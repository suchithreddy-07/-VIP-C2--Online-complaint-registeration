import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import { complaintAPI, agentAPI, feedbackAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Tag,
  AlertTriangle,
  User,
  ShieldCheck,
  CheckCircle,
  MessageSquare,
  Star,
} from "lucide-react";

const ComplaintDetails = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [complaint, setComplaint] = useState(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

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

  const fetchComplaintDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await complaintAPI.getSingle(complaintId);
      if (res.success) {
        setComplaint(res.complaint);

        // If complaint is resolved, check if feedback is already submitted
        if (res.complaint.status === "RESOLVED") {
          try {
            const feedRes = await feedbackAPI.getByComplaint(complaintId);
            if (feedRes.success && feedRes.feedback && feedRes.feedback.length > 0) {
              setFeedbackSubmitted(true);
            }
          } catch (e) {
            console.warn("Feedback fetch error:", e);
          }
        }
      } else {
        setError(res.message || "Failed to load complaint details.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error loading complaint details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (complaintId) {
      fetchComplaintDetails();
    }
  }, [complaintId]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (!newStatus || updating) return;

    try {
      setUpdating(true);
      const res = await agentAPI.updateStatus(complaintId, newStatus);
      if (res.success) {
        setComplaint((prev) => ({ ...prev, status: newStatus }));
        alert(`Status updated to ${newStatus}`);
      } else {
        alert(res.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const getBackPath = () => {
    if (!user) return "/";
    if (user.role === "ADMIN") return "/admin";
    if (user.role === "AGENT") return "/agent";
    return "/dashboard";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gov-light">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gov-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="flex-1 flex bg-gov-light">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-xl text-center max-w-lg mx-auto">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold">Error Accessing Complaint</h3>
            <p className="text-xs mt-2">{error || "Complaint details could not be found."}</p>
            <button
              onClick={() => navigate(getBackPath())}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 px-4 rounded-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Lifecycle steps check
  const steps = ["PENDING", "ASSIGNED", "IN_PROGRESS", "RESOLVED"];
  const currentStepIndex = steps.indexOf(complaint.status);

  return (
    <div className="flex-1 flex bg-gov-light">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(getBackPath())}
                className="bg-white border border-slate-200 p-2 rounded-lg hover:bg-slate-100 transition shadow-sm text-slate-500 hover:text-gov-primary"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Grievance ID: {complaint._id}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 m-0 leading-tight">
                  {complaint.title}
                </h2>
              </div>
            </div>
          </div>

          {/* Progress Tracker (For regular flow) */}
          {complaint.status !== "REJECTED" && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center relative">
                {/* Connector line */}
                <div className="absolute top-4 left-0 right-0 h-1 bg-slate-200 z-0"></div>
                <div
                  className="absolute top-4 left-0 h-1 bg-gov-primary transition-all duration-300 z-0"
                  style={{
                    width: `${Math.max(
                      0,
                      (currentStepIndex / (steps.length - 1)) * 100
                    )}%`,
                  }}
                ></div>

                {/* Step Circles */}
                {steps.map((step, idx) => {
                  const isActive = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div key={step} className="flex flex-col items-center relative z-10">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 font-bold text-xs transition ${
                          isCurrent
                            ? "bg-gov-primary border-gov-primary text-white scale-110 shadow-lg shadow-gov-primary/30"
                            : isActive
                            ? "bg-white border-gov-primary text-gov-primary"
                            : "bg-slate-50 border-slate-200 text-slate-400"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span
                        className={`text-[9px] font-bold mt-2 uppercase tracking-wide ${
                          isCurrent ? "text-gov-primary" : "text-slate-400"
                        }`}
                      >
                        {step.replace("_", " ")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {complaint.status === "REJECTED" && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center space-x-3 text-xs text-red-800 font-bold">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span>This grievance has been REJECTED by administration. No further action is required.</span>
            </div>
          )}

          {/* Grid Layout: Left Detail Card, Right Chatbox */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Details Panel */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Main details card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 m-0">
                    Grievance Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-slate-400" />
                    <span>Category: <span className="text-slate-800 font-bold">{complaint.category}</span></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Submitted: <span className="text-slate-800 font-bold">{new Date(complaint.createdAt).toLocaleDateString("en-IN")}</span></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-slate-400" />
                    <span>Priority: <span className="text-slate-800 font-bold">{complaint.priority}</span></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    <span>Status: <span className="text-slate-800 font-bold">{complaint.status}</span></span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Narrative</h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 whitespace-pre-wrap">
                    {complaint.description}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Location Details</span>
                  </h4>
                  <p className="text-xs text-slate-700 m-0">
                    {complaint.address}, {complaint.city}, {complaint.state} - <span className="font-bold">{complaint.pincode}</span>
                  </p>
                </div>
              </div>

              {/* Agent info & Actions card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 m-0">
                  Assigned Officer Details
                </h3>

                {complaint.assignedAgent ? (
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-50 text-gov-primary rounded-full flex items-center justify-center font-bold text-sm border border-blue-100">
                        {complaint.assignedAgent.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 m-0">{complaint.assignedAgent.name}</h4>
                        <p className="text-[10px] text-slate-500 m-0">{complaint.assignedAgent.email}</p>
                      </div>
                    </div>

                    {/* Agent Status Update Form */}
                    {user?.role === "AGENT" && (
                      <div className="flex items-center space-x-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Change Status:</label>
                        <select
                          value={complaint.status}
                          onChange={handleStatusChange}
                          disabled={updating || complaint.status === "RESOLVED" || complaint.status === "REJECTED"}
                          className="text-xs font-bold border border-slate-200 rounded-lg p-2 bg-slate-50 focus:outline-none focus:border-gov-primary transition"
                        >
                          {["ASSIGNED", "IN_PROGRESS", "RESOLVED", "REJECTED"].map((status) => {
                            const allowed = isTransitionAllowed(complaint.status, status);
                            const isActive = complaint.status === status;
                            if (!allowed && !isActive) return null;
                            return (
                              <option key={status} value={status}>
                                {status === "IN_PROGRESS" ? "IN PROGRESS" : status}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-4 bg-slate-50/50 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 font-medium m-0">
                      No grievance officer has been assigned yet.
                    </p>
                    {user?.role === "ADMIN" && (
                      <p className="text-[10px] text-slate-400 mt-1 m-0">
                        Use the Admin Dashboard to allocate an agent to this ticket.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Feedback Alert for User */}
              {user?.role === "USER" && complaint.status === "RESOLVED" && (
                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl flex items-center justify-between flex-wrap gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-emerald-800 m-0 flex items-center">
                      <CheckCircle className="w-4.5 h-4.5 text-emerald-600 mr-1.5" />
                      Grievance Resolved
                    </h4>
                    <p className="text-xs text-emerald-600 m-0">
                      {feedbackSubmitted
                        ? "Thank you! You have already submitted feedback for this grievance."
                        : "Please let us know how satisfied you were with the resolution process."}
                    </p>
                  </div>
                  {!feedbackSubmitted && (
                    <Link
                      to={`/feedback/${complaintId}`}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-lg shadow-sm flex items-center space-x-1.5 transition"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                      <span>Submit Feedback</span>
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Chatbox Panel */}
            <div className="lg:col-span-1">
              <ChatBox
                complaintId={complaintId}
                citizen={complaint.user}
                agent={complaint.assignedAgent}
                status={complaint.status}
              />
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default ComplaintDetails;
