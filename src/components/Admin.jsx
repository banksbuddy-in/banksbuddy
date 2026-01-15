import React, { useState, useEffect } from 'react'
import { HiOutlineClipboardList, HiOutlineBriefcase, HiOutlineDocumentText, HiOutlineStar, HiOutlineGift, HiOutlineUsers, HiOutlineMenu, HiOutlineX, HiOutlineHome } from 'react-icons/hi'
import { db } from '../firebase'
import { ref, get } from 'firebase/database'
import './Admin.css'

// Import Admin Components
import { AdminPolicyReminder } from './AdminPolicyReminder'
import AdminTable from './AdminTable'
import { AdminReviews } from './AdminReviews'
import { AdminOffers } from './AdminOffers'
import { AdminTeam } from './AdminTeam'
import { AddCareer } from './AddCareer'
import { AdminPartners } from './AdminPartners'

export const Admin = () => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    consultations: 0,
    policies: 0,
    team: 0,
    offers: 0,
    reviews: 0,
    careers: 0,
    partners: 0
  });

  const adminModules = [
    { id: 'dashboard', title: 'Dashboard', icon: HiOutlineHome, desc: 'Overview & Quick Stats' },
    { id: 'partners', title: 'Partners', icon: HiOutlineBriefcase, desc: 'Manage partner applications' },
    { id: 'policy-reminder', title: 'Policy Reminders', icon: HiOutlineClipboardList, desc: 'Track policy expirations' },
    { id: 'careers', title: 'Careers', icon: HiOutlineBriefcase, desc: 'Manage job postings' },
    { id: 'consultations', title: 'Consultations', icon: HiOutlineDocumentText, desc: 'View consultation requests' },
    { id: 'testimonials', title: 'Testimonials', icon: HiOutlineStar, desc: 'Manage customer reviews' },
    { id: 'offers', title: 'Offers', icon: HiOutlineGift, desc: 'Manage special offers' },
    { id: 'team', title: 'Team', icon: HiOutlineUsers, desc: 'Manage team members' },
  ];

  // Fetch real stats from Firebase
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [consultationsSnap, policiesSnap, teamSnap, offersSnap, reviewsSnap, careersSnap, partnersSnap] = await Promise.all([
          get(ref(db, 'consultations')),
          get(ref(db, 'policies')),
          get(ref(db, 'team')),
          get(ref(db, 'offers')),
          get(ref(db, 'reviews')),
          get(ref(db, 'careers')),
          get(ref(db, 'partner_applications'))
        ]);

        setStats({
          consultations: consultationsSnap.exists() ? Object.keys(consultationsSnap.val()).length : 0,
          policies: policiesSnap.exists() ? Object.keys(policiesSnap.val()).length : 0,
          team: teamSnap.exists() ? Object.keys(teamSnap.val()).length : 0,
          offers: offersSnap.exists() ? Object.keys(offersSnap.val()).length : 0,
          reviews: reviewsSnap.exists() ? Object.keys(reviewsSnap.val()).length : 0,
          careers: careersSnap.exists() ? Object.keys(careersSnap.val()).length : 0,
          partners: partnersSnap.exists() ? Object.keys(partnersSnap.val()).length : 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
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
      case 'dashboard':
        return <DashboardContent stats={stats} setActiveModule={setActiveModule} adminModules={adminModules} />;
      case 'policy-reminder':
        return <AdminPolicyReminder embedded={true} />;
      case 'careers':
        return <AddCareer embedded={true} />;
      case 'partners':
        return <AdminPartners embedded={true} />;
      case 'consultations':
        return <AdminTable embedded={true} />;
      case 'testimonials':
        return <AdminReviews embedded={true} />;
      case 'offers':
        return <AdminOffers embedded={true} />;
      case 'team':
        return <AdminTeam embedded={true} />;
      default:
        return <DashboardContent stats={stats} setActiveModule={setActiveModule} adminModules={adminModules} />;
    }
  };

  return (
    <section className="admin-section">
      <div className={`admin-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Mobile Header */}
        <div className="admin-mobile-header">
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>
          <h1>Admin Portal</h1>
        </div>

        {/* Sidebar */}
        <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <span className="logo-icon">BB</span>
              {!sidebarCollapsed && <span className="logo-text">Admin</span>}
            </div>
            <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
              {sidebarCollapsed ? '→' : '←'}
            </button>
          </div>

          <nav className="sidebar-nav">
            {adminModules.map((module) => {
              const IconComponent = module.icon;
              return (
                <button
                  key={module.id}
                  className={`nav-item ${activeModule === module.id ? 'active' : ''}`}
                  onClick={() => handleModuleClick(module.id)}
                  title={sidebarCollapsed ? module.title : ''}
                >
                  <IconComponent className="nav-icon" />
                  {!sidebarCollapsed && (
                    <span className="nav-text">{module.title}</span>
                  )}
                  {activeModule === module.id && <span className="nav-indicator"></span>}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          <div className="admin-content-header">
            <div className="content-title">
              <h2>{adminModules.find(m => m.id === activeModule)?.title}</h2>
              <p>{adminModules.find(m => m.id === activeModule)?.desc}</p>
            </div>
            <div className="header-actions">
              <span className="current-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          <div className="admin-content-body">
            {renderContent()}
          </div>
        </main>

        {/* Mobile Overlay */}
        {mobileMenuOpen && <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}></div>}
      </div>
    </section>
  )
}

// Dashboard Content Component
const DashboardContent = ({ stats, setActiveModule, adminModules }) => {
  const quickStats = [
    { label: 'Consultations', value: stats.consultations, icon: '📝' },
    { label: 'Active Policies', value: stats.policies, icon: '📋' },
    { label: 'Team Members', value: stats.team, icon: '👥' },
    { label: 'Active Offers', value: stats.offers, icon: '🎁' },
    { label: 'Testimonials', value: stats.reviews, icon: '⭐' },
    { label: 'Testimonials', value: stats.reviews, icon: '⭐' },
    { label: 'Job Postings', value: stats.careers, icon: '💼' },
    { label: 'Partner Apps', value: stats.partners, icon: '🤝' },
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
}
