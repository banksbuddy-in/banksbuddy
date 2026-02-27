import React, { useEffect, useMemo, useState } from "react";
import { db } from "../firebase";
import { push, ref } from "firebase/database";

const CASHFREE_SCRIPT = "https://sdk.cashfree.com/js/ui/2.0.0/cashfree.js";

const getMode = () =>
  (import.meta.env.VITE_CASHFREE_ENV || "sandbox").toLowerCase() ===
  "production"
    ? "production"
    : "sandbox";

export const BuyNowPayment = ({
  serviceId,
  serviceTitle,
  mainCategory = "Other Services",
  defaultAmount = "",
}) => {
  const [amount, setAmount] = useState(defaultAmount ?? "");
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const payloadMeta = useMemo(
    () => ({
      serviceId,
      serviceTitle,
      mainCategory,
    }),
    [serviceId, serviceTitle, mainCategory],
  );

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (defaultAmount !== undefined && defaultAmount !== null) {
      setAmount(defaultAmount);
    }
  }, [defaultAmount]);

  const saveRevenue = async ({ amountValue, status, orderId }) => {
    const now = new Date().toISOString();
    await push(ref(db, "cashfree_revenue"), {
      ...payloadMeta,
      username: customer.name || "Guest User",
      email: customer.email || "",
      mobile: customer.phone || "",
      status,
      amount: Number(amountValue),
      orderId,
      date: now,
      createdAt: now,
    });
  };

  const startPayment = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!ready) {
      console.log("Payment SDK is still loading. Please wait a moment.");
      return;
    }

    const amountValue = Number(amount);
    if (!amountValue || amountValue <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (!customer.phone) {
      setError("Enter a mobile number so we can reach you.");
      return;
    }

    try {
      setLoading(true);

      const appId = import.meta.env.VITE_CASHFREE_APP_ID;
      const secret = import.meta.env.VITE_CASHFREE_SECRET_KEY;
      const envUrl =
        (import.meta.env.VITE_CASHFREE_API_ENV || "sandbox").toLowerCase() ===
        "production"
          ? "https://api.cashfree.com/pg"
          : "https://sandbox.cashfree.com/pg";

      if (!appId || !secret)
        throw new Error("Cashfree keys missing in environment.");

      const orderPayload = {
        order_amount: amountValue,
        order_currency: "INR",
        order_id: `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        order_note: `${serviceTitle || "Service"} payment`,
        customer_details: {
          customer_id: customer.phone || `guest_${Date.now()}`,
          customer_name: customer.name || "Guest User",
          customer_email: customer.email || "support@banksbuddy.com",
          customer_phone: customer.phone || "9999999999",
        },
        order_meta: {
          return_url: `${window.location.origin}/payment-status?order_id={order_id}`,
        },
      };

      const res = await fetch(`${envUrl}/orders`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "x-api-version": "2023-08-01",
          "x-client-id": appId,
          "x-client-secret": secret,
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok || !data.link_url) {
        throw new Error(data?.error || "Unable to create payment link");
      }

      await saveRevenue({
        amountValue,
        status: "pending",
        orderId: data.order_id || data.link_id,
      });

      // Redirect the user entirely off banksbuddy.com to cashfree.com
      window.location.href = data.link_url;
    } catch (err) {
      console.error("Cashfree payment error", err);
      setError(err.message || "Unable to start payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="sp-btn-primary"
        onClick={() => setIsModalOpen(true)}
        style={{ background: "#0ea5e9" }}
      >
        Buy Now
      </button>

      {isModalOpen && (
        <div className="cb-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="cb-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "500px", width: "90%", position: "relative" }}
          >
            <button
              className="cb-close-btn"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <div
              className="sp-details-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
                borderBottom: "none",
                padding: "0",
                background: "transparent",
              }}
            >
              <div style={{ textAlign: "left" }}>
                <h3 style={{ fontSize: "1.5rem", margin: 0 }}>Buy Now</h3>
                <p style={{ color: "#475569", marginTop: "4px" }}>
                  Pay for {serviceTitle} securely via Cashfree. You choose the
                  amount.
                </p>
              </div>
              <span
                style={{
                  background: "#ecfeff",
                  color: "#0ea5e9",
                  padding: "6px 10px",
                  borderRadius: "999px",
                  fontSize: "0.85rem",
                  height: "fit-content",
                  display: "inline-block",
                }}
              >
                {getMode() === "production" ? "Live" : "Sandbox"}
              </span>
            </div>

            <form
              className="cb-form"
              onSubmit={startPayment}
              style={{ marginTop: "1rem" }}
            >
              <div className="cb-form-row">
                <input
                  className="cb-input"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Amount (₹)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <input
                  className="cb-input"
                  placeholder="Full Name"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({ ...customer, name: e.target.value })
                  }
                />
              </div>
              <div className="cb-form-row">
                <input
                  className="cb-input"
                  type="tel"
                  placeholder="Mobile Number"
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({ ...customer, phone: e.target.value })
                  }
                  required
                />
                <input
                  className="cb-input"
                  type="email"
                  placeholder="Email (for receipt)"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer({ ...customer, email: e.target.value })
                  }
                />
              </div>
              <button
                className="cb-btn-submit"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Starting payment..."
                  : `Pay securely for ${serviceTitle}`}
              </button>
            </form>

            {message && (
              <p className="cb-form-status" style={{ color: "#0f766e" }}>
                {message}
              </p>
            )}
            {error && (
              <p className="cb-form-status" style={{ color: "#dc2626" }}>
                {error}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BuyNowPayment;
