import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ComplaintCard from "../components/ComplaintCard";
import { complaintAPI } from "../services/api";
import { PlusCircle, Search, AlertCircle, FileText, CheckCircle2, Clock, HelpCircle } from "lucide-react";

const UserDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const res = await complaintAPI.getMyComplaints();
        if (res.success) {
          setComplaints(res.complaints || []);
        }
      } catch (err) {
        console.error("Error loading complaints:", err);
        setError("Failed to load your complaints list. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  // Compute stats
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === "PENDING").length;
  const activeCount = complaints.filter((c) => c.status === "ASSIGNED" || c.status === "IN_PROGRESS").length;
  const resolvedCount = complaints.filter((c) => c.status === "RESOLVED").length;

  // Filter complaints list
  const filteredComplaints = complaints.filter((c) => {
    // Tab filter
    if (activeTab === "PENDING" && c.status !== "PENDING") return false;
    if (activeTab === "ACTIVE" && c.status !== "ASSIGNED" && c.status !== "IN_PROGRESS") return false;
    if (activeTab === "RESOLVED" && c.status !== "RESOLVED") return false;
    if (activeTab === "REJECTED" && c.status !== "REJECTED") return false;

    // Search filter
    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase();
      return (
        c.title.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="flex-1 flex bg-gov-light">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 m-0">
                My Grievance Dashboard
              </h2>
              <p className="text-xs text-slate-500 m-0 mt-1 font-medium">
                Submit complaints, interact with assignment officers, and monitor updates.
              </p>
            </div>
            <Link
              to="/complaints/new"
              className="bg-gov-primary hover:bg-gov-accent text-white font-bold text-xs py-2.5 px-4 rounded-lg shadow-sm hover:shadow flex items-center space-x-2 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>File New Grievance</span>
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center space-x-2 text-xs font-semibold">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Stats Widgets */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat Item 1 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="bg-gov-light p-3 rounded-lg text-gov-primary">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0">Total Filed</p>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 m-0 mt-0.5">{totalCount}</h3>
              </div>
            </div>

            {/* Stat Item 2 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0">Pending</p>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 m-0 mt-0.5">{pendingCount}</h3>
              </div>
            </div>

            {/* Stat Item 3 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0">Active Tasks</p>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 m-0 mt-0.5">{activeCount}</h3>
              </div>
            </div>

            {/* Stat Item 4 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0">Resolved</p>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 m-0 mt-0.5">{resolvedCount}</h3>
              </div>
            </div>
          </div>

          {/* Filters and List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
            
            {/* Search and Tab Selector Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative max-w-sm w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by title, category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-gov-primary bg-slate-50 focus:bg-white text-slate-800 font-medium transition"
                />
              </div>

              {/* Tab Filters */}
              <div className="flex flex-wrap gap-1.5 border-b md:border-b-0 border-slate-100 pb-2 md:pb-0">
                {["ALL", "PENDING", "ACTIVE", "RESOLVED", "REJECTED"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-xs font-bold px-3 py-2 rounded-lg transition ${
                      activeTab === tab
                        ? "bg-gov-primary text-white"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {tab === "ACTIVE" ? "ACTIVE / ASSIGNED" : tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Complaints Grid */}
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-gov-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-500 font-medium">Loading Grievances...</p>
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center p-6">
                <HelpCircle className="w-10 h-10 text-slate-300 mb-2" />
                <h4 className="text-sm font-bold text-slate-700 m-0">No complaints found</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1 m-0">
                  {searchTerm
                    ? "Adjust your filters or search keywords to find the desired complaint."
                    : "You haven't submitted any complaints under this tab yet. Click 'File New Grievance' to start."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredComplaints.map((c) => (
                  <ComplaintCard key={c._id} complaint={c} />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
