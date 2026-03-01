import React, { useState } from "react";

export const DevStudioPaymentForm = ({ isOpen, onClose, serviceTitle }) => {
  const [payAmount, setPayAmount] = useState("");

  if (!isOpen) return null;

  return (
    <div className="pf-modal-overlay" onClick={onClose}>
      <div className="pf-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="pf-close-button" onClick={onClose}>
          &times;
        </button>

        <div className="pf-content">
          <div className="pf-amount-input-wrapper">
            <label className="pf-amount-label">Enter Payment Amount (₹)</label>
            <input
              type="number"
              className="pf-amount-input"
              placeholder="e.g. 500"
              value={payAmount}
              min="1"
              onChange={(e) => setPayAmount(e.target.value)}
            />
          </div>

          {payAmount && (
            <div className="pf-amount-badge">
              Amount to Pay: <strong>₹{payAmount}</strong>
            </div>
          )}

          <div className="pf-qr-container">
            <img src="/paymentshot.jpeg" alt="Payment QR Code" />
          </div>

          <div className="pf-bank-details">
            <h3>Bank Account Details</h3>
            <div className="pf-bank-list">
              <div className="pf-bank-row">
                <span className="pf-bank-label">Bank Name:</span>
                <span className="pf-bank-value">Punjab National Bank</span>
              </div>
              <div className="pf-bank-row">
                <span className="pf-bank-label">Account Number:</span>
                <span className="pf-bank-value pf-mono">2157000100378800</span>
              </div>
              <div className="pf-bank-row pf-no-border">
                <span className="pf-bank-label">IFSC Code:</span>
                <span className="pf-bank-value pf-mono">PUNB0215700</span>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="pf-submit-btn">
            I have completed the payment
          </button>
        </div>
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
          max-width: 440px;
          border-radius: 28px;
          padding: 2.5rem 2rem 2rem;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2);
          animation: pf-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
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
          gap: 1.25rem;
          align-items: center;
          padding-top: 0.5rem;
        }
        .pf-amount-input-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .pf-amount-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #475569;
        }
        .pf-amount-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          color: #0f172a;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .pf-amount-input:focus {
          border-color: #0ea5e9;
        }
        .pf-amount-badge {
          background: #e0f2fe;
          color: #0284c7;
          padding: 0.5rem 1.25rem;
          border-radius: 999px;
          font-size: 1.125rem;
          display: inline-block;
          font-weight: 500;
        }
        .pf-amount-badge strong {
          font-weight: 800;
          color: #0369a1;
        }
        .pf-qr-container {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 24px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
          border: 1px solid #f1f5f9;
        }
        .pf-qr-container img {
          width: 260px;
          height: auto;
          border-radius: 16px;
          display: block;
        }
        .pf-bank-details {
          width: 100%;
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 20px;
          text-align: left;
        }
        .pf-bank-details h3 {
          margin-top: 0;
          margin-bottom: 1.25rem;
          color: #0f172a;
          font-size: 1.15rem;
          font-weight: 800;
        }
        .pf-bank-list {
          display: flex;
          flex-direction: column;
          gap: 0;
          color: #334155;
          font-size: 0.95rem;
        }
        .pf-bank-row {
          display: flex;
          justify-content: space-between;
          padding: 0.875rem 0;
          border-bottom: 1px solid #e2e8f0;
          align-items: center;
        }
        .pf-bank-row.pf-no-border {
          border-bottom: none;
          padding-bottom: 0;
        }
        .pf-bank-label {
          font-weight: 700;
          color: #475569;
        }
        .pf-bank-value {
          color: #334155;
          font-weight: 500;
        }
        .pf-mono {
          font-family: inherit;
          font-size: 1.05rem;
          letter-spacing: 0.02em;
        }
        .pf-submit-btn {
          margin-top: 0.5rem;
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
        .pf-submit-btn:hover {
          background: #0284c7;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(14, 165, 233, 0.3), 0 4px 6px -4px rgba(14, 165, 233, 0.3);
        }
        .pf-submit-btn:active {
          transform: translateY(0);
          box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.2), 0 2px 4px -2px rgba(14, 165, 233, 0.2);
        }
      `}</style>
    </div>
  );
};

export default DevStudioPaymentForm;
