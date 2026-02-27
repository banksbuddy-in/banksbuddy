import React, { useState } from "react";
import DevStudioPaymentForm from "./DevStudioPaymentForm";

export const BuyNowPayment = ({ serviceTitle, defaultAmount = "" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="bn-pay-btn"
        onClick={() => setIsModalOpen(true)}
      >
        Pay now
      </button>

      <DevStudioPaymentForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        amount={defaultAmount}
        serviceTitle={serviceTitle}
      />

      <style>{`
        .bn-pay-btn {
          background: #0ea5e9;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.2);
        }
        .bn-pay-btn:hover {
          background: #0284c7;
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(14, 165, 233, 0.3);
        }
        .bn-pay-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </>
  );
};

export default BuyNowPayment;
