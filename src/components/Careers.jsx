import React, { useEffect, useState } from "react";
import apiFetch from "../lib/api.js";
import "./optional.css";

export const Careers = () => {
  const [careers, setCareers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null); // for modal

  useEffect(() => {
    const loadCareers = async () => {
      try {
        const data = await apiFetch("/api/careers");
        setCareers(data.reverse());
      } catch (err) {
        console.error("Error fetching careers:", err);
      }
    };
    loadCareers();
  }, []);

  const filteredCareers = careers.filter((job) =>
    (job.title + job.description + job.skills + job.message)
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="careers-container">
      <h1>Careers</h1>

      <input
        type="text"
        placeholder="Search job title, skills, keywords..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      <div className="job-list">
        {filteredCareers.length === 0 ? (
          <p>No careers found.</p>
        ) : (
          filteredCareers.map((job) => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className="job-card"
            >
              {/* <img src="./onlyicon.png" alt="onlyicon"   /> */}
              <div className="cnt">
                {" "}
                <h2>{job.title}</h2>
                <p>
                  {job.description.length > 150
                    ? job.description.substring(0, 150) + "..."
                    : job.description}
                </p>
                <p>
                  <strong>Skills:</strong> {job.skills}
                </p>
                <small>Click to view full details →</small>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedJob && (
        <div className="modal-backdrop" onClick={() => setSelectedJob(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedJob(null)}
            >
              ✖
            </button>

            <h2>{selectedJob.title}</h2>

            <p>
              <strong>Description:</strong>
              <br />
              {selectedJob.description}
            </p>

            <p>
              <strong>Skills Required:</strong>
              <br />
              {selectedJob.skills}
            </p>

            {selectedJob.message && (
              <p>
                <strong>Message from Recruiter:</strong>
                <br />
                {selectedJob.message}
              </p>
            )}

            <small>
              Posted on: {new Date(selectedJob.createdAt).toLocaleDateString()}
            </small>

            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=info@banksbuddy.in&su=${encodeURIComponent(
                "BanksBuddy - APPLICATION for " + selectedJob.title,
              )}&body=${encodeURIComponent(
                `Hello BanksBuddy Team,
[your introduction, experience, and motivation to apply]

Please find my resume/CV and cover letter attached.
Warm regards,
[Your Name]
Mobile Number: [Your Mobile Number]
[Your Contact Info]`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="apply-button"
            >
              Apply Now
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
