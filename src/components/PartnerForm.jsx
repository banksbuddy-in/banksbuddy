import React, { useState } from "react";
import { db } from "../firebase";
import { ref, push, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
// import "./PartnerForm.css"; // Removing custom CSS to use global classes
import { motion } from "framer-motion";
// import "./g.css"; // Removed as per consolidation to ch.css

export const PartnerForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    website: "",
    description: "",
    state: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newAppRef = push(ref(db, "partner_applications"));
      await set(newAppRef, {
        ...formData,
        status: "pending",
        submittedAt: new Date().toISOString(),
      });
      setStatus(
        "Application submitted successfully! We will contact you soon.",
      );
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        companyName: "",
        website: "",
        description: "",
        state: "",
        city: "",
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error submitting application:", error);
      setStatus("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="adareer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      variants={fadeUp}
    >
      <div className="hsoaiof pt">
        <form className="ac-frm pt" onSubmit={handleSubmit}>
          <h1 className="tgfrm pt">Join our Network.</h1>
          <h2 className="actitle">Partner Application</h2>

          <div className="fhrm">
            <div className="namfrm">
              <input
                className="ac-input"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Full Name"
              />
              <input
                className="ac-input"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Phone Number"
              />
            </div>

            <input
              className="a-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email Address"
            />

            <input
              className="a-input"
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              placeholder="Company Name"
            />

            <input
              className="a-input"
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Company Website (Optional)"
            />

            {/* State Dropdown */}
            <select
              className="a-input"
              name="state"
              value={formData.state}
              onChange={handleChange}
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
            {formData.state && (
              <input
                className="ac-input"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="Enter City Name"
              />
            )}

            <textarea
              className="ac-textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Brief Description / Proposal..."
            />
          </div>

          <div className="btnsc" style={{ display: "flex", gap: "1em" }}>
            <button className="acbutton" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </button>
            <button
              className="acbutton"
              type="button"
              onClick={() => navigate(-1)}
              style={{
                background: "#f1f5f9",
                color: "#1e293b",
                border: "1px solid #cbd5e1",
              }}
            >
              Back
            </button>
          </div>
        </form>
        <img
          src="/pn.png"
          alt="Partner with us"
          className="consult partner"
          style={{ objectFit: "contain" }}
        />
      </div>
      {status && (
        <p
          className="sactatus"
          style={{
            textAlign: "center",
            marginTop: "1rem",
            color: "var(--bl)",
            fontWeight: "bold",
          }}
        >
          {status}
        </p>
      )}
    </motion.div>
  );
};
