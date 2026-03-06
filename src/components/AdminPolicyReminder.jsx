import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../lib/api.js";
import "./AdminPolicyReminder.css";

export const AdminPolicyReminder = ({ embedded = false }) => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    address: "",
    policyNumber: "",
    policyType: "",
    purchaseDate: "",
    expirationDate: "",
    phone: "",
    email: "",
    premiumAmount: "",
    notes: "",
  });

  const policyTypes = [
    "Life Insurance",
    "Health Insurance",
    "Vehicle Insurance",
    "Home Insurance",
    "Travel Insurance",
    "Term Insurance",
    "ULIP",
    "Pension Plan",
    "Child Plan",
    "Other",
  ];

  useEffect(() => {
    fetchPolicies();
  }, []);
  useEffect(() => {
    checkExpiringPolicies();
  }, [policies]);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/policies");
      data.sort(
        (a, b) => new Date(a.expirationDate) - new Date(b.expirationDate),
      );
      setPolicies(data);
    } catch (error) {
      console.error("Error fetching policies:", error);
      alert("Error fetching policies");
    } finally {
      setLoading(false);
    }
  };

  const checkExpiringPolicies = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(
      today.getTime() + 30 * 24 * 60 * 60 * 1000,
    );
    const expiringPolicies = policies.filter((policy) => {
      const expDate = new Date(policy.expirationDate);
      return expDate >= today && expDate <= thirtyDaysFromNow;
    });
    const expiredPolicies = policies.filter(
      (policy) => new Date(policy.expirationDate) < today,
    );
    const notifs = [];
    expiredPolicies.forEach((policy) => {
      notifs.push({
        type: "expired",
        policy,
        message: `Policy ${policy.policyNumber} for ${policy.userName} has EXPIRED!`,
      });
    });
    expiringPolicies.forEach((policy) => {
      const daysLeft = Math.ceil(
        (new Date(policy.expirationDate) - today) / (1000 * 60 * 60 * 24),
      );
      notifs.push({
        type: "expiring",
        policy,
        message: `Policy ${policy.policyNumber} for ${policy.userName} expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`,
      });
    });
    setNotifications(notifs);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      userName: "",
      address: "",
      policyNumber: "",
      policyType: "",
      purchaseDate: "",
      expirationDate: "",
      phone: "",
      email: "",
      premiumAmount: "",
      notes: "",
    });
    setEditingPolicy(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.userName ||
      !formData.policyNumber ||
      !formData.policyType ||
      !formData.purchaseDate ||
      !formData.expirationDate
    ) {
      alert("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      if (editingPolicy) {
        await apiFetch(`/api/policies/${editingPolicy.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
        alert("Policy updated successfully!");
      } else {
        await apiFetch("/api/policies", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        alert("Policy added successfully!");
      }
      resetForm();
      fetchPolicies();
    } catch (error) {
      console.error("Error saving policy:", error);
      alert("Error saving policy");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (policy) => {
    setFormData({
      userName: policy.userName || "",
      address: policy.address || "",
      policyNumber: policy.policyNumber || "",
      policyType: policy.policyType || "",
      purchaseDate: policy.purchaseDate || "",
      expirationDate: policy.expirationDate || "",
      phone: policy.phone || "",
      email: policy.email || "",
      premiumAmount: policy.premiumAmount || "",
      notes: policy.notes || "",
    });
    setEditingPolicy(policy);
    setShowForm(true);
  };

  const handleDelete = async (policyId) => {
    if (
      !window.confirm("Are you sure you want to delete this policy reminder?")
    )
      return;
    try {
      await apiFetch(`/api/policies/${policyId}`, { method: "DELETE" });
      alert("Policy deleted successfully!");
      fetchPolicies();
    } catch (error) {
      console.error("Error deleting policy:", error);
      alert("Error deleting policy");
    }
  };

  const getStatusBadge = (expirationDate) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const daysLeft = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0)
      return <span className="status-badge expired">Expired</span>;
    else if (daysLeft <= 7)
      return (
        <span className="status-badge critical">Expires in {daysLeft}d</span>
      );
    else if (daysLeft <= 30)
      return (
        <span className="status-badge warning">Expires in {daysLeft}d</span>
      );
    else return <span className="status-badge active">Active</span>;
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      policy.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.policyNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.phone?.includes(searchTerm);
    const matchesType =
      filterType === "all" || policy.policyType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className={`policy-reminder-container ${embedded ? "embedded" : ""}`}>
      <div className="policy-header">
        {!embedded && (
          <button className="back-btn" onClick={() => navigate("/admin")}>
            ← Back
          </button>
        )}
        <div className="header-content">
          <h1>📋 Policy Reminders</h1>
          <p>Manage and track policy expirations</p>
        </div>
        <div className="header-actions">
          <button
            className={`notification-btn ${notifications.length > 0 ? "has-notifications" : ""}`}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔
            {notifications.length > 0 && (
              <span className="notification-count">{notifications.length}</span>
            )}
          </button>
          <button className="add-btn" onClick={() => setShowForm(true)}>
            + Add Policy
          </button>
        </div>
      </div>

      {showNotifications && notifications.length > 0 && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <h3>⚠️ Policy Alerts</h3>
            <button onClick={() => setShowNotifications(false)}>×</button>
          </div>
          <div className="notifications-list">
            {notifications.map((notif, idx) => (
              <div
                key={idx}
                className={`notification-item ${notif.type}`}
                onClick={() => {
                  handleEdit(notif.policy);
                  setShowNotifications(false);
                }}
              >
                <span className="notif-icon">
                  {notif.type === "expired" ? "🔴" : "🟡"}
                </span>
                <span className="notif-message">{notif.message}</span>
                <span className="notif-arrow">→</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card total">
          <span className="stat-icon">📊</span>
          <div className="stat-info">
            <span className="stat-number">{policies.length}</span>
            <span className="stat-label">Total Policies</span>
          </div>
        </div>
        <div className="stat-card active">
          <span className="stat-icon">✅</span>
          <div className="stat-info">
            <span className="stat-number">
              {
                policies.filter((p) => new Date(p.expirationDate) > new Date())
                  .length
              }
            </span>
            <span className="stat-label">Active</span>
          </div>
        </div>
        <div className="stat-card expiring">
          <span className="stat-icon">⚠️</span>
          <div className="stat-info">
            <span className="stat-number">
              {notifications.filter((n) => n.type === "expiring").length}
            </span>
            <span className="stat-label">Expiring Soon</span>
          </div>
        </div>
        <div className="stat-card expired">
          <span className="stat-icon">❌</span>
          <div className="stat-info">
            <span className="stat-number">
              {notifications.filter((n) => n.type === "expired").length}
            </span>
            <span className="stat-label">Expired</span>
          </div>
        </div>
      </div>

      <div className="search-filter-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name, policy number, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          {policyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => resetForm()}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPolicy ? "✏️ Edit Policy" : "➕ Add New Policy"}</h2>
              <button className="close-btn" onClick={resetForm}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="policy-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>User Name *</label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Policy Number *</label>
                  <input
                    type="text"
                    name="policyNumber"
                    value={formData.policyNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., POL-2024-001"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Policy Type *</label>
                  <select
                    name="policyType"
                    value={formData.policyType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Type</option>
                    {policyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Premium Amount</label>
                  <input
                    type="number"
                    name="premiumAmount"
                    value={formData.premiumAmount}
                    onChange={handleInputChange}
                    placeholder="₹ Amount"
                  />
                </div>
                <div className="form-group">
                  <label>Purchase Date *</label>
                  <input
                    type="date"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Expiration Date *</label>
                  <input
                    type="date"
                    name="expirationDate"
                    value={formData.expirationDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="customer@email.com"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter full address"
                    rows="2"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Additional notes..."
                    rows="2"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading
                    ? "Saving..."
                    : editingPolicy
                      ? "Update Policy"
                      : "Add Policy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="policies-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading policies...</p>
          </div>
        ) : filteredPolicies.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <h3>No policies found</h3>
            <p>
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filter"
                : "Add your first policy reminder to get started"}
            </p>
          </div>
        ) : (
          <>
            <table className="policies-table desktop-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Policy Details</th>
                  <th>Type</th>
                  <th>Purchase Date</th>
                  <th>Expiration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPolicies.map((policy) => (
                  <tr key={policy.id}>
                    <td>
                      <div className="customer-info">
                        <strong>{policy.userName}</strong>
                        {policy.phone && (
                          <span className="phone">{policy.phone}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="policy-info">
                        <strong>{policy.policyNumber}</strong>
                        {policy.premiumAmount && (
                          <span className="premium">
                            ₹{Number(policy.premiumAmount).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="type-badge">{policy.policyType}</span>
                    </td>
                    <td>{formatDate(policy.purchaseDate)}</td>
                    <td>{formatDate(policy.expirationDate)}</td>
                    <td>{getStatusBadge(policy.expirationDate)}</td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(policy)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(policy.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mobile-cards">
              {filteredPolicies.map((policy) => (
                <div key={policy.id} className="policy-card">
                  <div className="card-header">
                    <div className="card-title">
                      <h4>{policy.userName}</h4>
                      {getStatusBadge(policy.expirationDate)}
                    </div>
                    <div className="card-actions">
                      <button onClick={() => handleEdit(policy)}>✏️</button>
                      <button onClick={() => handleDelete(policy.id)}>
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="card-row">
                      <span className="label">Policy #:</span>
                      <span className="value">{policy.policyNumber}</span>
                    </div>
                    <div className="card-row">
                      <span className="label">Type:</span>
                      <span className="type-badge">{policy.policyType}</span>
                    </div>
                    <div className="card-row">
                      <span className="label">Purchase:</span>
                      <span className="value">
                        {formatDate(policy.purchaseDate)}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="label">Expires:</span>
                      <span className="value">
                        {formatDate(policy.expirationDate)}
                      </span>
                    </div>
                    {policy.phone && (
                      <div className="card-row">
                        <span className="label">Phone:</span>
                        <span className="value">{policy.phone}</span>
                      </div>
                    )}
                    {policy.premiumAmount && (
                      <div className="card-row">
                        <span className="label">Premium:</span>
                        <span className="value">
                          ₹{Number(policy.premiumAmount).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
