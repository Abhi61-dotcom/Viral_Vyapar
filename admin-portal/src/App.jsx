import React, { useState, useEffect } from 'react';
import {
  FaLock, FaUser, FaChartLine, FaUsers, FaEye, FaCheckCircle,
  FaPhoneAlt, FaEnvelope, FaBuilding, FaSearch, FaFilter, FaDownload,
  FaTrash, FaSignOutAlt, FaRobot, FaCog, FaSync, FaShieldAlt, FaKey,
  FaWhatsapp, FaExclamationCircle, FaExternalLinkAlt, FaMobileAlt, FaDesktop,
  FaRocket, FaPaperPlane, FaCheck, FaCalendarAlt, FaHistory
} from 'react-icons/fa';

import {
  adminLogin, verifyAdminToken, fetchAdminStats, fetchAdminLeads,
  updateLeadStatus, deleteLead, fetchChatLogs, requestAdminOtp, verifyOtpChangePassword
} from './api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

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

  // Require password entry on EVERY access/refresh - no persistent auto login
  useEffect(() => {
    sessionStorage.removeItem('vv_admin_token');
    localStorage.removeItem('vv_admin_token');
    setIsAuthenticated(false);
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, activeTab, leadStatusFilter, selectedDateFilter]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const res = await adminLogin(passwordInput);
    if (res?.token) {
      sessionStorage.setItem('vv_admin_token', res.token);
      setIsAuthenticated(true);
      setPasswordInput('');
    } else {
      setLoginError(res?.error || 'Invalid password');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('vv_admin_token');
    localStorage.removeItem('vv_admin_token');
    setIsAuthenticated(false);
  };

  const loadDashboardData = async () => {
    setLoadingData(true);
    if (activeTab === 'overview') {
      const res = await fetchAdminStats();
      if (res?.stats) setStats(res.stats);
    } else if (activeTab === 'leads') {
      const res = await fetchAdminLeads(leadStatusFilter, searchQuery, selectedDateFilter);
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
      setPwdMessage({ text: 'Password updated successfully!', type: 'success' });
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
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-slate-400">
        <FaSync className="animate-spin text-2xl text-amber-400 mr-2" /> Connecting to Admin Portal...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816] p-4">
        <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-amber-500/30 shadow-2xl shadow-amber-500/10">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-950 text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
              <FaLock />
            </div>
            <h2 className="font-heading font-extrabold text-2xl text-white">Viral Vyapar Admin Portal</h2>
            <p className="text-xs text-slate-400 mt-1">Standalone Password-Protected Control Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                Enter Admin Access Password
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
              <FaLock /> Unlock Admin Portal
            </button>

            <div className="text-center text-[11px] text-slate-500 pt-2">
              Default Password: <code className="text-amber-400 bg-slate-900 px-1.5 py-0.5 rounded">admin123</code>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100 font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 text-xl font-bold">
              <FaRocket />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <h1 className="font-heading font-extrabold text-2xl text-white">Viral Vyapar Admin Portal</h1>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Live Analytics & Lead Management • Live Connected to Backend (Port 5000)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="http://localhost:5173/"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <FaExternalLinkAlt size={11} /> Open Website (5173)
            </a>

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
            <FaRobot /> AI WhatsApp Intelligence
          </button>
        </div>

        {/* TAB 1: OVERVIEW & TRAFFIC ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-800">
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

              <div className="flex flex-wrap items-center gap-2">
                {/* Calendar Date Picker Filter */}
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
                  <FaCalendarAlt className="text-amber-400" />
                  <span className="text-slate-400 text-[11px] font-semibold hidden sm:inline">Date:</span>
                  <input
                    type="date"
                    value={selectedDateFilter}
                    onChange={(e) => setSelectedDateFilter(e.target.value)}
                    className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
                  />
                  {selectedDateFilter && (
                    <button
                      onClick={() => setSelectedDateFilter('')}
                      className="text-slate-400 hover:text-amber-400 font-bold text-xs ml-1"
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

            <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
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
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {leads.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-900/50 transition">
                        <td className="p-4 text-slate-400">
                          <div>{new Date(l.lastVisitedAt || l.createdAt).toLocaleDateString()}</div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(l.lastVisitedAt || l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-white">
                          <div className="flex items-center gap-2">
                            <span>{l.fullName}</span>
                            {l.source?.includes('Lead Magnet') && (
                              <span className="inline-flex items-center gap-1 text-[9px] bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-500/40 px-2 py-0.5 rounded-full font-bold">
                                🎯 Instant Email
                              </span>
                            )}
                          </div>
                          {l.email && l.email !== 'N/A' ? (
                            <a
                              href={`mailto:${l.email}?subject=Viral Vyapar - Special Offer & Free Growth Blueprint`}
                              className="text-[11px] text-amber-400 hover:underline font-normal inline-flex items-center gap-1 mt-0.5"
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
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}>
                              🔥 {l.visitCount || 1} {(l.visitCount || 1) > 1 ? 'Visits' : 'Visit'}
                            </span>
                            {(l.visitCount || 1) > 1 && (
                              <span className="text-[9px] text-amber-400/80 font-medium mt-0.5">Repeat Visitor</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-mono">
                          {l.phone && l.phone !== 'N/A' ? (
                            <a
                              href={`https://wa.me/${l.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-400 hover:underline flex items-center gap-1"
                            >
                              <FaWhatsapp /> {l.phone}
                            </a>
                          ) : (
                            <span className="text-slate-500">N/A</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-slate-200">{l.businessName}</span>
                          <span className="block text-[10px] text-slate-400">{l.goal || l.businessType}</span>
                        </td>
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
                            View History
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
            <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
                    <FaRobot /> VyaparAI Intelligence Center
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl text-white">
                    Formalized Visitor Questions & AI Logs
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Track, search, and analyze real-time visitor inquiries to identify hot leads & common questions.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadDashboardData}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-2 transition"
                  >
                    <FaSync className={loadingData ? 'animate-spin' : ''} /> Refresh Logs
                  </button>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Conversations</span>
                  <p className="font-heading font-extrabold text-2xl text-white mt-1">{chatLogs.length}</p>
                </div>
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Today's Questions</span>
                  <p className="font-heading font-extrabold text-2xl text-emerald-400 mt-1">
                    {chatLogs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length}
                  </p>
                </div>
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Pricing Inquiries</span>
                  <p className="font-heading font-extrabold text-2xl text-amber-400 mt-1">
                    {chatLogs.filter(l => getTopicCategory(l.userQuery).name.includes('Pricing')).length}
                  </p>
                </div>
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Free Audit Requests</span>
                  <p className="font-heading font-extrabold text-2xl text-cyan-400 mt-1">
                    {chatLogs.filter(l => getTopicCategory(l.userQuery).name.includes('Audit')).length}
                  </p>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  {/* Search Query */}
                  <div className="relative">
                    <FaSearch className="absolute left-3.5 top-3 text-slate-500 text-xs" />
                    <input
                      type="text"
                      placeholder="Search visitor questions..."
                      value={botSearchQuery}
                      onChange={(e) => setBotSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Topic Filter */}
                  <select
                    value={botTopicFilter}
                    onChange={(e) => setBotTopicFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="All">All Topics</option>
                    <option value="Pricing & Packages">💰 Pricing & Packages</option>
                    <option value="Reels & Video Marketing">📹 Reels & Video Marketing</option>
                    <option value="Performance Ads & ROAS">📈 Performance Ads & ROAS</option>
                    <option value="Local SEO & Maps">📍 Local SEO & Maps</option>
                    <option value="Free Audit & Strategy">⚡ Free Audit & Strategy</option>
                  </select>

                  {/* Date Filter */}
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={botDateFilter}
                      onChange={(e) => setBotDateFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    {botDateFilter && (
                      <button
                        onClick={() => setBotDateFilter('')}
                        className="px-2 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs"
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
                      className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3 hover:border-slate-700 transition"
                    >
                      {/* Top Meta Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${topic.badge}`}>
                            {topic.icon} {topic.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Session: {log.session}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {new Date(log.timestamp).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </span>
                      </div>

                      {/* Conversation Content */}
                      <div className="space-y-2 text-xs">
                        {/* Visitor Query Bubble */}
                        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-2.5">
                          <span className="p-1.5 bg-violet-500/10 text-violet-400 rounded-lg font-bold text-[10px] flex-shrink-0">
                            VISITOR
                          </span>
                          <p className="text-white font-medium leading-relaxed flex-1">
                            "{log.userQuery}"
                          </p>
                        </div>

                        {/* AI Reply Bubble */}
                        <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex items-start gap-2.5">
                          <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg font-bold text-[10px] flex-shrink-0">
                            VYAPAR AI
                          </span>
                          <p className="text-slate-300 leading-relaxed flex-1">
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
                          className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-[11px] font-bold inline-flex items-center gap-1.5 transition"
                        >
                          <FaWhatsapp /> Follow Up on WhatsApp (+91 96670 65637)
                        </a>
                      </div>
                    </div>
                  );
                })}

              {chatLogs.length === 0 && (
                <div className="glass-card rounded-3xl p-12 text-center text-slate-500">
                  <FaRobot size={36} className="mx-auto mb-3 text-slate-600" />
                  <p className="text-sm font-semibold">No AI conversation logs recorded yet.</p>
                  <p className="text-xs text-slate-600 mt-1">Open the website to test live VyaparAI chat!</p>
                </div>
              )}
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
                  <FaCheck /> 2FA Verified
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
                      placeholder="Re-enter new password..."
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sendingOtp}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition"
                  >
                    {sendingOtp ? <FaSync className="animate-spin" /> : <FaPaperPlane />}
                    <span>Send 6-Digit OTP to {adminEmail}</span>
                  </button>
                </form>
              ) : (
                /* Step 2: Enter 6-Digit Email OTP */
                <form onSubmit={handleVerifyAndChangePassword} className="space-y-4">
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs space-y-1">
                    <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <FaCheckCircle /> 6-Digit OTP Sent to {adminEmail}
                    </p>
                    <p className="text-[11px] text-slate-300">
                      Please check your email inbox & enter the 6-digit verification code below.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Enter 6-Digit Email OTP *</label>
                    <input
                      type="text"
                      required
                      maxLength="6"
                      placeholder="Enter 6-digit code..."
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-base font-mono tracking-widest text-center text-amber-400 font-extrabold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
                    >
                      <FaShieldAlt /> Verify OTP & Update Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs"
                    >
                      Back
                    </button>
                  </div>
                </form>
              )}

              {pwdMessage.text && (
                <div className={`mt-4 p-3 rounded-xl text-xs ${pwdMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                  {pwdMessage.text}
                </div>
              )}
            </div>
          </div>
        )}

        {/* LEAD DETAIL & VISIT HISTORY MODAL */}
        {selectedLeadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 border border-amber-500/30 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-xl text-white">{selectedLeadModal.fullName}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      🔥 {selectedLeadModal.visitCount || 1} Visits
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedLeadModal.email}</p>
                </div>
                <button onClick={() => setSelectedLeadModal(null)} className="text-slate-400 hover:text-white p-1 text-lg">✕</button>
              </div>

              <div className="space-y-2 text-xs text-slate-300 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <p><strong className="text-slate-400">Phone:</strong> {selectedLeadModal.phone}</p>
                <p><strong className="text-slate-400">Primary Goal:</strong> {selectedLeadModal.goal}</p>
                <p><strong className="text-slate-400">Business / Sector:</strong> {selectedLeadModal.businessName} ({selectedLeadModal.businessType})</p>
                <p><strong className="text-slate-400">Budget:</strong> <span className="text-amber-400 font-bold">{selectedLeadModal.budget}</span></p>
                <p><strong className="text-slate-400">Lead Source:</strong> {selectedLeadModal.source}</p>
                <p><strong className="text-slate-400">First Captured:</strong> {new Date(selectedLeadModal.createdAt).toLocaleString()}</p>
                <p><strong className="text-slate-400">Last Activity:</strong> {new Date(selectedLeadModal.lastVisitedAt || selectedLeadModal.createdAt).toLocaleString()}</p>
              </div>

              {/* Visit History Timeline */}
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <FaHistory /> Visitor Engagement Timeline ({selectedLeadModal.visitHistory?.length || 1} Events)
                </h4>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {(selectedLeadModal.visitHistory || [{ timestamp: selectedLeadModal.createdAt, source: selectedLeadModal.source }]).map((vh, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-900 border border-slate-800/80 px-3 py-2 rounded-xl text-[11px]">
                      <span className="text-slate-300 font-mono">📅 {new Date(vh.timestamp).toLocaleString()}</span>
                      <span className="text-amber-400/90 font-semibold">{vh.source || 'Website Visit'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-800">
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
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
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
