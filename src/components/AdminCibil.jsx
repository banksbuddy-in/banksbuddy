import React, { useEffect, useState } from "react";
import apiFetch from "../lib/api.js";
import { useNavigate } from "react-router-dom";
import { FiRefreshCw, FiArrowLeft } from "react-icons/fi";
import { FaWhatsapp, FaPhone, FaEnvelope } from "react-icons/fa";
import "./AdminCibil.css";

export const AdminCibil = ({ embedded = false }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("requests");
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchRequests();
    fetchNotifications();
    const interval = setInterval(() => {
      fetchRequests();
      fetchNotifications();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/cibil-requests");
      if (Array.isArray(data)) {
        setRequests(
          data.sort((a, b) =>
            (b.createdAt || "").localeCompare(a.createdAt || ""),
          ),
        );
      } else if (data && typeof data === "object") {
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

  const fetchNotifications = async () => {
    try {
      const data = await apiFetch("/api/cibil-notifications");
      if (Array.isArray(data)) {
        setNotifications(
          data.sort((a, b) =>
            (b.createdAt || "").localeCompare(a.createdAt || ""),
          ),
        );
      } else if (data && typeof data === "object") {
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        list.sort((a, b) =>
          (b.createdAt || "").localeCompare(a.createdAt || ""),
        );
        setNotifications(list);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Error fetching CIBIL notifications:", err);
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

  const updateNotifStatus = async (id, status) => {
    try {
      await apiFetch(`/api/cibil-notifications/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status } : n)),
      );
    } catch (err) {
      console.error("Error updating notification status:", err);
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
      <div className="admin-header-actions">
        {!embedded && (
          <button
            className="icon-btn"
            onClick={() => navigate("/admin")}
            title="Back to Admin"
          >
            <FiArrowLeft size={20} />
          </button>
        )}
        <button
          className="icon-btn refresh-btn"
          onClick={() => {
            fetchRequests();
            fetchNotifications();
          }}
          title="Refresh Data"
        >
          <FiRefreshCw size={18} className={loading ? "spin" : ""} />
        </button>
      </div>

      <div className="admin-main-tabs">
        <button
          className={`main-tab ${activeTab === "requests" ? "active" : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          Service Requests
        </button>
        <button
          className={`main-tab ${activeTab === "notifications" ? "active" : ""}`}
          onClick={() => setActiveTab("notifications")}
        >
          Notifications
        </button>
      </div>

      {activeTab === "requests" && (
        <>
          <div className="filter-tabs" style={{ marginBottom: "1rem" }}>
            {["all", "pending", "in-progress", "resolved", "completed"].map(
              (f) => (
                <button
                  key={f}
                  className={`filter-tab ${filter === f ? "active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ),
            )}
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
                        <div className="req-cell-sub">
                          PAN: {req.pan || "-"}
                        </div>
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
                        <span
                          className={`status-dot ${req.status || "pending"}`}
                        >
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
                            onChange={(e) =>
                              updateStatus(req.id, e.target.value)
                            }
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
        </>
      )}

      {activeTab === "notifications" && (
        <div className="notifications-section">
          {notifications.length === 0 ? (
            <p>No notifications found.</p>
          ) : (
            <div className="modern-table-wrap">
              <table className="modern-notif-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>User Details</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notif) => {
                    const linkedReq =
                      requests.find((r) => r.email === notif.email) || {};
                    return (
                      <tr key={notif.id} className="modern-notif-row">
                        <td className="modern-notif-date">
                          <div className="dt-date">
                            {notif.createdAt
                              ? new Date(notif.createdAt).toLocaleDateString(
                                  "en-IN",
                                )
                              : "-"}
                          </div>
                          <div className="dt-time">
                            {notif.createdAt
                              ? new Date(notif.createdAt).toLocaleTimeString(
                                  "en-IN",
                                )
                              : "-"}
                          </div>
                        </td>
                        <td className="modern-notif-user">
                          <strong
                            style={{ fontSize: "1.05rem", color: "#0f172a" }}
                          >
                            {notif.name ||
                              linkedReq.name ||
                              linkedReq.fullName ||
                              "Unknown User"}
                          </strong>
                          <div
                            style={{
                              color: "#64748b",
                              fontSize: "0.9rem",
                              marginTop: "0.3rem",
                            }}
                          >
                            {notif.email || "No Email"}
                          </div>
                          <div
                            style={{
                              color: "#64748b",
                              fontSize: "0.9rem",
                              marginTop: "0.1rem",
                            }}
                          >
                            {notif.phone || linkedReq.phone || "No Phone"}
                          </div>
                        </td>
                        <td className="modern-notif-status">
                          <span
                            className={`status-dot ${notif.status || "pending"}`}
                          >
                            {notif.status || "pending"}
                          </span>
                        </td>
                        <td className="modern-notif-actions">
                          <div
                            style={{
                              display: "flex",
                              gap: "0.5rem",
                              marginBottom: "0.5rem",
                            }}
                          >
                            <a
                              href={`https://wa.me/91${(
                                notif.phone ||
                                linkedReq.phone ||
                                ""
                              ).replace(
                                /\D/g,
                                "",
                              )}?text=Hello,%20this%20is%20regarding%20your%20CIBIL%20profile.`}
                              target="_blank"
                              rel="noreferrer"
                              title="WhatsApp"
                              className="icon-btn"
                              style={{ color: "#25D366" }}
                            >
                              <FaWhatsapp size={18} />
                            </a>
                            <a
                              href={`tel:${notif.phone || linkedReq.phone || ""}`}
                              title="Call"
                              className="icon-btn"
                              style={{ color: "#007BFF" }}
                            >
                              <FaPhone size={18} />
                            </a>
                            <a
                              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${
                                notif.email || linkedReq.email || ""
                              }&su=Regarding%20your%20CIBIL%20profile`}
                              target="_blank"
                              rel="noreferrer"
                              title="Email via Gmail"
                              className="icon-btn"
                              style={{ color: "#D44638" }}
                            >
                              <FaEnvelope size={18} />
                            </a>
                          </div>
                          <select
                            value={notif.status || "pending"}
                            onChange={(e) =>
                              updateNotifStatus(notif.id, e.target.value)
                            }
                            className="status-select"
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
