import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Clock, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from "lucide-react";

const ComplaintCard = ({ complaint }) => {
  const { _id, title, category, description, priority, status, createdAt } = complaint;

  // Format date helper
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Status style helper
  const getStatusBadge = (statusVal) => {
    switch (statusVal) {
      case "PENDING":
        return {
          bg: "bg-amber-100 text-amber-800 border-amber-200",
          icon: <Clock className="w-3.5 h-3.5 mr-1" />,
          label: "Pending",
        };
      case "ASSIGNED":
        return {
          bg: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <ShieldCheck className="w-3.5 h-3.5 mr-1" />,
          label: "Assigned",
        };
      case "IN_PROGRESS":
        return {
          bg: "bg-indigo-100 text-indigo-800 border-indigo-200",
          icon: <AlertCircle className="w-3.5 h-3.5 mr-1" />,
          label: "In Progress",
        };
      case "RESOLVED":
        return {
          bg: "bg-emerald-100 text-emerald-800 border-emerald-200",
          icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
          label: "Resolved",
        };
      case "REJECTED":
        return {
          bg: "bg-red-100 text-red-800 border-red-200",
          icon: <XCircle className="w-3.5 h-3.5 mr-1" />,
          label: "Rejected",
        };
      default:
        return {
          bg: "bg-slate-100 text-slate-800 border-slate-200",
          icon: <Clock className="w-3.5 h-3.5 mr-1" />,
          label: statusVal,
        };
    }
  };

  // Priority style helper
  const getPriorityBadge = (priorityVal) => {
    switch (priorityVal) {
      case "HIGH":
        return "bg-red-50 text-red-700 border-red-200";
      case "MEDIUM":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "LOW":
        return "bg-slate-50 text-slate-600 border-slate-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const statusConfig = getStatusBadge(status);

  return (
    <div className="bg-white border border-slate-200 rounded-xl hover:border-gov-primary hover:shadow-lg transition-all duration-200 flex flex-col h-full overflow-hidden animate-fade-in group">
      {/* Top Banner section */}
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] tracking-wider uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
            {category}
          </span>
          <div className="flex space-x-1.5">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full border flex items-center ${statusConfig.bg}`}
            >
              {statusConfig.icon}
              {statusConfig.label}
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getPriorityBadge(
                priority
              )}`}
            >
              {priority} Priority
            </span>
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-800 mb-2 truncate group-hover:text-gov-primary transition-colors">
          {title}
        </h3>

        <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Footer link section */}
      <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 flex justify-between items-center text-xs font-medium text-slate-500">
        <span>Filed: {formatDate(createdAt)}</span>
        <Link
          to={`/complaints/${_id}`}
          className="flex items-center space-x-1 text-gov-primary font-bold hover:text-gov-accent transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default ComplaintCard;
