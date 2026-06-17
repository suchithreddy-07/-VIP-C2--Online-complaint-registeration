import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { complaintAPI } from "../services/api";
import { ArrowLeft, CheckCircle, AlertCircle, FilePlus2 } from "lucide-react";

const CATEGORIES = [
  "Water Supply & Sanitation",
  "Electricity & Power Services",
  "Roads & Public Works (PWD)",
  "Waste Management & Garbage",
  "Street Lighting",
  "Public Health & Medical Services",
  "Land & Property disputes",
  "Social Welfare Schemes",
  "Law and Order / Safety",
  "Education & Government Schools",
  "Others",
];

const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi (NCT)",
  "Jammu & Kashmir",
  "Other Union Territories",
];

const CreateComplaint = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [priority, setPriority] = useState("MEDIUM");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !category ||
      !description.trim() ||
      !address.trim() ||
      !city.trim() ||
      !state ||
      !pincode.trim() ||
      !priority
    ) {
      setError("Please fill in all mandatory fields.");
      return;
    }

    // Pincode validation
    if (!/^\d{6}$/.test(pincode.trim())) {
      setError("Pincode must be exactly 6 digits.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const complaintData = {
        title: title.trim(),
        category,
        description: description.trim(),
        address: address.trim(),
        city: city.trim(),
        state,
        pincode: pincode.trim(),
        priority,
      };

      const res = await complaintAPI.create(complaintData);

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setError(res.message || "Failed to submit grievance.");
      }
    } catch (err) {
      console.error("Grievance registration failed:", err);
      setError(err.response?.data?.message || "Failed to submit grievance. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex bg-gov-light">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-white border border-slate-200 p-2 rounded-lg hover:bg-slate-100 transition shadow-sm text-slate-500 hover:text-gov-primary"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 m-0">
                File Official Grievance
              </h2>
              <p className="text-xs text-slate-500 m-0 mt-1 font-medium">
                Submit details below to register your grievance. A tracking number will be generated immediately.
              </p>
            </div>
          </div>

          {/* Success Dialog */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center space-x-3 text-xs font-semibold animate-bounce">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Grievance registered successfully! Redirecting to dashboard...</span>
            </div>
          )}

          {/* Error Dialog */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center space-x-3 text-xs font-semibold">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Complaint Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Briefly state the issue (e.g., Water leakage in sector 4 main road)"
                    required
                    className="block w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gov-primary focus:bg-white bg-slate-50 text-slate-800 font-medium transition"
                    disabled={loading || success}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Department / Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="block w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gov-primary focus:bg-white bg-slate-50 text-slate-800 font-medium transition"
                    disabled={loading || success}
                  >
                    <option value="">-- Choose Department --</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Estimated Urgency / Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    required
                    className="block w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gov-primary focus:bg-white bg-slate-50 text-slate-800 font-medium transition"
                    disabled={loading || success}
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Full Narrative Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    placeholder="Please explain the issue in detail. Mention when it started, what has been affected, and any specific support details."
                    required
                    className="block w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gov-primary focus:bg-white bg-slate-50 text-slate-800 font-medium transition"
                    disabled={loading || success}
                  ></textarea>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Incident Address / Location Details <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / Street / Landmark details"
                    required
                    className="block w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gov-primary focus:bg-white bg-slate-50 text-slate-800 font-medium transition"
                    disabled={loading || success}
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    City / Town <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g., Indore"
                    required
                    className="block w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gov-primary focus:bg-white bg-slate-50 text-slate-800 font-medium transition"
                    disabled={loading || success}
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    State / Province <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="block w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gov-primary focus:bg-white bg-slate-50 text-slate-800 font-medium transition"
                    disabled={loading || success}
                  >
                    <option value="">-- Choose State --</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Postal Code / Pincode (6-digits) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g., 452001"
                    maxLength="6"
                    required
                    className="block w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gov-primary focus:bg-white bg-slate-50 text-slate-800 font-medium transition"
                    disabled={loading || success}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold py-2.5 px-6 rounded-lg text-sm transition"
                  disabled={loading || success}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || success}
                  className="bg-gov-primary hover:bg-gov-accent text-white font-bold py-2.5 px-6 rounded-lg text-sm shadow flex items-center space-x-2 transition"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <FilePlus2 className="w-4 h-4" />
                      <span>Submit Grievance</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CreateComplaint;
