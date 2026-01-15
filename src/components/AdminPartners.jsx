import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue, update, remove } from "firebase/database";
import { HiCheck, HiX, HiTrash, HiSearch, HiEye, HiOutlineX } from "react-icons/hi";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import "./Admin.css";
import "./AdminPartners.css";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const STATUS_COLORS = {
    pending: '#f59e0b',  // Amber
    approved: '#10b981', // Emerald
    rejected: '#ef4444'  // Red
};

export const AdminPartners = ({ embedded }) => {
    const [applications, setApplications] = useState({});
    const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
    const [search, setSearch] = useState("");
    const [selectedApp, setSelectedApp] = useState(null);

    // Derived Data for Charts
    const getChartData = () => {
        const apps = Object.values(applications);
        const total = apps.length;

        // Status Distribution
        const statusCounts = apps.reduce((acc, app) => {
            const status = app.status || 'pending';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        const statusData = [
            { name: 'Pending', value: statusCounts.pending || 0, color: STATUS_COLORS.pending },
            { name: 'Approved', value: statusCounts.approved || 0, color: STATUS_COLORS.approved },
            { name: 'Rejected', value: statusCounts.rejected || 0, color: STATUS_COLORS.rejected }
        ].filter(item => item.value > 0);

        // State Distribution (Top 5)
        const stateCounts = apps.reduce((acc, app) => {
            if (app.state) {
                acc[app.state] = (acc[app.state] || 0) + 1;
            }
            return acc;
        }, {});

        const stateData = Object.entries(stateCounts)
            .map(([state, count]) => ({ state, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return { total, statusData, stateData };
    };

    const { total, statusData, stateData } = getChartData();

    useEffect(() => {
        const appsRef = ref(db, "partner_applications");
        const unsubscribe = onValue(appsRef, (snapshot) => {
            if (snapshot.exists()) {
                setApplications(snapshot.val());
            } else {
                setApplications({});
            }
        });
        return () => unsubscribe();
    }, []);

    const handleStatusChange = (id, newStatus) => {
        update(ref(db, `partner_applications/${id}`), { status: newStatus });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this application?")) {
            remove(ref(db, `partner_applications/${id}`));
        }
    };

    const filteredApps = Object.entries(applications).filter(([id, app]) => {
        const matchesFilter = filter === "all" || (app.status || "pending") === filter;
        const matchesSearch =
            app.companyName?.toLowerCase().includes(search.toLowerCase()) ||
            app.fullName?.toLowerCase().includes(search.toLowerCase()) ||
            app.email?.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className={`admin-module ${embedded ? "embedded" : ""}`}>
            <div className="module-header" style={{ marginBottom: "1rem" }}>
                <div>
                    <h3>Partner Applications</h3>
                    <p style={{ fontSize: "0.9rem", color: "#64748b" }}>Manage partnership requests and approvals</p>
                </div>
            </div>

            {/* Charts Section */}
            {Object.keys(applications).length > 0 && (
                <div className="charts-grid">
                    {/* Card 1: Total Applications */}
                    <div className="chart-card" style={{ justifyContent: 'center', textAlign: 'center' }}>
                        <div style={{ fontSize: "4rem", fontWeight: "800", color: "#1e293b", lineHeight: "1" }}>{total}</div>
                        <div style={{ color: "#64748b", fontWeight: "500", marginTop: "0.5rem" }}>Total Applications</div>
                        <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "0.25rem" }}>All time received</div>
                    </div>

                    {/* Card 2: Status Distribution */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h4>Application Status</h4>
                        </div>
                        <div style={{ width: '100%', height: 200 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Card 3: Geographic Distribution */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h4>Top Locations</h4>
                        </div>
                        <div style={{ width: '100%', height: 200 }}>
                            <ResponsiveContainer>
                                <BarChart data={stateData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="state" width={100} tick={{ fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            <div className="partner-filters">
                <div className="filter-tabs">
                    {["all", "pending", "approved", "rejected"].map((f) => (
                        <button
                            key={f}
                            className={`filter-tab ${filter === f ? "active" : ""}`}
                            onClick={() => setFilter(f)}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="search-box">
                    <HiSearch className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search partners..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Contact Person</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApps.length > 0 ? (
                            filteredApps.map(([id, app]) => (
                                <tr key={id} style={{ opacity: app.status === 'rejected' ? 0.6 : 1 }}>
                                    <td>
                                        <div className="company-info">
                                            <strong>{app.companyName}</strong>
                                            {app.website && (
                                                <a href={app.website} target="_blank" rel="noreferrer" className="website-link">
                                                    Visit Site
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: "500" }}>{app.fullName}</div>
                                        <div className="text-sm text-gray">{app.email}</div>
                                    </td>
                                    <td style={{ fontSize: "0.9rem", color: "#64748b" }}>
                                        {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : "-"}
                                    </td>
                                    <td>
                                        <span className={`status-badge ${app.status || "pending"}`}>
                                            {app.status || "Pending"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-icon view"
                                                onClick={() => setSelectedApp({ ...app, id })}
                                                title="View Details"
                                            >
                                                <HiEye />
                                            </button>
                                            {app.status !== "approved" && (
                                                <button
                                                    className="btn-icon approve"
                                                    onClick={() => handleStatusChange(id, "approved")}
                                                    title="Approve"
                                                >
                                                    <HiCheck />
                                                </button>
                                            )}
                                            {app.status !== "rejected" && (
                                                <button
                                                    className="btn-icon reject"
                                                    onClick={() => handleStatusChange(id, "rejected")}
                                                    title="Reject"
                                                >
                                                    <HiX />
                                                </button>
                                            )}
                                            <button
                                                className="btn-icon delete"
                                                onClick={() => handleDelete(id)}
                                                title="Delete"
                                            >
                                                <HiTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center" style={{ padding: "3rem" }}>
                                    <div style={{ color: "#94a3b8", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                                        <HiSearch style={{ fontSize: "2rem", opacity: 0.5 }} />
                                        <p>No applications match your filter.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Application Detail Modal */}
            {selectedApp && (
                <div className="partner-modal-overlay" onClick={() => setSelectedApp(null)}>
                    <div className="partner-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedApp(null)}>
                            <HiOutlineX />
                        </button>
                        <div className="modal-header">
                            <span className={`status-badge ${selectedApp.status || "pending"}`} style={{ marginBottom: "0.5rem" }}>
                                {selectedApp.status || "Pending"}
                            </span>
                            <h2>{selectedApp.companyName}</h2>
                            <p style={{ color: "#64748b" }}>Submitted on {new Date(selectedApp.submittedAt).toLocaleString()}</p>
                        </div>

                        <div className="modal-grid">
                            <div className="detail-item">
                                <label>Contact Person</label>
                                <p>{selectedApp.fullName}</p>
                            </div>
                            <div className="detail-item">
                                <label>Phone</label>
                                <p>{selectedApp.phone || "N/A"}</p>
                            </div>
                            <div className="detail-item">
                                <label>Email Address</label>
                                <p>{selectedApp.email}</p>
                            </div>
                            <div className="detail-item">
                                <label>Website</label>
                                <p>
                                    {selectedApp.website ? (
                                        <a href={selectedApp.website} target="_blank" rel="noreferrer" style={{ color: "var(--bl)" }}>
                                            {selectedApp.website}
                                        </a>
                                    ) : "N/A"}
                                </p>
                            </div>
                            {selectedApp.state && (
                                <div className="detail-item">
                                    <label>Location</label>
                                    <p>{selectedApp.city}, {selectedApp.state}</p>
                                </div>
                            )}
                            <div className="detail-full">
                                <label>Proposal / Description</label>
                                <p style={{ fontWeight: "400", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>{selectedApp.description}</p>
                            </div>
                        </div>

                        <div className="action-buttons" style={{ marginTop: "2rem", justifyContent: "flex-end" }}>
                            {selectedApp.status !== "approved" && (
                                <button
                                    className="btn-icon approve"
                                    onClick={() => {
                                        handleStatusChange(selectedApp.id, "approved");
                                        setSelectedApp({ ...selectedApp, status: "approved" });
                                    }}
                                    style={{ width: "auto", padding: "0.5rem 1rem", gap: "0.5rem" }}
                                >
                                    <HiCheck /> Approve
                                </button>
                            )}
                            {selectedApp.status !== "rejected" && (
                                <button
                                    className="btn-icon reject"
                                    onClick={() => {
                                        handleStatusChange(selectedApp.id, "rejected");
                                        setSelectedApp({ ...selectedApp, status: "rejected" });
                                    }}
                                    style={{ width: "auto", padding: "0.5rem 1rem", gap: "0.5rem" }}
                                >
                                    <HiX /> Reject
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
