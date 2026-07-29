import React from 'react';
import { FaSun, FaMoon, FaSync, FaExternalLinkAlt, FaShieldAlt, FaSignOutAlt } from 'react-icons/fa';

export const Navbar = ({
  themeMode,
  setThemeMode,
  liveSync,
  setLiveSync,
  lastRefreshedAt,
  loadingData,
  loadDashboardData,
  onOpenSecurityModal,
  onLogout,
  logoImg,
  frontendUrl
}) => {
  const isDark = themeMode === 'dark';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const cardBorder = isDark ? 'border-slate-800' : 'border-slate-200 shadow-sm';

  return (
    <header className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl transition-colors duration-300 ${cardBorder}`}>
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
            <span>Realtime Traffic Analytics & Lead Pipeline</span>
            {lastRefreshedAt && <span className="text-amber-500 font-mono text-[11px] font-bold">(Updated: {lastRefreshedAt})</span>}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
            isDark
              ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800'
              : 'bg-white border-slate-300 text-indigo-600 hover:bg-slate-50 shadow-sm'
          }`}
          title="Toggle Dark / Light Mode"
        >
          {isDark ? <FaSun className="text-amber-400 text-sm" /> : <FaMoon className="text-indigo-600 text-sm" />}
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* Live Auto-Poll Toggle */}
        <button
          onClick={() => setLiveSync(!liveSync)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
            liveSync
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : isDark ? 'bg-slate-900 text-slate-400 border-slate-700' : 'bg-white text-slate-600 border-slate-300 shadow-sm'
          }`}
          title="Toggle 4-Second Realtime Auto Sync"
        >
          <span className={`w-2 h-2 rounded-full ${liveSync ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
          {liveSync ? 'Live Sync: ON' : 'Live Sync: OFF'}
        </button>

        {/* Open Site Button */}
        <a
          href={frontendUrl}
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

        {/* Security Modal Trigger */}
        <button
          onClick={onOpenSecurityModal}
          className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm cursor-pointer"
          title="Change Admin Password & 2FA Security"
        >
          <FaShieldAlt /> Security
        </button>

        {/* Refresh / Sync Button */}
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

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </header>
  );
};
