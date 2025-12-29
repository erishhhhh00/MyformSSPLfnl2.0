import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import FuturisticLoader from './FuturisticLoader';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('admin' | 'assessor' | 'moderator')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, isLoading } = useAuth();

    // Show FuturisticLoader while checking auth
    if (isLoading) {
        return <FuturisticLoader type="loading" text="Authenticating..." />;
    }

    // Not logged in - redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check role if specified
    if (allowedRoles && !allowedRoles.includes(user.role as any)) {
        // Redirect to appropriate dashboard based on role
        if (user.role === 'admin') {
            return <Navigate to="/admin-dashboard" replace />;
        } else if (user.role === 'assessor') {
            return <Navigate to="/assessor-dashboard" replace />;
        } else if (user.role === 'moderator') {
            return <Navigate to="/moderator-dashboard" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
