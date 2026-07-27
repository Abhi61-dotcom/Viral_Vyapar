import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiGift, FiMail, FiPhone, FiUser, FiCheckCircle, FiStar, FiArrowRight } from 'react-icons/fi';
import { submitLead } from '../../utils/api';

// Module-level flag: resets every time website is fully reloaded/refreshed
let isHandledInThisPageLoad = false;

const LeadCaptureModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    // Clear legacy storage items so no old persistence blocks popup
    localStorage.removeItem('vv_lead_handled');
    sessionStorage.removeItem('vv_lead_handled');

    if (isHandledInThisPageLoad) {
      return;
    }

    // Show popup automatically 6 seconds after visitor lands on site
    const timer = setTimeout(() => {
      if (!isHandledInThisPageLoad) {
        setIsOpen(true);
      }
    }, 6000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    isHandledInThisPageLoad = true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email && !formData.phone) return;

    setLoading(true);
    isHandledInThisPageLoad = true;

    try {
      await submitLead({
        fullName: formData.fullName || 'Website Visitor',
        email: formData.email,
        phone: formData.phone || 'N/A',
        businessName: 'Visitor Inquiry',
        goal: 'Free Growth Blueprint & Audit',
        source: 'Instant Lead Magnet Popup'
      });

      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 1800);
    } catch (err) {
      console.error('Lead submission error:', err);
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer"
        >
          {/* Modal Container */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-orange-500/30 bg-slate-950 p-6 md:p-8 shadow-2xl shadow-orange-500/20 cursor-default"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="absolute top-4 right-4 z-50 p-2.5 text-slate-300 hover:text-white rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all hover:scale-110 cursor-pointer shadow-xl"
              aria-label="Close"
            >
              <FiX className="w-5 h-5 text-white" />
            </button>

            {!submitted ? (
              <div className="relative z-10 space-y-5 text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1.5 text-xs font-semibold text-orange-400">
                  <FiGift className="w-4 h-4 animate-bounce" />
                  <span>EXCLUSIVE FREE GIFT FOR VISITORS</span>
                </div>

                {/* Headline */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                    Get Free <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">Viral Growth Blueprint</span> 🚀
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">
                    Enter your email to unlock our <b>₹15,000 Reels & Meta Ads Strategy Guide</b> + Get a 1-on-1 Free Growth Audit!
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Your Name (Optional)"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400 w-4 h-4" />
                    <input
                      type="email"
                      required
                      placeholder="Enter Your Email Address *"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-orange-500/40 bg-slate-900/90 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 font-medium"
                    />
                  </div>

                  <div className="relative">
                    <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="tel"
                      placeholder="WhatsApp Number (Optional)"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-6 py-3.5 text-center text-sm font-bold text-slate-950 shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] hover:shadow-orange-500/40 active:scale-95 disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <span>Sending Free Blueprint...</span>
                      ) : (
                        <>
                          <span>Claim Free Blueprint & Audit</span>
                          <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <span className="flex items-center gap-1"><FiCheckCircle className="text-emerald-400 w-3.5 h-3.5" /> 100% Free</span>
                  <span className="flex items-center gap-1"><FiStar className="text-amber-400 w-3.5 h-3.5" /> No Spam Guarantee</span>
                  <span className="flex items-center gap-1"><FiCheckCircle className="text-emerald-400 w-3.5 h-3.5" /> Instant Delivery</span>
                </div>
              </div>
            ) : (
              /* Success State */
              <div className="relative z-10 py-8 text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                >
                  <FiCheckCircle className="w-10 h-10" />
                </motion.div>
                <h4 className="text-2xl font-bold text-white">Blueprint Sent Successfully! 🎉</h4>
                <p className="text-sm text-slate-300 max-w-xs mx-auto">
                  We have received your email <b>{formData.email}</b>. Our Growth Team will reach out with your free strategy guide within 10 minutes!
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LeadCaptureModal;
