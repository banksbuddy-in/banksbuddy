import React, { useState, useEffect } from "react";
import { load } from "@cashfreepayments/cashfree-js";

export const DevStudioPaymentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    paymentId: "",
    amount: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cashfree, setCashfree] = useState(null);

  // Initialize Cashfree SDK
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
    initializeSDK();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!cashfree) {
      setError("Payment SDK is still loading. Please wait.");
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      // 1. Create a Payment Session
      // We call our new API endpoint to get the payment_session_id
      const apiBaseUrl = import.meta.env.VITE_API_URL || "";
      const endpoint = `${apiBaseUrl}/api/createPaymentSession`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment session");
      }

      console.log("Payment Session ID:", data.payment_session_id);
      setMessage(`Payment Session Created! Check Console.`);

      // 2. Perform Dev Studio Payment using SDK
      const checkoutOptions = {
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self", // _self redirects in same tab, _modal opens popup if supported
      };

      cashfree.checkout(checkoutOptions);
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        err.message || "Something went wrong during payment initialization",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "2rem auto",
        padding: "2rem",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
      }}
    >
      <h2
        style={{
          fontSize: "1.5rem",
          marginBottom: "1.5rem",
          textAlign: "center",
          color: "#1e293b",
        }}
      >
        Payment Details
      </h2>

      <form
        onSubmit={handleProceedToPayment}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <label
            htmlFor="name"
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#475569",
            }}
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
            }}
          />
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <label
            htmlFor="phone"
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#475569",
            }}
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
            }}
          />
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <label
            htmlFor="email"
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#475569",
            }}
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
            }}
          />
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <label
            htmlFor="city"
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#475569",
            }}
          >
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            style={{
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
            }}
          />
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <label
            htmlFor="paymentId"
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#475569",
            }}
          >
            Payment ID
          </label>
          <input
            type="text"
            id="paymentId"
            name="paymentId"
            value={formData.paymentId}
            onChange={handleChange}
            required
            style={{
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
            }}
          />
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <label
            htmlFor="amount"
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#475569",
            }}
          >
            Amount (₹)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            min="1"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
            style={{
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
            }}
          />
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <label
            htmlFor="date"
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#475569",
            }}
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            style={{
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !cashfree}
          style={{
            marginTop: "1rem",
            padding: "0.875rem",
            backgroundColor: "#0ea5e9",
            color: "white",
            fontWeight: "600",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading || !cashfree ? 0.7 : 1,
          }}
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>

        {error && (
          <p
            style={{
              color: "#dc2626",
              fontSize: "0.875rem",
              marginTop: "0.5rem",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}
        {message && (
          <p
            style={{
              color: "#059669",
              fontSize: "0.875rem",
              marginTop: "0.5rem",
              textAlign: "center",
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default DevStudioPaymentForm;
