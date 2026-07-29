import React from 'react';
import { FaTimes, FaPhoneAlt, FaEnvelope, FaBuilding, FaCalendarAlt, FaHistory, FaCheckCircle, FaRocket } from 'react-icons/fa';

export const LeadDetailModal = ({ lead, onClose, isDark = true }) => {
  if (!lead) return null;

  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const cardBorder = isDark ? 'border-slate-800' : 'border-slate-200 shadow-sm';
  const itemBg = isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100/90 border-slate-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-xl glass-card rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto ${cardBorder}`}>
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer p-1"
        >
          <FaTimes />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-2xl">
            <FaRocket className="text-xl" />
          </div>
          <div>
            <h3 className={`font-heading font-extrabold text-lg ${textPrimary}`}>{lead.fullName}</h3>
            <p className={`text-xs ${textSecondary}`}>Lead Detail & Session Inspection</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Key Contact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className={`p-3.5 rounded-2xl ${itemBg}`}>
              <div className={`text-[10px] uppercase font-bold ${textSecondary}`}>Phone Number</div>
              <div className={`font-mono font-bold text-sm mt-0.5 ${textPrimary}`}>{lead.phone}</div>
            </div>

            <div className={`p-3.5 rounded-2xl ${itemBg}`}>
              <div className={`text-[10px] uppercase font-bold ${textSecondary}`}>Email Address</div>
              <div className={`font-mono font-bold text-sm mt-0.5 ${textPrimary}`}>{lead.email}</div>
            </div>

            <div className={`p-3.5 rounded-2xl ${itemBg}`}>
              <div className={`text-[10px] uppercase font-bold ${textSecondary}`}>Business Name</div>
              <div className={`font-semibold text-sm mt-0.5 ${textPrimary}`}>{lead.businessName}</div>
            </div>

            <div className={`p-3.5 rounded-2xl ${itemBg}`}>
              <div className={`text-[10px] uppercase font-bold ${textSecondary}`}>Business Type</div>
              <div className={`font-semibold text-sm mt-0.5 ${textPrimary}`}>{lead.businessType}</div>
            </div>

            <div className={`p-3.5 rounded-2xl ${itemBg}`}>
              <div className={`text-[10px] uppercase font-bold ${textSecondary}`}>Growth Goal</div>
              <div className="font-bold text-sm text-amber-500 mt-0.5">{lead.goal}</div>
            </div>

            <div className={`p-3.5 rounded-2xl ${itemBg}`}>
              <div className={`text-[10px] uppercase font-bold ${textSecondary}`}>Budget Range</div>
              <div className="font-bold text-sm text-emerald-400 mt-0.5">{lead.budget}</div>
            </div>
          </div>

          {/* Source & Status */}
          <div className={`p-3.5 rounded-2xl ${itemBg} flex items-center justify-between`}>
            <div>
              <span className={`text-[10px] uppercase font-bold block ${textSecondary}`}>Source Channel</span>
              <span className="font-semibold text-amber-400">{lead.source}</span>
            </div>
            <div>
              <span className={`text-[10px] uppercase font-bold block text-right ${textSecondary}`}>Current Status</span>
              <span className="font-extrabold text-emerald-400 font-mono text-sm">{lead.status || 'New'}</span>
            </div>
          </div>

          {/* Visit History Timeline */}
          {lead.visitHistory && lead.visitHistory.length > 0 && (
            <div className={`p-4 rounded-2xl ${itemBg} space-y-3`}>
              <div className={`font-bold flex items-center gap-1.5 ${textPrimary}`}>
                <FaHistory className="text-amber-500" /> Visit History Timeline ({lead.visitHistory.length} Interactions)
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {lead.visitHistory.map((vh, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">{vh.source}</span>
                    <span className="text-slate-400 font-mono">{new Date(vh.timestamp).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
