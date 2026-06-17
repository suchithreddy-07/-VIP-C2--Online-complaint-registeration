import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import CreateComplaint from "./pages/CreateComplaint";
import ComplaintDetails from "./pages/ComplaintDetails";
import AgentDashboard from "./pages/AgentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Feedback from "./pages/Feedback";

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-gov-light font-sans">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["USER"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/complaints/new"
            element={
              <ProtectedRoute allowedRoles={["USER"]}>
                <CreateComplaint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback/:complaintId"
            element={
              <ProtectedRoute allowedRoles={["USER"]}>
                <Feedback />
              </ProtectedRoute>
            }
          />

          {/* Shared Protected Routes (User, Agent, Admin) */}
          <Route
            path="/complaints/:complaintId"
            element={
              <ProtectedRoute allowedRoles={["USER", "AGENT", "ADMIN"]}>
                <ComplaintDetails />
              </ProtectedRoute>
            }
          />

          {/* Agent Protected Routes */}
          <Route
            path="/agent"
            element={
              <ProtectedRoute allowedRoles={["AGENT"]}>
                <AgentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback Redirect */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
