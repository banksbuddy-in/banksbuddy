import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import "./Credit.css"; // We will create this
import { TransUnion } from './TransUnion';
import { Crif } from './Crif';
import { Experian } from './Experian';
import { CibilApi } from './CibilApi';

export const Credit = () => {
    const { currentUser, logout } = useAuth();
    const [selectedService, setSelectedService] = useState(null);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch {
            console.error("Failed to log out");
        }
    };

    const renderService = () => {
        switch (selectedService) {
            case 'transunion': return <TransUnion />;
            case 'crif': return <Crif />;
            case 'experian': return <Experian />;
            case 'cibil': return <CibilApi />;
            default: return null;
        }
    };

    if (selectedService) {
        return (
            <div className="service-view-container">
                <button onClick={() => setSelectedService(null)} className="back-dash-btn">Back to Dashboard</button>
                {renderService()}
            </div>
        );
    }

    return (
        <div className="credit-dashboard">
            <header className="dashboard-header">
                <div className="welcome-text">
                    <h1>Welcome, {currentUser?.email}</h1>
                    <p>Track and improve your credit health.</p>
                </div>
                <button onClick={handleLogout} className="logout-btn">Log Out</button>
            </header>

            <section className="dashboard-content">
                <h2>Credit Bureau Services</h2>
                <div className="services-grid">
                    <div className="service-card transunion" onClick={() => setSelectedService('transunion')}>
                        <h3>TransUnion</h3>
                        <p>Check your TransUnion CIBIL Score</p>
                    </div>
                    <div className="service-card crif" onClick={() => setSelectedService('crif')}>
                        <h3>CRIF High Mark</h3>
                        <p>View your CRIF Credit Report</p>
                    </div>
                    <div className="service-card experian" onClick={() => setSelectedService('experian')}>
                        <h3>Experian</h3>
                        <p>Get your Experian Credit Report</p>
                    </div>
                    <div className="service-card cibil" onClick={() => setSelectedService('cibil')}>
                        <h3>CIBIL™</h3>
                        <p>Official CIBIL Score & Report</p>
                    </div>
                </div>
            </section>
        </div>
    )
}
