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
  updateLeadStatus, deleteLead, fetchChatLogs, requestAdminOtp, verifyOtpChangePassword, forgotPasswordSendOtp, forgotPasswordVerify, resetAdminTraffic
} from './api';

const logoImg = 'logo.png';
const FRONTEND_URL = window.location.hostname === 'localhost' ? 'http://localhost:5173/' : '/';

function App() {
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('vv_admin_theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('vv_admin_theme', themeMode);
  }, [themeMode]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Forgot Password State (Login Screen 2FA OTP)
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState('request'); // 'request' | 'verify'
  const [forgotOtpInput, setForgotOtpInput] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState({ text: '', type: '' });

  const [activeTab, setActiveTab] = useState('overview');

  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [chatLogs, setChatLogs] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const [leadStatusFilter, setLeadStatusFilter] = useState('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeadModal, setSelectedLeadModal] = useState(null);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

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
  const [dispatchedOtp, setDispatchedOtp] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [pwdMessage, setPwdMessage] = useState({ text: '', type: '' });

  const [showPassword, setShowPassword] = useState(false);
  const [selectedTrafficDate, setSelectedTrafficDate] = useState('');
  const [liveSync, setLiveSync] = useState(true);
  const [lastRefreshedAt, setLastRefreshedAt] = useState('');

  // JWT Session Token Authentication on Mount
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

  // Live auto-polling every 4 seconds when authenticated
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

  const [isLoggingIn, setIsLoggingIn] = useState(false);

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

  const handleLogout = () => {
    sessionStorage.removeItem('vv_admin_token');
    localStorage.removeItem('vv_admin_token');
    setIsAuthenticated(false);
  };

  const handleSearchLeads = async (e) => {
    e.preventDefault();
    setLoadingData(true);
    const res = await fetchAdminLeads(leadStatusFilter, searchQuery, selectedDateFilter);
    if (res?.leads) setLeads(res.leads);
    setLoadingData(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    const res = await updateLeadStatus(id, newStatus);
    if (res?.success) {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
      if (selectedLeadModal?.id === id) {
        setSelectedLeadModal((prev) => ({ ...prev, status: newStatus }));
      }
    }
  };

  const handleDeleteLead = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead record?')) {
      const res = await deleteLead(id);
      if (res?.success) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        if (selectedLeadModal?.id === id) setSelectedLeadModal(null);
      }
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return alert('No leads to export');

    const headers = ['Date', 'Full Name', 'Phone', 'Email', 'Business Name', 'Business Sector', 'Goal', 'Budget', 'Status', 'Source'];
    const csvRows = [headers.join(',')];

    leads.forEach((l) => {
      const row = [
        `"${new Date(l.createdAt).toLocaleDateString()}"`,
        `"${l.fullName}"`,
        `"${l.phone}"`,
        `"${l.email}"`,
        `"${l.businessName}"`,
        `"${l.businessType}"`,
        `"${l.goal}"`,
        `"${l.budget}"`,
        `"${l.status}"`,
        `"${l.source}"`
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ViralVyapar_Leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const [passResetMode, setPassResetMode] = useState('direct'); // 'direct' or 'otp'

  const handleForgotSendOtp = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMsg({ text: '', type: '' });

    const res = await forgotPasswordSendOtp();
    setForgotLoading(false);
    if (res?.success) {
      setForgotStep('verify');
      setForgotMsg({ text: `6-Digit Verification OTP sent to ${res.email}`, type: 'success' });
    } else {
      setForgotMsg({ text: res?.error || 'Failed to send OTP to registered email', type: 'error' });
    }
  };

  const handleForgotVerify = async (e) => {
    e.preventDefault();
    setForgotMsg({ text: '', type: '' });

    if (!forgotOtpInput) {
      return setForgotMsg({ text: 'Please enter the 6-Digit OTP received on email', type: 'error' });
    }
    if (forgotNewPassword.length < 6) {
      return setForgotMsg({ text: 'New password must be at least 6 characters', type: 'error' });
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      return setForgotMsg({ text: 'New Password and Confirm Password do not match!', type: 'error' });
    }

    setForgotLoading(true);
    const res = await forgotPasswordVerify(forgotOtpInput, forgotNewPassword);
    setForgotLoading(false);

    if (res?.success) {
      setForgotMsg({ text: 'Password reset successfully! Log in with your new password.', type: 'success' });
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotStep('request');
        setForgotOtpInput('');
        setForgotNewPassword('');
        setForgotConfirmPassword('');
        setForgotMsg({ text: '', type: '' });
      }, 2500);
    } else {
      setForgotMsg({ text: res?.error || 'Failed to reset password', type: 'error' });
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setPwdMessage({ text: '', type: '' });

    if (!currPassword) {
      return setPwdMessage({ text: 'Please enter your Current Password', type: 'error' });
    }
    if (!newPassword || !confirmPassword) {
      return setPwdMessage({ text: 'Please fill in both New Password and Confirm Password fields', type: 'error' });
    }
    if (newPassword !== confirmPassword) {
      return setPwdMessage({ text: 'New Password and Confirm Password do not match!', type: 'error' });
    }

    setSendingOtp(true);
    const res = await requestAdminOtp(currPassword);
    setSendingOtp(false);

    if (res?.success) {
      setOtpSent(true);
      setPwdMessage({ text: `6-Digit OTP sent to ${adminEmail}. Please check your email inbox.`, type: 'success' });
    } else {
      setPwdMessage({ text: res?.error || 'Failed to send OTP', type: 'error' });
    }
  };

  const handleVerifyAndChangePassword = async (e) => {
    e.preventDefault();
    setPwdMessage({ text: '', type: '' });

    if (!otpInput) {
      return setPwdMessage({ text: 'Please enter the 6-Digit OTP received on email', type: 'error' });
    }

    const res = await verifyOtpChangePassword(currPassword, otpInput, newPassword);
    if (res?.success) {
      setPwdMessage({ text: 'Password updated successfully! Log in with your new password.', type: 'success' });
      setCurrPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setOtpInput('');
      setOtpSent(false);
    } else {
      setPwdMessage({ text: res?.error || 'Invalid OTP code. Please try again.', type: 'error' });
    }
  };

  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${themeMode === 'dark' ? 'dark bg-[#050816] text-slate-400' : 'light bg-slate-100 text-slate-600'}`}>
        <FaSync className="animate-spin text-2xl text-amber-400 mr-2" /> Connecting to Executive Command Center...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${themeMode === 'dark' ? 'dark bg-[#050816] text-slate-100' : 'light bg-slate-100 text-slate-900'}`}>
        <div className={`w-full max-w-md glass-card rounded-3xl p-8 shadow-2xl transition-colors duration-300 ${themeMode === 'dark' ? 'border border-amber-500/30 shadow-amber-500/10' : 'border border-amber-500/40 shadow-slate-300'}`}>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Executive Security Portal
            </span>

            <button
              onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                themeMode === 'dark'
                  ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800'
                  : 'bg-white border-slate-300 text-indigo-600 hover:bg-slate-50 shadow-sm'
              }`}
              title="Toggle Dark / Light Mode"
            >
              {themeMode === 'dark' ? <FaSun className="text-amber-400" /> : <FaMoon className="text-indigo-600" />}
            </button>
          </div>

          <div className="text-center mb-6">
            <img src={logoImg} alt="Viral Vyapar Logo" className="w-16 h-16 object-contain mx-auto mb-3 rounded-2xl shadow-lg shadow-amber-500/20 bg-slate-900 p-1 border border-amber-500/30" />
            <h2 className={`font-heading font-extrabold text-2xl ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Viral Vyapar Admin Portal
            </h2>
            <p className={`text-xs mt-1 font-medium ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Standalone Password-Protected Control Panel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className={`block text-xs font-semibold uppercase ${themeMode === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
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
                    themeMode === 'dark' ? 'bg-slate-900 border border-slate-700 text-white' : 'bg-white border border-slate-300 text-slate-900'
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
          {showForgotPassword && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
              <div className={`relative w-full max-w-md glass-card rounded-3xl p-6 border shadow-2xl space-y-4 ${themeMode === 'dark' ? 'border-amber-500/30 text-white' : 'bg-white border-amber-500/40 text-slate-900'}`}>
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className={`absolute top-4 right-4 p-1.5 rounded-xl cursor-pointer ${themeMode === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  ✕
                </button>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-2xl text-xl">
                    <FaKey />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-lg">Admin Password Recovery</h3>
                    <p className="text-xs text-slate-400">2FA Email OTP Verification Required</p>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Registered Security Email</span>
                  <span className="font-bold text-amber-500">choudharyabhishek1503@gmail.com</span>
                </div>

                {forgotStep === 'request' ? (
                  <form onSubmit={handleForgotSendOtp} className="space-y-4 pt-1">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Click below to send a 6-digit security code to your registered email to set up a new password.
                    </p>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {forgotLoading ? <FaSync className="animate-spin" /> : <FaPaperPlane />}
                      <span>Send 6-Digit OTP to Email</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleForgotVerify} className="space-y-3.5 pt-1">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Enter 6-Digit Email OTP *</label>
                      <input
                        type="text"
                        required
                        maxLength="6"
                        placeholder="Enter 6-digit OTP code..."
                        value={forgotOtpInput}
                        onChange={(e) => setForgotOtpInput(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl text-center font-mono tracking-widest text-amber-500 font-extrabold text-base focus:outline-none focus:border-amber-500 ${themeMode === 'dark' ? 'bg-slate-900 border border-slate-700' : 'bg-slate-50 border border-slate-300'}`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">New Admin Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="Enter new admin password..."
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-amber-500 ${themeMode === 'dark' ? 'bg-slate-900 border border-slate-700 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'}`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">Confirm New Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="Confirm new admin password..."
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-amber-500 ${themeMode === 'dark' ? 'bg-slate-900 border border-slate-700 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'}`}
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {forgotLoading ? <FaSync className="animate-spin" /> : <FaShieldAlt />}
                        <span>Verify & Reset Password</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setForgotStep('request')}
                        className={`px-3 py-3 font-semibold rounded-xl text-xs border ${themeMode === 'dark' ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-200 text-slate-800 border-slate-300'}`}
                      >
                        Resend OTP
                      </button>
                    </div>
                  </form>
                )}

                {forgotMsg.text && (
                  <div className={`p-3 rounded-xl text-xs font-bold ${forgotMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}>
                    {forgotMsg.text}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const isDark = themeMode === 'dark';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const cardBorder = isDark ? 'border-slate-800' : 'border-slate-200 shadow-sm';
  const itemBg = isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100/90 border-slate-200';
  const inputStyle = isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-sm';

  return (
    <div className={`min-h-screen font-body py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDark ? 'dark bg-[#050816] text-slate-100' : 'light bg-slate-100 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl transition-colors duration-300 ${cardBorder}`}>
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Viral Vyapar Logo" className="w-10 h-10 object-contain rounded-xl shadow-md border border-amber-500/30 bg-slate-900 p-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${liveSync ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
                <h1 className={`font-heading font-extrabold text-2xl ${textPrimary}`}>
                  Viral Vyapar Executive Command Center
                </h1>
              </div>
              <p className={`text-xs mt-0.5 flex items-center gap-2 ${textSecondary}`}>
                <span>Realtime Traffic Tracker & Lead Pipeline</span>
                {lastRefreshedAt && <span className="text-amber-500 font-mono text-[11px] font-bold">(Updated: {lastRefreshedAt})</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800'
                  : 'bg-white border-slate-300 text-indigo-600 hover:bg-slate-50 shadow-sm'
              }`}
              title="Toggle Theme Mode (Dark / Light)"
            >
              {isDark ? <FaSun className="text-amber-400 text-sm" /> : <FaMoon className="text-indigo-600 text-sm" />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            {/* Live Auto-Poll Toggle */}
            <button
              onClick={() => setLiveSync(!liveSync)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                liveSync
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : isDark ? 'bg-slate-900 text-slate-400 border-slate-700' : 'bg-white text-slate-600 border-slate-300 shadow-sm'
              }`}
              title="Toggle 4-Second Realtime Auto Sync"
            >
              <span className={`w-2 h-2 rounded-full ${liveSync ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
              {liveSync ? 'Live Sync: ON' : 'Live Sync: OFF'}
            </button>

            <a
              href={FRONTEND_URL}
              target="_blank"
              rel="noreferrer"
              className={`px-3.5 py-2 border rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-sm'
              }`}
            >
              <FaExternalLinkAlt size={11} /> Open Site
            </a>

            <button
              onClick={() => setShowSecurityModal(true)}
              className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm cursor-pointer"
              title="Change Password & Security"
            >
              <FaShieldAlt /> Security
            </button>
            
            <button
              onClick={() => loadDashboardData()}
              className={`px-3.5 py-2 border rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-sm'
              }`}
              title="Refresh Data Now"
            >
              <FaSync className={loadingData ? 'animate-spin text-amber-500' : ''} /> Sync
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`flex flex-wrap gap-2 border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-300'}`}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : isDark ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-300 shadow-sm'
            }`}
          >
            <FaChartLine /> Overview & Traffic Analytics
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'leads'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : isDark ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-300 shadow-sm'
            }`}
          >
            <FaUsers /> Lead Submissions ({leads.length})
          </button>

          <button
            onClick={() => setActiveTab('bot')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'bot'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : isDark ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-300 shadow-sm'
            }`}
          >
            <FaRobot /> AI WhatsApp Intelligence
          </button>
        </div>

        {/* TAB 1: OVERVIEW & TRAFFIC ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Calendar Date Filter for Traffic */}
            <div className={`glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 ${cardBorder}`}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-xl">
                  <FaCalendarAlt />
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${textPrimary}`}>Filter Traffic By Date / Calendar</h4>
                  <p className={`text-[11px] ${textSecondary}`}>View real-time page visits, device breakdown & activity logged on any specific date</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                <input
                  type="date"
                  value={selectedTrafficDate}
                  onClick={(e) => e.target.showPicker?.()}
                  onChange={(e) => setSelectedTrafficDate(e.target.value)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono focus:outline-none focus:border-amber-500 cursor-pointer ${inputStyle}`}
                  title="Click to select date from interactive calendar"
                />
                {selectedTrafficDate && (
                  <button
                    onClick={() => setSelectedTrafficDate('')}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-xl cursor-pointer border ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'}`}
                  >
                    Clear Filter
                  </button>
                )}
                <button
                  onClick={async () => {
                    if (window.confirm('Reset all traffic analytics logs to 0 for fresh testing?')) {
                      await resetAdminTraffic();
                      loadDashboardData();
                    }
                  }}
                  className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  title="Reset All Traffic Data to 0"
                >
                  <FaTrash size={11} /> Reset to 0
                </button>
              </div>
            </div>

            {selectedTrafficDate && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-center justify-between animate-fadeIn">
                <span className="text-amber-500 font-bold">
                  📅 Selected Date Traffic ({selectedTrafficDate}): <b>{stats?.selectedDateTraffic || 0} page views</b>
                </span>
                <button onClick={() => setSelectedTrafficDate('')} className={`underline cursor-pointer font-bold ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'}`}>Show Today</button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`glass-card rounded-3xl p-6 ${cardBorder}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold uppercase ${textSecondary}`}>
                    {selectedTrafficDate ? `Traffic on ${selectedTrafficDate}` : "Today's Traffic"}
                  </span>
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl"><FaEye /></div>
                </div>
                <p className={`font-heading font-extrabold text-3xl ${textPrimary}`}>
                  {selectedTrafficDate ? (stats?.selectedDateTraffic || 0) : (stats?.todayTraffic || 0)}
                </p>
                <span className="text-[10px] text-emerald-500 flex items-center gap-1 mt-1 font-semibold">
                  {selectedTrafficDate ? `● Page views on ${selectedTrafficDate}` : "● Live site page views today"}
                </span>
              </div>

              <div className={`glass-card rounded-3xl p-6 ${cardBorder}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold uppercase ${textSecondary}`}>Total All-Time Views</span>
                  <div className="p-2 bg-violet-500/10 text-violet-500 rounded-xl"><FaChartLine /></div>
                </div>
                <p className={`font-heading font-extrabold text-3xl ${textPrimary}`}>{stats?.totalTraffic || 0}</p>
                <span className={`text-[10px] ${textSecondary} mt-1 block font-semibold`}>Logged by real-time backend tracker</span>
              </div>

              <div className={`glass-card rounded-3xl p-6 ${cardBorder}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold uppercase ${textSecondary}`}>Total Form Leads</span>
                  <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl"><FaUsers /></div>
                </div>
                <p className="font-heading font-extrabold text-3xl text-amber-500">{stats?.totalLeads || 0}</p>
                <span className="text-[10px] text-amber-500 flex items-center gap-1 mt-1 font-semibold">
                  {stats?.todayLeads || 0} leads received today
                </span>
              </div>

              <div className={`glass-card rounded-3xl p-6 ${cardBorder}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold uppercase ${textSecondary}`}>Conversion Rate</span>
                  <div className="p-2 bg-orange-500/10 text-orange-500 rounded-xl"><FaCheckCircle /></div>
                </div>
                <p className="font-heading font-extrabold text-3xl text-emerald-500">{stats?.conversionRate || 0}%</p>
                <span className={`text-[10px] ${textSecondary} mt-1 block font-semibold`}>Converted leads vs total</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`glass-card rounded-3xl p-6 space-y-4 ${cardBorder}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`font-heading font-bold text-lg ${textPrimary}`}>
                    {selectedTrafficDate ? `Top Visited Pages (${selectedTrafficDate})` : 'Top Visited Pages'}
                  </h3>
                </div>
                <div className="space-y-3">
                  {stats?.topPages?.map((page, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-3 rounded-xl text-xs ${itemBg}`}>
                      <span className={`font-mono font-bold ${textPrimary}`}>{page.path}</span>
                      <span className="font-heading font-bold text-amber-500">{page.count} visits</span>
                    </div>
                  )) || <p className={`text-xs ${textSecondary}`}>No page views recorded yet</p>}
                </div>
              </div>

              <div className={`glass-card rounded-3xl p-6 space-y-4 ${cardBorder}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`font-heading font-bold text-lg ${textPrimary}`}>
                    {selectedTrafficDate ? `Device Breakdown (${selectedTrafficDate})` : 'Device Breakdown'}
                  </h3>
                  <span className={`text-xs font-mono font-semibold ${textSecondary}`}>
                    Total Visits: {stats?.activeTrafficTotal || 0}
                  </span>
                </div>

                <div className="space-y-5 pt-1">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className={`flex items-center gap-1.5 font-semibold ${textPrimary}`}>
                        <FaMobileAlt className="text-emerald-500" /> Mobile Visitors
                      </span>
                      <span className={`font-mono font-bold ${textPrimary}`}>
                        {stats?.deviceCounts?.Mobile || 0} ({(stats?.activeTrafficTotal || 0) > 0 ? Math.round(((stats?.deviceCounts?.Mobile || 0) / stats.activeTrafficTotal) * 100) : 0}%)
                      </span>
                    </div>
                    <div className={`w-full h-3 rounded-full overflow-hidden border p-0.5 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-200 border-slate-300'}`}>
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${(stats?.activeTrafficTotal || 0) > 0 ? ((stats?.deviceCounts?.Mobile || 0) / stats.activeTrafficTotal) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className={`flex items-center gap-1.5 font-semibold ${textPrimary}`}>
                        <FaDesktop className="text-violet-500" /> Desktop Visitors
                      </span>
                      <span className={`font-mono font-bold ${textPrimary}`}>
                        {stats?.deviceCounts?.Desktop || 0} ({(stats?.activeTrafficTotal || 0) > 0 ? Math.round(((stats?.deviceCounts?.Desktop || 0) / stats.activeTrafficTotal) * 100) : 0}%)
                      </span>
                    </div>
                    <div className={`w-full h-3 rounded-full overflow-hidden border p-0.5 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-200 border-slate-300'}`}>
                      <div
                        className="bg-gradient-to-r from-violet-500 to-purple-400 h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${(stats?.activeTrafficTotal || 0) > 0 ? ((stats?.deviceCounts?.Desktop || 0) / stats.activeTrafficTotal) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Traffic Calendar History Table */}
            <div className={`glass-card rounded-3xl p-6 space-y-4 ${cardBorder}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaHistory className="text-amber-500 text-lg" />
                  <h3 className={`font-heading font-bold text-lg ${textPrimary}`}>Daily Traffic History (Saved Calendar Logs)</h3>
                </div>
                <span className={`text-xs font-mono ${textSecondary}`}>
                  {stats?.dailyHistory?.length || 0} Days Saved
                </span>
              </div>

              {stats?.dailyHistory?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className={`w-full text-left text-xs ${textSecondary}`}>
                    <thead className={`uppercase font-mono text-[10px] border-b ${isDark ? 'bg-slate-900/90 text-slate-400 border-slate-800' : 'bg-slate-200/90 text-slate-700 border-slate-300'}`}>
                      <tr>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Total Page Views</th>
                        <th className="py-3 px-4">Mobile Visits</th>
                        <th className="py-3 px-4">Desktop Visits</th>
                        <th className="py-3 px-4 text-right">Traffic Share</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
                      {stats.dailyHistory.map((row, idx) => {
                        const todayStr = new Date().toISOString().split('T')[0];
                        const isToday = row.date === todayStr;
                        const share = stats.totalTraffic > 0 ? ((row.count / stats.totalTraffic) * 100).toFixed(1) : '0';
                        return (
                          <tr key={idx} className={`transition ${isDark ? 'hover:bg-slate-900/50' : 'hover:bg-slate-100'}`}>
                            <td className={`py-3 px-4 font-mono font-bold flex items-center gap-2 ${textPrimary}`}>
                              {row.date}
                              {isToday && (
                                <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] px-2 py-0.5 rounded-full font-sans font-extrabold">Today</span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-bold text-amber-500">{row.count} views</td>
                            <td className={`py-3 px-4 ${textSecondary}`}>{row.mobile} ({row.count > 0 ? Math.round((row.mobile/row.count)*100) : 0}%)</td>
                            <td className={`py-3 px-4 ${textSecondary}`}>{row.desktop} ({row.count > 0 ? Math.round((row.desktop/row.count)*100) : 0}%)</td>
                            <td className={`py-3 px-4 text-right font-mono ${textSecondary}`}>{share}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={`py-8 text-center text-xs ${textSecondary}`}>
                  No historical traffic data recorded yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: LEADS & SUBMISSIONS */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className={`flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 glass-card p-4 rounded-2xl ${cardBorder}`}>
              <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {['All', 'New', 'Contacted', 'Converted'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setLeadStatusFilter(st)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      leadStatusFilter === st
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : isDark ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-300 shadow-sm'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Calendar Date Picker Filter */}
                <div className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`}>
                  <FaCalendarAlt className="text-amber-500" />
                  <span className={`text-[11px] font-semibold hidden sm:inline ${textSecondary}`}>Date:</span>
                  <input
                    type="date"
                    value={selectedDateFilter}
                    onClick={(e) => e.target.showPicker?.()}
                    onChange={(e) => setSelectedDateFilter(e.target.value)}
                    className={`bg-transparent font-mono text-xs focus:outline-none cursor-pointer ${textPrimary}`}
                    title="Click to select date from interactive calendar"
                  />
                  {selectedDateFilter && (
                    <button
                      onClick={() => setSelectedDateFilter('')}
                      className="text-slate-400 hover:text-amber-500 font-bold text-xs ml-1"
                      title="Clear Date Filter"
                    >
                      ✕ Clear
                    </button>
                  )}
                </div>

                <form onSubmit={handleSearchLeads} className="relative flex-1 min-w-[180px] md:w-56">
                  <input
                    type="text"
                    placeholder="Search name/email/phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none focus:border-amber-500 ${inputStyle}`}
                  />
                  <FaSearch className="absolute left-3 top-2.5 text-slate-400 text-xs" />
                </form>

                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FaDownload /> Export CSV
                </button>
              </div>
            </div>

            <div className={`glass-card rounded-3xl overflow-hidden ${cardBorder}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`font-semibold border-b uppercase tracking-wider ${isDark ? 'bg-slate-900/90 text-slate-400 border-slate-800' : 'bg-slate-200/90 text-slate-700 border-slate-300'}`}>
                    <tr>
                      <th className="p-4">Date & Time</th>
                      <th className="p-4">Lead / Visitor Email</th>
                      <th className="p-4">Total Visits</th>
                      <th className="p-4">Phone / WhatsApp</th>
                      <th className="p-4">Business / Goal</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800/60 text-slate-300' : 'divide-slate-200 text-slate-800'}`}>
                    {leads.map((l) => (
                      <tr key={l.id} className={`transition ${isDark ? 'hover:bg-slate-900/50' : 'hover:bg-slate-100'}`}>
                        <td className={`p-4 ${textSecondary}`}>
                          <div>{new Date(l.lastVisitedAt || l.createdAt).toLocaleDateString()}</div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(l.lastVisitedAt || l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td className={`p-4 font-bold ${textPrimary}`}>
                          <div className="flex items-center gap-2">
                            <span>{l.fullName}</span>
                            {l.source?.includes('Lead Magnet') && (
                              <span className="inline-flex items-center gap-1 text-[9px] bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-500 border border-orange-500/40 px-2 py-0.5 rounded-full font-bold">
                                🎯 Instant Email
                              </span>
                            )}
                          </div>
                          {l.email && l.email !== 'N/A' ? (
                            <a
                              href={`mailto:${l.email}?subject=Viral Vyapar - Special Offer & Free Growth Blueprint`}
                              className="text-[11px] text-amber-500 hover:underline font-normal inline-flex items-center gap-1 mt-0.5"
                              title="Click to Send Instant Email"
                            >
                              <FaEnvelope size={10} /> {l.email}
                            </a>
                          ) : (
                            <span className="block text-[10px] text-slate-500 font-normal">{l.email}</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold w-fit ${
                              (l.visitCount || 1) > 1
                                ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40 shadow-sm shadow-amber-500/20'
                                : isDark ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-slate-200 text-slate-800 border border-slate-300'
                            }`}>
                              🔥 {l.visitCount || 1} {(l.visitCount || 1) > 1 ? 'Visits' : 'Visit'}
                            </span>
                            {(l.visitCount || 1) > 1 && (
                              <span className="text-[9px] text-amber-500/90 font-medium mt-0.5">Repeat Visitor</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-mono">
                          {l.phone && l.phone !== 'N/A' ? (
                            <a
                              href={`https://wa.me/${l.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-500 hover:underline flex items-center gap-1 font-bold"
                            >
                              <FaWhatsapp /> {l.phone}
                            </a>
                          ) : (
                            <span className="text-slate-500">N/A</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`font-semibold ${textPrimary}`}>{l.businessName}</span>
                          <span className={`block text-[10px] ${textSecondary}`}>{l.goal || l.businessType}</span>
                        </td>
                        <td className="p-4">
                          <select
                            value={l.status}
                            onChange={(e) => handleStatusChange(l.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border focus:outline-none cursor-pointer ${
                              l.status === 'Converted'
                                ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30'
                                : l.status === 'Contacted'
                                ? 'bg-violet-500/20 text-violet-500 border-violet-500/30'
                                : 'bg-amber-500/20 text-amber-500 border-amber-500/30'
                            }`}
                          >
                            <option value="New" className={isDark ? "bg-slate-900 text-amber-400" : "bg-white text-amber-600"}>New</option>
                            <option value="Contacted" className={isDark ? "bg-slate-900 text-violet-400" : "bg-white text-violet-600"}>Contacted</option>
                            <option value="Converted" className={isDark ? "bg-slate-900 text-emerald-400" : "bg-white text-emerald-600"}>Converted</option>
                          </select>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedLeadModal(l)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer ${
                              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-200 hover:bg-slate-300 text-slate-900 border-slate-300 shadow-sm'
                            }`}
                          >
                            View History
                          </button>
                          <button
                            onClick={() => handleDeleteLead(l.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition cursor-pointer"
                            title="Delete Lead"
                          >
                            <FaTrash size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {leads.length === 0 && (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-slate-500">
                          {selectedDateFilter
                            ? `No visitor emails or leads found on ${selectedDateFilter}.`
                            : 'No real visitor emails captured yet. Visit the website to test live capture!'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AI WHATSAPP LOGS INTELLIGENCE CENTER */}
        {activeTab === 'bot' && (
          <div className="space-y-6">
            
            {/* Header & Quick Stats */}
            <div className={`glass-card rounded-3xl p-6 space-y-6 ${cardBorder}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold mb-2">
                    <FaRobot /> VyaparAI Intelligence Center
                  </div>
                  <h3 className={`font-heading font-extrabold text-2xl ${textPrimary}`}>
                    Formalized Visitor Questions & AI Logs
                  </h3>
                  <p className={`text-xs mt-1 ${textSecondary}`}>
                    Track, search, and analyze real-time visitor inquiries to identify hot leads & common questions.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadDashboardData}
                    className={`px-4 py-2 border rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                      isDark
                        ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                        : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-sm'
                    }`}
                  >
                    <FaSync className={loadingData ? 'animate-spin text-emerald-500' : ''} /> Refresh Logs
                  </button>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className={`p-4 rounded-2xl ${itemBg}`}>
                  <span className={`text-[10px] uppercase font-bold ${textSecondary}`}>Total Conversations</span>
                  <p className={`font-heading font-extrabold text-2xl mt-1 ${textPrimary}`}>{chatLogs.length}</p>
                </div>
                <div className={`p-4 rounded-2xl ${itemBg}`}>
                  <span className={`text-[10px] uppercase font-bold ${textSecondary}`}>Today's Questions</span>
                  <p className="font-heading font-extrabold text-2xl text-emerald-500 mt-1">
                    {chatLogs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl ${itemBg}`}>
                  <span className={`text-[10px] uppercase font-bold ${textSecondary}`}>Pricing Inquiries</span>
                  <p className="font-heading font-extrabold text-2xl text-amber-500 mt-1">
                    {chatLogs.filter(l => getTopicCategory(l.userQuery).name.includes('Pricing')).length}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl ${itemBg}`}>
                  <span className={`text-[10px] uppercase font-bold ${textSecondary}`}>Free Audit Requests</span>
                  <p className="font-heading font-extrabold text-2xl text-cyan-500 mt-1">
                    {chatLogs.filter(l => getTopicCategory(l.userQuery).name.includes('Audit')).length}
                  </p>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className={`pt-4 border-t space-y-3 ${isDark ? 'border-slate-800' : 'border-slate-300'}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  {/* Search Query */}
                  <div className="relative">
                    <FaSearch className="absolute left-3.5 top-3 text-slate-400 text-xs" />
                    <input
                      type="text"
                      placeholder="Search visitor questions..."
                      value={botSearchQuery}
                      onChange={(e) => setBotSearchQuery(e.target.value)}
                      className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-emerald-500 ${inputStyle}`}
                    />
                  </div>

                  {/* Topic Filter */}
                  <select
                    value={botTopicFilter}
                    onChange={(e) => setBotTopicFilter(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-emerald-500 cursor-pointer ${inputStyle}`}
                  >
                    <option value="All" className={isDark ? "bg-slate-900" : "bg-white"}>All Topics</option>
                    <option value="Pricing & Packages" className={isDark ? "bg-slate-900 text-amber-400" : "bg-white text-amber-600"}>💰 Pricing & Packages</option>
                    <option value="Reels & Video Marketing" className={isDark ? "bg-slate-900 text-orange-400" : "bg-white text-orange-600"}>📹 Reels & Video Marketing</option>
                    <option value="Performance Ads & ROAS" className={isDark ? "bg-slate-900 text-violet-400" : "bg-white text-violet-600"}>📈 Performance Ads & ROAS</option>
                    <option value="Local SEO & Maps" className={isDark ? "bg-slate-900 text-emerald-400" : "bg-white text-emerald-600"}>📍 Local SEO & Maps</option>
                    <option value="Free Audit & Strategy" className={isDark ? "bg-slate-900 text-cyan-400" : "bg-white text-cyan-600"}>⚡ Free Audit & Strategy</option>
                  </select>

                  {/* Date Filter */}
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={botDateFilter}
                      onClick={(e) => e.target.showPicker?.()}
                      onChange={(e) => setBotDateFilter(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-emerald-500 cursor-pointer ${inputStyle}`}
                      title="Click to select date from interactive calendar"
                    />
                    {botDateFilter && (
                      <button
                        onClick={() => setBotDateFilter('')}
                        className={`px-2 py-2 border rounded-xl text-xs cursor-pointer ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white border-slate-700' : 'bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-300'}`}
                        title="Clear Date"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                </div>
              </div>

            </div>

            {/* Formalized Log Cards */}
            <div className="space-y-3">
              {chatLogs
                .filter((log) => {
                  const matchesSearch = !botSearchQuery ||
                    log.userQuery?.toLowerCase().includes(botSearchQuery.toLowerCase()) ||
                    log.aiReply?.toLowerCase().includes(botSearchQuery.toLowerCase()) ||
                    log.session?.toLowerCase().includes(botSearchQuery.toLowerCase());

                  const category = getTopicCategory(log.userQuery);
                  const matchesTopic = botTopicFilter === 'All' || category.name === botTopicFilter;

                  const matchesDate = !botDateFilter ||
                    new Date(log.timestamp).toISOString().split('T')[0] === botDateFilter;

                  return matchesSearch && matchesTopic && matchesDate;
                })
                .map((log) => {
                  const topic = getTopicCategory(log.userQuery);
                  return (
                    <div
                      key={log.id || log._id}
                      className={`glass-card rounded-2xl p-5 space-y-3 transition ${cardBorder}`}
                    >
                      {/* Top Meta Bar */}
                      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${topic.badge}`}>
                            {topic.icon} {topic.name}
                          </span>
                          <span className={`text-[10px] font-mono ${textSecondary}`}>
                            Session: {log.session}
                          </span>
                        </div>
                        <span className={`text-[11px] font-medium ${textSecondary}`}>
                          {new Date(log.timestamp).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </span>
                      </div>

                      {/* Conversation Content */}
                      <div className="space-y-2 text-xs">
                        {/* Visitor Query Bubble */}
                        <div className={`p-3 rounded-xl flex items-start gap-2.5 border ${itemBg}`}>
                          <span className="p-1.5 bg-violet-500/10 text-violet-500 rounded-lg font-bold text-[10px] flex-shrink-0">
                            VISITOR
                          </span>
                          <p className={`font-semibold leading-relaxed flex-1 ${textPrimary}`}>
                            "{log.userQuery}"
                          </p>
                        </div>

                        {/* AI Reply Bubble */}
                        <div className={`p-3 rounded-xl flex items-start gap-2.5 border ${isDark ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-emerald-50/80 border-emerald-500/30'}`}>
                          <span className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg font-bold text-[10px] flex-shrink-0">
                            VYAPAR AI
                          </span>
                          <p className={`leading-relaxed flex-1 ${isDark ? 'text-slate-300' : 'text-slate-800 font-medium'}`}>
                            {log.aiReply}
                          </p>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-2 flex justify-end gap-2">
                        <a
                          href={`https://wa.me/919667065637?text=${encodeURIComponent(`Hi! Regarding visitor question: "${log.userQuery}"`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 rounded-lg text-[11px] font-bold inline-flex items-center gap-1.5 transition"
                        >
                          <FaWhatsapp /> Follow Up on WhatsApp (+91 96670 65637)
                        </a>
                      </div>
                    </div>
                  );
                })}

              {chatLogs.length === 0 && (
                <div className={`glass-card rounded-3xl p-12 text-center ${cardBorder}`}>
                  <FaRobot size={36} className={`mx-auto mb-3 ${textSecondary}`} />
                  <p className={`text-sm font-semibold ${textPrimary}`}>No AI conversation logs recorded yet.</p>
                  <p className={`text-xs mt-1 ${textSecondary}`}>Open the website to test live VyaparAI chat!</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ADMIN SECURITY MODAL OVERLAY */}
        {showSecurityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
            <div className={`relative w-full max-w-lg glass-card rounded-3xl p-8 border shadow-2xl max-h-[92vh] overflow-y-auto ${isDark ? 'border-amber-500/30 shadow-amber-500/10' : 'bg-white border-amber-500/40 text-slate-900 shadow-2xl'}`}>
              <button
                onClick={() => setShowSecurityModal(false)}
                className={`absolute top-5 right-5 p-2 rounded-xl transition cursor-pointer ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-2xl text-xl">
                  <FaShieldAlt />
                </div>
                <div>
                  <h3 className={`font-heading font-extrabold text-xl ${textPrimary}`}>Admin Security & Password Settings</h3>
                  <p className={`text-xs ${textSecondary}`}>Strict 2FA Email Verification Required to Update Password</p>
                </div>
              </div>

              <div className={`border rounded-2xl p-4 mb-4 flex items-center justify-between ${itemBg}`}>
                <div>
                  <span className={`text-[10px] uppercase font-bold block ${textSecondary}`}>Registered Security Email</span>
                  <span className="text-sm font-bold text-amber-500">{adminEmail}</span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <FaCheck /> 2FA Active
                </span>
              </div>

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${textSecondary}`}>Current Admin Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Enter current password..."
                      value={currPassword}
                      onChange={(e) => setCurrPassword(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-amber-500 ${inputStyle}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${textSecondary}`}>New Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Enter new password..."
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-amber-500 ${inputStyle}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${textSecondary}`}>Confirm New Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Re-enter new password..."
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-amber-500 ${inputStyle}`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sendingOtp}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    {sendingOtp ? <FaSync className="animate-spin text-slate-950" /> : <FaPaperPlane />}
                    <span>Send 6-Digit Verification OTP to Email</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyAndChangePassword} className="space-y-4">
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs space-y-1">
                    <p className="font-bold text-emerald-500 flex items-center gap-1.5">
                      <FaCheckCircle /> 6-Digit OTP Sent to {adminEmail}
                    </p>
                    <p className={`text-[11px] ${textSecondary}`}>
                      Please check your email inbox & enter the 6-digit verification code below.
                    </p>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${textSecondary}`}>Enter 6-Digit Email OTP *</label>
                    <input
                      type="text"
                      required
                      maxLength="6"
                      placeholder="Enter 6-digit code..."
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl text-base font-mono tracking-widest text-center text-amber-500 font-extrabold focus:outline-none focus:border-amber-500 ${inputStyle}`}
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FaShieldAlt /> Verify OTP & Update Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className={`px-4 py-3.5 font-semibold rounded-xl text-xs cursor-pointer border ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'}`}
                    >
                      Back
                    </button>
                  </div>
                </form>
              )}

              {pwdMessage.text && (
                <div className={`mt-4 p-3 rounded-xl text-xs font-bold ${pwdMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}>
                  {pwdMessage.text}
                </div>
              )}
            </div>
          </div>
        )}

        {/* LEAD DETAIL & VISIT HISTORY MODAL */}
        {selectedLeadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className={`relative w-full max-w-lg glass-card rounded-3xl p-6 border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${isDark ? 'border-amber-500/30 shadow-amber-500/10' : 'bg-white border-slate-300 text-slate-900 shadow-2xl'}`}>
              <div className={`flex justify-between items-start border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`font-heading font-bold text-xl ${textPrimary}`}>{selectedLeadModal.fullName}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-500 border border-amber-500/40">
                      🔥 {selectedLeadModal.visitCount || 1} Visits
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${textSecondary}`}>{selectedLeadModal.email}</p>
                </div>
                <button onClick={() => setSelectedLeadModal(null)} className={`p-1 text-lg cursor-pointer ${textSecondary} hover:${textPrimary}`}>✕</button>
              </div>

              <div className={`space-y-2 text-xs p-4 rounded-2xl border ${itemBg}`}>
                <p><strong className={textSecondary}>Phone:</strong> <span className={textPrimary}>{selectedLeadModal.phone}</span></p>
                <p><strong className={textSecondary}>Primary Goal:</strong> <span className={textPrimary}>{selectedLeadModal.goal}</span></p>
                <p><strong className={textSecondary}>Business / Sector:</strong> <span className={textPrimary}>{selectedLeadModal.businessName} ({selectedLeadModal.businessType})</span></p>
                <p><strong className={textSecondary}>Budget:</strong> <span className="text-amber-500 font-bold">{selectedLeadModal.budget}</span></p>
                <p><strong className={textSecondary}>Lead Source:</strong> <span className={textPrimary}>{selectedLeadModal.source}</span></p>
                <p><strong className={textSecondary}>First Captured:</strong> <span className={textPrimary}>{new Date(selectedLeadModal.createdAt).toLocaleString()}</span></p>
                <p><strong className={textSecondary}>Last Activity:</strong> <span className={textPrimary}>{new Date(selectedLeadModal.lastVisitedAt || selectedLeadModal.createdAt).toLocaleString()}</span></p>
              </div>

              {/* Visit History Timeline */}
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-bold text-amber-500 flex items-center gap-1.5 uppercase tracking-wider">
                  <FaHistory /> Visitor Engagement Timeline ({selectedLeadModal.visitHistory?.length || 1} Events)
                </h4>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {(selectedLeadModal.visitHistory || [{ timestamp: selectedLeadModal.createdAt, source: selectedLeadModal.source }]).map((vh, idx) => (
                    <div key={idx} className={`flex justify-between items-center px-3 py-2 rounded-xl text-[11px] border ${itemBg}`}>
                      <span className={`font-mono ${textPrimary}`}>📅 {new Date(vh.timestamp).toLocaleString()}</span>
                      <span className="text-amber-500 font-semibold">{vh.source || 'Website Visit'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`flex gap-2 pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                {selectedLeadModal.email && selectedLeadModal.email !== 'N/A' && (
                  <a
                    href={`mailto:${selectedLeadModal.email}?subject=Viral Vyapar - Special Offer & Free Growth Blueprint`}
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs text-center flex items-center justify-center gap-1.5"
                  >
                    <FaEnvelope size={12} /> Send Email
                  </a>
                )}
                {selectedLeadModal.phone && selectedLeadModal.phone !== 'N/A' && (
                  <a
                    href={`https://wa.me/${selectedLeadModal.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs text-center flex items-center justify-center gap-1.5"
                  >
                    <FaWhatsapp size={14} /> Open WhatsApp
                  </a>
                )}
                <button
                  onClick={() => setSelectedLeadModal(null)}
                  className={`px-4 py-2.5 font-bold rounded-xl text-xs cursor-pointer border ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'}`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
