import React, { useState } from "react";
import { db } from "../firebase";
import { ref, push } from "firebase/database";
import './AddCareer.css'
import { useNavigate } from "react-router-dom";

export const AddCareer = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const careerData = {
      title,
      description,
      skills,
      message,
      createdAt: new Date().toISOString(),
    };

    try {
      await push(ref(db, "careers"), careerData);
      setStatus("Career added successfully!");

      setTitle("");
      setDescription("");
      setSkills("");
      setMessage("");
    } catch (error) {
      console.error(error);
      setStatus("Error adding career!");
    }
  };
const n = useNavigate();
  return (
    <div className="add-career">
      <h2 className="ac-title">Add New Career</h2>

      <form className="ac-form" onSubmit={handleSubmit}>
        <label className="ac-label">Job Title</label>
        <input
          className="ac-input"
          type="text"
          placeholder="e.g. Frontend Developer"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className="ac-label">Job Description</label>
        <textarea
          className="ac-textarea"
          placeholder="Describe roles and responsibilities..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label className="ac-label">Skills Required</label>
        <input
          className="ac-input"
          type="text"
          placeholder="React, JS, API handling"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          required
        />

        <label className="ac-label">Message from Recruiter</label>
        <textarea
          className="ac-textarea"
          placeholder="What would you like to tell applicants?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button type="submit" className="ac-button">
          Add Career
        </button>
         <button className="btn" onClick={() => n("/admin")}>
          Back to Admin
        </button>
      </form>

      {status && <p className="ac-status">{status}</p>}
    </div>
  );
};
