import React, { useEffect, useState } from "react";
import apiFetch from "../lib/api.js";
import { useNavigate } from "react-router-dom";
import { FiRefreshCw, FiArrowLeft } from "react-icons/fi";
import { FaWhatsapp, FaPhone, FaEnvelope } from "react-icons/fa";
import "./AdminCibil.css";

export const AdminCibil = ({ embedded = false }) => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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
    try {
      const data = await apiFetch("/api/cibil-requests");
      if (Array.isArray(data)) {
        setRequests(data);
      } else if (data && typeof data === "object") {
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        setRequests(list);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error("Error fetching CIBIL requests:", err);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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
                          {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : "-"}
                        </div>
                        <div className="dt-time">
                          {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString() : "-"}
                        </div>
                      </td>
                      <td className="modern-notif-user">
                        <strong>
                          {notif.name ||
                            linkedReq.name ||
                            linkedReq.fullName ||
                            "Unknown User"}
                        </strong>
                        <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "2px" }}>
                          {notif.email}
                        </div>
                        {(notif.phone || linkedReq.phone) && (
                          <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "2px" }}>
                            Phone: {notif.phone || linkedReq.phone}
                          </div>
                        )}
                        <p style={{ margin: "0.4rem 0 0 0", color: "#475569", lineHeight: "1.4" }}>
                          {notif.message}
                        </p>
                      </td>
                      <td>
                        <span className={`status-dot ${notif.status || "requested"}`}>
                          {(notif.status || "requested").toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions-cell" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                          <div className="contact-links" style={{ display: "flex", gap: "0.3rem" }}>
                            {(notif.phone || linkedReq.phone) && (
                              <>
                                <a
                                  href={`https://wa.me/${(notif.phone || linkedReq.phone).replace(/[^0-9]/g, "")}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  title="Chat on WhatsApp"
                                  className="icon-btn"
                                  style={{ color: "#25D366" }}
                                >
                                  <FaWhatsapp size={18} />
                                </a>
                                <a
                                  href={`tel:${notif.phone || linkedReq.phone}`}
                                  title="Call user"
                                  className="icon-btn"
                                  style={{ color: "#3b82f6" }}
                                >
                                  <FaPhone size={16} />
                                </a>
                              </>
                            )}
                            <a
                              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${
                                notif.email
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
                            value={notif.status || "requested"}
                            onChange={(e) =>
                              updateNotifStatus(notif.id, e.target.value)
                            }
                            className="status-select"
                          >
                            <option value="requested">Requested</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
