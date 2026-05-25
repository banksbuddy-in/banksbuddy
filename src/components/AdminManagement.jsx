import React, { useState, useEffect } from "react";
import apiFetch from "../lib/api.js";
import "./AdminManagement.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useConfirm } from "../context/ToastContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineShieldCheck,
  HiOutlineSearch,
} from "react-icons/hi";

const COLORS = ["#059669", "#3b82f6"];

export const AdminManagement = ({ embedded = false }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const confirm = useConfirm();
  const [users, setUsers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchActivityLogs();
  }, []);

  const showNotification = (msg) => {
    setStatus(msg);
    const timer = setTimeout(() => {
      setStatus("");
    }, 3500);
    return () => clearTimeout(timer);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/users");
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const data = await apiFetch("/api/activity-logs");
      setActivityLogs(data || []);
    } catch (err) {
      console.error("Error fetching activity logs:", err);
    }
  };

  const updateRole = async (uid, newRole) => {
    // Double check to prevent self-demotion on the client side
    if (uid === currentUser?.uid && newRole !== "admin") {
      showNotification("Error: You cannot remove yourself from the admin role.");
      return;
    }

    try {
      await apiFetch(`/api/users/${uid}`, {
        method: "PUT",
        body: JSON.stringify({ role: newRole }),
      });
      showNotification(`Role updated to "${newRole}".`);
      
      // Log DB action
      apiFetch("/api/activity-logs", {
        method: "POST",
        body: JSON.stringify({
          type: "db_action",
          action: "update_role",
          timestamp: new Date().toISOString(),
        }),
      }).catch(err => console.error("Failed to log role update action:", err));

      fetchUsers();
      fetchActivityLogs();
    } catch (err) {
      console.error("Error updating role:", err);
      showNotification("Failed to update role.");
    }
  };

  const deleteUser = async (uid, displayName) => {
    if (uid === currentUser?.uid) {
      showNotification("Error: You cannot delete your own account.");
      return;
    }
    const label = displayName || uid;
    const confirmed = await confirm(
      `Delete user "${label}"?\n\nThis will permanently remove their account and all associated data (CIBIL requests, partner applications, policy reminders, notifications).\n\nConsultations will be kept.\n\nThis action cannot be undone.`
    );
    if (!confirmed) return;
    try {
      await apiFetch(`/api/users/${uid}`, { method: "DELETE" });
      showNotification(`User "${label}" and their data have been deleted.`);
      apiFetch("/api/activity-logs", {
        method: "POST",
        body: JSON.stringify({
          type: "db_action",
          action: "delete_user",
          targetUid: uid,
          timestamp: new Date().toISOString(),
        }),
      }).catch((err) => console.error("Failed to log delete action:", err));
      fetchUsers();
      fetchActivityLogs();
    } catch (err) {
      console.error("Error deleting user:", err);
      showNotification("Failed to delete user. Please try again.");
    }
  };

  // Analytics logic
  const totalUsers = users.length;
  const adminUsers = users.filter((u) => u.role === "admin").length;
  const regularUsers = totalUsers - adminUsers;

  const chartData = [
    { name: "Admins", value: adminUsers },
    { name: "Regular Users", value: regularUsers },
  ];



  // Helper to generate last 7 days metrics
  const getLast7DaysMetrics = () => {
    const days = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    // Baseline statistics to populate initial dashboard layout
    const baselineStats = {
      Mon: { v: 12, f: 8 },
      Tue: { v: 15, f: 12 },
      Wed: { v: 18, f: 14 },
      Thu: { v: 22, f: 20 },
      Fri: { v: 27, f: 25 },
      Sat: { v: 21, f: 18 },
      Sun: { v: 25, f: 22 }
    };

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const name = dayNames[d.getDay()];
      const base = baselineStats[name] || { v: 5, f: 3 };
      
      days.push({
        dateStr,
        name,
        "Vercel Requests": base.v,
        "Firebase DB Actions": base.f
      });
    }
    return days;
  };

  // Group real logs dynamically
  const activityData = getLast7DaysMetrics();
  activityLogs.forEach((log) => {
    if (!log.timestamp) return;
    const logDate = log.timestamp.split("T")[0];
    const targetDay = activityData.find((day) => day.dateStr === logDate);
    if (targetDay) {
      if (log.type === "page_view") {
        targetDay["Vercel Requests"] += 1;
      } else {
        targetDay["Firebase DB Actions"] += 1;
      }
    }
  });

  // Filtered users for table search
  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      (u.email || u.id || "").toLowerCase().includes(term) ||
      (u.displayName || u.username || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className={`users-dashboard ${embedded ? "embedded" : ""}`}>
      {!embedded && (
        <button className="back-btn" onClick={() => navigate("/admin")}>
          ← Back to Admin
        </button>
      )}

      {/* Toast Notification */}
      {status && (
        <div className="users-toast-notification">
          <span>{status}</span>
        </div>
      )}

      {/* Header */}
      <div className="users-header">
        <div>
          <h3>User Management & Analytics</h3>
          <p className="users-desc">
            Monitor registration metrics, user distributions, and manage access control permissions.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="users-stats-grid">
        <div className="users-stat-card">
          <div className="users-stat-icon icon-users">
            <HiOutlineUsers />
          </div>
          <div className="users-stat-info">
            <span className="users-stat-value">{totalUsers}</span>
            <span className="users-stat-label">Total Users</span>
          </div>
        </div>

        <div className="users-stat-card">
          <div className="users-stat-icon icon-admins">
            <HiOutlineShieldCheck />
          </div>
          <div className="users-stat-info">
            <span className="users-stat-value">{adminUsers}</span>
            <span className="users-stat-label">Administrators</span>
          </div>
        </div>

        <div className="users-stat-card">
          <div className="users-stat-icon icon-regular">
            <HiOutlineUserGroup />
          </div>
          <div className="users-stat-info">
            <span className="users-stat-value">{regularUsers}</span>
            <span className="users-stat-label">Regular Users</span>
          </div>
        </div>
      </div>

     

      {/* Search Filter */}
      <div className="users-filters">
        <div className="users-search-box">
          <input
            type="text"
            className="users-search-input"
            placeholder="Search by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="users-table-container">
        {loading ? (
          <p style={{ padding: "2rem", textAlign: "center" }}>Loading users...</p>
        ) : filteredUsers.length === 0 ? (
          <p style={{ padding: "2rem", textAlign: "center" }}>No users found.</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Current Role</th>
                <th>Role Actions</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const isSelf = user.id === currentUser?.uid;
                const displayName = user.displayName || user.username || "-";
                const userEmail = user.email || user.id;

                return (
                  <tr key={user.id}>
                    <td>
                      <span className="user-display-name">
                        {displayName} {isSelf && " (You)"}
                      </span>
                      <span className="user-email">{userEmail}</span>
                    </td>
                    <td>
                      <span
                        className={`role-badge ${
                          user.role === "admin" ? "role-admin" : "role-user"
                        }`}
                      >
                        {user.role || "user"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        {user.role !== "admin" && (
                          <button
                            className="users-action-btn primary"
                            onClick={() => updateRole(user.id, "admin")}
                          >
                            Make Admin
                          </button>
                        )}
                        {user.role === "admin" && (
                          <button
                            className="users-action-btn secondary"
                            onClick={() => updateRole(user.id, "user")}
                            disabled={isSelf}
                            title={
                              isSelf
                                ? "You cannot demote yourself from Admin"
                                : ""
                            }
                          >
                            Make User
                          </button>
                        )}
                      </div>
                    </td>
                    <td>
                      <button
                        className="users-action-btn danger"
                        onClick={() => deleteUser(user.id, displayName)}
                        disabled={isSelf}
                        title={isSelf ? "You cannot delete your own account" : `Delete ${displayName}`}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

