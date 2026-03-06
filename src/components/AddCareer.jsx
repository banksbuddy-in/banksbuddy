import React, { useState } from "react";
import apiFetch from "../lib/api.js";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./AddCareer.css";

export const AddCareer = ({ embedded = false }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !skills) {
      setStatus("Please fill all required fields.");
      return;
    }
    try {
      await apiFetch("/api/careers", {
        method: "POST",
        body: JSON.stringify({ title, description, skills, message }),
      });
      setStatus("Job posted successfully!");
      setTitle("");
      setDescription("");
      setSkills("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setStatus("Failed to post job. Please try again.");
    }
  };

  return (
    <motion.div
      className={`add-career ${embedded ? "embedded" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {!embedded && (
        <button className="back-btn" onClick={() => navigate("/admin")}>
          ← Back to Admin
        </button>
      )}
      <h2 className="ac-title">Add Job Posting</h2>
      <form className="ac-form" onSubmit={handleSubmit}>
        <label className="ac-label">Job Title *</label>
        <input
          className="ac-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="e.g. Financial Advisor"
        />
        <label className="ac-label">Description *</label>
        <textarea
          className="ac-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Job description..."
        />
        <label className="ac-label">Skills Required *</label>
        <input
          className="ac-input"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          required
          placeholder="e.g. Communication, Finance, Excel"
        />
        <label className="ac-label">Message from Recruiter</label>
        <textarea
          className="ac-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Optional note for applicants..."
        />
        <button className="ac-button" type="submit">
          Post Job
        </button>
      </form>
      {status && <p className="ac-status">{status}</p>}
    </motion.div>
  );
};

export default AddCareer;
