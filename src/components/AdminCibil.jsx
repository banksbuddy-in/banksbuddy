import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue, update } from "firebase/database";
import { HiSearch, HiEye, HiOutlineX, HiDownload } from "react-icons/hi";
import * as XLSX from "xlsx";
import "./Admin.css";
import "./AdminPartners.css";

const STATUS_COLORS = {
  pending: "#f59e0b",
  completed: "#10b981",
};

export const AdminCibil = ({ embedded }) => {
  const [requests, setRequests] = useState({});
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedReq, setSelectedReq] = useState(null);

  useEffect(() => {
    const reqRef = ref(db, "cibil_requests");
    const unsubscribe = onValue(reqRef, (snapshot) => {
      if (snapshot.exists()) {
        setRequests(snapshot.val());
      } else {
        setRequests({});
      }
    });
    return () => unsubscribe();
  }, []);

  const allEntries = Object.entries(requests);

  // Notification counts
  const pendingCount = allEntries.filter(
    ([, r]) => (r.status || "pending") === "pending",
  ).length;

  const today = new Date().toISOString().slice(0, 10);
  const newTodayCount = allEntries.filter(
    ([, r]) => r.createdAt && r.createdAt.slice(0, 10) === today,
  ).length;

  const handleStatusToggle = (id, currentStatus) => {
    const next = currentStatus === "pending" ? "completed" : "pending";
    update(ref(db, `cibil_requests/${id}`), { status: next });
  };

  const filteredEntries = allEntries.filter(([, r]) => {
    const matchesFilter =
      filter === "all" || (r.status || "pending") === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      r.name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.phone?.includes(q) ||
      r.paymentId?.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const handleDownloadXlsx = () => {
    const rows = allEntries.map(([id, r]) => ({
      ID: id,
      Name: r.name || "",
      Phone: r.phone || "",
      Email: r.email || "",
      State: r.state || "",
      City: r.city || "",
      "Employment Type": r.employmentType || "",
      Income: r.income || "",
      "Payment ID": r.paymentId || "",
      Amount: r.amount || "",
      Status: r.status || "pending",
      Date: r.createdAt ? new Date(r.createdAt).toLocaleString() : "",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cibil Requests");
    XLSX.writeFile(wb, "cibil_requests.xlsx");
  };

  return (
    <div className={`admin-module ${embedded ? "embedded" : ""}`}>
      <div className="module-header" style={{ marginBottom: "1rem" }}>
        <div>
          <h3>CIBIL Service Requests</h3>
          <p className="cb-admin-desc">
            Manage customer payment requests and send reports
          </p>
        </div>
      </div>

      {/* Notification Banners */}
      {(pendingCount > 0 || newTodayCount > 0) && (
        <div className="cb-notif-row">
          {pendingCount > 0 && (
            <div className="cb-notif-banner cb-notif-pending">
              ⏳ <strong>{pendingCount}</strong> request
              {pendingCount > 1 ? "s" : ""} pending action
            </div>
          )}
          {newTodayCount > 0 && (
            <div className="cb-notif-banner cb-notif-new">
              🆕 <strong>{newTodayCount}</strong> new request
              {newTodayCount > 1 ? "s" : ""} today
            </div>
          )}
        </div>
      )}

      {/* Filters + Search + Download */}
      <div className="partner-filters">
        <div className="filter-tabs">
          {["all", "pending", "completed"].map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="cb-filter-actions">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="cb-download-btn" onClick={handleDownloadXlsx}>
            <HiDownload /> Download XLSX
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>City</th>
              <th>Payment ID</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.length > 0 ? (
              filteredEntries.map(([id, r]) => (
                <tr key={id}>
                  <td>
                    <strong>{r.name}</strong>
                  </td>
                  <td>{r.phone}</td>
                  <td className="cb-td-email">{r.email}</td>
                  <td>{r.city || "—"}</td>
                  <td className="cb-td-payid">{r.paymentId || "—"}</td>
                  <td>₹{r.amount || 100}</td>
                  <td className="cb-td-date">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>
                    <span className={`status-badge ${r.status || "pending"}`}>
                      {r.status || "pending"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon view"
                        onClick={() => setSelectedReq({ ...r, id })}
                        title="View Details"
                      >
                        <HiEye />
                      </button>
                      <button
                        className={`btn-icon ${(r.status || "pending") === "pending" ? "approve" : "reject"}`}
                        onClick={() =>
                          handleStatusToggle(id, r.status || "pending")
                        }
                        title={
                          (r.status || "pending") === "pending"
                            ? "Mark Completed"
                            : "Mark Pending"
                        }
                      >
                        {(r.status || "pending") === "pending" ? "✓" : "↺"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="text-center"
                  style={{ padding: "3rem" }}
                >
                  <div className="cb-empty-state">
                    <HiSearch className="cb-empty-icon" />
                    <p>No requests match your filter.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedReq && (
        <div
          className="partner-modal-overlay"
          onClick={() => setSelectedReq(null)}
        >
          <div
            className="partner-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedReq(null)}
            >
              <HiOutlineX />
            </button>
            <div className="modal-header">
              <span
                className={`status-badge ${selectedReq.status || "pending"}`}
                style={{ marginBottom: "0.5rem" }}
              >
                {selectedReq.status || "pending"}
              </span>
              <h2>{selectedReq.name}</h2>
              <p className="cb-modal-date">
                Submitted on {new Date(selectedReq.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="modal-grid">
              <div className="detail-item">
                <label>Mobile Number</label>
                <p>{selectedReq.phone}</p>
              </div>
              <div className="detail-item">
                <label>Email</label>
                <p>{selectedReq.email}</p>
              </div>
              <div className="detail-item">
                <label>Location</label>
                <p>
                  {selectedReq.city || "—"}, {selectedReq.state || "—"}
                </p>
              </div>
              <div className="detail-item">
                <label>Employment</label>
                <p>
                  {selectedReq.employmentType || "—"}
                  {selectedReq.income ? ` — ₹${selectedReq.income}/mo` : ""}
                </p>
              </div>
              <div className="detail-item">
                <label>Payment ID</label>
                <p>{selectedReq.paymentId || "—"}</p>
              </div>
              <div className="detail-item">
                <label>Amount</label>
                <p>₹{selectedReq.amount || 100}</p>
              </div>
              {selectedReq.message && (
                <div className="detail-full">
                  <label>Message</label>
                  <p
                    style={{
                      fontWeight: "400",
                      lineHeight: "1.6",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {selectedReq.message}
                  </p>
                </div>
              )}
            </div>
            <div
              className="action-buttons"
              style={{ marginTop: "2rem", justifyContent: "flex-end" }}
            >
              <button
                className={`btn-icon ${(selectedReq.status || "pending") === "pending" ? "approve" : "reject"}`}
                onClick={() => {
                  const next =
                    (selectedReq.status || "pending") === "pending"
                      ? "completed"
                      : "pending";
                  update(ref(db, `cibil_requests/${selectedReq.id}`), {
                    status: next,
                  });
                  setSelectedReq({ ...selectedReq, status: next });
                }}
                style={{ width: "auto", padding: "0.5rem 1rem", gap: "0.5rem" }}
              >
                {(selectedReq.status || "pending") === "pending"
                  ? "✓ Mark Completed"
                  : "↺ Mark Pending"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
