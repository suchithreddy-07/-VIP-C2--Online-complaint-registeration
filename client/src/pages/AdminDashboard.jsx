import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { adminAPI } from "../services/api";
import {
  Users,
  Shield,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  MessageSquare,
  UserCheck,
  UserX,
  UserPlus,
  TrendingUp,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAgents: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    inProgressComplaints: 0,
    rejectedComplaints: 0,
  });
  const [complaints, setComplaints] = useState([]);
  const [agents, setAgents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [assigningId, setAssigningId] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [activeSubTab, setActiveSubTab] = useState("COMPLAINTS"); // COMPLAINTS, AGENTS, USERS

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [statsRes, complaintsRes, agentsRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAllComplaints(),
        adminAPI.getAgents(),
        adminAPI.getUsers(),
      ]);

      if (statsRes.success) {
        setStats(statsRes.stats);
      }
      if (complaintsRes.success) {
        setComplaints(complaintsRes.complaints || []);
      }
      if (agentsRes.success) {
        setAgents(agentsRes.agents || []);
      }
      if (usersRes.success) {
        setUsers(usersRes.users || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load administration data. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssignAgent = async (complaintId, agentId) => {
    if (!agentId) return;

    try {
      setAssigningId(complaintId);
      const res = await adminAPI.assignAgent(complaintId, agentId);
      
      if (res.success) {
        const selectedAgent = agents.find((a) => a._id === agentId);
        setComplaints((prev) =>
          prev.map((c) =>
            c._id === complaintId
              ? {
                  ...c,
                  status: "ASSIGNED",
                  assignedAgent: selectedAgent
                    ? { _id: selectedAgent._id, name: selectedAgent.name, email: selectedAgent.email }
                    : null,
                }
              : c
          )
        );

        // Refetch stats
        const statsRes = await adminAPI.getStats();
        if (statsRes.success) {
          setStats(statsRes.stats);
        }
        alert("Officer assigned successfully.");
      } else {
        alert(res.message || "Failed to assign officer.");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to assign officer.");
    } finally {
      setAssigningId(null);
    }
  };

  const handleApproveAgent = async (agentId) => {
    try {
      setActionLoadingId(agentId);
      const res = await adminAPI.approveAgent(agentId);
      if (res.success) {
        // Update local agents state
        setAgents((prev) =>
          prev.map((a) => (a._id === agentId ? { ...a, isApproved: true } : a))
        );
        // Reload stats
        const statsRes = await adminAPI.getStats();
        if (statsRes.success) {
          setStats(statsRes.stats);
        }
        alert("Agent approved successfully.");
      } else {
        alert(res.message || "Failed to approve agent.");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to approve agent.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectAgent = async (agentId) => {
    if (!window.confirm("Are you sure you want to reject and delete this agent account?")) {
      return;
    }
    try {
      setActionLoadingId(agentId);
      const res = await adminAPI.rejectAgent(agentId);
      if (res.success) {
        // Remove agent locally
        setAgents((prev) => prev.filter((a) => a._id !== agentId));
        // Reload stats
        const statsRes = await adminAPI.getStats();
        if (statsRes.success) {
          setStats(statsRes.stats);
        }
        alert("Agent account rejected and removed.");
      } else {
        alert(res.message || "Failed to reject agent.");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to reject agent.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    if (statusFilter !== "ALL" && c.status !== statusFilter) return false;

    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase();
      return (
        c.title.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query) ||
        c.user?.name?.toLowerCase().includes(query) ||
        c.assignedAgent?.name?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Split agents
  const pendingAgents = agents.filter((a) => !a.isApproved);
  const approvedAgents = agents.filter((a) => a.isApproved);

  // Filter users/citizens
  const filteredUsers = users.filter((u) => {
    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase();
      return u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query);
    }
    return true;
  });

  // Filter agents lists based on search
  const filteredApprovedAgents = approvedAgents.filter((a) => {
    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase();
      return a.name.toLowerCase().includes(query) || a.email.toLowerCase().includes(query);
    }
    return true;
  });

  return (
    <div className="flex-1 flex bg-gov-light">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 m-0">
                System Admin Console
              </h2>
              <p className="text-xs text-slate-500 m-0 mt-1 font-medium">
                Manage grievances, moderate support agents, approve registrations, and view analytics.
              </p>
            </div>
            <button
              onClick={loadData}
              className="mt-3 sm:mt-0 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-2 px-4 rounded-lg shadow-sm transition"
            >
              Refresh Data
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center space-x-2 text-xs font-semibold">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Stats Widgets */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Complaints */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="bg-gov-light p-3 rounded-lg text-gov-primary">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0 font-sans">Total Complaints</p>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 m-0 mt-0.5">{stats.totalComplaints}</h3>
              </div>
            </div>

            {/* Pending Complaints */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0 font-sans">Pending Complaints</p>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 m-0 mt-0.5">{stats.pendingComplaints}</h3>
              </div>
            </div>

            {/* In Progress Complaints */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0 font-sans">In Progress</p>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 m-0 mt-0.5">{stats.inProgressComplaints || 0}</h3>
              </div>
            </div>

            {/* Resolved Complaints */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0 font-sans">Resolved Complaints</p>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 m-0 mt-0.5">{stats.resolvedComplaints}</h3>
              </div>
            </div>
          </div>

          {/* Sub-tabs Selection Row */}
          <div className="border-b border-slate-200 flex space-x-4">
            <button
              onClick={() => {
                setActiveSubTab("COMPLAINTS");
                setSearchTerm("");
              }}
              className={`pb-3 text-sm font-bold border-b-2 transition ${
                activeSubTab === "COMPLAINTS"
                  ? "border-gov-primary text-gov-primary"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Assign Complaints
            </button>
            <button
              onClick={() => {
                setActiveSubTab("AGENTS");
                setSearchTerm("");
              }}
              className={`pb-3 text-sm font-bold border-b-2 transition flex items-center space-x-1.5 ${
                activeSubTab === "AGENTS"
                  ? "border-gov-primary text-gov-primary"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <span>Approve Agents</span>
              {pendingAgents.length > 0 && (
                <span className="bg-red-500 text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded-full">
                  {pendingAgents.length}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveSubTab("USERS");
                setSearchTerm("");
              }}
              className={`pb-3 text-sm font-bold border-b-2 transition ${
                activeSubTab === "USERS"
                  ? "border-gov-primary text-gov-primary"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Registered Citizens ({stats.totalUsers})
            </button>
          </div>

          {/* Sub-Tab 1: COMPLAINTS */}
          {activeSubTab === "COMPLAINTS" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative max-w-sm w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search complaints, categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-gov-primary bg-slate-50 focus:bg-white text-slate-800 font-medium transition"
                  />
                </div>

                <div className="flex flex-wrap gap-1">
                  {["ALL", "PENDING", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "REJECTED"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setStatusFilter(tab)}
                      className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition ${
                        statusFilter === tab
                          ? "bg-gov-primary text-white"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-4 border-gov-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-slate-500 font-medium">Loading Platform Registry...</p>
                </div>
              ) : filteredComplaints.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-6 flex flex-col items-center justify-center">
                  <FileText className="w-10 h-10 text-slate-300 mb-2" />
                  <h4 className="text-sm font-bold text-slate-700 m-0">No complaints found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1 m-0">
                    Try adjusting search parameters or selecting a different status filter.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase bg-slate-50">
                        <th className="py-3 px-4">Grievance Info</th>
                        <th className="py-3 px-4">Citizen Info</th>
                        <th className="py-3 px-4">Priority & Status</th>
                        <th className="py-3 px-4">Allocated Officer / Assignment</th>
                        <th className="py-3 px-4 text-center">Inspect</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComplaints.map((c) => (
                        <tr
                          key={c._id}
                          className="border-b border-slate-100 hover:bg-slate-50/50 text-xs font-medium text-slate-600 transition"
                        >
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

                          <td className="py-4 px-4">
                            <span className="font-bold text-slate-700 block">{c.user?.name || "Citizen"}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{c.user?.email || "No Email"}</span>
                          </td>

                          <td className="py-4 px-4 space-y-1">
                            <span
                              className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                c.priority === "HIGH"
                                  ? "bg-red-50 text-red-700 border border-red-150"
                                  : c.priority === "MEDIUM"
                                  ? "bg-amber-50 text-amber-700 border border-amber-150"
                                  : "bg-slate-50 text-slate-500 border border-slate-150"
                              }`}
                            >
                              {c.priority}
                            </span>
                            <div className="text-[10px] font-bold flex items-center space-x-1">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  c.status === "RESOLVED"
                                    ? "bg-emerald-500"
                                    : c.status === "REJECTED"
                                    ? "bg-red-500"
                                    : c.status === "PENDING"
                                    ? "bg-amber-400"
                                    : "bg-blue-500"
                                }`}
                              ></span>
                              <span className="uppercase tracking-wide text-[10px]">{c.status}</span>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            {c.status === "REJECTED" ? (
                              <span className="text-[10px] text-red-500 font-bold uppercase">REJECTED Ticket</span>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <select
                                  value={c.assignedAgent?._id || ""}
                                  onChange={(e) => handleAssignAgent(c._id, e.target.value)}
                                  disabled={assigningId === c._id}
                                  className="text-xs font-semibold border border-slate-200 rounded px-2 py-1 bg-slate-50 focus:outline-none focus:border-gov-primary transition"
                                >
                                  <option value="">-- Choose Officer --</option>
                                  {agents
                                    .filter((a) => a.isApproved)
                                    .map((agent) => (
                                      <option key={agent._id} value={agent._id}>
                                        {agent.name}
                                      </option>
                                    ))}
                                </select>
                                {assigningId === c._id && (
                                  <div className="w-3.5 h-3.5 border-2 border-gov-primary border-t-transparent rounded-full animate-spin"></div>
                                )}
                              </div>
                            )}
                          </td>

                          <td className="py-4 px-4 text-center">
                            <Link
                              to={`/complaints/${c._id}`}
                              className="text-gov-primary font-bold hover:text-gov-accent flex items-center justify-center space-x-1"
                            >
                              <MessageSquare className="w-4.5 h-4.5" />
                              <span className="hidden sm:inline">Inspect</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Sub-Tab 2: AGENTS APPROVALS */}
          {activeSubTab === "AGENTS" && (
            <div className="space-y-6">
              {/* Approval Queue Section */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-800 m-0 border-b border-slate-100 pb-3 flex items-center space-x-2">
                  <UserPlus className="w-5 h-5 text-amber-500" />
                  <span>Pending Agent Approvals Queue</span>
                </h3>

                {pendingAgents.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 font-medium bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                    No pending support agent accounts require verification.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase bg-slate-50">
                          <th className="py-2.5 px-4">Agent Name</th>
                          <th className="py-2.5 px-4">Email Address</th>
                          <th className="py-2.5 px-4">Phone Number</th>
                          <th className="py-2.5 px-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingAgents.map((agent) => (
                          <tr key={agent._id} className="border-b border-slate-100 hover:bg-slate-50/30 text-xs text-slate-600 font-medium">
                            <td className="py-3 px-4 font-bold text-slate-800">{agent.name}</td>
                            <td className="py-3 px-4">{agent.email}</td>
                            <td className="py-3 px-4">{agent.phone}</td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  onClick={() => handleApproveAgent(agent._id)}
                                  disabled={actionLoadingId === agent._id}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-3 rounded text-[10px] transition disabled:opacity-50 flex items-center space-x-1"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => handleRejectAgent(agent._id)}
                                  disabled={actionLoadingId === agent._id}
                                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-[10px] transition disabled:opacity-50 flex items-center space-x-1"
                                >
                                  <UserX className="w-3.5 h-3.5" />
                                  <span>Reject</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Approved/Active Agents Section */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-800 m-0 flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-gov-primary" />
                    <span>Active Support Officers ({approvedAgents.length})</span>
                  </h3>
                  <div className="relative max-w-xs w-full">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search active agents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-8 pr-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-gov-primary bg-slate-50 focus:bg-white text-slate-800 transition"
                    />
                  </div>
                </div>

                {filteredApprovedAgents.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 font-medium">
                    No active support officers found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase bg-slate-50">
                          <th className="py-2.5 px-4">Officer Name</th>
                          <th className="py-2.5 px-4">Email Address</th>
                          <th className="py-2.5 px-4">Phone Number</th>
                          <th className="py-2.5 px-4">Approval Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApprovedAgents.map((agent) => (
                          <tr key={agent._id} className="border-b border-slate-100 hover:bg-slate-50/30 text-xs text-slate-600 font-medium">
                            <td className="py-3 px-4 font-bold text-slate-800">{agent.name}</td>
                            <td className="py-3 px-4">{agent.email}</td>
                            <td className="py-3 px-4">{agent.phone}</td>
                            <td className="py-3 px-4">
                              <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px]">
                                Approved & Active
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sub-Tab 3: USERS (Citizens) */}
          {activeSubTab === "USERS" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-800 m-0 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-gov-primary" />
                  <span>Registered Platform Citizens ({users.length})</span>
                </h3>
                <div className="relative max-w-xs w-full">
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search citizens..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-8 pr-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-gov-primary bg-slate-50 focus:bg-white text-slate-800 transition"
                  />
                </div>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 font-medium">
                  No registered citizens found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase bg-slate-50">
                        <th className="py-2.5 px-4">Citizen Name</th>
                        <th className="py-2.5 px-4">Email Address</th>
                        <th className="py-2.5 px-4">Phone Number</th>
                        <th className="py-2.5 px-4">Registered Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50/30 text-xs text-slate-600 font-medium">
                          <td className="py-3 px-4 font-bold text-slate-800">{user.name}</td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">{user.phone}</td>
                          <td className="py-3 px-4">
                            {new Date(user.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
