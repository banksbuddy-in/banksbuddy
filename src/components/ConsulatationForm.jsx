import React, { useState } from "react";
import { db } from "../firebase";
import { ref, push } from "firebase/database";
import "./AddCareer.css";
import { useNavigate } from "react-router-dom";

export const ConsulatationForm = () => {
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [location, setLocation] = useState("");
  const [otherLocation, setOtherLocation] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [loanType, setLoanType] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [income, setIncome] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      Name,
      email,
      phone,
      reason,
      location: location === "Other" ? otherLocation : location,
      serviceType,
      ...(serviceType === "Loan" && { loanType }),
      employmentType,
      ...(employmentType === "Salaried" && { income }),
      createdAt: new Date().toISOString(),
    };

    try {
      await push(ref(db, "consultations"), payload);
      setStatus("Request submitted — we will contact you soon.");
      setName("");
      setEmail("");
      setPhone("");
      setReason("");
      setLocation("");
      setOtherLocation("");
      setServiceType("");
      setLoanType("");
      setEmploymentType("");
      setIncome("");
    } catch (err) {
      console.error(err);
      setStatus("Failed to submit request. Please try again later.");
    }
  };
  const na = useNavigate();
  function n() {
    na("/services");
  }

  return (
    <div className="adareer">
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
                placeholder="Contact Number"
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

            {/* Location Dropdown */}
            <select
              className="a-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            >
              <option value="">Select Location</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Pune">Pune</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Other">Other</option>
            </select>

            {/* Conditional Other Location Input */}
            {location === "Other" && (
              <input
                className="a-input"
                value={otherLocation}
                onChange={(e) => setOtherLocation(e.target.value)}
                required
                placeholder="Please specify your location"
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
              <option value="CIBIL Score Improvement">CIBIL Score Improvement</option>
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
                <option value="Loan Against Property (LAP)">Loan Against Property (LAP)</option>
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

            {/* <label className="ac-label">Contact Number</label> */}

            {/* <label className="ac-label">Reason for Consultation</label> */}
            <textarea
              className="a-textarea"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              placeholder="Reason for Consultation"
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
      {status && <p className="sactatus">{status}</p>}
    </div>
  );
};

export default ConsulatationForm;
