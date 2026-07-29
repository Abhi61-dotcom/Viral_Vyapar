import React, { useState, useEffect } from 'react';
import {
  FaLock, FaUser, FaChartLine, FaUsers, FaEye, FaEyeSlash, FaCheckCircle,
  FaPhoneAlt, FaEnvelope, FaBuilding, FaSearch, FaFilter, FaDownload,
  FaTrash, FaSignOutAlt, FaRobot, FaCog, FaSync, FaShieldAlt, FaKey,
  FaWhatsapp, FaExclamationCircle, FaExternalLinkAlt, FaMobileAlt, FaDesktop,
  FaRocket, FaPaperPlane, FaCheck, FaCalendarAlt, FaHistory, FaSun, FaMoon
} from 'react-icons/fa';

import {
  adminLogin, verifyAdminToken, fetchAdminStats, fetchAdminLeads,
  updateLeadStatus, deleteLead, fetchChatLogs, requestAdminOtp, verifyOtpChangePassword,
  forgotPasswordSendOtp, forgotPasswordVerify, resetAdminTraffic
} from './api';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { OverviewTab } from './components/OverviewTab';
import { LeadsTab } from './components/LeadsTab';
import { WhatsAppLogsTab } from './components/WhatsAppLogsTab';
import { SecurityModal } from './components/SecurityModal';
import { LeadDetailModal } from './components/LeadDetailModal';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';

const logoImg = 'logo.png';
const FRONTEND_URL = window.location.hostname === 'localhost' ? 'http://localhost:5173/' : '/';

function App() {
  // Theme Control (Dark / Light Mode)
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('vv_admin_theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('vv_admin_theme', themeMode);
  }, [themeMode]);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Forgot Password State (Login Screen 2FA OTP)
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState('request'); // 'request' | 'verify'
  const [forgotOtpInput, setForgotOtpInput] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState({ text: '', type: '' });

  // Navigation & View State
  const [activeTab, setActiveTab] = useState('overview');

  // Enterprise Dashboard Data State
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [chatLogs, setChatLogs] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [liveSync, setLiveSync] = useState(true);
  const [lastRefreshedAt, setLastRefreshedAt] = useState('');

  // Leads Pipeline Filters
  const [leadStatusFilter, setLeadStatusFilter] = useState('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeadModal, setSelectedLeadModal] = useState(null);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [selectedTrafficDate, setSelectedTrafficDate] = useState('');

  // AI WhatsApp Logs Intelligence State
  const [botSearchQuery, setBotSearchQuery] = useState('');
  const [botTopicFilter, setBotTopicFilter] = useState('All');
  const [botDateFilter, setBotDateFilter] = useState('');

  const getTopicCategory = (query = '') => {
    const q = query.toLowerCase();
    if (q.includes('price') || q.includes('cost') || q.includes('package') || q.includes('charge') || q.includes('kitna')) {
      return { name: 'Pricing & Packages', icon: '💰', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
    }
    if (q.includes('reel') || q.includes('video') || q.includes('short') || q.includes('content')) {
      return { name: 'Reels & Video Marketing', icon: '📹', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/30' };
    }
    if (q.includes('roas') || q.includes('ad') || q.includes('meta') || q.includes('lead') || q.includes('result')) {
      return { name: 'Performance Ads & ROAS', icon: '📈', badge: 'bg-violet-500/10 text-violet-400 border-violet-500/30' };
    }
    if (q.includes('seo') || q.includes('google') || q.includes('map') || q.includes('local')) {
      return { name: 'Local SEO & Maps', icon: '📍', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
    }
    if (q.includes('audit') || q.includes('consult') || q.includes('call') || q.includes('book')) {
      return { name: 'Free Audit & Strategy', icon: '⚡', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' };
    }
    return { name: 'General Inquiry', icon: '💬', badge: 'bg-slate-800 text-slate-300 border-slate-700' };
  };

  // Email 2FA OTP Password Change State
  const adminEmail = 'choudharyabhishek1503@gmail.com';
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [pwdMessage, setPwdMessage] = useState({ text: '', type: '' });

  // JWT Session Token Authentication Check on Mount
  useEffect(() => {
    const checkAuth = async () => {
      const existingToken = sessionStorage.getItem('vv_admin_token') || localStorage.getItem('vv_admin_token');
      if (existingToken) {
        const res = await verifyAdminToken();
        if (res?.success) {
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem('vv_admin_token');
          localStorage.removeItem('vv_admin_token');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setAuthLoading(false);
    };

    checkAuth();
  }, []);

  // Fetch Live Dashboard Data
  const loadDashboardData = async (silent = false) => {
    if (!silent) setLoadingData(true);
    if (activeTab === 'overview') {
      const res = await fetchAdminStats(selectedTrafficDate);
      if (res?.stats) setStats(res.stats);
    } else if (activeTab === 'leads') {
      const res = await fetchAdminLeads(leadStatusFilter, searchQuery, selectedDateFilter);
      if (res?.leads) setLeads(res.leads);
    } else if (activeTab === 'bot') {
      const res = await fetchChatLogs();
      if (res?.chatLogs) setChatLogs(res.chatLogs);
    }
    setLastRefreshedAt(new Date().toLocaleTimeString());
    if (!silent) setLoadingData(false);
  };

  // Realtime Auto-Sync Loop (4-Second Poll / Push)
  useEffect(() => {
    if (!isAuthenticated) return;

    loadDashboardData();

    let interval = null;
    if (liveSync) {
      interval = setInterval(() => {
        loadDashboardData(true); // silent refresh
      }, 4000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAuthenticated, activeTab, leadStatusFilter, selectedDateFilter, selectedTrafficDate, liveSync]);

  // Handle Admin Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      return setLoginError('Please enter the admin password.');
    }
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await adminLogin(passwordInput);
      setIsLoggingIn(false);

      if (res?.success && res?.token) {
        sessionStorage.setItem('vv_admin_token', res.token);
        setIsAuthenticated(true);
        setPasswordInput('');
        setLoginError('');
      } else {
        setLoginError(res?.error || 'Incorrect Admin Password. Please try again.');
      }
    } catch (err) {
      setIsLoggingIn(false);
      setLoginError('Login request failed. Please check server connection.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem('vv_admin_token');
    localStorage.removeItem('vv_admin_token');
    setIsAuthenticated(false);
  };

  // Handle Forgot Password OTP Dispatch
  const handleForgotSendOtp = async () => {
    setForgotLoading(true);
    setForgotMsg({ text: '', type: '' });
    const res = await forgotPasswordSendOtp();
    setForgotLoading(false);
    if (res?.success) {
      setForgotStep('verify');
      setForgotMsg({ text: res.message || 'OTP dispatched to registered admin email.', type: 'success' });
    } else {
      setForgotMsg({ text: res?.error || 'Failed to dispatch OTP.', type: 'error' });
    }
  };

  // Handle Forgot Password OTP Verify & Password Reset
  const handleForgotVerifyAndReset = async (e) => {
    e.preventDefault();
    if (forgotNewPassword !== forgotConfirmPassword) {
      return setForgotMsg({ text: 'New Passwords do not match.', type: 'error' });
    }
    setForgotLoading(true);
    setForgotMsg({ text: '', type: '' });

    const res = await forgotPasswordVerify(forgotOtpInput, forgotNewPassword);
    setForgotLoading(false);

    if (res?.success) {
      setForgotMsg({ text: 'Password reset successfully! Please login with your new password.', type: 'success' });
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotStep('request');
        setForgotOtpInput('');
        setForgotNewPassword('');
        setForgotConfirmPassword('');
      }, 2000);
    } else {
      setForgotMsg({ text: res?.error || 'Failed to verify OTP or update password.', type: 'error' });
    }
  };

  // Handle Security Modal 2FA OTP Request
  const handleRequestOtp = async () => {
    if (!currPassword) {
      return setPwdMessage({ text: 'Please enter your current password first.', type: 'error' });
    }
    setSendingOtp(true);
    setPwdMessage({ text: '', type: '' });
    const res = await requestAdminOtp(currPassword);
    setSendingOtp(false);

    if (res?.success) {
      setOtpSent(true);
      setPwdMessage({ text: res.message || 'OTP dispatched to registered admin email.', type: 'success' });
    } else {
      setPwdMessage({ text: res?.error || 'Failed to send OTP.', type: 'error' });
    }
  };

  // Handle Security Modal OTP Verification & Password Change
  const handleVerifyAndChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setPwdMessage({ text: 'New Passwords do not match.', type: 'error' });
    }
    if (!otpInput.trim()) {
      return setPwdMessage({ text: 'Please enter the 6-digit OTP code sent to your email.', type: 'error' });
    }

    setPwdMessage({ text: '', type: '' });
    const res = await verifyOtpChangePassword(currPassword, otpInput, newPassword);

    if (res?.success) {
      setPwdMessage({ text: 'Password updated successfully!', type: 'success' });
      setTimeout(() => {
        setShowSecurityModal(false);
        setCurrPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setOtpInput('');
        setOtpSent(false);
      }, 2000);
    } else {
      setPwdMessage({ text: res?.error || 'Failed to update password.', type: 'error' });
    }
  };

  // Handle Lead Status Update
  const handleUpdateStatus = async (id, newStatus) => {
    const res = await updateLeadStatus(id, newStatus);
    if (res?.success) {
      loadDashboardData(true);
    }
  };

  // Handle Lead Delete
  const handleDeleteLead = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead record?')) {
      const res = await deleteLead(id);
      if (res?.success) {
        loadDashboardData(true);
      }
    }
  };

  const isDark = themeMode === 'dark';

  // Loading Screen
  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDark ? 'dark bg-[#050816] text-slate-400' : 'light bg-slate-100 text-slate-600'}`}>
        <FaSync className="animate-spin text-2xl text-amber-400 mr-2" /> Connecting to Executive Command Center...
      </div>
    );
  }

  // Unauthenticated Login Screen
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${isDark ? 'dark bg-[#050816] text-slate-100' : 'light bg-slate-100 text-slate-900'}`}>
        <div className={`w-full max-w-md glass-card rounded-3xl p-8 shadow-2xl transition-colors duration-300 ${isDark ? 'border border-amber-500/30 shadow-amber-500/10' : 'border border-amber-500/40 shadow-slate-300 bg-white'}`}>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Executive Security Portal
            </span>

            <button
              onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800'
                  : 'bg-white border-slate-300 text-indigo-600 hover:bg-slate-50 shadow-sm'
              }`}
              title="Toggle Dark / Light Mode"
            >
              {isDark ? <FaSun className="text-amber-400" /> : <FaMoon className="text-indigo-600" />}
            </button>
          </div>

          <div className="text-center mb-6">
            <img src={logoImg} alt="Viral Vyapar Logo" className="w-16 h-16 object-contain mx-auto mb-3 rounded-2xl shadow-lg shadow-amber-500/20 bg-slate-900 p-1 border border-amber-500/30" />
            <h2 className={`font-heading font-extrabold text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Viral Vyapar Admin Portal
            </h2>
            <p className={`text-xs mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Standalone Password-Protected Control Panel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className={`block text-xs font-semibold uppercase ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Enter Admin Access Password
                </label>
                <button
                  type="button"
                  onClick={() => { setShowForgotPassword(true); setForgotStep('request'); setForgotMsg({ text: '', type: '' }); }}
                  className="text-xs font-bold text-amber-500 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <FaKey size={10} /> Forgot Password?
                </button>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-slate-500"><FaKey /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter admin password..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition font-medium ${
                    isDark ? 'bg-slate-900 border border-slate-700 text-white' : 'bg-white border border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-amber-500 cursor-pointer"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3.5 bg-red-500/15 border border-red-500/40 rounded-xl text-red-400 text-xs font-bold flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2">
                  <FaExclamationCircle className="text-red-400 text-base" />
                  <span>{loginError}</span>
                </div>
                <button type="button" onClick={() => setLoginError('')} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? <FaSync className="animate-spin text-slate-950" /> : <FaLock />}
              <span>{isLoggingIn ? 'Verifying Password...' : 'Unlock Admin Portal'}</span>
            </button>
          </form>

          {/* FORGOT PASSWORD 2FA OTP MODAL OVERLAY */}
          <ForgotPasswordModal
            isOpen={showForgotPassword}
            onClose={() => setShowForgotPassword(false)}
            forgotStep={forgotStep}
            setForgotStep={setForgotStep}
            forgotOtpInput={forgotOtpInput}
            setForgotOtpInput={setForgotOtpInput}
            forgotNewPassword={forgotNewPassword}
            setForgotNewPassword={setForgotNewPassword}
            forgotConfirmPassword={forgotConfirmPassword}
            setForgotConfirmPassword={setForgotConfirmPassword}
            forgotLoading={forgotLoading}
            forgotMsg={forgotMsg}
            onRequestOtp={handleForgotSendOtp}
            onVerifyAndReset={handleForgotVerifyAndReset}
            adminEmail={adminEmail}
            isDark={isDark}
          />
        </div>
      </div>
    );
  }

  // Authenticated Enterprise Admin Panel Workspace
  return (
    <div className={`min-h-screen font-body py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDark ? 'dark bg-[#050816] text-slate-100' : 'light bg-slate-100 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <Navbar
          themeMode={themeMode}
          setThemeMode={setThemeMode}
          liveSync={liveSync}
          setLiveSync={setLiveSync}
          lastRefreshedAt={lastRefreshedAt}
          loadingData={loadingData}
          loadDashboardData={loadDashboardData}
          onOpenSecurityModal={() => setShowSecurityModal(true)}
          onLogout={handleLogout}
          logoImg={logoImg}
          frontendUrl={FRONTEND_URL}
        />

        {/* Tab Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          leadsCount={leads.length}
          chatLogsCount={chatLogs.length}
          isDark={isDark}
        />

        {/* TAB 1: OVERVIEW & REALTIME ANALYTICS */}
        {activeTab === 'overview' && (
          <OverviewTab
            stats={stats}
            selectedTrafficDate={selectedTrafficDate}
            setSelectedTrafficDate={setSelectedTrafficDate}
            resetAdminTraffic={resetAdminTraffic}
            loadDashboardData={loadDashboardData}
            isDark={isDark}
          />
        )}

        {/* TAB 2: CAPTURED LEADS PIPELINE */}
        {activeTab === 'leads' && (
          <LeadsTab
            leads={leads}
            leadStatusFilter={leadStatusFilter}
            setLeadStatusFilter={setLeadStatusFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedDateFilter={selectedDateFilter}
            setSelectedDateFilter={setSelectedDateFilter}
            onViewLead={(lead) => setSelectedLeadModal(lead)}
            onUpdateStatus={handleUpdateStatus}
            onDeleteLead={handleDeleteLead}
            isDark={isDark}
          />
        )}

        {/* TAB 3: AI WHATSAPP INTELLIGENCE */}
        {activeTab === 'bot' && (
          <WhatsAppLogsTab
            chatLogs={chatLogs}
            botSearchQuery={botSearchQuery}
            setBotSearchQuery={setBotSearchQuery}
            botTopicFilter={botTopicFilter}
            setBotTopicFilter={setBotTopicFilter}
            botDateFilter={botDateFilter}
            setBotDateFilter={setBotDateFilter}
            getTopicCategory={getTopicCategory}
            isDark={isDark}
          />
        )}

        {/* SECURITY & PASSWORD 2FA OTP MODAL */}
        <SecurityModal
          isOpen={showSecurityModal}
          onClose={() => setShowSecurityModal(false)}
          currPassword={currPassword}
          setCurrPassword={setCurrPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          otpInput={otpInput}
          setOtpInput={setOtpInput}
          otpSent={otpSent}
          sendingOtp={sendingOtp}
          pwdMessage={pwdMessage}
          onRequestOtp={handleRequestOtp}
          onVerifyAndChangePassword={handleVerifyAndChangePassword}
          adminEmail={adminEmail}
          isDark={isDark}
        />

        {/* LEAD DETAIL MODAL */}
        <LeadDetailModal
          lead={selectedLeadModal}
          onClose={() => setSelectedLeadModal(null)}
          isDark={isDark}
        />
      </div>
    </div>
  );
}

export default App;
