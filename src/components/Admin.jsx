import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Admin.css'

export const Admin = () => {
    const nv = useNavigate();
    
    const adminModules = [
      { path: '/admin-career', title: 'Careers', icon: '💼', desc: 'Manage job postings' },
      { path: '/admin-table', title: 'Consultations', icon: '📋', desc: 'View consultation requests' },
      { path: '/admin-reviews', title: 'Testimonials', icon: '⭐', desc: 'Manage customer reviews' },
      { path: '/admin-offers', title: 'Offers', icon: '🎁', desc: 'Manage special offers' },
      { path: '/admin-team', title: 'Team', icon: '👥', desc: 'Manage team members' },
    ];

    return (
      <div id="admin">
        <div className="admin-header">
          <h1>Administration Portal</h1>
          <p className="admin-subtitle">Manage your business operations</p>
        </div>
        
        <div className="admin-grid">
          {adminModules.map((module, index) => (
            <div 
              key={index} 
              className="admin-card"
              onClick={() => nv(module.path)}
            >
              <div className="admin-card-icon">{module.icon}</div>
              <h3>{module.title}</h3>
              <p>{module.desc}</p>
              <div className="admin-card-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    )
}
