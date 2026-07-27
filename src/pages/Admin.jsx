import React, { useState, useEffect } from 'react';
import {
  FaLock, FaUser, FaChartLine, FaUsers, FaEye, FaCheckCircle,
  FaPhoneAlt, FaEnvelope, FaBuilding, FaSearch, FaFilter, FaDownload,
  FaTrash, FaSignOutAlt, FaRobot, FaCog, FaSync, FaShieldAlt, FaKey,
  FaWhatsapp, FaExclamationCircle, FaExternalLinkAlt, FaMobileAlt, FaDesktop
} from 'react-icons/fa';

import {
  adminLogin, verifyAdminToken, fetchAdminStats, fetchAdminLeads,
  updateLeadStatus, deleteLead, fetchChatLogs, requestAdminOtp, verifyOtpChangePassword
} from '../utils/api';

const Admin = () => {
  // Auth States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard Tab State
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'leads' | 'bot' | 'settings'

  // Data States
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [chatLogs, setChatLogs] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Lead Filters & Search
  const [leadStatusFilter, setLeadStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeadModal, setSelectedLeadModal] = useState(null);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  // 2-Step Email OTP Password Change State
  const adminEmail = 'choudharyabhishek1503@gmail.com';
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [pwdMessage, setPwdMessage] = useState({ text: '', type: '' });

  // Initial Auth Check
  useEffect(() => {
    checkAuth();
  }, []);

  // Fetch Data when authenticated or tab changes
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, activeTab, leadStatusFilter]);

  const checkAuth = async () => {
    setAuthLoading(true);
    const token = localStorage.getItem('vv_admin_token');
    if (!token) {
      setIsAuthenticated(false);
      setAuthLoading(false);
      return;
    }

    const res = await verifyAdminToken();
    if (res?.success) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      localStorage.removeItem('vv_admin_token');
    }
    setAuthLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const res = await adminLogin(passwordInput);
    if (res?.success) {
      setIsAuthenticated(true);
      setPasswordInput('');
    } else {
      setLoginError(res?.error || 'Invalid password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vv_admin_token');
    setIsAuthenticated(false);
  };

  const loadDashboardData = async () => {
    setLoadingData(true);
    if (activeTab === 'overview') {
      const res = await fetchAdminStats();
      if (res?.stats) setStats(res.stats);
    } else if (activeTab === 'leads') {
      const res = await fetchAdminLeads(leadStatusFilter, searchQuery);
      if (res?.leads) setLeads(res.leads);
    } else if (activeTab === 'bot') {
      const res = await fetchChatLogs();
      if (res?.chatLogs) setChatLogs(res.chatLogs);
    }
    setLoadingData(false);
  };

  const handleSearchLeads = async (e) => {
    e.preventDefault();
    setLoadingData(true);
    const res = await fetchAdminLeads(leadStatusFilter, searchQuery);
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
      setTimeout(() => {
        handleLogout();
      }, 1500);
    } else {
      setPwdMessage({ text: res?.error || 'Invalid OTP code. Please try again.', type: 'error' });
    }
  };

  /* ==========================================================================
     1. LOGIN SCREEN (PASSWORD PROTECTED)
     ========================================================================== */
  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-400">
        <FaSync className="animate-spin text-2xl text-amber-400 mr-2" /> Authenticating Admin Session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-amber-500/30 shadow-2xl shadow-amber-500/10">
          <div className="text-center mb-6">
            <img src="/logo.png" alt="Viral Vyapar Logo" className="w-16 h-16 object-contain mx-auto mb-4 rounded-2xl shadow-lg shadow-amber-500/20 bg-slate-900 p-1 border border-amber-500/30" />
            <h2 className="font-heading font-extrabold text-2xl text-white">Admin Control Panel</h2>
            <p className="text-xs text-slate-400 mt-1">Viral Vyapar Secure Dashboard Login</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                Admin Access Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-slate-500"><FaKey /></span>
                <input
                  type="password"
                  required
                  placeholder="Enter admin password..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <FaExclamationCircle /> {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
            >
              <FaLock /> Unlock Admin Dashboard
            </button>

            <div className="text-center text-[11px] text-slate-500 pt-2">
              Default password: <code className="text-amber-400 bg-slate-900 px-1.5 py-0.5 rounded">admin123</code>
            </div>
          </form>
        </div>
      </div>
    );
  }

  /* ==========================================================================
     2. ADMIN DASHBOARD MAIN INTERFACE
     ========================================================================== */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Viral Vyapar Logo" className="w-10 h-10 object-contain rounded-xl shadow-md border border-amber-500/20 bg-slate-900 p-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <h1 className="font-heading font-extrabold text-2xl text-white">Viral Vyapar Admin Portal</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">Live Site Traffic Analytics & Lead Management System</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSecurityModal(true)}
            className="px-3.5 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm"
            title="Change Password & 2FA Settings"
          >
            <FaShieldAlt /> Admin Security
          </button>

          <button
            onClick={loadDashboardData}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-2 transition"
            title="Refresh Data"
          >
            <FaSync className={loadingData ? 'animate-spin text-amber-400' : ''} /> Refresh
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FaChartLine /> Overview & Traffic Analytics
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'leads'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FaUsers /> Lead Submissions ({leads.length})
        </button>

        <button
          onClick={() => setActiveTab('bot')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'bot'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FaRobot /> AI WhatsApp Logs
        </button>
      </div>

      {/* TAB 1: OVERVIEW & TRAFFIC ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card rounded-3xl p-6 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-semibold uppercase">Today's Traffic</span>
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl"><FaEye /></div>
              </div>
              <p className="font-heading font-extrabold text-3xl text-white">{stats?.todayTraffic || 0}</p>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                ● Live site page views today
              </span>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-semibold uppercase">Total All-Time Views</span>
                <div className="p-2 bg-violet-500/10 text-violet-400 rounded-xl"><FaChartLine /></div>
              </div>
              <p className="font-heading font-extrabold text-3xl text-white">{stats?.totalTraffic || 0}</p>
              <span className="text-[10px] text-slate-400 mt-1 block">Logged by backend tracker</span>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-semibold uppercase">Total Form Leads</span>
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl"><FaUsers /></div>
              </div>
              <p className="font-heading font-extrabold text-3xl text-amber-400">{stats?.totalLeads || 0}</p>
              <span className="text-[10px] text-amber-300 flex items-center gap-1 mt-1">
                {stats?.todayLeads || 0} leads received today
              </span>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-semibold uppercase">Conversion Rate</span>
                <div className="p-2 bg-orange-500/10 text-orange-400 rounded-xl"><FaCheckCircle /></div>
              </div>
              <p className="font-heading font-extrabold text-3xl text-emerald-400">{stats?.conversionRate || 0}%</p>
              <span className="text-[10px] text-slate-400 mt-1 block">Converted leads vs total</span>
            </div>
          </div>

          {/* Top Pages & Device Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Top Visited Pages */}
            <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
              <h3 className="font-heading font-bold text-lg text-white">Top Visited Pages</h3>
              <div className="space-y-3">
                {stats?.topPages?.map((page, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                    <span className="font-mono text-slate-200">{page.path}</span>
                    <span className="font-heading font-bold text-amber-400">{page.count} visits</span>
                  </div>
                )) || <p className="text-xs text-slate-500">No page views recorded yet</p>}
              </div>
            </div>

            {/* Device Type Distribution */}
            <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
              <h3 className="font-heading font-bold text-lg text-white">Device Breakdown</h3>
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span className="flex items-center gap-1.5"><FaMobileAlt className="text-emerald-400" /> Mobile Visitors</span>
                    <span className="font-bold text-white">{stats?.deviceCounts?.Mobile || 0}</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (stats?.deviceCounts?.Mobile || 0) * 10)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span className="flex items-center gap-1.5"><FaDesktop className="text-violet-400" /> Desktop Visitors</span>
                    <span className="font-bold text-white">{stats?.deviceCounts?.Desktop || 0}</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-violet-500 h-full rounded-full" style={{ width: `${Math.min(100, (stats?.deviceCounts?.Desktop || 0) * 10)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: LEADS & SUBMISSIONS */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-800">
            
            {/* Status Filter Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {['All', 'New', 'Contacted', 'Converted'].map((st) => (
                <button
                  key={st}
                  onClick={() => setLeadStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    leadStatusFilter === st
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Search Input & CSV Export */}
            <div className="flex items-center gap-2">
              <form onSubmit={handleSearchLeads} className="relative flex-1 md:w-64">
                <input
                  type="text"
                  placeholder="Search leads by name/phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <FaSearch className="absolute left-3 top-2.5 text-slate-500 text-xs" />
              </form>

              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <FaDownload /> Export CSV
              </button>
            </div>

          </div>

          {/* Leads Table */}
          <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Lead Name</th>
                    <th className="p-4">Phone / WhatsApp</th>
                    <th className="p-4">Business & Sector</th>
                    <th className="p-4">Budget</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {leads.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-900/50 transition">
                      <td className="p-4 text-slate-400">
                        {new Date(l.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 font-bold text-white">
                        {l.fullName}
                        <span className="block text-[10px] text-slate-500 font-normal">{l.email}</span>
                      </td>
                      <td className="p-4 font-mono">
                        <a
                          href={`https://wa.me/${l.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <FaWhatsapp /> {l.phone}
                        </a>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-200">{l.businessName}</span>
                        <span className="block text-[10px] text-slate-400">{l.businessType}</span>
                      </td>
                      <td className="p-4 font-bold text-amber-400">{l.budget}</td>
                      <td className="p-4">
                        <select
                          value={l.status}
                          onChange={(e) => handleStatusChange(l.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border focus:outline-none ${
                            l.status === 'Converted'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : l.status === 'Contacted'
                              ? 'bg-violet-500/20 text-violet-400 border-violet-500/30'
                              : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          <option value="New" className="bg-slate-900 text-amber-400">New</option>
                          <option value="Contacted" className="bg-slate-900 text-violet-400">Contacted</option>
                          <option value="Converted" className="bg-slate-900 text-emerald-400">Converted</option>
                        </select>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedLeadModal(l)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDeleteLead(l.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition"
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
                        No leads found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: AI WHATSAPP LOGS */}
      {activeTab === 'bot' && (
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-800">
            <h3 className="font-heading font-bold text-xl text-white mb-2 flex items-center gap-2">
              <FaRobot className="text-emerald-400" /> VyaparAI WhatsApp Conversation Logs
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Real-time query interactions logged by the AI Assistant on the site.
            </p>

            <div className="space-y-3">
              {chatLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Session: {log.session}</span>
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-300"><span className="font-bold text-violet-400">User Query:</span> "{log.userQuery}"</p>
                  <p className="text-slate-300"><span className="font-bold text-emerald-400">AI Reply:</span> "{log.aiReply}"</p>
                </div>
              ))}
              {chatLogs.length === 0 && (
                <p className="text-xs text-slate-500 py-4 text-center">No AI chat logs recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADMIN SECURITY 2FA OTP MODAL OVERLAY */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg glass-card rounded-3xl p-8 border border-amber-500/30 shadow-2xl shadow-amber-500/10 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowSecurityModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl text-xl">
                <FaShieldAlt />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-xl text-white">2-Factor Email OTP Password Reset</h3>
                <p className="text-xs text-slate-400">High Security Password Reset via Verified Email OTP</p>
              </div>
            </div>

            {/* Admin Email Badge */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Registered Admin Email</span>
                <span className="text-sm font-bold text-amber-400">{adminEmail}</span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                <FaCheckCircle /> 2FA Verified
              </span>
            </div>

            {/* Step 1: Enter Current, New & Confirm Passwords */}
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current password..."
                    value={currPassword}
                    onChange={(e) => setCurrPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">New Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new password..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Confirm new password..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {pwdMessage.text && (
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    pwdMessage.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/10 text-red-400 border border-red-500/30'
                  }`}>
                    <FaExclamationCircle /> {pwdMessage.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sendingOtp}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
                >
                  {sendingOtp ? <FaSync className="animate-spin" /> : <FaPaperPlane />}
                  <span>{sendingOtp ? 'Sending OTP to Email...' : 'Send Verification OTP to Email'}</span>
                </button>
              </form>
            ) : (
              /* Step 2: Enter 6-Digit OTP Received on Email */
              <form onSubmit={handleVerifyAndChangePassword} className="space-y-4 animate-fadeIn">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-semibold flex items-center gap-2">
                  <FaCheckCircle /> OTP Dispatched to {adminEmail}! Enter the code below.
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Enter 6-Digit Email OTP *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit OTP code..."
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-amber-500/50 rounded-xl text-lg font-mono text-center tracking-widest text-amber-400 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {pwdMessage.text && (
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    pwdMessage.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/10 text-red-400 border border-red-500/30'
                  }`}>
                    <FaExclamationCircle /> {pwdMessage.text}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                  >
                    <FaShieldAlt /> Verify OTP & Update Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    Back
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* LEAD DETAIL MODAL */}
      {selectedLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 border border-amber-500/30 shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-heading font-bold text-xl text-white">{selectedLeadModal.fullName}</h3>
                <p className="text-xs text-slate-400">{selectedLeadModal.businessName} ({selectedLeadModal.businessType})</p>
              </div>
              <button onClick={() => setSelectedLeadModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <p><strong className="text-slate-400">Phone:</strong> {selectedLeadModal.phone}</p>
              <p><strong className="text-slate-400">Email:</strong> {selectedLeadModal.email}</p>
              <p><strong className="text-slate-400">Primary Goal:</strong> {selectedLeadModal.goal}</p>
              <p><strong className="text-slate-400">Budget:</strong> <span className="text-amber-400 font-bold">{selectedLeadModal.budget}</span></p>
              <p><strong className="text-slate-400">Source:</strong> {selectedLeadModal.source}</p>
              <p><strong className="text-slate-400">Submitted At:</strong> {new Date(selectedLeadModal.createdAt).toLocaleString()}</p>
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-800">
              <a
                href={`https://wa.me/${selectedLeadModal.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs text-center flex items-center justify-center gap-2"
              >
                <FaWhatsapp size={14} /> Open WhatsApp Chat
              </a>
              <button
                onClick={() => setSelectedLeadModal(null)}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;
