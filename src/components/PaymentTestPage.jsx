import React from "react";
import DevStudioPaymentForm from "./DevStudioPaymentForm";

export const PaymentTestPage = () => {
  return (
    <div
      style={{ minHeight: "80vh", padding: "2rem", backgroundColor: "#f8fafc" }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            color: "#0f172a",
          }}
        >
          Dev Studio Payment Test
        </h1>
        <p
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            color: "#64748b",
          }}
        >
          This page is used to test the new Cashfree Dev Studio integration API
          and Form.
        </p>
        <DevStudioPaymentForm />
      </div>
    </div>
  );
};

export default PaymentTestPage;
