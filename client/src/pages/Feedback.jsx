import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { feedbackAPI, complaintAPI } from "../services/api";
import { Star, AlertTriangle, ArrowLeft, Send, CheckCircle } from "lucide-react";

const Feedback = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const checkGrievanceEligibility = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await complaintAPI.getSingle(complaintId);
        if (res.success) {
          setComplaint(res.complaint);
          if (res.complaint.status !== "RESOLVED") {
            setError("Feedback can only be submitted for RESOLVED grievances.");
          }

          // Check if feedback already submitted
          const feedRes = await feedbackAPI.getByComplaint(complaintId);
          if (feedRes.success && feedRes.feedback && feedRes.feedback.length > 0) {
            setError("Feedback has already been submitted for this grievance.");
          }
        } else {
          setError(res.message || "Could not retrieve complaint.");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load complaint. Access denied.");
      } finally {
        setLoading(false);
      }
    };

    if (complaintId) {
      checkGrievanceEligibility();
    }
  }, [complaintId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setError("Please provide a rating between 1 and 5.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      
      const res = await feedbackAPI.submit({
        complaintId,
        rating,
        comment: comment.trim(),
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/complaints/${complaintId}`);
        }, 1500);
      } else {
        setError(res.message || "Failed to submit feedback.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gov-light">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gov-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Verifying eligibility...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex bg-gov-light">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/complaints/${complaintId}`)}
              className="bg-white border border-slate-200 p-2 rounded-lg hover:bg-slate-100 transition shadow-sm text-slate-500"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 m-0">
                Grievance Resolution Feedback
              </h2>
              <p className="text-xs text-slate-500 m-0 mt-1 font-medium">
                Your feedback helps us monitor officer performance and improve administrative services.
              </p>
            </div>
          </div>

          {/* Success Dialog */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center space-x-3 text-xs font-semibold animate-bounce">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Feedback submitted successfully! Redirecting...</span>
            </div>
          )}

          {/* Error / Warning Alert */}
          {error && (
            <div className="bg-amber-50 border border-amber-250 text-amber-900 p-4 rounded-xl flex items-start space-x-3 text-xs font-semibold">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold">Feedback Blocked</span>
                <span className="font-normal block mt-1">{error}</span>
                <button
                  onClick={() => navigate(`/complaints/${complaintId}`)}
                  className="mt-3 bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 px-3 rounded text-[10px]"
                >
                  Back to Grievance Details
                </button>
              </div>
            </div>
          )}

          {/* Main Card (Visible only when eligible) */}
          {!error && !success && complaint && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6 text-xs text-slate-600">
                <span className="font-bold text-slate-700 block">Complaint Summary</span>
                <span className="font-semibold block mt-1">Title: <span className="text-slate-800">{complaint.title}</span></span>
                <span className="font-semibold block mt-0.5">Category: <span className="text-slate-800">{complaint.category}</span></span>
                <span className="font-semibold block mt-0.5">Assigned Officer: <span className="text-slate-800">{complaint.assignedAgent?.name}</span></span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Rating selection (Stars) */}
                <div className="text-center space-y-3">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Rate Your Experience
                  </label>
                  <div className="flex justify-center items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((starNum) => {
                      const isSelected = starNum <= rating;
                      return (
                        <button
                          key={starNum}
                          type="button"
                          onClick={() => setRating(starNum)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-10 h-10 ${
                              isSelected
                                ? "fill-amber-400 stroke-amber-400"
                                : "stroke-slate-300 fill-transparent"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-slate-400 font-semibold uppercase mt-1">
                    {rating === 1 && "Highly Dissatisfied"}
                    {rating === 2 && "Dissatisfied"}
                    {rating === 3 && "Neutral / Average"}
                    {rating === 4 && "Satisfied"}
                    {rating === 5 && "Highly Satisfied"}
                  </p>
                </div>

                {/* Comments box */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Comment / Suggestions
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="4"
                    placeholder="Provide details of your experience. Did the assigned officer resolve the issue effectively? How was the response time?"
                    className="block w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gov-primary focus:bg-white bg-slate-50 text-slate-800 font-medium transition"
                    disabled={submitting}
                  ></textarea>
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => navigate(`/complaints/${complaintId}`)}
                    className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold py-2.5 px-6 rounded-lg text-sm transition"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-gov-primary hover:bg-gov-accent text-white font-bold py-2.5 px-6 rounded-lg text-sm shadow flex items-center space-x-2 transition"
                  >
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Feedback</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Feedback;
