import React, { useEffect, useState } from "react";
import apiFetch from "../lib/api.js";
import "./AdminTable.css";
import { useNavigate } from "react-router-dom";
// 1. Import the xlsx library
import * as XLSX from "xlsx";

const AdminTable = ({ embedded = false }) => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRows = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/consultations");
      data.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      setRows(data);
    } catch (err) {
      console.error("Error fetching consultations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
    const interval = setInterval(fetchRows, 30000);
    return () => clearInterval(interval);
  }, []);

  // 2. New Excel Download Function
  const downloadExcel = () => {
    if (!rows || rows.length === 0) return;

    // Map the raw data into clean objects with proper column headers
    const excelData = rows.map((r) => {
      // Format the date so it looks clean in Excel (Asia/Kolkata)
      let formattedDate = "";
      if (r.createdAt) {
        try {
          const date = new Date(r.createdAt);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
          } else {
            formattedDate = r.createdAt;
          }
        } catch (e) {
          formattedDate = r.createdAt;
        }
      }

      return {
        "Created At": formattedDate,
        Name: r.Name || "", // Using capital 'Name' to match your JSX
        Email: r.email || "",
        "Service Type": r.serviceType || "",
        "Loan Type": r.loanType || "",
        Reason: r.reason || "",
        Phone: r.phone || "",
      };
    });

    // Create a new workbook and add the data
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Consultations");

    // Adjust column widths automatically
    const columnWidths = [
      { wch: 20 }, // Created At
      { wch: 20 }, // Name
      { wch: 25 }, // Email
      { wch: 20 }, // Service Type
      { wch: 15 }, // Loan Type
      { wch: 40 }, // Reason
      { wch: 15 }, // Phone
    ];
    worksheet["!cols"] = columnWidths;

    // Trigger the download
    const fileName = `consultations_${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-")}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className={`admin-table ${embedded ? "embedded" : ""}`}>
      {!embedded && (
        <button className="back-btn" onClick={() => navigate("/admin")}>
          ← Back to Admin
        </button>
      )}
      <h2>Consultations</h2>
      <div
        className="admin-actions"
        style={{ display: "flex", gap: "1em", margin: "1rem 0rem" }}
      >
        {/* 3. Updated button to call downloadExcel */}
        <button
          className="btn"
          onClick={downloadExcel}
          disabled={rows.length === 0}
        >
          Download Excel
        </button>
        <button className="btn" onClick={fetchRows} disabled={loading}>
          {loading ? "Refreshing…" : "↻ Refresh"}
        </button>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : rows.length === 0 ? (
        <p>No consultations found.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Created At</th>
                <th>Name</th>
                <th>Email</th>
                <th>Service Type</th>
                <th>Loan Type</th>
                <th>Reason</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr style={{ fontSize: "14px" }} key={r.id}>
                  <td>
                    {(() => {
                      if (!r.createdAt) return "—";
                      try {
                        const date = new Date(r.createdAt);
                        if (isNaN(date.getTime())) return r.createdAt;
                        const dateStr = date.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
                        const timeStr = date.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour12: true });
                        return (
                          <>
                            {dateStr} <br /> {timeStr}
                          </>
                        );
                      } catch (e) {
                        return r.createdAt;
                      }
                    })()}
                  </td>
                  <td>{r.Name}</td>
                  <td>{r.email}</td>
                  <td>{r.serviceType}</td>
                  <td>{r.loanType}</td>
                  <td style={{ width: "30%" }}>{r.reason}</td>
                  <td style={{ textAlign: "center" }}>
                    {r.phone ? (
                      <a
                        href={
                          (() => {
                            const cleanPhone = String(r.phone).replace(/[^0-9]/g, "");
                            const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                            return `https://wa.me/${waPhone}?text=${encodeURIComponent(
                              `Hi ${r.Name || "there"}, this is BanksBuddy team.\n\n` +
                                `Regarding your request for the *${r.serviceType || "service"}* ` +
                                `\nFor further queries,please reply to this message or call us at +91-6377956633.\n` +
                                `www.banksbuddy.in`,
                            )}`;
                          })()
                        }
                        target="_blank"
                        rel="noreferrer"
                        title={`WhatsApp ${r.Name}`}
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
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.12)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 14px rgba(37,211,102,0.55)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow =
                            "0 2px 8px rgba(37,211,102,0.4)";
                        }}
                      >
                        <svg
                          viewBox="0 0 32 32"
                          width="1.1em"
                          height="1.1em"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.5L4 29l7.697-1.812A12.94 12.94 0 0 0 16 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10c-1.97 0-3.81-.57-5.36-1.555l-.374-.235-4.566 1.074 1.117-4.462-.247-.393A9.954 9.954 0 0 1 6 15c0-5.523 4.477-10 10-10zm-3.3 5.5c-.19 0-.5.072-.762.36-.263.288-1 .977-1 2.381 0 1.404 1.024 2.762 1.166 2.954.143.193 2 3.048 4.905 4.154.687.267 1.222.427 1.638.547.689.196 1.317.169 1.813.102.553-.075 1.703-.697 1.944-1.37.24-.673.24-1.25.168-1.37-.072-.119-.264-.19-.553-.335-.289-.144-1.703-.84-1.968-.937-.264-.096-.457-.144-.649.145-.192.288-.745.937-.913 1.13-.168.192-.336.216-.624.072-.289-.144-1.218-.449-2.32-1.43-.857-.763-1.436-1.705-1.605-1.993-.168-.288-.018-.444.127-.588.13-.13.288-.336.432-.504.143-.168.191-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.649-1.562-.89-2.14-.233-.562-.472-.487-.648-.496l-.552-.01z" />
                        </svg>
                      </a>
                    ) : (
                      <span style={{ color: "#cbd5e1", fontSize: "0.8rem" }}>
                        —
                      </span>
                    )}
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

export default AdminTable;
