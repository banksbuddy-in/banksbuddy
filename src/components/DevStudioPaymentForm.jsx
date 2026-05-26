import React, { useState, useEffect } from "react";
import apiFetch from "../lib/api.js";
import { useAuth } from "../context/AuthContext";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export const DevStudioPaymentForm = ({
  isOpen,
  onClose,
  serviceTitle,
  amount = "",
  onSuccess,
}) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pan: "",
    address: "",
    state: "",
    city: "",
    accountNumber: "",
    salaryStatus: "",
    amount: amount || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        amount: amount || "",
        email: prev.email || currentUser?.email || "",
        name: prev.name || currentUser?.displayName || "",
      }));
      setError("");
    }
  }, [isOpen, amount, currentUser]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!currentUser?.email) {
      setError("You must be logged in to proceed with the payment.");
      return;
    }

    if (
      !formData.name ||
      !formData.phone ||
      !formData.pan ||
      !formData.address ||
      !formData.state ||
      !formData.city ||
      !formData.accountNumber ||
      !formData.salaryStatus ||
      !formData.amount
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setShowQR(true);
  };

  const handleIPaid = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/cibil-requests", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          status: "initiated",
          paymentMethod: "UPI Manual",
        }),
      });

      if (res.id) {
        setShowQR(false);
        setShowSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        throw new Error("Failed to record payment.");
      }
    } catch (err) {
      console.error("Payment recording failed:", err);
      setError("Failed to record payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const upiLink = `upi://pay?pa=7723926058@ptaxis&pn=BanksBuddy&am=${formData.amount}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

  if (showSuccess) {
    return (
      <div className="pf-modal-overlay" onClick={onClose}>
        <div className="pf-modal-container" onClick={(e) => e.stopPropagation()} style={{ alignItems: 'center', textAlign: 'center', padding: '2.5rem 2rem' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: '0 8px 24px rgba(16,185,129,0.35)' }}>
            <span style={{ fontSize: '2rem' }}>✓</span>
          </div>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Payment Submitted!</h2>
          <p style={{ margin: '0 0 2rem', color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6 }}>Your payment has been recorded.<br/>Our admin will verify it shortly and your report will be ready soon.</p>
          <button onClick={onClose} className="pf-submit-btn" style={{ background: '#10b981' }}>Done</button>
        </div>
        <style>{`
          .pf-modal-overlay { position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(15,23,42,0.4);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:9999;padding:1rem; }
          .pf-modal-container { background:#fff;width:100%;max-width:480px;border-radius:28px;padding:2.5rem 2rem;position:relative;box-shadow:0 25px 50px -12px rgba(0,0,0,0.2);animation:pf-slide-up 0.3s cubic-bezier(0.16,1,0.3,1);display:flex;flex-direction:column; }
          @keyframes pf-slide-up { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
          .pf-submit-btn { padding:1.125rem;width:100%;color:#fff;border:none;border-radius:16px;font-size:1.1rem;font-weight:700;cursor:pointer;transition:transform 0.2s,background 0.2s; }
          .pf-submit-btn:disabled { background:#94a3b8;cursor:not-allowed; }
        `}</style>
      </div>
    );
  }

  if (showQR) {
    return (
      <div className="pf-modal-overlay" onClick={onClose}>
        <div className="pf-modal-container" onClick={(e) => e.stopPropagation()} style={{ alignItems: 'center', textAlign: 'center', padding: '2rem' }}>
          <button className="pf-close-button" onClick={onClose} disabled={loading}>&times;</button>

          <img
            src="/payshot.png"
            alt="Payment Options"
            style={{ width: '100%', borderRadius: '16px', marginBottom: '1.5rem', marginTop: '1rem' }}
          />

          {error && <div className="pf-error" style={{ marginBottom: '1rem', width: '100%' }}>{error}</div>}

          <button
            onClick={handleIPaid}
            disabled={loading}
            className="pf-submit-btn"
            style={{ background: '#10b981', width: '100%', boxSizing: 'border-box' }}
          >
            {loading ? "Processing..." : "✅ I Paid"}
          </button>
        </div>

        <style>{`
          .pf-modal-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px);
            display: flex; align-items: center; justify-content: center;
            z-index: 9999; padding: 1rem;
          }
          .pf-modal-container {
            background: #ffffff; width: 100%; max-width: 480px;
            border-radius: 28px; padding: 2.5rem 2rem 2rem; position: relative;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.2);
            animation: pf-slide-up 0.3s cubic-bezier(0.16,1,0.3,1);
            max-height: 90vh; display: flex; flex-direction: column;
          }
          @keyframes pf-slide-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .pf-close-button {
            position: absolute; top: 1rem; right: 1.25rem;
            background: transparent; border: none; width: 32px; height: 32px;
            border-radius: 50%; cursor: pointer; font-size: 1.75rem;
            display: flex; align-items: center; justify-content: center;
            color: #94a3b8; transition: color 0.2s;
          }
          .pf-close-button:hover { color: #0f172a; }
          .pf-error {
            background: #fef2f2; color: #b91c1c; padding: 0.75rem;
            border-radius: 8px; font-size: 0.875rem; font-weight: 500;
          }
          .pf-submit-btn {
            padding: 1.125rem; width: 100%; color: white; border: none;
            border-radius: 16px; font-size: 1.1rem; font-weight: 700;
            cursor: pointer; transition: transform 0.2s, background 0.2s;
          }
          .pf-submit-btn:disabled { background: #94a3b8; cursor: not-allowed; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="pf-modal-overlay" onClick={onClose}>
      <div className="pf-modal-container" onClick={(e) => e.stopPropagation()}>
        <button
          className="pf-close-button"
          onClick={onClose}
          disabled={loading}
        >
          &times;
        </button>

        <form className="pf-content" onSubmit={handleSubmit}>
          <h2 className="pf-title">Checkout Details</h2>
          <p className="pf-subtitle">{serviceTitle}</p>

          {error && <div className="pf-error">{error}</div>}

          <div className="pf-scroll-container">
            <div className="pf-input-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="pf-input-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                pattern="[0-9]{10}"
                title="10 digit mobile number"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                placeholder="10 digit number"
                required
              />
            </div>

            <div className="pf-input-group pf-email-badge">
              <label>Paying with Account</label>
              <div className="pf-email-display">
                {currentUser?.email || "No account detected"}
              </div>
            </div>

            <div className="pf-input-group">
              <label>PAN Card Number *</label>
              <input
                type="text"
                name="pan"
                style={{ textTransform: "uppercase" }}
                value={formData.pan}
                onChange={handleChange}
                placeholder="e.g. ABCDE1234F"
                disabled={loading}
                required
              />
            </div>

            <div className="pf-input-group">
              <label>Address *</label>
              <textarea
                name="address"
                className="pf-textarea"
                rows="2"
                value={formData.address}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <div className="pf-input-group" style={{ flex: 1 }}>
                <label>State *</label>
                <select
                  name="state"
                  className="pf-select"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={loading}
                  required
                >
                  <option value="" disabled>
                    Select State
                  </option>
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pf-input-group" style={{ flex: 1 }}>
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="pf-input-group">
              <label>Bank Account Number *</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="pf-input-group">
              <label>Salary Status *</label>
              <select
                name="salaryStatus"
                className="pf-select"
                value={formData.salaryStatus}
                onChange={handleChange}
                disabled={loading}
                required
              >
                <option value="" disabled>
                  Select Status
                </option>
                <option value="Salaried">Salaried</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Student">Student</option>
              </select>
            </div>
          </div>

          <div className="pf-footer-action">
            <div className="pf-input-group pf-amount-box">
              <label>Amount (₹) *</label>
              <input
                type="number"
                name="amount"
                min="1"
                value={formData.amount}
                onChange={handleChange}
                disabled={!!amount || loading}
                placeholder="e.g. 500"
                required
              />
            </div>

            <button type="submit" className="pf-submit-btn" disabled={loading}>
              {loading
                ? "Processing..."
                : `Proceed to Pay ₹${formData.amount || "0"}`}
            </button>
          </div>
        </form>
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
          max-width: 480px;
          border-radius: 28px;
          padding: 2.5rem 2rem 2rem;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2);
          animation: pf-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }
        @keyframes pf-slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pf-close-button {
          position: absolute;
          top: 1rem;
          right: 1.25rem;
          background: transparent;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          transition: color 0.2s;
        }
        .pf-close-button:hover {
          color: #0f172a;
        }
        .pf-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          height: 100%;
          overflow: hidden;
        }
        .pf-scroll-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: 0.5rem;
          margin-right: -0.5rem;
          /* Add some spacing at the top */
          padding-top: 0.5rem;
        }
        .pf-scroll-container::-webkit-scrollbar {
          width: 6px;
        }
        .pf-scroll-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .pf-scroll-container::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .pf-title {
          margin: 0;
          font-size: 1.5rem;
          color: #0f172a;
          font-weight: 800;
          flex-shrink: 0;
        }
        .pf-subtitle {
          margin: -0.5rem 0 0.5rem 0;
          color: #64748b;
          font-size: 0.95rem;
          flex-shrink: 0;
        }
        .pf-error {
          background: #fef2f2;
          color: #b91c1c;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          flex-shrink: 0;
        }
        .pf-payment-options-img-container {
          display: flex;
          justify-content: center;
          margin-bottom: 0.5rem;
          flex-shrink: 0;
        }
        .pf-payment-options-img {
          max-width: 100%;
          height: auto;
          max-height: 50px;
          object-fit: contain;
        }
        .pf-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .pf-input-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
        }
        .pf-input-group input, .pf-textarea, .pf-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          color: #0f172a;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
          font-family: inherit;
        }
        .pf-textarea {
          resize: vertical;
        }
        .pf-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1em;
        }
        .pf-input-group input:focus, .pf-textarea:focus, .pf-select:focus {
          border-color: #0ea5e9;
        }
        .pf-input-group input:disabled, .pf-textarea:disabled, .pf-select:disabled {
          background: #f8fafc;
          color: #64748b;
        }
        .pf-footer-action {
          flex-shrink: 0;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .pf-amount-box input {
          background: #f0f9ff;
          border-color: #bae6fd;
          font-weight: 700;
          color: #0369a1;
        }
        .pf-submit-btn {
          padding: 1.125rem;
          width: 100%;
          background: #0ea5e9;
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.2), 0 2px 4px -2px rgba(14, 165, 233, 0.2);
        }
        .pf-submit-btn:hover:not(:disabled) {
          background: #0284c7;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(14, 165, 233, 0.3), 0 4px 6px -4px rgba(14, 165, 233, 0.3);
        }
        .pf-submit-btn:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.2), 0 2px 4px -2px rgba(14, 165, 233, 0.2);
        }
        .pf-submit-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }
        .pf-email-badge {
          background: #f1f5f9;
          padding: 1rem;
          border-radius: 12px;
          border: 1px dashed #cbd5e1;
          margin-bottom: 0.5rem;
        }
        .pf-email-display {
          font-weight: 700;
          color: #0f172a;
          font-size: 0.95rem;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default DevStudioPaymentForm;
