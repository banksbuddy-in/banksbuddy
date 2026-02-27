import React, { useState, useEffect } from "react";
import { load } from "@cashfreepayments/cashfree-js";

const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export const DevStudioPaymentForm = ({
  isOpen,
  onClose,
  amount,
  serviceTitle,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    state: "",
    city: "",
    income: "",
    amount: amount || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cashfree, setCashfree] = useState(null);

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const env =
          import.meta.env.VITE_CASHFREE_API_ENV === "production"
            ? "production"
            : "sandbox";
        const cf = await load({ mode: env });
        setCashfree(cf);
      } catch (err) {
        console.error("Failed to load Cashfree SDK:", err);
      }
    };
    if (isOpen) initializeSDK();
  }, [isOpen]);

  useEffect(() => {
    if (amount) {
      setFormData((prev) => ({ ...prev, amount }));
    }
  }, [amount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!cashfree) {
      setError("Payment system initializing... please try again in a second.");
      return;
    }

    setLoading(true);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || "";
      const endpoint = `${apiBaseUrl}/api/createPaymentSession`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          serviceTitle,
          date: new Date().toISOString(),
        }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(
          "Invalid server response. Please ensure backend is running.",
        );
      }

      if (!response.ok)
        throw new Error(data.error || "Failed to create payment session");

      const checkoutOptions = {
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self",
      };

      cashfree.checkout(checkoutOptions);
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Initialization failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="pf-modal-overlay" onClick={onClose}>
      <div className="pf-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="pf-close-button" onClick={onClose}>
          &times;
        </button>

        <div className="pf-header">
          <h2>Complete Your Payment</h2>
          <p>Securely pay for {serviceTitle || "your service"} via Cashfree</p>
        </div>

        <form onSubmit={handleSubmit} className="pf-form">
          <div className="pf-form-grid">
            <div className="pf-field">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
              />
            </div>
            <div className="pf-field">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="9876543210"
              />
            </div>
          </div>

          <div className="pf-field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
            />
          </div>

          <div className="pf-form-grid">
            <div className="pf-field">
              <label>State</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="pf-field">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="Mumbai"
              />
            </div>
          </div>

          <div className="pf-form-grid">
            <div className="pf-field">
              <label>Employment Type</label>
              <select
                name="income"
                value={formData.income}
                onChange={handleChange}
                required
              >
                <option value="">Select Option</option>
                <option value="salaried">Salaried</option>
                <option value="self-employed">Self Employed</option>
                <option value="not-salaried">Not Salaried</option>
              </select>
            </div>
            <div className="pf-field">
              <label>Amount (₹)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="1"
                step="0.01"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="pf-submit-btn">
            {loading ? "Processing..." : `Pay ₹${formData.amount || "0"}`}
          </button>

          {error && <p className="pf-error-msg">{error}</p>}
        </form>

        <p className="pf-footer-note">
          Your payment is secured with 256-bit encryption
        </p>
      </div>

      <style>{`
        .pf-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1rem;
        }
        .pf-modal-container {
          background: #ffffff;
          width: 100%;
          max-width: 520px;
          border-radius: 24px;
          padding: 2.5rem;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
          animation: pf-slide-up 0.3s ease-out;
        }
        @keyframes pf-slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pf-close-button {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          background: #f1f5f9;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          transition: all 0.2s;
        }
        .pf-close-button:hover {
          background: #e2e8f0;
          color: #0f172a;
        }
        .pf-header {
          margin-bottom: 2rem;
        }
        .pf-header h2 {
          font-size: 1.75rem;
          color: #0f172a;
          margin: 0 0 0.5rem 0;
          font-weight: 700;
          letter-spacing: -0.025em;
        }
        .pf-header p {
          color: #64748b;
          margin: 0;
          font-size: 1rem;
        }
        .pf-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .pf-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .pf-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .pf-field label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #334155;
        }
        .pf-field input, .pf-field select {
          width: 100%;
          box-sizing: border-box;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          color: #0f172a;
          background: #f8fafc;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .pf-field input:focus, .pf-field select:focus {
          outline: none;
          border-color: #0ea5e9;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
        }
        .pf-submit-btn {
          margin-top: 1rem;
          padding: 1rem;
          background: #0ea5e9;
          color: white;
          border: none;
          border-radius: 14px;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
        }
        .pf-submit-btn:hover {
          background: #0284c7;
          transform: translateY(-2px);
        }
        .pf-submit-btn:active {
          transform: translateY(0);
        }
        .pf-submit-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          transform: none;
        }
        .pf-error-msg {
          color: #ef4444;
          font-size: 0.875rem;
          text-align: center;
          margin: 0;
        }
        .pf-footer-note {
          text-align: center;
          font-size: 0.75rem;
          color: #94a3b8;
          margin-top: 1.5rem;
        }
        @media (max-width: 480px) {
          .pf-form-grid {
            grid-template-columns: 1fr;
          }
          .pf-modal-container {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DevStudioPaymentForm;
