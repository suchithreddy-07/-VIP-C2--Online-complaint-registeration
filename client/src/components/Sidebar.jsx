import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FileText,
  PlusCircle,
  FolderOpen,
  Users,
  Shield,
  LifeBuoy,
} from "lucide-react";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-150 ${
      isActive(path)
        ? "bg-gov-primary text-white shadow-md shadow-gov-primary/30"
        : "text-slate-600 hover:bg-slate-200/80 hover:text-gov-primary"
    }`;

  const renderUserLinks = () => (
    <>
      <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
        Citizen Services
      </div>
      <Link to="/dashboard" className={linkClass("/dashboard")}>
        <FolderOpen className="w-5 h-5" />
        <span>My Grievances</span>
      </Link>
      <Link to="/complaints/new" className={linkClass("/complaints/new")}>
        <PlusCircle className="w-5 h-5" />
        <span>File New Grievance</span>
      </Link>
    </>
  );

  const renderAgentLinks = () => (
    <>
      <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
        Agent Workspace
      </div>
      <Link to="/agent" className={linkClass("/agent")}>
        <FileText className="w-5 h-5" />
        <span>Assigned Tasks</span>
      </Link>
    </>
  );

  const renderAdminLinks = () => (
    <>
      <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
        Administration
      </div>
      <Link to="/admin" className={linkClass("/admin")}>
        <Shield className="w-5 h-5" />
        <span>Admin Console</span>
      </Link>
    </>
  );

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col p-4 space-y-6 flex-shrink-0">
      {/* User Info Card inside Sidebar */}
      <div className="bg-gov-light p-4 rounded-xl border border-slate-100 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-gov-primary/10 rounded-full flex items-center justify-center text-gov-primary font-bold text-lg border border-gov-primary/20">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h4 className="mt-2 text-sm font-bold text-slate-800 m-0 truncate w-full">
          {user.name}
        </h4>
        <p className="text-xs text-slate-500 m-0 truncate w-full">{user.email}</p>
        <span className="mt-2 inline-block text-[10px] font-extrabold px-2 py-0.5 bg-gov-primary/15 text-gov-primary rounded-full uppercase">
          {user.role} Portal
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {user.role === "USER" && renderUserLinks()}
        {user.role === "AGENT" && renderAgentLinks()}
        {user.role === "ADMIN" && renderAdminLinks()}
      </nav>

      {/* Support Footer in Sidebar */}
      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium px-2 py-1">
          <LifeBuoy className="w-4 h-4 text-slate-400" />
          <span>Support Hotline: 1800-11-2200</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
