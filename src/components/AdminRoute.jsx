import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminRoute = ({ children }) => {
    const { currentUser, userRole, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    // Ensure user is logged in AND has admin role
    if (!currentUser || userRole !== 'admin') {
        return <Navigate to="/" />;
    }

    return children;
};
