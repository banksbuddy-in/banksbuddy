import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue, off } from "firebase/database";
import "./AdminTable.css";
import { useNavigate } from "react-router-dom";

export const AdminTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const consultationsRef = ref(db, "consultations");
    // eslint-disable-next-line no-unused-vars
    const unsubscribe = onValue(consultationsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setRows([]);
        setLoading(false);
        return;
      }
      // data is object keyed by push id
      const mapped = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));
      // sort by createdAt descending if present
      mapped.sort((a, b) =>
        (b.createdAt || "").localeCompare(a.createdAt || "")
      );
      setRows(mapped);
      setLoading(false);
    });

    return () => off(consultationsRef);
  }, []);

  const escapeCsv = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (s.includes(",") || s.includes("\n") || s.includes('"')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };

  const downloadCsv = () => {
    if (!rows || rows.length === 0) return;
    const headers = [
      "id",
      "firstName",
      "lastName",
      "email",
      "phone",
      "reason",
      "createdAt",
    ];
    const lines = [headers.join(",")];
    rows.forEach((r) => {
      const row = headers.map((h) => escapeCsv(r[h] ?? ""));
      lines.push(row.join(","));
    });

    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `consultations_${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-")}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  const n = useNavigate();

  return (
    <div className="admin-table">
      <h2>Consultations</h2>
      <div className="admin-actions" style={{ display: "flex", gap: "1em" }}>
        <button
          className="btn"
          onClick={downloadCsv}
          disabled={rows.length === 0}
        >
          Download CSV
        </button>
        <button className="btn" onClick={() => n("/admin")}>
          Back to Admin
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
                {/* <th>ID</th> */}
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Reason</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  {/* <td className="mono">{r.id}</td> */}
                  <td>{r.firstName}</td>
                  <td>{r.lastName}</td>
                  <td>{r.email}</td>
                  <td>{r.phone}</td>
                  <td>{r.reason}</td>
                  <td>{r.createdAt}</td>
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
