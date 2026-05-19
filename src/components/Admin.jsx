import React, { useState, useEffect } from "react";
import apiFetch from "../lib/api.js";
import {
  HiOutlineClipboardList,
  HiOutlineBriefcase,
  HiOutlineDocumentText,
  HiOutlineStar,
  HiOutlineGift,
  HiOutlineUsers,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineHome,
  HiOutlineCurrencyRupee,
} from "react-icons/hi";
import "./Admin.css";

// Import Admin Components
import { AdminPolicyReminder } from "./AdminPolicyReminder";
import AdminTable from "./AdminTable";
import { AdminReviews } from "./AdminReviews";
import { AdminOffers } from "./AdminOffers";
import { AdminTeam } from "./AdminTeam";
import { AddCareer } from "./AddCareer";
import { AdminPartners } from "./AdminPartners";
import { AdminManagement } from "./AdminManagement";
import { AdminCibil } from "./AdminCibil";
import { AdminRevenue } from "./AdminRevenue";

export const Admin = () => {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    consultations: 0,
    policies: 0,
    team: 0,
    offers: 0,
    reviews: 0,
    careers: 0,
    partners: 0,
    admins: 0,
    cibil: 0,
    revenue: 0,
  });

  const adminModules = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: HiOutlineHome,
      desc: "Overview & Quick Stats",
    },
    {
      id: "users",
      title: "Users",
      icon: HiOutlineUsers,
      desc: "Manage Platform Users",
    },
    {
      id: "partners",
      title: "Partners",
      icon: HiOutlineBriefcase,
      desc: "Manage partner applications",
    },
    {
      id: "policy-reminder",
      title: "Policy Reminders",
      icon: HiOutlineClipboardList,
      desc: "Track policy expirations",
    },
    {
      id: "careers",
      title: "Careers",
      icon: HiOutlineBriefcase,
      desc: "Manage job postings",
    },
    {
      id: "consultations",
      title: "Consultations",
      icon: HiOutlineDocumentText,
      desc: "View consultation requests",
    },
    {
      id: "testimonials",
      title: "Testimonials",
      icon: HiOutlineStar,
      desc: "Manage customer reviews",
    },
    {
      id: "offers",
      title: "Offers",
      icon: HiOutlineGift,
      desc: "Manage special offers",
    },
    {
      id: "team",
      title: "Team",
      icon: HiOutlineUsers,
      desc: "Manage team members",
    },
    {
      id: "cibil",
      title: "Cibil",
      icon: HiOutlineClipboardList,
      desc: "CIBIL report notifications",
    },
    {
      id: "revenue",
      title: "Revenue",
      icon: HiOutlineCurrencyRupee,
      desc: "Financial overview",
    },
  ];

  // Fetch real stats from backend API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiFetch("/api/stats");
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, [activeModule]);

  const handleModuleClick = (moduleId) => {
    setActiveModule(moduleId);
    setMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeModule) {
      case "dashboard":
        return (
          <DashboardContent
            stats={stats}
            setActiveModule={setActiveModule}
            adminModules={adminModules}
          />
        );
      case "users":
        return <AdminManagement embedded={true} />;
      case "policy-reminder":
        return <AdminPolicyReminder embedded={true} />;
      case "careers":
        return <AddCareer embedded={true} />;
      case "partners":
        return <AdminPartners embedded={true} />;
      case "consultations":
        return <AdminTable embedded={true} />;
      case "testimonials":
        return <AdminReviews embedded={true} />;
      case "offers":
        return <AdminOffers embedded={true} />;
      case "team":
        return <AdminTeam embedded={true} />;
      case "cibil":
        return <AdminCibil embedded={true} />;
      case "revenue":
        return <AdminRevenue embedded={true} />;
      default:
        return (
          <DashboardContent
            stats={stats}
            setActiveModule={setActiveModule}
            adminModules={adminModules}
          />
        );
    }
  };

  return (
    <section className="admin-section">
      <div className="admin-mobile-restriction">
        <div className="restriction-content">
          <span className="restriction-icon">💻</span>
          <h2>Top Secret Area</h2>
          <p>Please use a PC or Laptop to access the Admin Portal.</p>
          <a href="/" className="back-home-btn">
            Go Back Home
          </a>
        </div>
      </div>
      <div
        className={`admin-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
      >
        {/* Mobile Header */}
        <div className="admin-mobile-header">
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>
          <h1>Admin Portal</h1>
        </div>

        {/* Sidebar */}
        <aside
          className={`admin-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}
        >
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <span className="logo-icon">BB</span>
              {!sidebarCollapsed && <span className="logo-text">Admin</span>}
            </div>
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? "→" : "←"}
            </button>
          </div>

          <nav className="sidebar-nav">
            {adminModules.map((module) => {
              const IconComponent = module.icon;
              return (
                <button
                  key={module.id}
                  className={`nav-item ${activeModule === module.id ? "active" : ""}`}
                  onClick={() => handleModuleClick(module.id)}
                  title={sidebarCollapsed ? module.title : ""}
                >
                  <IconComponent className="nav-icon" />
                  {!sidebarCollapsed && (
                    <span className="nav-text">{module.title}</span>
                  )}
                  {activeModule === module.id && (
                    <span className="nav-indicator"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          <div className="admin-content-header">
            <div className="content-title">
              <h2>{adminModules.find((m) => m.id === activeModule)?.title}</h2>
              <p>{adminModules.find((m) => m.id === activeModule)?.desc}</p>
            </div>
            <div className="header-actions">
              <span className="current-date">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="admin-content-body">{renderContent()}</div>
        </main>

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div
            className="mobile-overlay"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
        )}
      </div>
    </section>
  );
};

// Dashboard Content Component
const DashboardContent = ({ stats, setActiveModule, adminModules }) => {
  const quickStats = [
    { label: "Consultations", value: stats.consultations, icon: "📝" },
    { label: "Active Policies", value: stats.policies, icon: "📋" },
    { label: "Team Members", value: stats.team, icon: "👥" },
    { label: "Active Offers", value: stats.offers, icon: "🎁" },
    { label: "Testimonials", value: stats.reviews, icon: "⭐" },
    { label: "Job Postings", value: stats.careers, icon: "💼" },
    { label: "Partner Apps", value: stats.partners, icon: "🤝" },
    { label: "Cibil Requests", value: stats.cibil, icon: "📊" },
    { label: "Revenue Txns", value: stats.revenue, icon: "💰" },
  ];

  return (
    <div className="dashboard-content">
      {/* Quick Stats */}
      <div className="stats-grid">
        {quickStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <span className="stat-icon">{stat.icon}</span>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h3>Quick Actions</h3>
        <div className="quick-actions-grid">
          {adminModules.slice(1).map((module) => {
            const IconComponent = module.icon;
            return (
              <button
                key={module.id}
                className="quick-action-card"
                onClick={() => setActiveModule(module.id)}
              >
                <IconComponent className="action-icon" />
                <span className="action-title">{module.title}</span>
                <span className="action-desc">{module.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
