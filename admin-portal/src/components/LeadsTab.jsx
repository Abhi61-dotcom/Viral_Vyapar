import React from 'react';
import {
  FaSearch, FaFilter, FaDownload, FaEye, FaTrash,
  FaCheckCircle, FaPhoneAlt, FaEnvelope, FaBuilding, FaCalendarAlt
} from 'react-icons/fa';

export const LeadsTab = ({
  leads = [],
  leadStatusFilter,
  setLeadStatusFilter,
  searchQuery,
  setSearchQuery,
  selectedDateFilter,
  setSelectedDateFilter,
  onViewLead,
  onUpdateStatus,
  onDeleteLead,
  isDark = true
}) => {
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const cardBorder = isDark ? 'border-slate-800' : 'border-slate-200 shadow-sm';
  const itemBg = isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100/90 border-slate-200';
  const inputStyle = isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-sm';

  // Export Leads to CSV File
  const handleExportCsv = () => {
    if (!leads || leads.length === 0) {
      alert('No lead records to export.');
      return;
    }

    const headers = ['Full Name', 'Phone', 'Email', 'Business Name', 'Business Type', 'Goal', 'Budget', 'Status', 'Source', 'Visit Count', 'Created At'];
    const rows = leads.map(l => [
      `"${l.fullName || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      `"${l.businessName || ''}"`,
      `"${l.businessType || ''}"`,
      `"${l.goal || ''}"`,
      `"${l.budget || ''}"`,
      `"${l.status || ''}"`,
      `"${l.source || ''}"`,
      l.visitCount || 1,
      `"${l.createdAt || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Viral_Vyapar_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Contacted':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'Converted':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Controls Bar: Search, Filters & Export CSV */}
      <div className={`glass-card rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 ${cardBorder}`}>
        <div className="flex items-center gap-3 w-full md:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <span className="absolute left-3.5 top-3 text-slate-500"><FaSearch /></span>
            <input
              type="text"
              placeholder="Search by name, email, phone, business..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-amber-500 font-medium ${inputStyle}`}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          {/* Status Pills Filter */}
          <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
            {['All', 'New', 'Contacted', 'Converted'].map((st) => (
              <button
                key={st}
                onClick={() => setLeadStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  leadStatusFilter === st
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Date Picker Filter */}
          <input
            type="date"
            value={selectedDateFilter}
            onClick={(e) => e.target.showPicker?.()}
            onChange={(e) => setSelectedDateFilter(e.target.value)}
            className={`px-3 py-2 rounded-xl text-xs font-mono focus:outline-none focus:border-amber-500 cursor-pointer ${inputStyle}`}
            title="Filter leads by date"
          />
          {selectedDateFilter && (
            <button
              onClick={() => setSelectedDateFilter('')}
              className={`px-2.5 py-2 text-xs font-semibold rounded-xl border ${isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-200 text-slate-800 border-slate-300'}`}
            >
              Clear
            </button>
          )}

          {/* Export CSV Button */}
          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
          >
            <FaDownload /> Export CSV ({leads.length})
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className={`glass-card rounded-3xl overflow-hidden ${cardBorder}`}>
        {leads.length === 0 ? (
          <div className={`p-12 text-center text-xs font-medium ${textSecondary}`}>
            No captured leads match the selected filter query
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={isDark ? 'bg-slate-900/80 text-slate-400 border-b border-slate-800' : 'bg-slate-200/80 text-slate-700 border-b border-slate-300'}>
                <tr>
                  <th className="p-4 font-bold uppercase tracking-wider">Lead Info</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Contact & Phone</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Business & Goal</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Status</th>
                  <th className="p-4 font-bold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/40">
                {leads.map((lead) => (
                  <tr key={lead.id || lead._id} className={`transition hover:bg-amber-500/5`}>
                    {/* Lead Info */}
                    <td className="p-4">
                      <div className={`font-bold text-sm ${textPrimary}`}>{lead.fullName}</div>
                      <div className={`text-[11px] font-mono mt-0.5 ${textSecondary}`}>{lead.email}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                          Visits: {lead.visitCount || 1}
                        </span>
                        <span className="text-[10px] text-amber-400 font-semibold">{lead.source}</span>
                      </div>
                    </td>

                    {/* Contact & Phone */}
                    <td className="p-4">
                      <div className={`font-mono font-bold text-xs ${textPrimary}`}>{lead.phone}</div>
                      {lead.createdAt && (
                        <div className={`text-[11px] mt-1 flex items-center gap-1 ${textSecondary}`}>
                          <FaCalendarAlt size={10} />
                          <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </td>

                    {/* Business & Goal */}
                    <td className="p-4">
                      <div className={`font-semibold ${textPrimary}`}>{lead.businessName}</div>
                      <div className={`text-[11px] mt-0.5 ${textSecondary}`}>{lead.businessType}</div>
                      <div className="text-[11px] font-bold text-amber-500 mt-1">{lead.goal}</div>
                    </td>

                    {/* Status Dropdown Pill */}
                    <td className="p-4">
                      <select
                        value={lead.status || 'New'}
                        onChange={(e) => onUpdateStatus(lead.id || lead._id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border cursor-pointer focus:outline-none ${getStatusBadge(
                          lead.status
                        )}`}
                      >
                        <option value="New" className="bg-slate-900 text-amber-400 font-bold">New</option>
                        <option value="Contacted" className="bg-slate-900 text-indigo-400 font-bold">Contacted</option>
                        <option value="Converted" className="bg-slate-900 text-emerald-400 font-bold">Converted</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => onViewLead(lead)}
                        className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition cursor-pointer"
                        title="Inspect Full Lead Details"
                      >
                        <FaEye />
                      </button>

                      <button
                        onClick={() => onDeleteLead(lead.id || lead._id)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition cursor-pointer"
                        title="Delete Lead Record"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
