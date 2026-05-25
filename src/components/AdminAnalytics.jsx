import React, { useState, useEffect } from "react";
import apiFetch from "../lib/api.js";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  HiOutlineGlobe,
  HiOutlineDatabase,
  HiOutlineDeviceMobile,
  HiOutlineChartBar,
  HiOutlineTrash,
  HiOutlineRefresh,
} from "react-icons/hi";
import "./AdminAnalytics.css";
import { useToast, useConfirm } from "../context/ToastContext";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#ec4899"];

export const AdminAnalytics = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pruning, setPruning] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("overview");

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/analytics/overview");
      setData(res);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // Poll every 10 seconds for genuine realtime data
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, []);

  const handlePrune = async () => {
    const isConfirmed = await confirm("Are you sure you want to prune logs older than 7 days?\n\nThis will permanently delete historical db_ops and activity_logs from Firebase to optimize performance.");
    if (!isConfirmed) {
      return;
    }
    setPruning(true);
    try {
      await apiFetch("/api/analytics/prune", { method: "DELETE" });
      toast.success("Historical analytics data pruned successfully!");
      fetchAnalytics();
    } catch (err) {
      console.error("Failed to prune:", err);
      toast.error("Failed to prune analytics logs.");
    } finally {
      setPruning(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="analytics-loading">
        <div className="analytics-spinner"></div>
        <p>Fetching Realtime Analytics Data...</p>
      </div>
    );
  }

  const { summary, trafficChart, dbOpsChart, browserDist, osDist, countryDist, cityDist, topPages } = data || {};

  return (
    <div className="admin-analytics-container">
      {/* Realtime Status Ribbon */}
      <div className="analytics-header-ribbon">
        <div className="live-badge">
          <span className="live-dot"></span>
          REALTIME DATA FEED
        </div>
        <div className="header-actions">
          <button className="analytics-btn refresh-btn" onClick={fetchAnalytics} disabled={loading}>
            <HiOutlineRefresh className={loading ? "spin" : ""} /> {loading ? "Syncing..." : "Sync Live"}
          </button>
          <button className="analytics-btn prune-btn" onClick={handlePrune} disabled={pruning}>
            <HiOutlineTrash /> {pruning ? "Pruning..." : "Prune (>7d)"}
          </button>
        </div>
      </div>

      {/* Numerical Stats Grid */}
      <div className="analytics-stats-grid">
        <div className="analytics-stat-card border-blue">
          <div className="stat-icon-wrapper bg-blue">
            <HiOutlineGlobe />
          </div>
          <div className="stat-content">
            <h3>{summary?.totalPageViews || 0}</h3>
            <p>Total Page Traffic</p>
          </div>
        </div>

        <div className="analytics-stat-card border-green">
          <div className="stat-icon-wrapper bg-green">
            <HiOutlineDatabase />
          </div>
          <div className="stat-content">
            <h3>{summary?.dbReads || 0}</h3>
            <p>Firebase DB Reads</p>
          </div>
        </div>

        <div className="analytics-stat-card border-purple">
          <div className="stat-icon-wrapper bg-purple">
            <HiOutlineDatabase />
          </div>
          <div className="stat-content">
            <h3>{summary?.dbWrites || 0}</h3>
            <p>Firebase DB Writes</p>
          </div>
        </div>

        <div className="analytics-stat-card border-orange">
          <div className="stat-icon-wrapper bg-orange">
            <HiOutlineDeviceMobile />
          </div>
          <div className="stat-content">
            <h3>{summary?.activeUsersCount || 0}</h3>
            <p>Active Users (7 Days)</p>
          </div>
        </div>
      </div>

      {/* Main Charts & Table section */}
      <div className="analytics-visuals-layout">
        {/* Left Side: Graphs */}
        <div className="analytics-charts-panel">
          {/* Traffic Line Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h4><HiOutlineChartBar /> Page Traffic Growth (Vercel Edge)</h4>
              <p>Total page views recorded daily</p>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={trafficChart}>
                  <defs>
                    <linearGradient id="trafficColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                  <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#trafficColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Database Operations Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h4><HiOutlineDatabase /> Realtime DB Requests Load</h4>
              <p>Read operations vs. write operations counts</p>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={dbOpsChart}>
                  <defs>
                    <linearGradient id="readsColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="writesColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                  <Legend verticalAlign="top" height={36} />
                  <Area type="monotone" name="DB Reads" dataKey="reads" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#readsColor)" />
                  <Area type="monotone" name="DB Writes" dataKey="writes" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#writesColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Technology distributions (Browser & OS side-by-side) */}
          <div className="tech-dist-row">
            <div className="chart-card">
              <div className="chart-header">
                <h4>Browser Distribution</h4>
              </div>
              <div className="chart-wrapper flex-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={browserDist}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {browserDist?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" iconSize={8} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h4>Operating System</h4>
              </div>
              <div className="chart-wrapper flex-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={osDist}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {osDist?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" iconSize={8} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Geographics & Active Pages tables */}
        <div className="analytics-sidebar-panel">
          {/* Vercel Geo Metrics */}
          <div className="chart-card height-fixed">
            <div className="chart-header">
              <h4><HiOutlineGlobe /> Geographic Traffic</h4>
              <p>Top countries and cities visiting</p>
            </div>
            
            <div className="geo-lists">
              <div className="geo-column">
                <h5>Countries</h5>
                {countryDist?.length === 0 ? <p className="no-data">No data</p> : (
                  countryDist?.map((c, i) => (
                    <div className="geo-item" key={i}>
                      <span className="geo-name">📍 {c.name}</span>
                      <span className="geo-val font-semibold">{c.value} views</span>
                    </div>
                  ))
                )}
              </div>
              
              <div className="geo-column">
                <h5>Cities</h5>
                {cityDist?.length === 0 ? <p className="no-data">No data</p> : (
                  cityDist?.map((c, i) => (
                    <div className="geo-item" key={i}>
                      <span className="geo-name">🏙️ {c.name}</span>
                      <span className="geo-val font-semibold">{c.value} views</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Top Visited Pages Table */}
          <div className="chart-card height-fixed">
            <div className="chart-header">
              <h4>Top Active Pages</h4>
              <p>Ranked by view popularity</p>
            </div>
            <div className="table-wrapper">
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>Page Path</th>
                    <th style={{ textAlign: "right" }}>Total Views</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages?.length === 0 ? (
                    <tr>
                      <td colSpan="2" style={{ textAlign: "center", color: "#94a3b8" }}>No traffic registered yet</td>
                    </tr>
                  ) : (
                    topPages?.map((p, i) => (
                      <tr key={i}>
                        <td className="page-path font-mono">{p.path}</td>
                        <td style={{ textAlign: "right" }} className="font-semibold">{p.views}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
