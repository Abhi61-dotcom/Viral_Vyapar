import React from 'react';

// Custom SVG Area / Line Trend Chart for Traffic History
export const TrafficTrendChart = ({ data = [], isDark = true }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs font-semibold opacity-50">
        No traffic history data recorded yet
      </div>
    );
  }

  // Reverse so chronological order goes left to right
  const points = [...data].reverse();
  const maxCount = Math.max(...points.map((p) => p.count || 0), 10);
  const width = 600;
  const height = 180;
  const padding = 30;

  const pointsString = points
    .map((p, index) => {
      const x = padding + (index / Math.max(points.length - 1, 1)) * (width - 2 * padding);
      const y = height - padding - ((p.count || 0) / maxCount) * (height - 2 * padding);
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `${padding},${height - padding} ${pointsString} ${width - padding},${height - padding}`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 select-none">
        <defs>
          <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth="1" strokeDasharray="4 4" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth="1" strokeDasharray="4 4" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth="1" />

        {/* Filled Area */}
        <polygon points={areaPoints} fill="url(#trafficGradient)" />

        {/* Gradient Line */}
        <polyline points={pointsString} fill="none" stroke="url(#lineGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data Point Circles */}
        {points.map((p, index) => {
          const x = padding + (index / Math.max(points.length - 1, 1)) * (width - 2 * padding);
          const y = height - padding - ((p.count || 0) / maxCount) * (height - 2 * padding);
          return (
            <g key={index} className="group cursor-pointer">
              <circle cx={x} cy={y} r="5" fill="#f97316" stroke={isDark ? '#0f172a' : '#ffffff'} strokeWidth="2" className="transition-all transform group-hover:scale-150" />
              <text x={x} y={y - 10} textAnchor="middle" fill={isDark ? '#f8fafc' : '#0f172a'} fontSize="10" fontWeight="bold" className="opacity-0 group-hover:opacity-100 transition-opacity">
                {p.count} views ({p.date})
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Custom Device Breakdown Visual Progress / Donut Indicator
export const DeviceBreakdownChart = ({ mobile = 0, desktop = 0, isDark = true }) => {
  const total = mobile + desktop || 1;
  const mobilePct = Math.round((mobile / total) * 100);
  const desktopPct = 100 - mobilePct;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-bold">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span>
          <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>Mobile Visitors: {mobile} ({mobilePct}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50"></span>
          <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>Desktop Visitors: {desktop} ({desktopPct}%)</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner p-0.5 border border-slate-700/50">
        <div
          style={{ width: `${mobilePct}%` }}
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-l-full transition-all duration-500"
          title={`Mobile Traffic: ${mobilePct}%`}
        ></div>
        <div
          style={{ width: `${desktopPct}%` }}
          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-r-full transition-all duration-500"
          title={`Desktop Traffic: ${desktopPct}%`}
        ></div>
      </div>
    </div>
  );
};
