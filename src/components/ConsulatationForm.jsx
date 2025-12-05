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
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      Name,
      email,
      phone,
      reason,
      createdAt: new Date().toISOString(),
    };

    try {
      await push(ref(db, "consultations"), payload);
      setStatus("Request submitted — we will contact you soon.");
      setName("");
      setEmail("");
      setPhone("");
      setReason("");
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
