import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Landmark, User, Mail, Phone, Lock, AlertTriangle, UserPlus, HelpCircle } from "lucide-react";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("USER"); // USER = Citizen, AGENT = Agent
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    // Password matching validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Phone validation
    if (phone.trim().length < 10) {
      setError("Please enter a valid phone number (at least 10 digits).");
      return;
    }

    try {
      setLoading(true);
      const res = await register(
        name.trim(),
        email.trim(),
        password,
        phone.trim(),
        role
      );

      if (res.success) {
        // Redirect based on registered role
        if (role === "AGENT") {
          // Since agent needs approval, user.isApproved will be checked by ProtectedRoute or the backend.
          // Let's redirect to agent workspace dashboard (if auto-logged in) or login page.
          // The prompt says on success register can log them in, let's navigate to '/agent' or back to login.
          // We can route them to '/agent' and let the dashboard handle the approval checks,
          // or direct them appropriately. Redirecting to their dashboard is best.
          navigate("/agent");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(res.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please check your network connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gov-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-fade-in">
        
        {/* Header Branding */}
        <div className="bg-gov-primary text-white text-center py-8 px-6 border-b-4 border-amber-500">
          <div className="bg-white p-3 rounded-full text-gov-primary w-fit mx-auto shadow-md mb-3">
            <Landmark className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight m-0">
            e-Samadhan Grievance Portal
          </h2>
          <p className="text-xs text-blue-100 font-medium tracking-wide mt-1 m-0">
            Create Official Portal Account
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg flex items-start space-x-2.5 mb-6 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-bold text-slate-500 uppercase mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Rajesh Kumar"
                  className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-gov-primary focus:bg-white bg-slate-50 text-slate-800 placeholder-slate-400 font-medium transition"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-slate-500 uppercase mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., rajesh@nic.in"
                  className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-gov-primary focus:bg-white bg-slate-50 text-slate-800 placeholder-slate-400 font-medium transition"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-bold text-slate-500 uppercase mb-1.5"
              >
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., 9876543210"
                  className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-gov-primary focus:bg-white bg-slate-50 text-slate-800 placeholder-slate-400 font-medium transition"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Register As Section */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Register As
              </label>
              <div className="flex items-center space-x-6 bg-slate-50 border border-slate-200 rounded-lg p-3">
                <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="role"
                    value="USER"
                    checked={role === "USER"}
                    onChange={() => setRole("USER")}
                    className="w-4 h-4 text-gov-primary border-slate-300 focus:ring-gov-primary"
                    disabled={loading}
                  />
                  <span>Citizen (USER)</span>
                </label>
                <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="role"
                    value="AGENT"
                    checked={role === "AGENT"}
                    onChange={() => setRole("AGENT")}
                    className="w-4 h-4 text-gov-primary border-slate-300 focus:ring-gov-primary"
                    disabled={loading}
                  />
                  <span>Officer (AGENT)</span>
                </label>
              </div>

              {/* Informational warning for Agents */}
              {role === "AGENT" && (
                <div className="mt-2 bg-blue-50 border border-blue-200 text-blue-800 p-2.5 rounded-lg text-[10px] font-semibold flex items-center space-x-2 animate-fade-in">
                  <HelpCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Agent accounts require admin approval before activation.</span>
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold text-slate-500 uppercase mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-gov-primary focus:bg-white bg-slate-50 text-slate-800 placeholder-slate-400 font-medium transition"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-bold text-slate-500 uppercase mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-gov-primary focus:bg-white bg-slate-50 text-slate-800 placeholder-slate-400 font-medium transition"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gov-primary hover:bg-gov-accent text-white font-bold py-3 px-4 rounded-lg shadow hover:shadow-md transition-all duration-150 flex items-center justify-center space-x-2 text-sm disabled:opacity-50 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account & Register</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Login Link */}
          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <p className="text-xs text-slate-400 font-medium m-0">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-gov-primary font-bold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
