import React from 'react';
import { FaChartLine, FaUsers, FaRobot } from 'react-icons/fa';

export const Sidebar = ({ activeTab, setActiveTab, leadsCount = 0, chatLogsCount = 0, isDark = true }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
      <button
        onClick={() => setActiveTab('overview')}
        className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
          activeTab === 'overview'
            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20'
            : isDark
            ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-300 shadow-sm'
        }`}
      >
        <FaChartLine className="text-sm" /> Overview & Realtime Analytics
      </button>

      <button
        onClick={() => setActiveTab('leads')}
        className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
          activeTab === 'leads'
            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20'
            : isDark
            ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-300 shadow-sm'
        }`}
      >
        <FaUsers className="text-sm" /> Captured Leads Pipeline
        {leadsCount > 0 && (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
            activeTab === 'leads' ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}>
            {leadsCount}
          </span>
        )}
      </button>

      <button
        onClick={() => setActiveTab('bot')}
        className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
          activeTab === 'bot'
            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20'
            : isDark
            ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-300 shadow-sm'
        }`}
      >
        <FaRobot className="text-sm" /> AI WhatsApp Intelligence
        {chatLogsCount > 0 && (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
            activeTab === 'bot' ? 'bg-slate-950 text-amber-400' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {chatLogsCount}
          </span>
        )}
      </button>
    </div>
  );
};
