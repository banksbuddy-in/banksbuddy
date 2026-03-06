import React, { useState, useEffect } from "react";
import apiFetch from "../lib/api.js";
import "./AddCareer.css";
import { useNavigate } from "react-router-dom";

export const AdminManagement = ({ embedded = false }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const updateRole = async (uid, newRole) => {
    try {
      await apiFetch(`/api/users/${uid}`, {
        method: "PUT",
        body: JSON.stringify({ role: newRole }),
      });
      setStatus(`Role updated to "${newRole}".`);
      fetchUsers();
    } catch (err) {
      console.error("Error updating role:", err);
      setStatus("Failed to update role.");
    }
  };

  return (
    <div className={`add-career ${embedded ? "embedded" : ""}`}>
      {!embedded && (
        <button className="back-btn" onClick={() => navigate("/admin")}>
          ← Back to Admin
        </button>
      )}
      <h2 className="ac-title">Admin User Management</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table
          className="users-table"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Email</th>
              <th>Display Name</th>
              <th>Current Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email || user.id}</td>
                <td>{user.displayName || "-"}</td>
                <td>
                  <span className="role-badge">{user.role || "user"}</span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {user.role !== "admin" && (
                      <button
                        className="role-btn"
                        onClick={() => updateRole(user.id, "admin")}
                      >
                        Make Admin
                      </button>
                    )}
                    {user.role !== "user" && (
                      <button
                        className="role-btn secondary"
                        onClick={() => updateRole(user.id, "user")}
                      >
                        Make User
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {status && <p className="ac-status">{status}</p>}
    </div>
  );
};
