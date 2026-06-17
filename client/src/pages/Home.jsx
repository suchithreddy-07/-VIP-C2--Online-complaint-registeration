import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FileText,
  MessageSquare,
  ShieldCheck,
  Zap,
  ArrowRight,
  UserCheck,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (user.role === "AGENT") {
        navigate("/agent", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, navigate]);

  const getStartedPath = () => {
    if (!user) return "/register";
    if (user.role === "ADMIN") return "/admin";
    if (user.role === "AGENT") return "/agent";
    return "/dashboard";
  };

  return (
    <div className="flex-1 bg-gov-light flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gov-dark via-slate-900 to-gov-accent text-white py-16 sm:py-24 px-4 shadow-inner relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent)] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold mb-6 animate-pulse">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Government Redressal System</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto">
            Public Grievance Redressal and Management System
          </h2>

          <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Register your complaints online, chat in real-time with assigned officers, 
            and track the resolution process of civic, public service, and administrative issues.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to={getStartedPath()}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-gov-dark font-bold px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-150 flex items-center justify-center space-x-2 text-sm sm:text-base group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            {!user && (
              <Link
                to="/login"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold px-8 py-3.5 rounded-lg transition-all duration-150 flex items-center justify-center text-sm sm:text-base"
              >
                Sign In to Account
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="bg-white border-y border-slate-200 py-6 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-gov-primary">99.4%</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Resolution Rate</div>
          </div>
          <div className="border-l border-slate-200">
            <div className="text-2xl sm:text-3xl font-extrabold text-gov-primary">24 Hours</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Avg Assignment Time</div>
          </div>
          <div className="border-l md:border-l border-slate-200">
            <div className="text-2xl sm:text-3xl font-extrabold text-gov-primary">10k+</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Active Citizens</div>
          </div>
          <div className="border-l border-slate-200">
            <div className="text-2xl sm:text-3xl font-extrabold text-gov-primary">100%</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Encrypted & Secure</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
            System Key Features
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            A comprehensive, transparent administrative portal designed to empower citizens and expedite grievances.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gov-light text-gov-primary rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Instant Filing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Submit complaints in diverse categories. Provide addresses, postal codes, and detailed descriptions with ease.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gov-light text-gov-primary rounded-xl flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Real-Time Assistance</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Direct live chat with assigned support agents. Receive updates, ask questions, and share information on-the-go.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gov-light text-gov-primary rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Rapid Assignment</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automated pipelines and admin tools ensure complaints are quickly allocated to active support personnel.
            </p>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="bg-white py-16 sm:py-20 px-4 border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
              How Grievance Handling Works
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Follow our simple four-step grievance lifecycle from submission to verified resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connection Line for Desktop */}
            <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-slate-200 z-0"></div>

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 bg-gov-light text-gov-primary rounded-full flex items-center justify-center font-bold text-lg border border-slate-200 shadow-sm mb-4">
                01
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Registration</h4>
              <p className="text-[11px] text-slate-400 max-w-[150px]">
                Citizen registers and fills the grievance form.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 bg-gov-light text-gov-primary rounded-full flex items-center justify-center font-bold text-lg border border-slate-200 shadow-sm mb-4">
                02
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Assignment</h4>
              <p className="text-[11px] text-slate-400 max-w-[150px]">
                Administrator reviews and assigns an agent.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 bg-gov-light text-gov-primary rounded-full flex items-center justify-center font-bold text-lg border border-slate-200 shadow-sm mb-4">
                03
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Investigation</h4>
              <p className="text-[11px] text-slate-400 max-w-[150px]">
                Agent chats with citizen, processes issues.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-bold text-lg border border-emerald-200 shadow-sm mb-4">
                04
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Resolution</h4>
              <p className="text-[11px] text-slate-400 max-w-[150px]">
                Agent marks as resolved and citizen submits feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Support micro-bar */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-6 px-4 border-t border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-center sm:text-left space-y-3 sm:space-y-0">
          <p className="m-0">© 2026 e-Samadhan Grievance Cell. All rights reserved.</p>
          <div className="flex space-x-4">
            <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition">Helpdesk Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
