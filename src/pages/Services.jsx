import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaRocket, FaBullhorn, FaChartLine, FaMapMarkerAlt, FaWhatsapp, FaMobileAlt, FaUsers, FaCheckCircle, FaArrowRight, FaCogs } from 'react-icons/fa';

const Services = () => {
  const { openConsultation } = useOutletContext();
  const [selectedService, setSelectedService] = useState(0);

  const services = [
    {
      icon: <FaBullhorn className="text-3xl text-orange-400" />,
      title: "Viral Reels & Short-Form Video Marketing",
      subtitle: "Command attention in under 3 seconds with high-retention Instagram Reels & YouTube Shorts.",
      features: [
        "Hook-driven viral scriptwriting tailored to Indian consumer psychology",
        "Professional shoot setup & studio editor workflows",
        "High-retention captions, sound design & trending audio selection",
        "Weekly content calendar & automated multi-platform publishing",
        "Organic reach optimization targeting your exact local city/demographic"
      ],
      result: "1M+ Organic Views & 10X Brand Recall"
    },
    {
      icon: <FaChartLine className="text-3xl text-violet-400" />,
      title: "ROAS-Driven Performance Marketing (Meta & Google Ads)",
      subtitle: "Stop wasting money on boosted posts. We build high-ROI conversion ad campaigns.",
      features: [
        "A/B testing of 10+ ad creatives and video hooks weekly",
        "Custom audience segmenting & retargeting pixel setup",
        "High-converting landing page & lead magnet creation",
        "Daily ad budget optimization to maximize ROAS & minimize CAC",
        "Transparent real-time lead reporting dashboard"
      ],
      result: "4.5X Average ROAS & 60% Lower Cost Per Acquisition"
    },
    {
      icon: <FaMapMarkerAlt className="text-3xl text-emerald-400" />,
      title: "Local SEO & Google My Business (GMB) Domination",
      subtitle: "Rank #1 on Google Maps when local customers search for your products or services near them.",
      features: [
        "Complete GMB profile optimization & verification",
        "Local keyword citation building & map pack ranking",
        "Automated 5-star customer review collection sequence",
        "Geo-tagged photo uploads & local area Schema markup",
        "Hyper-local store visit campaign tracking"
      ],
      result: "#1 Rank Guarantee & 300% More Store Inquiries"
    },
    {
      icon: <FaWhatsapp className="text-3xl text-teal-400" />,
      title: "WhatsApp AI Chatbot & CRM Automation",
      subtitle: "Turn 100% of incoming leads into instant conversations & sales on WhatsApp.",
      features: [
        "Official WhatsApp Business API setup & Blue Tick assistance",
        "Instant AI chatbot reply sequences for 24/7 lead qualification",
        "Automated abandoned cart & follow-up broadcast campaigns",
        "Multi-agent live chat dashboard for your sales team",
        "CRM integration with Shopify, WooCommerce, and lead forms"
      ],
      result: "98% Open Rate & Instant 2-Min Lead Response Time"
    },
    {
      icon: <FaMobileAlt className="text-3xl text-pink-400" />,
      title: "E-Commerce & High-Converting Funnel Development",
      subtitle: "Lightning-fast websites designed to turn cold visitors into repeat paying customers.",
      features: [
        "Shopify / Custom React web application development",
        "Mobile-first responsive design optimized for Indian 4G/5G users",
        "1-Click checkout & UPI/Razorpay payment gateway integration",
        "Speed optimization (under 2-second page load guarantee)",
        "Conversion Rate Optimization (CRO) heatmaps & A/B testing"
      ],
      result: "3X Store Conversion Rate & 0% Cart Friction"
    },
    {
      icon: <FaUsers className="text-3xl text-cyan-400" />,
      title: "Creator & Influencer Collaboration Campaigns",
      subtitle: "Leverage trusted local & niche influencers to build instant credibility.",
      features: [
        "Curated database of 5,000+ verified Indian micro & macro creators",
        "End-to-end creator negotiations, contract handling & briefing",
        "Barter & paid campaign management for maximum ROI",
        "Rights management for using influencer content as performance ads",
        "Tracking trackable promo codes and affiliate sales links"
      ],
      result: "Massive Brand Social Proof & Instant Trust Surge"
    }
  ];

  const steps = [
    { num: "01", title: "Discovery & Growth Audit", desc: "We analyze your business model, current marketing performance, target audience, and top competitors." },
    { num: "02", title: "Viral Blueprint & Scripting", desc: "Our creative directors draft high-converting video scripts, ad hooks, and local targeting strategies." },
    { num: "03", title: "Production & Launch", desc: "We produce aesthetic reels, design ad creatives, build WhatsApp bots, and launch campaigns within 48 hours." },
    { num: "04", title: "Scale to Infinity", desc: "We double down on winning creatives, optimize ad spend daily, and scale your monthly sales predictably." }
  ];

  return (
    <div className="space-y-24 pb-16">
      
      {/* Header */}
      <section className="pt-8 pb-10 text-center max-w-4xl mx-auto px-4">
        <span className="text-xs uppercase font-bold tracking-widest text-orange-400 bg-orange-500/10 px-3.5 py-1.5 rounded-full border border-orange-500/20">
          OUR SERVICES
        </span>
        <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-white tracking-tight mt-4">
          End-to-End Digital Services Designed to <br />
          <span className="text-gradient-fire">Explode Your Revenue</span>
        </h1>
        <p className="text-slate-300 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
          We combine cutting-edge viral short video content, performance ads, and automated WhatsApp funnels to deliver guaranteed growth.
        </p>
      </section>

      {/* Services Breakdown Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((s, idx) => (
            <div key={idx} className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col justify-between hover:border-violet-500/40 transition">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                    {s.icon}
                  </div>
                  <span className="text-[11px] font-extrabold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {s.result}
                  </span>
                </div>

                <h3 className="font-heading font-extrabold text-2xl text-white mb-2">{s.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-6">{s.subtitle}</p>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Key Deliverables:</h4>
                <ul className="space-y-2.5 mb-6">
                  {s.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <FaCheckCircle className="text-violet-400 text-sm flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => openConsultation({ goal: s.title })}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition"
                >
                  <FaRocket /> Book This Service
                </button>
                <span className="text-xs text-slate-500 font-medium">Customizable Plan</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4-Step Viral Process */}
      <section className="bg-slate-950/80 py-16 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-violet-400 bg-violet-500/10 px-3.5 py-1.5 rounded-full border border-violet-500/20">
              OUR 4-STEP BLUEPRINT
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight mt-3">
              How We Take Your Business Viral
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between hover:border-orange-500/40 hover:scale-[1.02] transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-11 h-11 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 font-heading font-extrabold text-lg flex items-center justify-center shadow-lg shadow-orange-500/10">
                      {step.num}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
                      Step 0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-white mb-2 leading-snug">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 text-center">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-violet-500/30 bg-gradient-to-tr from-violet-950/60 to-slate-900">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-3">
            Need a Custom Marketing Service Package?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6">
            We build custom tailored growth packages designed specifically for your budget and business goal.
          </p>
          <button
            onClick={() => openConsultation()}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-orange-500/20 inline-flex items-center gap-2 hover:scale-105 transition"
          >
            <FaCogs /> Build My Custom Service Plan
          </button>
        </div>
      </section>

    </div>
  );
};

export default Services;
