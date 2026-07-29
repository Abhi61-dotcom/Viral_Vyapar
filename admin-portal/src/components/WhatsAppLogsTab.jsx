import React from 'react';
import { FaRobot, FaSearch, FaFilter, FaCalendarAlt, FaComments } from 'react-icons/fa';

export const WhatsAppLogsTab = ({
  chatLogs = [],
  botSearchQuery,
  setBotSearchQuery,
  botTopicFilter,
  setBotTopicFilter,
  botDateFilter,
  setBotDateFilter,
  getTopicCategory,
  isDark = true
}) => {
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const cardBorder = isDark ? 'border-slate-800' : 'border-slate-200 shadow-sm';
  const itemBg = isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100/90 border-slate-200';
  const inputStyle = isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-sm';

  // Filter logs by search, topic, date
  const filteredLogs = chatLogs.filter((log) => {
    const q = (botSearchQuery || '').toLowerCase();
    const matchesSearch =
      !q ||
      (log.userQuery && log.userQuery.toLowerCase().includes(q)) ||
      (log.aiReply && log.aiReply.toLowerCase().includes(q)) ||
      (log.session && log.session.toLowerCase().includes(q));

    const category = getTopicCategory(log.userQuery);
    const matchesTopic = botTopicFilter === 'All' || category.name === botTopicFilter;

    const logDate = log.timestamp ? new Date(log.timestamp).toISOString().split('T')[0] : '';
    const matchesDate = !botDateFilter || logDate === botDateFilter;

    return matchesSearch && matchesTopic && matchesDate;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Search & Topic Filters Header */}
      <div className={`glass-card rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 ${cardBorder}`}>
        <div className="flex items-center gap-3 w-full md:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <span className="absolute left-3.5 top-3 text-slate-500"><FaSearch /></span>
            <input
              type="text"
              placeholder="Search chat queries or AI responses..."
              value={botSearchQuery}
              onChange={(e) => setBotSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-amber-500 font-medium ${inputStyle}`}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          {/* Topic Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-xl scrollbar-none">
            {['All', 'Pricing & Packages', 'Reels & Video Marketing', 'Performance Ads & ROAS', 'Local SEO & Maps', 'Free Audit & Strategy'].map((topic) => (
              <button
                key={topic}
                onClick={() => setBotTopicFilter(topic)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  botTopicFilter === topic
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : isDark ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-300 shadow-sm'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Date Filter */}
          <input
            type="date"
            value={botDateFilter}
            onClick={(e) => e.target.showPicker?.()}
            onChange={(e) => setBotDateFilter(e.target.value)}
            className={`px-3 py-2 rounded-xl text-xs font-mono focus:outline-none focus:border-amber-500 cursor-pointer ${inputStyle}`}
          />
          {botDateFilter && (
            <button
              onClick={() => setBotDateFilter('')}
              className={`px-2.5 py-2 text-xs font-semibold rounded-xl border ${isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-200 text-slate-800 border-slate-300'}`}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Chat Logs List */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className={`glass-card rounded-3xl p-12 text-center text-xs ${textSecondary} ${cardBorder}`}>
            No AI WhatsApp chat conversations match the selected query filter
          </div>
        ) : (
          filteredLogs.map((log, idx) => {
            const cat = getTopicCategory(log.userQuery);
            return (
              <div key={idx} className={`glass-card rounded-3xl p-6 transition hover:border-amber-500/30 ${cardBorder}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/40">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border flex items-center gap-1.5 ${cat.badge}`}>
                      <span>{cat.icon}</span> <span>{cat.name}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-800/50 px-2.5 py-0.5 rounded-lg border border-slate-700">
                      Session: {log.session || 'guest'}
                    </span>
                  </div>

                  {log.timestamp && (
                    <span className={`text-[11px] font-mono flex items-center gap-1 ${textSecondary}`}>
                      <FaCalendarAlt size={10} /> {new Date(log.timestamp).toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {/* User Query */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/20 shrink-0">
                      U
                    </div>
                    <div className={`p-3.5 rounded-2xl ${itemBg} text-xs font-semibold ${textPrimary} flex-1`}>
                      {log.userQuery}
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/20 shrink-0">
                      AI
                    </div>
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-medium flex-1">
                      {log.aiReply}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
