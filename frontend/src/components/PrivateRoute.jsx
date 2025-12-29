import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, restrictedRole }) => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (restrictedRole && user.role !== restrictedRole) {
        // If role doesn't match, redirect to their appropriate dashboard
        // or unauthorized page. For now, redirect to home/login.
        if (user.role === 'doctor') return <Navigate to="/doctor/dashboard" replace />;
        if (user.role === 'patient') return <Navigate to="/" replace />;
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
