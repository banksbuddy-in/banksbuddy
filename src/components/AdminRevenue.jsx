import React, { useState, useEffect, useRef } from "react";
import apiFetch from "../lib/api.js";
import {
  HiOutlineCurrencyRupee,
  HiPlus,
  HiSearch,
  HiDownload,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiCalendar,
} from "react-icons/hi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import * as XLSX from "xlsx";
import "./Admin.css";
import "./AdminRevenue.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Service Categories Configuration
const SERVICE_CATEGORIES = {
  "Loan Services": [
    "Personal Loan",
    "Home Loan",
    "Education Loan",
    "Machinery/Auto Loan",
    "Business Loan",
    "Loan Against Property",
  ],
  "Cibil Improvement": ["CIBIL Score Improvement"],
  "Insurance Services": [
    "Life Insurance",
    "Health Insurance",
    "General Insurance",
  ],
  "Other Services": [
    "Website Development",
    "Tax Consultancy Services",
    "Other",
  ],
};

export const AdminRevenue = ({ embedded }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTxns, setFilteredTxns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    mainCategory: "Loan Services",
    subCategory: "Personal Loan", // Default first item
    status: "paid",
    amount: "",
    isInstantPaid: true,
    customDate: "", // YYYY-MM-DDTHH:mm format
  });

  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingPayment: 0,
    completedPayment: 0,
  });

  // Fetch Data from all 3 sources via REST
  const fetchAll = async () => {
    try {
      const [cibilData, manualData, instamojoData] = await Promise.all([
        apiFetch("/api/revenue/cibil"),
        apiFetch("/api/revenue/manual"),
        apiFetch("/api/revenue/instamojo"),
      ]);

      const processData = (data, source, mapper) => {
        if (Array.isArray(data)) {
          return data.map((v) => ({ ...mapper(v), id: v.id, source }));
        }
        return Object.entries(data || {}).map(([k, v]) => ({
          ...mapper(v),
          id: k,
          source,
        }));
      };

      const cibilList = processData(cibilData, "Cibil", (v) => ({
        mainCategory: "Cibil Improvement",
        subCategory: "CIBIL Score Improvement",
        username: v.name,
        email: v.email,
        mobile: v.phone,
        status: v.status || (v.paymentId ? "paid" : "pending"),
        amount: v.amount || 200,
        date: v.createdAt,
      }));

      const manualList = processData(manualData, "Manual", (v) => ({
        username: v.fullName,
        ...v,
      }));

      const instamojoList = processData(instamojoData, "Instamojo", (v) => ({
        username: v.username || v.buyer_name,
        email: v.email,
        mobile: v.mobile || v.phone,
        mainCategory: v.mainCategory || "Cibil Improvement",
        subCategory: v.serviceTitle || "CIBIL Score Improvement",
        serviceType: v.serviceTitle,
        status: v.status || "paid",
        amount: v.amount,
        date: v.date || v.createdAt,
      }));

      const all = [...cibilList, ...manualList, ...instamojoList].sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );
      setTransactions(all);
    } catch (err) {
      console.error("Error fetching revenue:", err);
    }
  };

  useEffect(() => {
    fetchAll();
    // Poll every 30s for near-realtime updates
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateTxnStatus = async (txn, newStatus) => {
    try {
      let endpoint;
      let payload;

      if (txn.source === "Manual") {
        endpoint = `/api/revenue/manual/${txn.id}`;
        payload = { status: newStatus };
      } else if (txn.source === "Instamojo") {
        endpoint = `/api/revenue/instamojo/${txn.id}`;
        payload = { status: newStatus };
      } else {
        endpoint = `/api/revenue/cibil/${txn.id}`;
        payload = { status: newStatus };
      }

      await apiFetch(endpoint, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      // Optimistic update
      setTransactions((prev) =>
        prev.map((t) => (t.id === txn.id ? { ...t, status: newStatus } : t)),
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  useEffect(() => {
    const filtered = transactions.filter(
      (t) =>
        t.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.mobile?.includes(searchTerm) ||
        t.email?.toLowerCase().includes(searchTerm),
    );
    setFilteredTxns(filtered);

    const totalRev = transactions
      .filter((t) => ["paid", "completed", "resolved"].includes(t.status))
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const pending = transactions.filter((t) => t.status === "pending").length;
    const completed = transactions.filter((t) =>
      ["paid", "completed", "resolved"].includes(t.status),
    ).length;

    setStats({
      totalRevenue: totalRev,
      pendingPayment: pending,
      completedPayment: completed,
    });
  }, [transactions, searchTerm]);

  // Handle Form Logic
  const handleMainCategoryChange = (e) => {
    const category = e.target.value;
    setFormData((prev) => ({
      ...prev,
      mainCategory: category,
      subCategory: SERVICE_CATEGORIES[category]
        ? SERVICE_CATEGORIES[category][0]
        : "Other",
    }));
  };

  const handleEdit = (txn) => {
    setEditingTxn(txn);
    setFormData({
      fullName: txn.username,
      email: txn.email || "",
      mobile: txn.mobile || "",
      mainCategory: txn.mainCategory || "Loan Services",
      subCategory: txn.subCategory || "",
      status: txn.status,
      amount: txn.amount,
      isInstantPaid: true,
      customDate: "",
    });
    setShowModal(true);
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.amount || !formData.mobile) return;

    // Determine Date
    let finalDate = new Date().toISOString();
    if (!formData.isInstantPaid && formData.customDate) {
      finalDate = new Date(formData.customDate).toISOString();
    }

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        mainCategory: formData.mainCategory,
        subCategory: formData.subCategory,
        status: formData.status,
        amount: Number(formData.amount),
        updatedAt: new Date().toISOString(),
      };

      if (editingTxn) {
        // Update existing record via REST
        let endpoint;
        let finalPayload;
        if (editingTxn.source === "Manual") {
          endpoint = `/api/revenue/manual/${editingTxn.id}`;
          finalPayload = payload;
        } else if (editingTxn.source === "Instamojo") {
          endpoint = `/api/revenue/instamojo/${editingTxn.id}`;
          finalPayload = {
            username: formData.fullName,
            email: formData.email,
            mobile: formData.mobile,
            amount: Number(formData.amount),
            status: formData.status,
          };
        } else {
          endpoint = `/api/revenue/cibil/${editingTxn.id}`;
          finalPayload = {
            name: formData.fullName,
            email: formData.email,
            phone: formData.mobile,
            amount: Number(formData.amount),
            status: formData.status,
          };
        }
        await apiFetch(endpoint, {
          method: "PUT",
          body: JSON.stringify(finalPayload),
        });
      } else {
        // Create new manual record
        payload.createdAt = finalDate;
        payload.date = finalDate;
        await apiFetch("/api/revenue/manual", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      await fetchAll();

      setShowModal(false);
      setEditingTxn(null);
      setFormData({
        fullName: "",
        email: "",
        mobile: "",
        mainCategory: "Loan Services",
        subCategory: "Personal Loan",
        status: "paid",
        amount: "",
        isInstantPaid: true,
        customDate: "",
      });
    } catch (error) {
      console.error("Error saving revenue:", error);
    }
  };

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(
      transactions.map((t) => ({
        Name: t.username,
        Mobile: t.mobile,
        Email: t.email,
        "Main Service": t.mainCategory || "Other",
        "Sub Service": t.subCategory || t.serviceType,
        Status: t.status,
        Amount: t.amount,
        Date: new Date(t.date).toLocaleString(),
      })),
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Revenue_Report");
    XLSX.writeFile(wb, "Revenue_Transactions.xlsx");
  };

  // Chart Logic
  const serviceData = transactions.reduce((acc, curr) => {
    // Prefer mainCategory if available, else standard fallback
    const svc = curr.mainCategory || "Other Services";
    if (!acc[svc]) acc[svc] = 0;
    if (["paid", "completed", "resolved"].includes(curr.status)) {
      acc[svc] += Number(curr.amount || 0);
    }
    return acc;
  }, {});

  const barChartData = Object.entries(serviceData).map(([name, value]) => ({
    name,
    value,
  }));

  const pieChartData = [
    { name: "Paid", value: stats.completedPayment },
    { name: "Pending", value: stats.pendingPayment },
  ];

  return (
    <div className={`admin-module rev-dashboard ${embedded ? "embedded" : ""}`}>
      {/* Header */}
      <div className="rev-header">
        <div>
          <h3>Revenue & Finance</h3>
          <p className="rev-desc">
            Detailed financial tracking for all services.
          </p>
        </div>
        <button className="rev-add-btn" onClick={() => setShowModal(true)}>
          <HiPlus /> Add Revenue
        </button>
      </div>

      {/* Stats Cards */}
      <div className="rev-stats-grid">
        <div className="rev-stat-card">
          <div className="rev-stat-icon icon-revenue">
            <HiOutlineCurrencyRupee />
          </div>
          <div className="rev-stat-info">
            <span className="rev-stat-value">
              ₹{stats.totalRevenue.toLocaleString()}
            </span>
            <span className="rev-stat-label">Total Revenue</span>
          </div>
        </div>

        <div className="rev-stat-card">
          <div className="rev-stat-icon icon-pending">
            <HiOutlineClock />
          </div>
          <div className="rev-stat-info">
            <span className="rev-stat-value">{stats.pendingPayment}</span>
            <span className="rev-stat-label">Pending Payments</span>
          </div>
        </div>

        <div className="rev-stat-card">
          <div className="rev-stat-icon icon-completed">
            <HiOutlineCheckCircle />
          </div>
          <div className="rev-stat-info">
            <span className="rev-stat-value">{stats.completedPayment}</span>
            <span className="rev-stat-label">Completed Transactions</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="rev-charts-grid">
        <div className="rev-chart-card">
          <div className="rev-chart-header">
            <h4>Revenue by Category</h4>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={barChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
                interval={0}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                cursor={{ fill: "#f1f5f9" }}
              />
              <Bar
                dataKey="value"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
              >
                {barChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#3b82f6", "#06b6d4", "#8b5cf6"][index % 3]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rev-chart-card">
          <div className="rev-chart-header">
            <h4>Payment Status</h4>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Legend
                iconType="circle"
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter & Table */}
      <div className="rev-filters">
        <div className="rev-search-box">
          <input
            type="text"
            className="rev-search-input"
            placeholder="Search by name, mobile, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="rev-export-btn" onClick={handleDownload}>
          <HiDownload /> Export Report
        </button>
      </div>

      <div className="rev-table-container">
        <table className="rev-table">
          <thead>
            <tr>
              <th>User Details</th>
              <th>Service Category</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Date & Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTxns.length > 0 ? (
              filteredTxns.map((t) => (
                <tr key={t.id}>
                  <td>
                    <span className="rev-user-name">{t.username}</span>
                    <span className="rev-user-sub">{t.email}</span>
                    <span className="rev-user-sub" style={{ color: "#64748b" }}>
                      {t.mobile}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontWeight: 600,
                        color: "#334155",
                        display: "block",
                      }}
                    >
                      {t.mainCategory || "Other"}
                    </span>
                    <span
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        color: "#0f172a",
                        marginTop: "2px",
                      }}
                    >
                      {t.subCategory || t.serviceType}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`rev-status-badge rev-status-${t.status || "pending"}`}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "currentColor",
                        }}
                      ></span>
                      <span style={{ textTransform: "capitalize" }}>
                        {t.status}
                      </span>
                    </span>
                  </td>
                  <td>
                    <span className="rev-amount">
                      ₹{Number(t.amount).toLocaleString()}
                    </span>
                  </td>
                  <td style={{ color: "#64748b", fontSize: "0.85rem" }}>
                    {new Date(t.date).toLocaleDateString()}
                    <br />
                    <small>
                      {new Date(t.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      <select
                        className="rev-status-select"
                        value={t.status || "pending"}
                        onChange={(e) => updateTxnStatus(t, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="resolved">Resolved</option>
                        <option value="completed">Completed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                      <button
                        className="rev-edit-btn-small"
                        onClick={() => handleEdit(t)}
                        title="Edit Full Entry"
                      >
                        Edit Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "3rem",
                    color: "#94a3b8",
                  }}
                >
                  No revenue records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Manual Entry Modal */}
      {showModal && (
        <div
          className="cb-modal-overlay"
          onClick={() => {
            setShowModal(false);
            setEditingTxn(null);
          }}
        >
          <div
            className="cb-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "600px" }}
          >
            <h2 className="cb-modal-title">
              {editingTxn ? "Edit Revenue Entry" : "Add Revenue Entry"}
            </h2>
            <form className="cb-form" onSubmit={handleManualSubmit}>
              <div className="cb-form-row">
                <div style={{ flex: 1 }}>
                  <label className="rev-form-label">Full Name</label>
                  <input
                    className="cb-input"
                    placeholder="Enter full name"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="rev-form-label">Payment Amount (₹)</label>
                  <input
                    className="cb-input"
                    placeholder="e.g. 5000"
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="cb-form-row">
                <div style={{ flex: 1 }}>
                  <label className="rev-form-label">
                    Main Service Category
                  </label>
                  <select
                    className="cb-select"
                    required
                    value={formData.mainCategory}
                    onChange={handleMainCategoryChange}
                  >
                    {Object.keys(SERVICE_CATEGORIES).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="rev-form-label">Sub-Service</label>
                  <select
                    className="cb-select"
                    required
                    value={formData.subCategory}
                    onChange={(e) =>
                      setFormData({ ...formData, subCategory: e.target.value })
                    }
                  >
                    {SERVICE_CATEGORIES[formData.mainCategory].map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="cb-form-row">
                <div style={{ flex: 1 }}>
                  <label className="rev-form-label">Contact Number</label>
                  <input
                    className="cb-input"
                    placeholder="Mobile Number"
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="rev-form-label">Email Address</label>
                  <input
                    className="cb-input"
                    placeholder="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="cb-form-row">
                <div style={{ flex: 1 }}>
                  <label className="rev-form-label">Payment Status</label>
                  <select
                    className="cb-select"
                    required
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="resolved">Resolved</option>
                    <option value="completed">Completed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              {/* Date Selection Logic - Only for new entries */}
              {!editingTxn && (
                <div
                  style={{
                    background: "#f8fafc",
                    padding: "1rem",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <label
                    className="rev-form-label"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: formData.isInstantPaid ? 0 : "0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.isInstantPaid}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isInstantPaid: e.target.checked,
                        })
                      }
                      style={{ width: "16px", height: "16px" }}
                    />
                    <span>
                      Record as <strong>Instantly Paid</strong> (Current Time)
                    </span>
                  </label>

                  {!formData.isInstantPaid && (
                    <div
                      style={{ marginTop: "0.5rem", animation: "fadeIn 0.2s" }}
                    >
                      <label className="rev-form-label">
                        Select Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        className="cb-input"
                        required={!formData.isInstantPaid}
                        value={formData.customDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}
                </div>
              )}

              <button
                className="cb-btn-submit"
                type="submit"
                style={{ marginTop: "1rem" }}
              >
                Save Transaction
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
