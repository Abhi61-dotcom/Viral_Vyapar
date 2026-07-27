import React, { useState } from 'react';
import { FaTimes, FaCalculator, FaRocket, FaChartLine, FaCheckCircle } from 'react-icons/fa';

const ROICalculatorModal = ({ isOpen, onClose, onOpenConsultation }) => {
  const [industry, setIndustry] = useState('E-commerce & D2C');
  const [monthlyRevenue, setMonthlyRevenue] = useState(250000); // 2.5 Lakhs default
  const [monthlyBudget, setMonthlyBudget] = useState(30000); // 30k default

  if (!isOpen) return null;

  // Calculation estimates
  const getMultiplier = () => {
    switch (industry) {
      case 'E-commerce & D2C': return { reach: 150000, leads: 450, roiMultiplier: 5.2 };
      case 'Local Store / Retail': return { reach: 80000, leads: 220, roiMultiplier: 4.8 };
      case 'Real Estate': return { reach: 60000, leads: 95, roiMultiplier: 8.5 };
      case 'Coaching & Education': return { reach: 120000, leads: 380, roiMultiplier: 6.0 };
      case 'Healthcare & Clinics': return { reach: 75000, leads: 180, roiMultiplier: 5.5 };
      case 'Restaurants & Cafes': return { reach: 200000, leads: 600, roiMultiplier: 4.2 };
      default: return { reach: 100000, leads: 300, roiMultiplier: 5.0 };
    }
  };

  const metrics = getMultiplier();
  const estimatedReach = Math.round((monthlyBudget / 10000) * metrics.reach);
  const estimatedLeads = Math.round((monthlyBudget / 10000) * metrics.leads);
  const projectedRevenue = Math.round(monthlyRevenue + (monthlyBudget * metrics.roiMultiplier));
  const roiGrowthPercent = Math.round(((projectedRevenue - monthlyRevenue) / monthlyRevenue) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-card rounded-3xl p-6 sm:p-8 border border-violet-500/30 shadow-2xl shadow-violet-500/20 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
        >
          <FaTimes size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white text-xl shadow-lg shadow-violet-500/30">
            <FaCalculator />
          </div>
          <div>
            <h3 className="font-heading font-bold text-2xl text-white">Viral Growth & ROI Calculator</h3>
            <p className="text-xs text-slate-400">Estimate your potential reach, leads & revenue growth with Viral Vyapar</p>
          </div>
        </div>

        <div className="space-y-5 my-6">
          {/* Industry Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Select Your Industry
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-violet-500 transition"
            >
              <option value="E-commerce & D2C">E-commerce & D2C Brand</option>
              <option value="Local Store / Retail">Local Store / Showroom</option>
              <option value="Real Estate">Real Estate & Property</option>
              <option value="Coaching & Education">Coaching, EdTech & Consultants</option>
              <option value="Healthcare & Clinics">Doctors & Healthcare Clinics</option>
              <option value="Restaurants & Cafes">Restaurants, Cafes & Food</option>
            </select>
          </div>

          {/* Monthly Budget Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Monthly Marketing Budget
              </label>
              <span className="font-heading font-bold text-violet-400 text-lg">
                ₹{monthlyBudget.toLocaleString('en-IN')} / mo
              </span>
            </div>
            <input
              type="range"
              min="15000"
              max="300000"
              step="5000"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>₹15,000</span>
              <span>₹1,50,000</span>
              <span>₹3,00,000+</span>
            </div>
          </div>

          {/* Current Revenue */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Current Monthly Revenue
              </label>
              <span className="font-heading font-bold text-emerald-400 text-lg">
                ₹{monthlyRevenue.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="50000"
              max="2000000"
              step="50000"
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>

        {/* Calculated Results Card */}
        <div className="bg-gradient-to-br from-violet-950/60 to-slate-900 border border-violet-500/30 rounded-2xl p-5 mb-6 text-center sm:text-left">
          <h4 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-4 flex items-center justify-center sm:justify-start gap-2">
            <FaChartLine /> Projected Monthly Impact (Next 90 Days)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <p className="text-[11px] text-slate-400 uppercase font-medium">Est. Monthly Views</p>
              <p className="font-heading font-extrabold text-xl text-white mt-1">
                {(estimatedReach / 1000).toFixed(0)}K+
              </p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <p className="text-[11px] text-slate-400 uppercase font-medium">Est. Leads / Sales</p>
              <p className="font-heading font-extrabold text-xl text-emerald-400 mt-1">
                {estimatedLeads.toLocaleString('en-IN')}+
              </p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <p className="text-[11px] text-slate-400 uppercase font-medium">Est. Monthly Rev.</p>
              <p className="font-heading font-extrabold text-xl text-amber-400 mt-1">
                ₹{(projectedRevenue / 100000).toFixed(2)}L
              </p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <p className="text-[11px] text-slate-400 uppercase font-medium">Growth Boost</p>
              <p className="font-heading font-extrabold text-xl text-fuchsia-400 mt-1">
                +{roiGrowthPercent}%
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenConsultation({
                budget: `₹${monthlyBudget.toLocaleString('en-IN')}`,
                industry,
                expectedRevenue: `₹${(projectedRevenue / 100000).toFixed(2)} Lakhs`
              });
            }}
            className="flex-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 text-sm transition"
          >
            <FaRocket /> Claim This Growth Plan Now
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
};

export default ROICalculatorModal;
