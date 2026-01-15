import React from 'react';
import { GoArrowLeft } from "react-icons/go";
import { Link } from "react-router-dom";

export const TransUnion = () => {
    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <Link className="backtoser" to="/cibil" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', textDecoration: 'none', color: 'black' }}>
                <span style={{ marginRight: '5px' }}><GoArrowLeft /></span> Back to Dashboard
            </Link>
            <h1>TransUnion CIBIL Score</h1>
            <p>Service integration coming soon...</p>
        </div>
    );
};
