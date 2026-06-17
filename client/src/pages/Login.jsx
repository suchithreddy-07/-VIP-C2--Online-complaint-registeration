import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Landmark, Mail, Lock, AlertTriangle, Key } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      const res = await login(email.trim(), password);

      if (res.success && res.user) {
        const userRole = res.user.role;
        if (userRole === "ADMIN") {
          navigate("/admin");
        } else if (userRole === "AGENT") {
          navigate("/agent");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(res.message || "Invalid Email or Password");
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
        
        {/* Top Header / Accent bar */}
        <div className="bg-gov-primary text-white text-center py-8 px-6 border-b-4 border-amber-500">
          <div className="bg-white p-3 rounded-full text-gov-primary w-fit mx-auto shadow-md mb-3">
            <Landmark className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight m-0">
            e-Samadhan Grievance Cell
          </h2>
          <p className="text-xs text-blue-100 font-medium tracking-wide mt-1 m-0">
            Secure Citizen & Officer Login
          </p>
        </div>

        {/* Card Body Form */}
        <div className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg flex items-start space-x-2.5 mb-6 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-slate-500 uppercase mb-2"
              >
                Registered Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., citizen@nic.in"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-gov-primary focus:bg-white bg-slate-50 text-slate-800 placeholder-slate-400 font-medium transition"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold text-slate-500 uppercase"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-gov-primary focus:bg-white bg-slate-50 text-slate-800 placeholder-slate-400 font-medium transition"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gov-primary hover:bg-gov-accent text-white font-bold py-3 px-4 rounded-lg shadow hover:shadow-md transition-all duration-150 flex items-center justify-center space-x-2 text-sm disabled:opacity-50 mt-8"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Authenticate & Login</span>
                </>
              )}
            </button>
          </form>

          {/* Quick info or Test credentials helper to wow the user */}
          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <p className="text-xs text-slate-400 font-medium m-0">
              New to e-Samadhan?{" "}
              <Link
                to="/register"
                className="text-gov-primary font-bold hover:underline"
              >
                Create an Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
