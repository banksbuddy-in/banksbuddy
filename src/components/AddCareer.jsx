import React, { useState, useEffect } from "react";
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
  const [careers, setCareers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchCareers = async () => {
    try {
      const data = await apiFetch("/api/careers");
      if (Array.isArray(data)) setCareers(data);
      else if (data && typeof data === "object")
        setCareers(Object.entries(data).map(([id, val]) => ({ id, ...val })));
    } catch (err) {
      console.error("Error fetching careers:", err);
    }
  };

  useEffect(() => {
    fetchCareers();
    const interval = setInterval(fetchCareers, 30000);
    return () => clearInterval(interval);
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSkills("");
    setMessage("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !skills) {
      setStatus("Please fill all required fields.");
      return;
    }
    try {
      if (editingId) {
        await apiFetch(`/api/careers/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({ title, description, skills, message }),
        });
        setStatus("Job posting updated successfully!");
      } else {
        await apiFetch("/api/careers", {
          method: "POST",
          body: JSON.stringify({ title, description, skills, message }),
        });
        setStatus("Job posted successfully!");
      }
      resetForm();
      fetchCareers();
    } catch (err) {
      console.error(err);
      setStatus("Failed to save job posting. Please try again.");
    }
  };

  const handleEdit = (career) => {
    setTitle(career.title || "");
    setDescription(career.description || "");
    setSkills(career.skills || "");
    setMessage(career.message || "");
    setEditingId(career.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job posting?")) return;
    try {
      await apiFetch(`/api/careers/${id}`, { method: "DELETE" });
      setStatus("Job posting deleted.");
      fetchCareers();
    } catch (err) {
      console.error(err);
      setStatus("Failed to delete job posting.");
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
      <h2 className="ac-title">
        {editingId ? "Edit Job Posting" : "Add Job Posting"}
      </h2>
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
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="ac-button" type="submit">
            {editingId ? "Update Job" : "Post Job"}
          </button>
          {editingId && (
            <button
              className="btn"
              type="button"
              onClick={resetForm}
              style={{ background: "#e2e8f0", color: "#475569" }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      {status && <p className="ac-status">{status}</p>}

      <h2 className="ac-title" style={{ marginTop: "2rem" }}>
        Job Postings ({careers.length})
      </h2>
      {careers.length === 0 ? (
        <p>No job postings yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {careers.map((career) => (
            <div
              key={career.id}
              style={{
                background: "#f8f9fa",
                padding: "1rem 1.5rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            >
              <h4 style={{ margin: "0 0 0.3rem 0", color: "#1e293b" }}>
                {career.title}
              </h4>
              <p
                style={{
                  margin: "0 0 0.3rem 0",
                  fontSize: "0.9rem",
                  color: "#555",
                }}
              >
                {career.description}
              </p>
              <p
                style={{
                  margin: "0 0 1rem 0",
                  fontSize: "0.85rem",
                  color: "#888",
                }}
              >
                <strong>Skills:</strong> {career.skills}
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => handleEdit(career)}
                  style={{
                    padding: "0.4rem 1rem",
                    background: "#ffc107",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(career.id)}
                  style={{
                    padding: "0.4rem 1rem",
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AddCareer;
