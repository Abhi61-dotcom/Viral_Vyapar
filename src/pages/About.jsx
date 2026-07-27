import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { FaRocket, FaFire, FaBullseye, FaLightbulb, FaShieldAlt, FaUsers, FaAward, FaCheckCircle, FaHandshake } from 'react-icons/fa';

const About = () => {
  const { openConsultation } = useOutletContext();

  const values = [
    {
      icon: <FaFire className="text-3xl text-orange-400" />,
      title: "Viral Creativity First",
      desc: "Boring ads don't convert. We engineer hook-driven short-form reels and scroll-stopping visuals that command attention in under 3 seconds."
    },
    {
      icon: <FaBullseye className="text-3xl text-violet-400" />,
      title: "Obsessed with Revenue & ROAS",
      desc: "Vanity metrics like likes don't pay bills. Every campaign we launch is tracked down to verified leads, footfalls, and bankable sales."
    },
    {
      icon: <FaShieldAlt className="text-3xl text-emerald-400" />,
      title: "100% Transparent Growth",
      desc: "No hidden fees or obscure metrics. You get live dashboard access, weekly reporting calls, and clear ROI tracking from day 1."
    },
    {
      icon: <FaHandshake className="text-3xl text-amber-400" />,
      title: "Partners, Not Vendors",
      desc: "We treat your business like our own. Our dedicated growth managers work alongside your team to scale your revenue exponentially."
    }
  ];

  const team = [
    {
      name: "Rohan Verma",
      role: "Co-Founder & Chief Growth Strategist",
      bio: "Growth Marketer with 5+ years scaling D2C brands and local retail businesses.",
      badge: "🚀 Growth Specialist"
    },
    {
      name: "Priya Sundaram",
      role: "Head of Creative & Reel Strategy",
      bio: "Creative Director who has scripted over 100+ reels generating 2.5M+ organic views across Instagram & YouTube.",
      badge: "✨ Viral Reel Strategist"
    },
    {
      name: "Amitabh Roy",
      role: "Performance Marketing Lead",
      bio: "Google Ads & Meta Ads specialist managing performance campaigns at an average 4.2X ROAS.",
      badge: "📊 Performance Ads Specialist"
    },
    {
      name: "Sneha Kapoor",
      role: "Local SEO & WhatsApp Automation Lead",
      bio: "Local search expert who has optimized over 25+ local showrooms & clinics on Google Maps.",
      badge: "📍 GMB & CRM Specialist"
    }
  ];

  const milestones = [
    { year: "2023", title: "Viral Vyapar Founded", desc: "Started with a mission to empower local Indian retailers & D2C brands with viral short-form video marketing." },
    { year: "2024", title: "25+ Businesses Scaled", desc: "Crossed 2.5 Million organic reel views for D2C brands & local showrooms." },
    { year: "2025 - Present", title: "Full-Stack Growth Agency", desc: "Providing end-to-end Reels, Meta Ads, Google Maps SEO, and WhatsApp automation." }
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* Header */}
      <section className="relative pt-8 pb-12 text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold mb-4">
          <FaAward /> ABOUT VIRAL VYAPAR
        </div>
        <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-tight">
          We Turn Indian Businesses Into <br />
          <span className="text-gradient-fire">Viral Market Leaders</span>
        </h1>
        <p className="text-slate-300 text-base sm:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
          Viral Vyapar (वायरल व्यापार) was born out of a simple vision: to give local & online Indian businesses access to world-class viral video marketing, performance ads, and sales automation.
        </p>
      </section>

      {/* Stats Counter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-3xl p-6 text-center border border-slate-800">
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-orange-400">25+</span>
            <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Brands Scaled</p>
          </div>
          <div className="glass-card rounded-3xl p-6 text-center border border-slate-800">
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-violet-400">2.5M+</span>
            <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Organic Reel Views</p>
          </div>
          <div className="glass-card rounded-3xl p-6 text-center border border-slate-800">
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-emerald-400">4.2X</span>
            <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Average Client ROAS</p>
          </div>
          <div className="glass-card rounded-3xl p-6 text-center border border-slate-800">
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-amber-400">98%</span>
            <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Client Satisfaction</p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-violet-400 bg-violet-500/10 px-3.5 py-1.5 rounded-full border border-violet-500/20">
            OUR CORE PILLARS
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight mt-3">
            Why Top Brands Trust Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <div key={i} className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 flex gap-5 items-start">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex-shrink-0">
                {v.icon}
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-white mb-2">{v.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Showcase */}
      <section className="bg-slate-950/80 py-16 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-orange-400 bg-orange-500/10 px-3.5 py-1.5 rounded-full border border-orange-500/20">
              THE GROWTH WIZARDS
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight mt-3">
              Meet The Team Behind Your Growth
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className="glass-card rounded-3xl p-6 border border-slate-800 text-center flex flex-col justify-between">
                <div>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-600 to-orange-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-violet-600/30">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400">
                    {member.badge}
                  </span>
                  <h3 className="font-heading font-bold text-lg text-white mt-3">{member.name}</h3>
                  <p className="text-xs font-semibold text-violet-400 mb-3">{member.role}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Milestones */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
            OUR JOURNEY
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight mt-3">
            Milestones of Excellence
          </h2>
        </div>

        <div className="space-y-6">
          {milestones.map((m, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-heading font-extrabold text-2xl text-orange-400 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
                  {m.year}
                </span>
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">{m.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{m.desc}</p>
                </div>
              </div>
              <FaCheckCircle className="text-emerald-400 text-xl hidden sm:block" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 text-center">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-violet-500/30 bg-gradient-to-tr from-violet-950/60 to-slate-900">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-3">
            Ready to Partner with India's Premier Growth Team?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6">
            Book your free 30-minute growth consultation and receive a custom marketing strategy document.
          </p>
          <button
            onClick={() => openConsultation()}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-orange-500/20 inline-flex items-center gap-2 hover:scale-105 transition"
          >
            <FaRocket /> Book Free Strategy Call Now
          </button>
        </div>
      </section>

    </div>
  );
};

export default About;
