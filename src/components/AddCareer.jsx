import React, { useState } from "react";
import { db } from "../firebase";
import { ref, push } from "firebase/database";

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

  return (
    <div id="ADMINFORCAREERS">
      <h2>Add New Career</h2>

      <form onSubmit={handleSubmit}>
        <label>Job Title</label>
        <input
          type="text"
          placeholder="e.g. Frontend Developer"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Job Description</label>
        <textarea
          placeholder="Describe roles and responsibilities..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Skills Required</label>
        <input
          type="text"
          placeholder="React, JS, API handling"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          required
        />

        <label>Message from Recruiter</label>
        <textarea
          placeholder="What would you like to tell applicants?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button type="submit" className="BUTTOn">
          Add Career
        </button>
      </form>

      {status && <p>{status}</p>}
    </div>
  );
};
