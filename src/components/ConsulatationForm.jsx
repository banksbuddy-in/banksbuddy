import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import apiFetch from "../lib/api.js";
import "./AddCareer.css";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export const ConsulatationForm = () => {
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [loanType, setLoanType] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [income, setIncome] = useState("");
  const [status, setStatus] = useState("");

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      Name,
      email,
      phone,
      reason,
      state,
      city,
      serviceType,
      ...(serviceType === "Loan" && { loanType }),
      employmentType,
      ...(employmentType === "Salaried" && { income }),
      createdAt: new Date().toISOString(),
    };

    try {
      await apiFetch("/api/consultations", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setStatus("Request submitted — we will contact you soon.");
      setTimeout(() => setStatus(""), 2500);
      setName("");
      setEmail("");
      setPhone("");
      setReason("");
      setState("");
      setCity("");
      setServiceType("");
      setLoanType("");
      setEmploymentType("");
      setIncome("");
    } catch (err) {
      console.error(err);
      setStatus("Failed to submit request. Please try again later.");
      setTimeout(() => setStatus(""), 2500);
    }
  };
  const na = useNavigate();
  function n() {
    na("/services");
  }

  return (
    <motion.div
      className="adareer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      variants={fadeUp}
    >
      <div className="hsoaiof">
        <form className="ac-frm" onSubmit={handleSubmit}>
          <h1 className="tgfrm">Grow with our Assistance.</h1>
          <h2 className="actitle">Request a Consultation</h2>
          <div className="fhrm">
            <div className="namfrm">
              {/* <label className="ac-label">Name</label> */}
              <input
                className="a-input"
                value={Name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Full Name"
              />

              {/* <label className="ac-label">Email</label> */}
              <input
                className="a-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Mobile Number"
              />
            </div>
            <input
              className="a-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email Address"
            />

            {/* State Dropdown */}
            <select
              className="a-input"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            >
              <option value="">Select State</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
              <option value="Assam">Assam</option>
              <option value="Bihar">Bihar</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Goa">Goa</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Haryana">Haryana</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Jharkhand">Jharkhand</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Manipur">Manipur</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Mizoram">Mizoram</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Odisha">Odisha</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Tripura">Tripura</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Andaman and Nicobar Islands">
                Andaman and Nicobar Islands
              </option>
              <option value="Chandigarh">Chandigarh</option>
              <option value="Dadra and Nagar Haveli and Daman and Diu">
                Dadra and Nagar Haveli and Daman and Diu
              </option>
              <option value="Delhi">Delhi</option>
              <option value="Jammu and Kashmir">Jammu and Kashmir</option>
              <option value="Ladakh">Ladakh</option>
              <option value="Lakshadweep">Lakshadweep</option>
              <option value="Puducherry">Puducherry</option>
            </select>

            {/* Conditional City Input */}
            {state && (
              <input
                className="a-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                placeholder="Enter City Name"
              />
            )}

            {/* Type of Service Dropdown */}
            <select
              className="a-input"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              required
            >
              <option value="">Select Type of Service</option>
              <option value="Loan">Loan</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Insurance">Insurance</option>
              <option value="CIBIL Score Improvement">
                CIBIL Score Improvement
              </option>
              <option value="Investment">Investment</option>
              <option value="Other">Other</option>
            </select>

            {/* Conditional Loan Type Dropdown */}
            {serviceType === "Loan" && (
              <select
                className="a-input"
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                required
              >
                <option value="">Select Type of Loan</option>
                <option value="Personal Loan (PL)">Personal Loan (PL)</option>
                <option value="Home Loan (HL)">Home Loan (HL)</option>
                <option value="Business Loan (BL)">Business Loan (BL)</option>
                <option value="Car Loan">Car Loan</option>
                <option value="Education Loan">Education Loan</option>
                <option value="Loan Against Property (LAP)">
                  Loan Against Property (LAP)
                </option>
                <option value="Other">Other</option>
              </select>
            )}

            {/* Employment Type Dropdown */}
            <select
              className="a-input"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              required
            >
              <option value="">Select Employment Type</option>
              <option value="Salaried">Salaried</option>
              <option value="Self-Employed">Self-Employed</option>
            </select>

            {/* Conditional Income Field */}
            {employmentType === "Salaried" && (
              <input
                className="a-input"
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                required
                placeholder="Monthly Income (₹)"
              />
            )}

            {/* <label className="ac-label">Reason for Consultation</label> */}
            <textarea
              className="a-textarea"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              placeholder="Mention your message for us here..."
            />
          </div>

          <div className="btnsc" style={{ display: "flex", gap: "1em" }}>
            <button className="acbutton" type="submit">
              Send Request
            </button>
            <button
              className="acbutton"
              type="button"
              onClick={() => {
                n();
              }}
            >
              Back
            </button>
          </div>
        </form>
        <img src="/consult.png" alt="form" className="consult" />
      </div>
      {status && (
        <div className="cb-success-overlay" onClick={() => setStatus("")}>
          <div className="cb-success-card" onClick={(e) => e.stopPropagation()}>
            <button className="cb-close-btn" onClick={() => setStatus("")}>
              <FaTimes />
            </button>
            <div className="cb-success-icon">
              {status.includes("Failed") || status.includes("Error") ? "❌" : "✅"}
            </div>
            <h2 className="cb-success-title">
              {status.includes("Failed") || status.includes("Error") ? "Submission Failed" : "Request Successful!"}
            </h2>
            <p className="cb-success-text">{status}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ConsulatationForm;
