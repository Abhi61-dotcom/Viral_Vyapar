import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaRocket, FaFire, FaCheckCircle, FaStar, FaShieldAlt, FaCalculator, FaChevronRight } from 'react-icons/fa';

const Pricing = () => {
  const { openConsultation, openCalculator } = useOutletContext();
  const [isQuarterly, setIsQuarterly] = useState(false);

  const plans = [
    {
      name: "Starter Growth",
      badge: "🌱 For Local Shops & Startups",
      monthlyPrice: 24999,
      quarterlyPrice: 19999,
      desc: "Perfect for local stores & small businesses looking for hyper-local footfalls & immediate lead generation.",
      popular: false,
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
      name: "Viral Rocket",
      badge: "🔥 MOST POPULAR - 10X GROWTH",
      monthlyPrice: 49999,
      quarterlyPrice: 39999,
      desc: "Comprehensive growth package for D2C, E-commerce, Real Estate & fast-scaling Indian brands.",
      popular: true,
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
      name: "Market Leader",
      badge: "👑 Enterprise & Franchises",
      monthlyPrice: 99999,
      quarterlyPrice: 79999,
      desc: "Dominant market presence for high-volume brands, multi-location chains & enterprise D2C stores.",
      popular: false,
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

  return (
    <div className="space-y-20 pb-16">
      
      {/* Header */}
      <section className="pt-8 pb-10 text-center max-w-4xl mx-auto px-4">
        <span className="text-xs uppercase font-bold tracking-widest text-orange-400 bg-orange-500/10 px-3.5 py-1.5 rounded-full border border-orange-500/20">
          TRANSPARENT PRICING
        </span>
        <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-white tracking-tight mt-4">
          Invest in Revenue Growth, <br />
          <span className="text-gradient-fire">Not Just Marketing Services</span>
        </h1>
        <p className="text-slate-300 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
          Clear, upfront growth plans with zero hidden fees. Select a plan or customize one for your specific target goals.
        </p>

        {/* Toggle Switch */}
        <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setIsQuarterly(false)}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              !isQuarterly ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setIsQuarterly(true)}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
              isQuarterly ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Quarterly Plan</span>
            <span className="text-[10px] bg-slate-950 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
              SAVE 20%
            </span>
          </button>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const price = isQuarterly ? plan.quarterlyPrice : plan.monthlyPrice;
            return (
              <div
                key={idx}
                className={`glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative transition duration-300 ${
                  plan.popular
                    ? 'border-2 border-orange-500 bg-gradient-to-b from-orange-950/40 via-slate-900 to-slate-950 shadow-2xl shadow-orange-500/10 scale-105 z-10'
                    : 'border border-slate-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 font-extrabold text-[11px] uppercase tracking-wider px-4 py-1 rounded-full shadow-lg">
                    🔥 Recommended Growth Package
                  </div>
                )}

                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1">{plan.badge}</span>
                  <h3 className="font-heading font-extrabold text-2xl text-white mb-2">{plan.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">{plan.desc}</p>

                  <div className="mb-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">/ month</span>
                    </div>
                    {isQuarterly && (
                      <p className="text-[10px] text-emerald-400 font-semibold mt-1">
                        Billed quarterly (Save ₹{(plan.monthlyPrice - plan.quarterlyPrice) * 3} per quarter)
                      </p>
                    )}
                  </div>

                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">What's Included:</h4>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <FaCheckCircle className="text-emerald-400 text-sm flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => openConsultation({ goal: `Selected Plan: ${plan.name} (₹${price}/mo)` })}
                    className={`w-full py-4 rounded-xl font-heading font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 text-slate-950 shadow-xl shadow-orange-500/20'
                        : 'bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white'
                    }`}
                  >
                    <FaRocket /> {plan.cta}
                  </button>
                  <button
                    onClick={() => openCalculator()}
                    className="w-full text-[11px] text-slate-400 hover:text-white transition text-center"
                  >
                    Calculate projected ROI for this plan →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="glass-card rounded-3xl p-8 border border-emerald-500/30 bg-emerald-950/20 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-400 text-3xl flex items-center justify-center flex-shrink-0">
            <FaShieldAlt />
          </div>
          <div>
            <h3 className="font-heading font-bold text-xl text-white">100% Growth Commitment & Transparency Guarantee</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              No long-term lock-in contracts. You own 100% of all ad accounts, creatives, and leads generated. Cancel anytime with a 7-day advance notice.
            </p>
          </div>
        </div>
      </section>

      {/* Custom Quote Request CTA */}
      <section className="max-w-7xl mx-auto px-4 text-center">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-violet-500/30 bg-gradient-to-tr from-violet-950/60 to-slate-900">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-3">
            Need a Custom Enterprise Quote?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6">
            If you have specialized requirements, multi-city operations, or specific ad budget allocations, we can tailor a bespoke package.
          </p>
          <button
            onClick={() => openConsultation()}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-orange-500/20 inline-flex items-center gap-2 hover:scale-105 transition"
          >
            <FaRocket /> Request Custom Quote & Proposal
          </button>
        </div>
      </section>

    </div>
  );
};

export default Pricing;
