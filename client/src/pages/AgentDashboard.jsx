import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { agentAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Search,
  ChevronRight,
  ShieldCheck,
  User,
} from "lucide-react";

const AgentDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  if (user && user.role === "AGENT" && !user.isApproved) {
    return (
      <div className="flex-1 flex bg-gov-light">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center">
            <div className="bg-amber-50 p-4 rounded-full text-amber-500 w-fit mx-auto shadow-sm mb-4">
              <Clock className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 m-0">Account Pending Approval</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Your agent account has been registered successfully. However, you cannot access the officer console until a System Administrator reviews and approves your account.
            </p>
            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-xs text-slate-400 font-medium">
                Please contact support or check back later.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const fetchAssignedComplaints = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await agentAPI.getAssignedComplaints();
      if (res.success) {
        setComplaints(res.complaints || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch assigned complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedComplaints();
  }, []);

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      setUpdatingId(complaintId);
      const res = await agentAPI.updateStatus(complaintId, newStatus);
      if (res.success) {
        showToast(`Complaint status updated to ${newStatus} successfully!`, "success");
        fetchAssignedComplaints();
      } else {
        showToast(res.message || "Failed to update status", "error");
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to update status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const isTransitionAllowed = (currentStatus, targetStatus) => {
    if (currentStatus === targetStatus) return true;
    if (currentStatus === "ASSIGNED") {
      return ["IN_PROGRESS", "RESOLVED", "REJECTED"].includes(targetStatus);
    }
    if (currentStatus === "IN_PROGRESS") {
      return ["RESOLVED", "REJECTED"].includes(targetStatus);
    }
    return false;
  };

  // Compute stats
  const totalCount = complaints.length;
  const assignedCount = complaints.filter((c) => c.status === "ASSIGNED").length;
  const progressCount = complaints.filter((c) => c.status === "IN_PROGRESS").length;
  const resolvedCount = complaints.filter((c) => c.status === "RESOLVED").length;

  // Filter lists
  const filteredComplaints = complaints.filter((c) => {
    // Filter by tab
    if (statusFilter === "PENDING" && c.status !== "PENDING") return false;
    if (statusFilter === "IN_PROGRESS" && c.status !== "IN_PROGRESS" && c.status !== "ASSIGNED") return false;
    if (statusFilter === "RESOLVED" && c.status !== "RESOLVED") return false;
    if (statusFilter === "REJECTED" && c.status !== "REJECTED") return false;

    // Filter by Search term
    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase();
      return (
        c.title.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query) ||
        c.user?.name?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <div className="flex-1 flex bg-gov-light relative">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-bold flex items-center space-x-2 animate-fade-in ${
          toast.type === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
            : "bg-red-50 border-red-200 text-red-800"
        }`}>
          <span>{toast.message}</span>
        </div>
      )}
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 m-0">
              Agent Workspace Dashboard
            </h2>
            <p className="text-xs text-slate-500 m-0 mt-1 font-medium">
              Review assigned citizen complaints, manage grievance statuses, and chat to resolve issues.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center space-x-2 text-xs font-semibold">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Stats Summary row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="bg-gov-light p-3 rounded-lg text-gov-primary">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0 font-sans">Total Assigned</p>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 m-0 mt-0.5">{totalCount}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0 font-sans">Assigned (New)</p>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 m-0 mt-0.5">{assignedCount}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0 font-sans">In Progress</p>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 m-0 mt-0.5">{progressCount}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0 font-sans">Resolved</p>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 m-0 mt-0.5">{resolvedCount}</h3>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
            
            {/* Search and Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative max-w-sm w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by title, citizen name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-gov-primary bg-slate-50 focus:bg-white text-slate-800 font-medium transition"
                />
              </div>

              <div className="flex flex-wrap gap-1">
                {["ALL", "IN_PROGRESS", "RESOLVED", "REJECTED"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`text-[11px] font-bold px-3 py-2 rounded-lg transition ${
                      statusFilter === tab
                        ? "bg-gov-primary text-white"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {tab === "IN_PROGRESS" ? "ACTIVE / IN PROGRESS" : tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Data Table */}
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-gov-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-500 font-medium">Loading Assigned Grievances...</p>
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-6 flex flex-col items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-slate-300 mb-2" />
                <h4 className="text-sm font-bold text-slate-700 m-0">No assigned complaints</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1 m-0">
                  {searchTerm
                    ? "Adjust search keyword or filter tab to locate the complaint."
                    : "No grievances are assigned under this filter tab."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase bg-slate-50">
                      <th className="py-3 px-4">Grievance Info</th>
                      <th className="py-3 px-4">Citizen</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComplaints.map((c) => (
                      <tr
                        key={c._id}
                        className="border-b border-slate-100 hover:bg-slate-50/50 text-xs font-medium text-slate-600 transition"
                      >
                        {/* Grievance title and category */}
                        <td className="py-4 px-4 max-w-xs">
                          <Link
                            to={`/complaints/${c._id}`}
                            className="font-bold text-slate-800 hover:text-gov-primary transition text-sm line-clamp-1 m-0"
                          >
                            {c.title}
                          </Link>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block mt-1">
                            {c.category} • Filed: {new Date(c.createdAt).toLocaleDateString("en-IN")}
                          </span>
                        </td>

                        {/* Citizen info */}
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-700 flex items-center space-x-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{c.user?.name || "Citizen"}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {c.user?.phone || c.user?.email || "No Phone"}
                          </span>
                        </td>

                        {/* Priority */}
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              c.priority === "HIGH"
                                ? "bg-red-50 text-red-700"
                                : c.priority === "MEDIUM"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-slate-50 text-slate-500"
                            }`}
                          >
                            {c.priority}
                          </span>
                        </td>

                        {/* Status update selector */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col sm:flex-row gap-1">
                            {["ASSIGNED", "IN_PROGRESS", "RESOLVED", "REJECTED"].map((status) => {
                              const allowed = isTransitionAllowed(c.status, status);
                              const isActive = c.status === status;
                              if (!allowed && !isActive) return null;
                              return (
                                <button
                                  key={status}
                                  onClick={() => handleStatusChange(c._id, status)}
                                  disabled={updatingId === c._id || isActive}
                                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all duration-150 ${
                                    isActive
                                      ? status === "RESOLVED"
                                        ? "bg-emerald-600 text-white shadow"
                                        : status === "REJECTED"
                                        ? "bg-red-600 text-white shadow"
                                        : status === "IN_PROGRESS"
                                        ? "bg-indigo-600 text-white shadow"
                                        : "bg-blue-600 text-white shadow"
                                      : "bg-slate-50 hover:bg-slate-200 text-slate-600 border border-slate-200"
                                  }`}
                                >
                                  {status === "IN_PROGRESS" ? "IN PROGRESS" : status}
                                </button>
                              );
                            })}
                          </div>
                        </td>

                        {/* Actions links */}
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center space-x-3">
                            <Link
                              to={`/complaints/${c._id}`}
                              className="text-gov-primary font-bold hover:text-gov-accent flex items-center space-x-1"
                              title="Open assistance chat room"
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span className="hidden sm:inline">Assist Chat</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default AgentDashboard;
