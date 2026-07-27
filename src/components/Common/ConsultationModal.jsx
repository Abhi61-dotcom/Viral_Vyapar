import React, { useState, useEffect } from 'react';
import { FaTimes, FaFire, FaCheckCircle, FaPhoneAlt, FaEnvelope, FaBuilding, FaUser, FaPaperPlane } from 'react-icons/fa';
import { submitLead } from '../../utils/api';

const ConsultationModal = ({ isOpen, onClose, initialData = {} }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    businessName: '',
    businessType: 'Local Business',
    goal: 'Increase Sales & Leads',
    budget: 'Not Specified Yet'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData?.industry) {
      setFormData(prev => ({
        ...prev,
        businessType: initialData.industry,
        budget: initialData.budget || prev.budget
      }));
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitLead({
        ...formData,
        source: 'Consultation Modal'
      });
    } catch (err) {
      console.warn('Backend submission error:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        const msg = encodeURIComponent(
          `Hi Viral Vyapar Team ! I submitted a request for a Free Audit.\nName: ${formData.fullName}\nBusiness: ${formData.businessName} (${formData.businessType})\nGoal: ${formData.goal}`
        );
        window.open(`https://wa.me/919667065637?text=${msg}`, '_blank');
      }, 1500);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl shadow-amber-500/10 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
        >
          <FaTimes size={18} />
        </button>

        {!isSubmitted ? (
          <>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
                <FaFire className="animate-pulse" /> LIMITED TIME OFFER: FREE AUDIT
              </div>
              <h3 className="font-heading font-bold text-2xl text-white">
                Get Your Free 30-Min <span className="text-amber-400">Viral Growth Blueprint</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                We'll analyze your business, competitor strategy & reveal how to get 10X more leads.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Full Name *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-500"><FaUser /></span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number (WhatsApp) *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-slate-500"><FaPhoneAlt /></span>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-slate-500"><FaEnvelope /></span>
                    <input
                      type="email"
                      required
                      placeholder="rahul@mybusiness.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Business Name *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-slate-500"><FaBuilding /></span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Apparel Store"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Business Sector</label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  >
                    <option value="E-commerce & D2C">E-commerce & D2C</option>
                    <option value="Local Business">Local Store / Showroom</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Services / Clinic / Coaching">Services / Clinic / Coaching</option>
                    <option value="Restaurant & Hospitality">Restaurant & Hospitality</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Primary Growth Goal</label>
                  <select
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  >
                    <option value="Increase Sales & Leads">Generate High Quality Leads & Direct Sales</option>
                    <option value="Viral Social Media Reach">Get Millions of Organic Views on Reels/Shorts</option>
                    <option value="Dominate Google Local Map">Rank #1 on Google Maps & Local Search</option>
                    <option value="Complete Rebranding & Website">Build High Converting Website & Funnel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Monthly Marketing Budget</label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  >
                    <option value="Not Specified Yet">Not Specified Yet</option>
                    <option value="Under ₹25,000 / mo">Under ₹25,000 / mo</option>
                    <option value="₹25,000 - ₹50,000 / mo">₹25,000 - ₹50,000 / mo</option>
                    <option value="₹50,000 - ₹1,00,000 / mo">₹50,000 - ₹1,00,000 / mo</option>
                    <option value="₹1,00,000+ / mo">₹1,00,000+ / mo (Scale-Up)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-amber-500/20 text-sm flex items-center justify-center gap-2 transition"
                >
                  <FaPaperPlane /> Request Free Growth Audit Session
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span className="flex items-center gap-1"><FaCheckCircle className="text-emerald-400" /> 100% Free Consultation</span>
                <span className="flex items-center gap-1"><FaCheckCircle className="text-emerald-400" /> No Obligation</span>
                <span className="flex items-center gap-1"><FaCheckCircle className="text-emerald-400" /> Instant Response</span>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 text-3xl flex items-center justify-center mx-auto mb-4 animate-bounce">
              <FaCheckCircle />
            </div>
            <h3 className="font-heading font-bold text-2xl text-white mb-2">Audit Request Received!</h3>
            <p className="text-sm text-slate-300 mb-6">
              Thank you <span className="text-amber-400 font-semibold">{formData.fullName}</span>. Our Viral Growth Strategist is connecting with you on WhatsApp right now.
            </p>
            <button
              onClick={handleReset}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationModal;
