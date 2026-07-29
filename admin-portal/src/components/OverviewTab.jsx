import React from 'react';
import {
  FaEye, FaUsers, FaChartLine, FaMobileAlt, FaDesktop,
  FaCalendarAlt, FaTrash, FaCheckCircle, FaRocket, FaClock, FaHistory
} from 'react-icons/fa';
import { TrafficTrendChart, DeviceBreakdownChart } from './Charts';

export const OverviewTab = ({
  stats,
  selectedTrafficDate,
  setSelectedTrafficDate,
  resetAdminTraffic,
  loadDashboardData,
  isDark = true
}) => {
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const cardBorder = isDark ? 'border-slate-800' : 'border-slate-200 shadow-sm';
  const itemBg = isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100/90 border-slate-200';
  const inputStyle = isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-sm';

  const todayTraffic = stats?.todayTraffic || 0;
  const totalTraffic = stats?.totalTraffic || 0;
  const selectedDateTraffic = stats?.selectedDateTraffic || 0;
  const totalLeads = stats?.totalLeads || 0;
  const convertedLeads = stats?.convertedLeadsCount || 0;
  const conversionRate = stats?.conversionRate || '0.0';
  const mobileCount = stats?.deviceCounts?.Mobile || 0;
  const desktopCount = stats?.deviceCounts?.Desktop || 0;
  const topPages = stats?.topPages || [];
  const dailyHistory = stats?.dailyHistory || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Calendar Date Filter for Traffic */}
      <div className={`glass-card rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-300 ${cardBorder}`}>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-2xl shadow-sm">
            <FaCalendarAlt className="text-lg" />
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
            className={`px-4 py-2.5 rounded-xl text-xs font-mono focus:outline-none focus:border-amber-500 cursor-pointer ${inputStyle}`}
            title="Click to select date from interactive graphical calendar"
          />
          {selectedTrafficDate && (
            <button
              onClick={() => setSelectedTrafficDate('')}
              className={`px-3.5 py-2.5 text-xs font-semibold rounded-xl cursor-pointer border transition ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'
              }`}
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
            className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            title="Reset All Traffic Logs to Clean Slate"
          >
            <FaTrash size={11} /> Reset to 0
          </button>
        </div>
      </div>

      {selectedTrafficDate && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-center justify-between shadow-sm animate-fadeIn">
          <span className="text-amber-500 font-bold flex items-center gap-2">
            <FaCalendarAlt /> Selected Date Traffic ({selectedTrafficDate}): <b>{selectedDateTraffic} page views</b>
          </span>
          <button onClick={() => setSelectedTrafficDate('')} className={`underline cursor-pointer font-bold ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'}`}>
            Show Today
          </button>
        </div>
      )}

      {/* Top Metric Cards (Stripe / Vercel Aesthetic) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's / Selected Date Traffic */}
        <div className={`glass-card rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] ${cardBorder}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold uppercase tracking-wider ${textSecondary}`}>
              {selectedTrafficDate ? `Traffic on ${selectedTrafficDate}` : "Today's Traffic"}
            </span>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20"><FaEye /></div>
          </div>
          <h3 className={`font-heading font-extrabold text-3xl ${textPrimary}`}>
            {selectedTrafficDate ? selectedDateTraffic : todayTraffic}
          </h3>
          <p className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <FaCheckCircle size={10} /> Live Realtime Page Hits
          </p>
        </div>

        {/* Total All-Time Traffic */}
        <div className={`glass-card rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] ${cardBorder}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold uppercase tracking-wider ${textSecondary}`}>Total All-Time Views</span>
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20"><FaChartLine /></div>
          </div>
          <h3 className={`font-heading font-extrabold text-3xl ${textPrimary}`}>{totalTraffic}</h3>
          <p className={`text-[11px] mt-1 font-medium ${textSecondary}`}>Public Website Page Impressions</p>
        </div>

        {/* Captured Leads */}
        <div className={`glass-card rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] ${cardBorder}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold uppercase tracking-wider ${textSecondary}`}>Captured Leads</span>
            <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-2xl border border-indigo-500/20"><FaUsers /></div>
          </div>
          <h3 className={`font-heading font-extrabold text-3xl ${textPrimary}`}>{totalLeads}</h3>
          <p className="text-[11px] text-amber-400 font-semibold mt-1 flex items-center gap-1">
            <FaRocket size={10} /> {convertedLeads} Converted Clients ({conversionRate}%)
          </p>
        </div>

        {/* Live Active Online Status */}
        <div className={`glass-card rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] ${cardBorder}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold uppercase tracking-wider ${textSecondary}`}>Active Live Users</span>
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/20 relative">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute top-1 right-1"></span>
              <FaClock />
            </div>
          </div>
          <h3 className={`font-heading font-extrabold text-3xl text-cyan-400 flex items-center gap-2`}>
            <span>1</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300">LIVE</span>
          </h3>
          <p className={`text-[11px] mt-1 font-medium ${textSecondary}`}>Connected to Command Portal</p>
        </div>
      </div>

      {/* Traffic Trend Visualizer & Device Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Realtime Traffic Trend Chart (2 Columns) */}
        <div className={`lg:col-span-2 glass-card rounded-3xl p-6 ${cardBorder}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`font-heading font-extrabold text-lg ${textPrimary}`}>Realtime Visitor Traffic Trend</h3>
              <p className={`text-xs ${textSecondary}`}>Page views and visitor activity history timeline</p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Live Chart
            </span>
          </div>

          <TrafficTrendChart data={dailyHistory} isDark={isDark} />
        </div>

        {/* Device Type Breakdown Card (1 Column) */}
        <div className={`glass-card rounded-3xl p-6 flex flex-col justify-between ${cardBorder}`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`font-heading font-extrabold text-lg ${textPrimary}`}>Device Breakdown</h3>
                <span className="text-xs text-amber-400 font-semibold font-mono">
                  {selectedTrafficDate ? `Date: ${selectedTrafficDate}` : "Today's Traffic"}
                </span>
              </div>
              <span className="text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                Filtered Date
              </span>
            </div>

            <p className={`text-xs mb-6 ${textSecondary}`}>
              Visitors connecting via Mobile Phones vs Desktop Laptops on {selectedTrafficDate || "Today"}
            </p>

            <DeviceBreakdownChart mobile={mobileCount} desktop={desktopCount} isDark={isDark} />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-800/50">
            <div className={`p-3.5 rounded-2xl ${itemBg} flex items-center gap-3`}>
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl"><FaMobileAlt /></div>
              <div>
                <div className={`text-xs font-semibold ${textSecondary}`}>Mobile</div>
                <div className={`text-lg font-extrabold ${textPrimary}`}>{mobileCount}</div>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl ${itemBg} flex items-center gap-3`}>
              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl"><FaDesktop /></div>
              <div>
                <div className={`text-xs font-semibold ${textSecondary}`}>Desktop</div>
                <div className={`text-lg font-extrabold ${textPrimary}`}>{desktopCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Visited Pages & Daily History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Visited Pages Ranking */}
        <div className={`glass-card rounded-3xl p-6 ${cardBorder}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`font-heading font-extrabold text-lg ${textPrimary}`}>Top Visited Pages</h3>
              <span className="text-xs text-amber-400 font-semibold font-mono">
                {selectedTrafficDate ? `Date: ${selectedTrafficDate}` : "Today's Traffic"}
              </span>
            </div>
            <span className={`text-xs font-semibold ${textSecondary}`}>{topPages.length} Routes Tracked</span>
          </div>

          {topPages.length === 0 ? (
            <div className={`p-8 text-center text-xs ${textSecondary}`}>No public page hits recorded yet</div>
          ) : (
            <div className="space-y-3">
              {topPages.map((item, idx) => {
                const totalActive = stats?.activeTrafficTotal || 1;
                const pct = Math.round((item.count / totalActive) * 100);
                return (
                  <div key={idx} className={`p-3.5 rounded-2xl ${itemBg} flex items-center justify-between transition hover:border-amber-500/30`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 font-mono text-xs font-bold flex items-center justify-center border border-amber-500/20">
                        #{idx + 1}
                      </span>
                      <span className={`font-mono text-xs font-semibold truncate ${textPrimary}`}>{item.path}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden hidden sm:block">
                        <div style={{ width: `${pct}%` }} className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full"></div>
                      </div>
                      <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 font-mono">
                        {item.count} hits ({pct}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Daily Traffic History Log */}
        <div className={`glass-card rounded-3xl p-6 ${cardBorder}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-heading font-extrabold text-lg ${textPrimary}`}>Daily Calendar History</h3>
            <span className="text-xs text-amber-400 font-semibold flex items-center gap-1"><FaHistory /> Date Log</span>
          </div>

          {dailyHistory.length === 0 ? (
            <div className={`p-8 text-center text-xs ${textSecondary}`}>No daily logs recorded yet</div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {dailyHistory.map((dh, idx) => (
                <div key={idx} className={`p-3.5 rounded-2xl ${itemBg} flex items-center justify-between transition hover:border-amber-500/30`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl"><FaCalendarAlt size={12} /></div>
                    <div>
                      <div className={`text-xs font-mono font-bold ${textPrimary}`}>{dh.date}</div>
                      <div className={`text-[10px] ${textSecondary}`}>
                        Mobile: {dh.mobile} | Desktop: {dh.desktop}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                    {dh.count} Views
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
