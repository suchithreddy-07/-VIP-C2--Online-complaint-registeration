import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Landmark, LogOut, User, LayoutDashboard, ShieldCheck } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    if (user.role === "ADMIN") return "/admin";
    if (user.role === "AGENT") return "/agent";
    return "/dashboard";
  };

  return (
    <header className="bg-gov-dark text-white border-b-4 border-amber-500 shadow-md">
      {/* Top micro-bar for Government Portal feel */}
      <div className="bg-slate-900 text-[11px] text-slate-400 py-1 px-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-white">MINISTRY OF HOUSING & PUBLIC SERVICES</span>
          <span>• Government of India</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="cursor-pointer hover:text-white transition">Screen Reader Access</span>
          <span>|</span>
          <span className="cursor-pointer hover:text-white transition">English</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to={user ? getDashboardLink() : "/"} className="flex items-center space-x-3 group">
          <div className="bg-white p-2 rounded-lg text-gov-primary group-hover:scale-105 transition shadow-sm">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight m-0 text-white font-sans flex items-center">
              e-Samadhan
            </h1>
            <p className="text-[10px] text-slate-300 font-medium tracking-wider -mt-1 m-0 uppercase font-sans">
              National Grievance Portal
            </p>
          </div>
        </Link>

        <nav className="flex items-center space-x-4">
          {!user && (
            <Link
              to="/"
              className="text-sm font-semibold hover:text-amber-400 transition py-2 px-1 text-slate-100"
            >
              Home
            </Link>
          )}

          {user ? (
            <>
              <div className="hidden md:flex items-center space-x-2 bg-slate-800/80 border border-slate-700/50 py-1 px-3 rounded-full">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-medium max-w-[120px] truncate">
                  {user.name}
                </span>
                <span className="text-[10px] bg-gov-primary text-white font-bold px-2 py-0.5 rounded-full uppercase scale-90">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-1.5 px-3 rounded transition shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-sm font-semibold hover:text-amber-400 transition py-2 px-2 text-slate-100"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-amber-500 hover:bg-amber-600 text-gov-dark font-bold text-xs py-2 px-4 rounded shadow transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
