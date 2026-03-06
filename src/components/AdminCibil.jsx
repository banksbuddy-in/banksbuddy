import React, { useEffect, useState } from "react";
import apiFetch from "../lib/api.js";
import { useNavigate } from "react-router-dom";
import "./AdminCibil.css";

export const AdminCibil = ({ embedded = false }) => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/cibil-requests");
      if (data && typeof data === "object") {
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        list.sort((a, b) =>
          (b.createdAt || "").localeCompare(a.createdAt || ""),
        );
        setRequests(list);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error("Error fetching CIBIL requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await apiFetch(`/api/cibil-requests/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r)),
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDownload = (request) => {
    const lines = Object.entries(request)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cibil_${request.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  return (
    <div className={`admin-cibil ${embedded ? "embedded" : ""}`}>
      {!embedded && (
        <button className="back-btn" onClick={() => navigate("/admin")}>
          ← Back to Admin
        </button>
      )}
      <h2>CIBIL Service Requests</h2>

      <div className="filter-tabs" style={{ marginBottom: "1rem" }}>
        {["all", "pending", "in-progress", "resolved", "completed"].map((f) => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Registration Details</th>
                <th>Contact Info</th>
                <th>Financial Details</th>
                <th>Location</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((req) => (
                <tr key={req.id}>
                  <td>
                    <div className="req-cell-main">
                      <strong>{req.name || req.fullName || "-"}</strong>
                    </div>
                    <div className="req-cell-sub">PAN: {req.pan || "-"}</div>
                  </td>
                  <td>
                    <div>{req.email}</div>
                    <div>{req.phone}</div>
                  </td>
                  <td>
                    <div>A/C: {req.accountNumber || "-"}</div>
                    <div>Status: {req.salaryStatus || "-"}</div>
                    <div className="req-amount">
                      ₹{req.amount || req.amountPaid || "-"}
                    </div>
                  </td>
                  <td>
                    <div className="req-address">{req.address || "-"}</div>
                    <div className="req-city">
                      {req.city
                        ? `${req.city}, ${req.state}`
                        : req.state || "-"}
                    </div>
                  </td>
                  <td>
                    <span className={`status-dot ${req.status || "pending"}`}>
                      {req.status || "pending"}
                    </span>
                  </td>
                  <td>
                    {req.createdAt
                      ? new Date(req.createdAt).toLocaleDateString("en-IN")
                      : "-"}
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.4rem",
                      }}
                    >
                      <select
                        value={req.status || "pending"}
                        onChange={(e) => updateStatus(req.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button
                        onClick={() => handleDownload(req)}
                        className="download-btn"
                        title="Download Data"
                      >
                        Download TXT
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
