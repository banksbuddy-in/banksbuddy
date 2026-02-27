import React, { useState } from "react";
import DevStudioPaymentForm from "./DevStudioPaymentForm";

export const PaymentTestPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "80vh",
        padding: "2rem",
        backgroundColor: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <h1
          style={{
            marginBottom: "1rem",
            color: "#0f172a",
            fontSize: "2.5rem",
            fontWeight: "800",
          }}
        >
          Payment Integration
        </h1>
        <p
          style={{
            marginBottom: "2rem",
            color: "#64748b",
            fontSize: "1.125rem",
          }}
        >
          Click the button below to test the new premium payment modal.
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            background: "#0ea5e9",
            color: "white",
            border: "none",
            padding: "1rem 2rem",
            borderRadius: "14px",
            fontWeight: "600",
            fontSize: "1.125rem",
            cursor: "pointer",
            boxShadow: "0 10px 15px -3px rgba(14, 165, 233, 0.3)",
          }}
        >
          Open Payment Modal
        </button>

        <DevStudioPaymentForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          amount="500"
          serviceTitle="Test Service"
        />
      </div>
    </div>
  );
};

export default PaymentTestPage;
