import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaRocket, FaFire, FaCheckCircle, FaStar, FaShieldAlt,
  FaCalculator, FaChevronRight, FaChevronDown, FaTag, FaMagic
} from 'react-icons/fa';

const Pricing = () => {
  const { openConsultation, openCalculator } = useOutletContext();
  const [isQuarterly, setIsQuarterly] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const plans = [
    {
      id: 'starter',
      name: "Starter Growth",
      badge: "🌱 For Local Shops & Startups",
      monthlyPrice: 24999,
      quarterlyPrice: 19999,
      desc: "Perfect for local stores & small businesses looking for hyper-local footfalls & immediate lead generation.",
      popular: false,
      glowColor: "from-violet-500/20 to-indigo-500/10",
      borderColor: "border-slate-800 hover:border-violet-500/50",
      features: [
        "8 High-Retention Viral Reels / Shorts per Month",
        "Meta Ads Management (FB & Instagram)",
        "Google My Business (GMB) Local SEO Optimization",
        "Basic WhatsApp Auto-Responder Setup",
        "Dedicated Account Growth Manager",
        "Bi-Weekly Performance Calls & Reports"
      ],
      cta: "Launch Starter Growth"
    },
    {
      id: 'rocket',
      name: "Viral Rocket",
      badge: "🔥 MOST POPULAR - 10X GROWTH",
      monthlyPrice: 49999,
      quarterlyPrice: 39999,
      desc: "Comprehensive growth package for D2C, E-commerce, Real Estate & fast-scaling Indian brands.",
      popular: true,
      glowColor: "from-orange-500/30 via-amber-500/20 to-purple-500/20",
      borderColor: "border-2 border-orange-500 shadow-2xl shadow-orange-500/20",
      features: [
        "16 High-Retention Viral Reels / Shorts per Month",
        "Script-to-Screen Scripting & Creator Coordination",
        "Meta Ads + Google Search & Display Ads Scaling",
        "Complete WhatsApp AI Chatbot & Broadcast CRM",
        "Landing Page / Shopify Store Conversion Optimization",
        "A/B Testing of 10+ Creative Video Hooks",
        "Weekly Strategy Calls & 24/7 Priority Support"
      ],
      cta: "Launch Viral Rocket Plan"
    },
    {
      id: 'leader',
      name: "Market Leader",
      badge: "👑 Enterprise & Franchises",
      monthlyPrice: 99999,
      quarterlyPrice: 79999,
      desc: "Dominant market presence for high-volume brands, multi-location chains & enterprise D2C stores.",
      popular: false,
      glowColor: "from-amber-500/20 to-orange-500/10",
      borderColor: "border-slate-800 hover:border-amber-500/50",
      features: [
        "30+ High-Production Viral Reels & Shorts / Mo",
        "Dedicated On-Location Video Crew & Studio Editors",
        "Omnichannel Ads (Meta, Google, YouTube, LinkedIn, Zomato)",
        "Official WhatsApp Verified Blue Tick API Automation",
        "Micro & Macro Influencer Collab Management",
        "Custom Web App / E-commerce Funnel Development",
        "Dedicated Senior Growth Director & Custom Dashboard"
      ],
      cta: "Claim Market Leader Plan"
    }
  ];

  const faqs = [
    {
      q: "Are there any setup fees or hidden charges?",
      a: "No hidden charges whatsoever! The price listed is all-inclusive of campaign management, ad creative scripting, editing, and reporting."
    },
    {
      q: "Can I switch or upgrade my plan anytime?",
      a: "Yes, absolutely! You can upgrade your plan at any point during your billing cycle, and the remaining amount will be prorated automatically."
    },
    {
      q: "Who pays for the Meta & Google Ad spend?",
      a: "Ad spend is paid directly from your own Meta / Google Business ad accounts to ensure 100% transparency and account ownership."
    },
    {
      q: "What is the minimum contract commitment?",
      a: "We work on month-to-month contracts. You can cancel at any time with a simple 7-day advance notice."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 35, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', damping: 22, stiffness: 220 }
    }
  };

  return (
    <div className="space-y-20 pb-16 overflow-hidden">
      
      {/* Background Motion Glow Effects */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-600/10 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header with Animation */}
      <section className="pt-8 pb-10 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold mb-4"
        >
          <FaTag /> TRANSPARENT PRICING & GUARANTEED ROI
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading font-extrabold text-4xl sm:text-6xl text-white tracking-tight mt-2 leading-tight"
        >
          Invest in Revenue Growth, <br />
          <span className="text-gradient-fire">Not Just Marketing Services</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-300 text-base sm:text-lg mt-4 max-w-2xl mx-auto"
        >
          Clear, upfront growth plans with zero hidden fees. Select a plan or customize one for your specific target goals.
        </motion.p>

        {/* Animated Toggle Switch */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 inline-flex items-center p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md relative"
        >
          <button
            onClick={() => setIsQuarterly(false)}
            className={`relative z-10 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
              !isQuarterly ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {!isQuarterly && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-violet-600 rounded-xl shadow-lg shadow-violet-600/30"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">Monthly Billing</span>
          </button>

          <button
            onClick={() => setIsQuarterly(true)}
            className={`relative z-10 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              isQuarterly ? 'text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isQuarterly && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-400 rounded-xl shadow-lg shadow-orange-500/30"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">Quarterly Plan</span>
            <span className={`relative z-10 text-[10px] px-2 py-0.5 rounded-full border transition-all ${
              isQuarterly ? 'bg-slate-950 text-amber-400 border-amber-500/40 font-extrabold' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
            }`}>
              SAVE 20%
            </span>
          </button>
        </motion.div>
      </section>

      {/* Pricing Cards with Motion Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
        >
          {plans.map((plan) => {
            const price = isQuarterly ? plan.quarterlyPrice : plan.monthlyPrice;
            return (
              <motion.div
                key={plan.id}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative transition-all duration-300 ${plan.borderColor} ${
                  plan.popular ? 'z-20 lg:-translate-y-2' : ''
                }`}
              >
                {/* Background Gradient Glow */}
                <div className={`absolute inset-0 bg-gradient-to-b ${plan.glowColor} rounded-3xl opacity-50 pointer-events-none -z-10`} />

                {plan.popular && (
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 text-slate-950 font-extrabold text-[11px] uppercase tracking-wider px-4 py-1 rounded-full shadow-xl shadow-orange-500/30 flex items-center gap-1.5"
                  >
                    <FaFire className="animate-pulse" /> MOST POPULAR GROWTH PLAN
                  </motion.div>
                )}

                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1">{plan.badge}</span>
                  <h3 className="font-heading font-extrabold text-2xl text-white mb-2">{plan.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">{plan.desc}</p>

                  {/* Price Box */}
                  <div className="mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner">
                    <div className="flex items-baseline gap-1">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={price}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight"
                        >
                          ₹{price.toLocaleString('en-IN')}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-xs text-slate-400 font-medium">/ month</span>
                    </div>
                    {isQuarterly && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center gap-1"
                      >
                        <FaCheckCircle className="text-[10px]" /> Billed quarterly (Save ₹{((plan.monthlyPrice - plan.quarterlyPrice) * 3).toLocaleString('en-IN')} per quarter)
                      </motion.p>
                    )}
                  </div>

                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-1.5">
                    <FaMagic className="text-amber-400 text-xs" /> What's Included:
                  </h4>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat, fIdx) => (
                      <motion.li
                        key={fIdx}
                        whileHover={{ x: 3 }}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 group/item transition-all"
                      >
                        <FaCheckCircle className="text-emerald-400 text-sm flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                        <span className="group-hover/item:text-white transition-colors">{feat}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => openConsultation({ goal: `Selected Plan: ${plan.name} (₹${price}/mo)` })}
                    className={`w-full py-4 rounded-xl font-heading font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                      plan.popular
                        ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 text-slate-950 shadow-orange-500/25'
                        : 'bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white hover:border-slate-600'
                    }`}
                  >
                    <FaRocket /> {plan.cta}
                  </motion.button>
                  <button
                    onClick={() => openCalculator()}
                    className="w-full text-[11px] text-slate-400 hover:text-amber-400 transition text-center flex items-center justify-center gap-1 group/calc py-1 cursor-pointer"
                  >
                    <span>Calculate projected ROI for this plan</span>
                    <FaChevronRight className="text-[9px] group-hover/calc:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Trust & Guarantee Banner with Motion */}
      <section className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-8 border border-emerald-500/30 bg-emerald-950/20 flex flex-col md:flex-row items-center gap-6 text-center md:text-left shadow-2xl shadow-emerald-500/5 relative overflow-hidden"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-3xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
            <FaShieldAlt />
          </div>
          <div>
            <h3 className="font-heading font-bold text-xl text-white">100% Growth Commitment & Transparency Guarantee</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              No long-term lock-in contracts. You own 100% of all ad accounts, video creatives, and lead data generated. Cancel anytime with a 7-day advance notice.
            </p>
          </div>
        </motion.div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-xs uppercase font-bold tracking-widest text-violet-400 bg-violet-500/10 px-3.5 py-1.5 rounded-full border border-violet-500/20">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight mt-3">
            Pricing & Plan Details
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl border border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-900/50 transition cursor-pointer"
                >
                  <span className="font-heading font-bold text-sm sm:text-base text-white">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400"
                  >
                    <FaChevronDown size={12} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 border-t border-slate-800/60 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Custom Quote Request CTA */}
      <section className="max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-8 sm:p-12 border border-violet-500/30 bg-gradient-to-tr from-violet-950/60 via-slate-900 to-amber-950/30 relative overflow-hidden shadow-2xl"
        >
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-3">
            Need a Custom Enterprise Quote?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6">
            If you have specialized requirements, multi-city operations, or specific ad budget allocations, we can tailor a bespoke package.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openConsultation()}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-orange-500/20 inline-flex items-center gap-2 cursor-pointer"
          >
            <FaRocket /> Request Custom Quote & Proposal
          </motion.button>
        </motion.div>
      </section>

    </div>
  );
};

export default Pricing;
