import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gov-light">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gov-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Verifying Credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect unauthorized user to home page or specific dashboards
    if (user.role === "ADMIN") return <Navigate to="/admin" replace />;
    if (user.role === "AGENT") return <Navigate to="/agent" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
