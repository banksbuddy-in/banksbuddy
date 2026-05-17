import React, { useState, useEffect, useRef } from "react";
import apiFetch from "../lib/api.js";
import {
  HiOutlineCurrencyRupee,
  HiPlus,
  HiSearch,
  HiDownload,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiDocumentText,
  HiPencilAlt,
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
import InvoicePreview from "./InvoicePreview";
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
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  
  const [editingTxn, setEditingTxn] = useState(null);
  const [invoiceDataMap, setInvoiceDataMap] = useState({});
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Form State for Add Revenue
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    mainCategory: "Loan Services",
    subCategory: "Personal Loan",
    totalAmount: "",
    paidAmount: "",
    isInstantPaid: true,
    customDate: "", 
  });

  // Form State for Edit Details (Invoice Metadata)
  const [invoiceForm, setInvoiceForm] = useState({
    invoiceId: "",
    billingAddress: "",
  });

  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingPayment: 0,
    completedPayment: 0,
  });

  // Fetch Data
  const fetchAll = async () => {
    try {
      // Use individual .catch so one failing endpoint doesn't block all others
      const [cibilRaw, manualData, instamojoData, invoicesData] = await Promise.all([
        apiFetch("/api/cibil-requests").catch((e) => { console.warn("cibil-requests failed:", e.message); return []; }),
        apiFetch("/api/revenue/manual").catch((e) => { console.warn("revenue/manual failed:", e.message); return []; }),
        apiFetch("/api/revenue/instamojo").catch((e) => { console.warn("revenue/instamojo failed:", e.message); return []; }),
        apiFetch("/api/revenue/invoices").catch((e) => { console.warn("revenue/invoices failed:", e.message); return {}; }),
      ]);

      console.log("[Revenue] raw fetch results:", { cibilRaw, manualData, instamojoData, invoicesData });

      setInvoiceDataMap(invoicesData || {});

      // Normalize any data shape (array or Firebase object) into an array with id
      const toList = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data.filter(Boolean);
        return Object.entries(data).map(([k, v]) => ({ id: k, ...v }));
      };

      const cibilList = toList(cibilRaw).map((v) => ({
        id: v.id,
        source: "Cibil",
        mainCategory: "Cibil Improvement",
        subCategory: "CIBIL Score Improvement",
        username: v.name || v.fullName || v.username || "—",
        email: v.email || "",
        mobile: v.phone || v.mobile || "",
        totalAmount: Number(v.amount || 0),
        paidAmount: (v.status === "paid" || v.status === "completed")
          ? Number(v.amount || 0)
          : v.paymentId ? Number(v.amount || 0) : 0,
        status: v.status || "pending",
        date: v.createdAt || v.date || new Date().toISOString(),
      }));

      const manualList = toList(manualData).map((v) => ({
        id: v.id,
        source: "Manual",
        username: v.fullName || v.username || "—",
        mainCategory: v.mainCategory || "Other Services",
        subCategory: v.subCategory || "Other",
        totalAmount: Number(v.totalAmount || v.amount || 0),
        paidAmount: v.paidAmount !== undefined
          ? Number(v.paidAmount)
          : (v.status === "paid" || v.status === "completed" ? Number(v.amount || 0) : 0),
        email: v.email || "",
        mobile: v.mobile || v.phone || "",
        status: v.status || "pending",
        date: v.createdAt || v.date || new Date().toISOString(),
      }));

      const instamojoList = toList(instamojoData).map((v) => ({
        id: v.id,
        source: "Instamojo",
        username: v.username || v.buyer_name || v.name || "—",
        email: v.email || "",
        mobile: v.mobile || v.phone || "",
        mainCategory: v.mainCategory || "Cibil Improvement",
        subCategory: v.serviceTitle || v.subCategory || "CIBIL Score Improvement",
        serviceType: v.serviceTitle,
        totalAmount: Number(v.amount || 0),
        paidAmount: (v.status === "paid" || v.status === "completed" || !v.status)
          ? Number(v.amount || 0) : 0,
        status: v.status || "paid",
        date: v.date || v.createdAt || new Date().toISOString(),
      }));

      const computeDerived = (t, invoicesMap) => {
        const total = Number(t.totalAmount || 0);
        const paid = Number(t.paidAmount || 0);
        const due = Math.max(0, total - paid);
        let invoiceStatus = "Due";
        if (due <= 0) invoiceStatus = "Paid";
        else if (paid > 0) invoiceStatus = "Partial";
        const invData = (invoicesMap || {})[t.id] || {};
        return {
          ...t,
          totalAmount: total,
          paidAmount: paid,
          dueAmount: due,
          invoiceStatus,
          invoiceId: invData.invoiceId || "",
          billingAddress: invData.billingAddress || "",
          invoiceDate: invData.invoiceDate || t.date,
        };
      };

      const all = [...cibilList, ...manualList, ...instamojoList]
        .map((t) => computeDerived(t, invoicesData))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      console.log("[Revenue] total rows to display:", all.length);
      setTransactions(all);
    } catch (err) {
      console.error("Error fetching revenue:", err);
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const filtered = transactions.filter(
      (t) =>
        t.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.mobile?.includes(searchTerm) ||
        t.email?.toLowerCase().includes(searchTerm) ||
        t.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTxns(filtered);

    const totalRev = transactions.reduce((sum, t) => sum + t.paidAmount, 0);
    const pending = transactions.filter((t) => t.invoiceStatus === "Due" || t.invoiceStatus === "Partial").length;
    const completed = transactions.filter((t) => t.invoiceStatus === "Paid").length;

    setStats({
      totalRevenue: totalRev,
      pendingPayment: pending,
      completedPayment: completed,
    });
  }, [transactions, searchTerm]);

  // Handle Add Revenue Form
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

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.totalAmount || !formData.paidAmount || !formData.mobile) return;
    
    if (Number(formData.paidAmount) > Number(formData.totalAmount)) {
      alert("Paid amount cannot exceed total amount");
      return;
    }
    if (Number(formData.paidAmount) < 0 || Number(formData.totalAmount) < 0) {
        alert("Amounts cannot be negative");
        return;
    }

    let finalDate = new Date().toISOString();
    if (!formData.isInstantPaid && formData.customDate) {
      finalDate = new Date(formData.customDate).toISOString();
    }
    
    const total = Number(formData.totalAmount);
    const paid = Number(formData.paidAmount);
    const due = total - paid;
    let status = "Due";
    if (due <= 0) status = "Paid";
    else if (paid > 0) status = "Partial";

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        mainCategory: formData.mainCategory,
        subCategory: formData.subCategory,
        totalAmount: total,
        paidAmount: paid,
        dueAmount: due,
        invoiceStatus: status,
        status: status.toLowerCase(), // legacy
        amount: total, // legacy
        updatedAt: new Date().toISOString(),
        createdAt: finalDate,
        date: finalDate,
      };

      await apiFetch("/api/revenue/manual", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      await fetchAll();

      setShowAddModal(false);
      setFormData({
        fullName: "",
        email: "",
        mobile: "",
        mainCategory: "Loan Services",
        subCategory: "Personal Loan",
        totalAmount: "",
        paidAmount: "",
        isInstantPaid: true,
        customDate: "",
      });
    } catch (error) {
      console.error("Error saving revenue:", error);
    }
  };

  const updateTxnStatus = async (txn, newStatus) => {
    // Optimistic UI update immediately
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id !== txn.id) return t;
        const updatedT = { ...t, status: newStatus };
        // Recalculate paidAmount for cibil entries based on new status
        if (t.source === "Cibil") {
          updatedT.paidAmount = (newStatus === "paid" || newStatus === "completed")
            ? t.totalAmount : 0;
          updatedT.dueAmount = t.totalAmount - updatedT.paidAmount;
          updatedT.invoiceStatus = updatedT.dueAmount <= 0 ? "Paid" : updatedT.paidAmount > 0 ? "Partial" : "Due";
        }
        return updatedT;
      })
    );

    try {
      let endpoint;
      if (txn.source === "Manual") {
        endpoint = `/api/revenue/manual/${txn.id}`;
      } else if (txn.source === "Instamojo") {
        endpoint = `/api/revenue/instamojo/${txn.id}`;
      } else {
        endpoint = `/api/cibil-requests/${txn.id}`;
      }

      await apiFetch(endpoint, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Error updating status:", err);
      // Rollback on failure
      fetchAll();
    }
  };

  // Handle Edit Details (Invoice Data)
  const handleEditDetails = (txn) => {
    setEditingTxn(txn);
    setInvoiceForm({
      invoiceId: txn.invoiceId || "",
      billingAddress: txn.billingAddress || "",
    });
    setShowEditDetailsModal(true);
  };

  const handleEditDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!editingTxn) return;

    try {
      const invoicePayload = {
        invoiceId: invoiceForm.invoiceId,
        billingAddress: invoiceForm.billingAddress,
        invoiceDate: new Date().toISOString(),
      };

      await apiFetch(`/api/revenue/invoices/${editingTxn.id}`, {
        method: "POST", // using POST as upsert
        body: JSON.stringify(invoicePayload),
      });

      await fetchAll();
      setShowEditDetailsModal(false);
      setEditingTxn(null);
    } catch (error) {
      console.error("Error saving invoice details:", error);
    }
  };

  // Handle Invoice Preview
  const handleShowInvoice = (txn) => {
    setSelectedInvoice({
      invoiceId: txn.invoiceId,
      invoiceDate: txn.invoiceDate,
      customerName: txn.username,
      customerPhone: txn.mobile,
      billingAddress: txn.billingAddress,
      mainCategory: txn.mainCategory,
      subCategory: txn.subCategory,
      totalAmount: txn.totalAmount,
      paidAmount: txn.paidAmount,
      dueAmount: txn.dueAmount,
    });
    setShowInvoicePreview(true);
  };

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(
      transactions.map((t) => ({
        "Invoice ID": t.invoiceId || "—",
        Name: t.username,
        Mobile: t.mobile,
        Email: t.email,
        "Main Service": t.mainCategory || "Other",
        "Sub Service": t.subCategory || t.serviceType,
        "Total Amount": t.totalAmount,
        "Paid Amount": t.paidAmount,
        "Due Amount": t.dueAmount,
        Status: t.invoiceStatus,
        Date: new Date(t.date).toLocaleString(),
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Revenue_Report");
    XLSX.writeFile(wb, "Revenue_Transactions.xlsx");
  };

  // Chart Logic
  const serviceData = transactions.reduce((acc, curr) => {
    const svc = curr.mainCategory || "Other Services";
    if (!acc[svc]) acc[svc] = 0;
    acc[svc] += Number(curr.paidAmount || 0);
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
            Detailed financial tracking and invoice management.
          </p>
        </div>
        <button className="rev-add-btn" onClick={() => setShowAddModal(true)}>
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
            <span className="rev-stat-label">Total Revenue Collected</span>
          </div>
        </div>

        <div className="rev-stat-card">
          <div className="rev-stat-icon icon-pending">
            <HiOutlineClock />
          </div>
          <div className="rev-stat-info">
            <span className="rev-stat-value">{stats.pendingPayment}</span>
            <span className="rev-stat-label">Pending / Partial Payments</span>
          </div>
        </div>

        <div className="rev-stat-card">
          <div className="rev-stat-icon icon-completed">
            <HiOutlineCheckCircle />
          </div>
          <div className="rev-stat-info">
            <span className="rev-stat-value">{stats.completedPayment}</span>
            <span className="rev-stat-label">Fully Paid Transactions</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="rev-charts-grid">
        <div className="rev-chart-card">
          <div className="rev-chart-header">
            <h4>Collected Revenue by Category</h4>
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
            <h4>Payment Status Distribution</h4>
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
            placeholder="Search by invoice ID, name, mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="rev-export-btn" onClick={handleDownload}>
          <HiDownload /> Export Report
        </button>
      </div>

      <div className="rev-table-container">
        <div className="rev-table-wrapper">
          <table className="rev-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Customer Details</th>
                <th>Service Category</th>
                <th>Amount</th>
                <th>Paid Amount</th>
                <th>Due Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>WhatsApp</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxns.length > 0 ? (
                filteredTxns.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600, color: "#475569" }}>
                      {t.invoiceId || "—"}
                    </td>
                    <td>
                      <span className="rev-user-name">{t.username}</span>
                      <span className="rev-user-sub">{t.mobile}</span>
                    </td>
                    <td>
                      <span className="rev-service-main">{t.mainCategory || "Other"}</span>
                      <span className="rev-service-sub">{t.subCategory || t.serviceType}</span>
                    </td>
                    <td>
                      <span className="rev-amount">₹{Number(t.totalAmount).toLocaleString()}</span>
                    </td>
                    <td>
                      <span className="rev-amount-paid">₹{Number(t.paidAmount).toLocaleString()}</span>
                    </td>
                    <td>
                      <span className="rev-amount-due">₹{Number(t.dueAmount).toLocaleString()}</span>
                    </td>
                    <td className="rev-date-cell">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`rev-status-badge rev-status-${t.invoiceStatus.toLowerCase()}`}>
                        <span className="status-dot"></span>
                        {t.invoiceStatus}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {t.mobile ? (
                        <a
                          href={`https://wa.me/${String(t.mobile).replace(/[^0-9]/g, "").replace(/^0/, "91")}`
                            + `?text=${encodeURIComponent(
                              `Hi ${t.username || "there"}, this is BanksBuddy team.\n\n` +
                              `Regarding your *${t.mainCategory || "service"}* — ${t.subCategory || ""}\n` +
                              (Number(t.dueAmount) > 0
                                ? `Your outstanding payment of *₹${Number(t.dueAmount).toLocaleString()}* is pending.\n`
                                : `Your payment is fully received. Thank you! 🎉\n`) +
                              `\nStatus: *${t.status || "Pending"}*\n` +
                              `\nFor any queries, reply to this message or call us at +91-6377956633.\n` +
                              `www.banksbuddy.in`
                            )}`}
                          target="_blank"
                          rel="noreferrer"
                          title={`WhatsApp ${t.username}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "2.2rem",
                            height: "2.2rem",
                            borderRadius: "50%",
                            background: "#25d366",
                            color: "#fff",
                            fontSize: "1.15rem",
                            textDecoration: "none",
                            boxShadow: "0 2px 8px rgba(37,211,102,0.4)",
                            transition: "transform 0.15s, box-shadow 0.15s",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.transform="scale(1.12)"; e.currentTarget.style.boxShadow="0 4px 14px rgba(37,211,102,0.55)"; }}
                          onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 2px 8px rgba(37,211,102,0.4)"; }}
                        >
                          {/* WhatsApp SVG icon */}
                          <svg viewBox="0 0 32 32" width="1.1em" height="1.1em" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.5L4 29l7.697-1.812A12.94 12.94 0 0 0 16 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10c-1.97 0-3.81-.57-5.36-1.555l-.374-.235-4.566 1.074 1.117-4.462-.247-.393A9.954 9.954 0 0 1 6 15c0-5.523 4.477-10 10-10zm-3.3 5.5c-.19 0-.5.072-.762.36-.263.288-1 .977-1 2.381 0 1.404 1.024 2.762 1.166 2.954.143.193 2 3.048 4.905 4.154.687.267 1.222.427 1.638.547.689.196 1.317.169 1.813.102.553-.075 1.703-.697 1.944-1.37.24-.673.24-1.25.168-1.37-.072-.119-.264-.19-.553-.335-.289-.144-1.703-.84-1.968-.937-.264-.096-.457-.144-.649.145-.192.288-.745.937-.913 1.13-.168.192-.336.216-.624.072-.289-.144-1.218-.449-2.32-1.43-.857-.763-1.436-1.705-1.605-1.993-.168-.288-.018-.444.127-.588.13-.13.288-.336.432-.504.143-.168.191-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.649-1.562-.89-2.14-.233-.562-.472-.487-.648-.496l-.552-.01z"/>
                          </svg>
                        </a>
                      ) : (
                        <span style={{ color: "#cbd5e1", fontSize: "0.8rem" }}>—</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <select
                          className="rev-status-select"
                          style={{
                            padding: "0.4rem 0.5rem",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            fontSize: "0.85rem",
                            color: "#475569",
                            background: "#f8fafc",
                            outline: "none",
                            cursor: "pointer",
                            width: "100%"
                          }}
                          value={t.status || "pending"}
                          onChange={(e) => updateTxnStatus(t, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="resolved">Resolved</option>
                          <option value="completed">Completed</option>
                          <option value="refunded">Refunded</option>
                          <option value="Verification Pending">Verification Pending</option>
                        </select>
                        <div className="rev-action-group">
                          <button
                            className="rev-action-btn primary"
                            onClick={() => handleShowInvoice(t)}
                            title="Generate Invoice"
                          >
                            <HiDocumentText /> Invoice
                          </button>
                          <button
                            className="rev-action-btn secondary"
                            onClick={() => handleEditDetails(t)}
                            title="Edit Invoice Details"
                          >
                            <HiPencilAlt /> Edit
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="rev-empty-state">
                    No revenue records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Revenue Modal */}
      {showAddModal && (
        <div className="cb-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="cb-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "650px" }}>
            <h2 className="cb-modal-title">Add Revenue Entry</h2>
            <form className="cb-form" onSubmit={handleAddSubmit}>
              <div className="cb-form-row">
                <div style={{ flex: 1 }}>
                  <label className="rev-form-label">Full Name</label>
                  <input
                    className="cb-input"
                    placeholder="Enter full name"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="rev-form-label">Contact Number</label>
                  <input
                    className="cb-input"
                    placeholder="Mobile Number"
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  />
                </div>
              </div>

              <div className="cb-form-row">
                <div style={{ flex: 1 }}>
                  <label className="rev-form-label">Main Service Category</label>
                  <select
                    className="cb-select"
                    required
                    value={formData.mainCategory}
                    onChange={handleMainCategoryChange}
                  >
                    {Object.keys(SERVICE_CATEGORIES).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="rev-form-label">Sub-Service</label>
                  <select
                    className="cb-select"
                    required
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                  >
                    {SERVICE_CATEGORIES[formData.mainCategory].map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="cb-form-row">
                <div style={{ flex: 1 }}>
                  <label className="rev-form-label">Total Amount (₹)</label>
                  <input
                    className="cb-input"
                    placeholder="e.g. 5000"
                    type="number"
                    min="0"
                    required
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="rev-form-label">Paid Amount (₹)</label>
                  <input
                    className="cb-input"
                    placeholder="e.g. 2000"
                    type="number"
                    min="0"
                    required
                    value={formData.paidAmount}
                    onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="cb-form-row" style={{ marginTop: '-0.5rem', marginBottom: '1rem' }}>
                  <div style={{ flex: 1, fontSize: '0.9rem', color: '#64748b' }}>
                      <strong>Due Amount:</strong> ₹{Math.max(0, Number(formData.totalAmount || 0) - Number(formData.paidAmount || 0)).toLocaleString()}
                  </div>
              </div>

              <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <label className="rev-form-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: formData.isInstantPaid ? 0 : "0.5rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formData.isInstantPaid}
                    onChange={(e) => setFormData({ ...formData, isInstantPaid: e.target.checked })}
                    style={{ width: "16px", height: "16px" }}
                  />
                  <span>Record as <strong>Instantly Paid</strong> (Current Time)</span>
                </label>

                {!formData.isInstantPaid && (
                  <div style={{ marginTop: "0.5rem", animation: "fadeIn 0.2s" }}>
                    <label className="rev-form-label">Select Date & Time</label>
                    <input
                      type="datetime-local"
                      className="cb-input"
                      required={!formData.isInstantPaid}
                      value={formData.customDate}
                      onChange={(e) => setFormData({ ...formData, customDate: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <button className="cb-btn-submit" type="submit" style={{ marginTop: "1.5rem" }}>
                Add Revenue Entry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Details (Invoice Data) Modal */}
      {showEditDetailsModal && (
        <div className="cb-modal-overlay" onClick={() => setShowEditDetailsModal(false)}>
          <div className="cb-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px" }}>
            <h2 className="cb-modal-title">Edit Invoice Details</h2>
            <div className="rev-auto-fetched-info">
              <p><strong>Customer:</strong> {editingTxn?.username} ({editingTxn?.mobile})</p>
              <p><strong>Service:</strong> {editingTxn?.subCategory || editingTxn?.serviceType}</p>
              <p><strong>Amount:</strong> ₹{editingTxn?.totalAmount}</p>
            </div>
            <form className="cb-form" onSubmit={handleEditDetailsSubmit} style={{ marginTop: "1.5rem" }}>
              <div className="cb-form-row">
                <div style={{ flex: 1 }}>
                  <label className="rev-form-label">Invoice ID (Manual entry)</label>
                  <input
                    className="cb-input"
                    placeholder="e.g. INV-2024-001"
                    value={invoiceForm.invoiceId}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, invoiceId: e.target.value })}
                  />
                </div>
              </div>
              <div className="cb-form-row">
                <div style={{ flex: 1 }}>
                  <label className="rev-form-label">Billing Address</label>
                  <textarea
                    className="cb-input"
                    placeholder="Enter complete billing address"
                    rows={4}
                    value={invoiceForm.billingAddress}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, billingAddress: e.target.value })}
                    style={{ resize: "vertical" }}
                  />
                </div>
              </div>
              <button className="cb-btn-submit" type="submit" style={{ marginTop: "1rem" }}>
                Save Details
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Preview Modal */}
      {showInvoicePreview && selectedInvoice && (
        <InvoicePreview
          invoice={selectedInvoice}
          onClose={() => setShowInvoicePreview(false)}
        />
      )}
    </div>
  );
};

export default AdminRevenue;
