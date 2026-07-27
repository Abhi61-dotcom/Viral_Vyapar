import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { submitLead } from '../utils/api';
import {
  FaRocket, FaFire, FaChartLine, FaCheckCircle, FaStar,
  FaPlay, FaEye, FaUsers, FaCoins, FaBullhorn, FaMapMarkerAlt,
  FaWhatsapp, FaCalculator, FaChevronRight, FaArrowRight, FaLightbulb,
  FaQuestionCircle, FaShieldAlt, FaMobileAlt, FaSearchDollar, FaEnvelope
} from 'react-icons/fa';

// Framer Motion Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
};

const Home = () => {
  const { openCalculator, openConsultation } = useOutletContext();

  const [activeTab, setActiveTab] = useState('E-commerce');
  const [activeFaq, setActiveFaq] = useState(0);

  // Industry Tab Content
  const industryData = {
    'E-commerce': {
      title: 'E-commerce & D2C Brands',
      subtitle: 'Scale your monthly revenue with viral Reels style ad creatives & high-converting product funnels.',
      stats: ['3.8X Avg ROAS', '45% Lower CAC', '500K+ Video Views'],
      highlights: [
        'Viral UGC (User Generated Content) Video Reels',
        'Retargeting & Abandoned Cart Automation via WhatsApp',
        'Shopify / Custom Store Conversion Rate Optimization',
        'Meta Ads (FB/IG) & Google Shopping Ads Setup'
      ]
    },
    'Local Retail': {
      title: 'Local Retail & Showrooms',
      subtitle: 'Drive steady footfalls into your physical store using hyper-local geo-targeted ads & Google Maps ranking.',
      stats: ['150% Footfall Increase', '#1 Google Map Ranking', '25+ Weekly Store Inquiries'],
      highlights: [
        'Google My Business (GMB) #1 Rank Optimization',
        'Hyper-Local Instagram & Facebook Video Ads (5-10km radius)',
        'WhatsApp Store Catalog & Instant Inquiry Setup',
        'Festival & Flash Sale Campaign Management'
      ]
    },
    'Real Estate': {
      title: 'Real Estate & Property Developers',
      subtitle: 'Generate high-intent site visit leads for apartments, plots, and commercial spaces.',
      stats: ['₹85 Lakhs+ Property Value Inquiries', '₹240 Avg Lead Cost', '85% Verified Buyers'],
      highlights: [
        'Cinematic Property Tour & Walkthrough Reels',
        'High-Intent Meta Lead Generation Forms with Instant WhatsApp Alert',
        'Automated Nurturing via WhatsApp & SMS',
        'Local Builder & Agent Personal Branding'
      ]
    },
    'Coaching & Services': {
      title: 'Coaching, EdTech & Consultants',
      subtitle: 'Fill your workshops, consultations, and courses with pre-qualified clients.',
      stats: ['250+ Workshop Attendees', '4.5X Event ROI', 'Automated Lead Flow'],
      highlights: [
        'Personal Brand Reel Creation & Content Scripts',
        'High-Converting Landing Page & Workshop Funnel Setup',
        'Automated Lead Follow-up via WhatsApp',
        'Targeted Meta & YouTube In-Stream Ads'
      ]
    },
    'Restaurants & Food': {
      title: 'Restaurants, Cafes & Food Brands',
      subtitle: 'Mouth-watering viral reel content that highlights your best dishes across your city.',
      stats: ['150K+ Local Views', '120+ Weekend Bookings', 'Top Rated Local Spot'],
      highlights: [
        'Foodie & Micro-Influencer Collaboration Campaigns',
        'Aesthetic High-Resolution Food Reels & Stories',
        'Zomato / Swiggy Ads & Local Promotion Guidance',
        'Table Reservation & WhatsApp Menu Integration'
      ]
    }
  };

  const servicesList = [
    {
      icon: <FaBullhorn className="text-3xl text-orange-400" />,
      title: "Viral Reels & Short Video Marketing",
      desc: "Script-to-screen high-retention Instagram Reels & YouTube Shorts that turn viewers into paying customers.",
      badge: "🔥 Most Popular",
      link: "/services"
    },
    {
      icon: <FaChartLine className="text-3xl text-violet-400" />,
      title: "Performance Ads (Meta & Google)",
      desc: "ROAS-driven ad campaigns designed to maximize ROI, lower CAC, and generate consistent high-quality leads.",
      badge: "⚡ High ROI",
      link: "/services"
    },
    {
      icon: <FaMapMarkerAlt className="text-3xl text-emerald-400" />,
      title: "Local SEO & GMB Optimization",
      desc: "Rank higher on local Google searches & map packs so local customers find your business first.",
      badge: "📍 Local Growth",
      link: "/services"
    },
    {
      icon: <FaWhatsapp className="text-3xl text-teal-400" />,
      title: "WhatsApp Automation & Lead CRM",
      desc: "Never miss a lead. Automated instant replies, broadcast campaigns, and automated sales follow-ups on WhatsApp.",
      badge: "🤖 Automated",
      link: "/services"
    },
    {
      icon: <FaMobileAlt className="text-3xl text-pink-400" />,
      title: "High-Converting Websites & Funnels",
      desc: "Lightning-fast, mobile-first websites and landing pages built to convert visitors into phone calls & orders.",
      badge: "🚀 Higher Conversion",
      link: "/services"
    },
    {
      icon: <FaUsers className="text-3xl text-cyan-400" />,
      title: "Micro-Influencer Collaborations",
      desc: "Partner with relevant creators in your city/niche to build instant trust and genuine organic reach.",
      badge: "🌟 Organic Boost",
      link: "/services"
    }
  ];

  const portfolioHighlights = [
    {
      title: "Royal Furnishings - Local Store Growth",
      industry: "Furniture Retail",
      metric: "+180% Footfall Increase",
      views: "250K Reels Views",
      imageTag: "🛋️ Furniture Brand",
      desc: "Hyper-local reel campaign generated 85+ store visit inquiries in 30 days."
    },
    {
      title: "GlamSkin D2C - E-commerce Scaling",
      industry: "Beauty & Cosmetics",
      metric: "4.2X ROAS",
      views: "480K Video Views",
      imageTag: "✨ Beauty D2C",
      desc: "Scaled monthly Shopify revenue from ₹50,000 to ₹3.5 Lakhs in 60 days."
    },
    {
      title: "Skyline Heights - Real Estate Leads",
      industry: "Local Real Estate",
      metric: "35 Site Visit Leads",
      views: "₹240 Per Lead",
      imageTag: "🏢 Real Estate",
      desc: "Property tour reel ads generated verified buyer leads for site visits."
    }
  ];

  const testimonials = [
    {
      name: "Vikram Malhotra",
      role: "Founder, Malhotra Electronics",
      location: "Delhi NCR",
      rating: 5,
      comment: "Viral Vyapar helped our retail store gain great traction! Their hyper-local reels got us over 150,000 views in Delhi NCR, and footfalls have visibly increased.",
      metric: "1.8X Sales Growth"
    },
    {
      name: "Ananya Sharma",
      role: "CEO, OrganicGlow Botanicals",
      location: "Mumbai",
      rating: 5,
      comment: "We were struggling with ad costs until Viral Vyapar optimized our ad creatives. Their UGC video reels brought down our acquisition cost significantly!",
      metric: "₹3.5L Monthly Revenue"
    },
    {
      name: "Dr. Rajesh Verma",
      role: "Managing Director, Apex Dental Clinic",
      location: "Gurugram",
      rating: 5,
      comment: "Their GMB optimization got our clinic on top of local Google Map results. We now get 5-8 genuine appointment inquiries every week on WhatsApp!",
      metric: "5-8 Weekly Leads"
    }
  ];

  const faqs = [
    {
      q: "How fast can Viral Vyapar start generating results for my business?",
      a: "We launch your campaigns within 48 hours of onboarding! For Performance Ads, you will start seeing leads and traffic from Day 1. For Reels & Organic viral campaigns, momentum builds rapidly within the first 7-14 days."
    },
    {
      q: "What makes Viral Vyapar different from traditional marketing agencies?",
      a: "Unlike traditional agencies that focus on vanity metrics like impressions, Viral Vyapar is 100% revenue and ROI focused. We combine script-to-screen reel creation, high-converting ad copy, and automated WhatsApp nurturing to deliver actual revenue."
    },
    {
      q: "Do I need a large marketing budget to work with you?",
      a: "Not at all! We have scalable growth packages designed specifically for Indian small & medium businesses starting from just ₹15,000/month. Use our ROI Calculator to see expected returns based on your budget."
    },
    {
      q: "Will your team handle the video creation, shooting, and editing?",
      a: "Yes, 100%! We provide end-to-end service including scriptwriting, video shooting/creator coordination, high-retention video editing, trending audio selection, and ad setup."
    },
    {
      q: "What industries do you specialize in?",
      a: "We specialize in E-commerce & D2C, Local Retail Stores, Real Estate, Clinics & Healthcare, Coaching/Education, and Restaurants. Our strategies are customized for your specific audience."
    }
  ];

  return (
    <div className="space-y-24 pb-16 overflow-hidden">
      
      {/* 1. HERO SECTION WITH DYNAMIC GLOW ANIMATIONS */}
      <section className="relative pt-6 sm:pt-14 pb-16 overflow-hidden">
        {/* Animated Background Glowing Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.25, 0.45, 0.25],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-violet-600/30 via-amber-500/20 to-orange-500/30 rounded-full blur-[130px] pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto space-y-6"
          >
            {/* Top Glowing Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-amber-500/40 text-amber-400 text-xs sm:text-sm font-semibold shadow-xl shadow-amber-500/10">
              <motion.span animate={{ rotate: [0, 20, 0, -20, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <FaFire className="text-orange-500 text-base" />
              </motion.span>
              <span>India's Fast-Growing Digital & Viral Marketing Agency</span>
            </motion.div>

            {/* Main Animated Headline */}
            <motion.h1 variants={fadeInUp} className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.1]">
              Transform Your Business Into A <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 via-pink-400 to-violet-400 bg-300% animate-gradient">
                Viral Brand & Scale 5X
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={fadeInUp} className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
              We create high-retention Reels, ROAS-driven Meta/Google Ads, and WhatsApp lead funnels that drive steady sales & qualified inquiries for growing Indian businesses.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(249, 115, 22, 0.4)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openConsultation()}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-violet-600 text-slate-950 font-heading font-bold text-base shadow-xl flex items-center justify-center gap-3 transition"
              >
                <FaRocket className="text-lg animate-bounce" /> Get Free 30-Min Growth Audit
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, borderColor: 'rgba(168, 85, 247, 0.8)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openCalculator()}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-heading font-semibold text-base transition flex items-center justify-center gap-3"
              >
                <FaCalculator className="text-violet-400 text-lg" /> Calculate Your ROI
              </motion.button>
            </motion.div>

            {/* Instant Visitor Email Capture Bar with Glowing Border Beam */}
            <motion.div variants={fadeInUp} className="pt-2 max-w-xl mx-auto">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const emailInput = e.target.elements.visitorEmail.value;
                  if (!emailInput) return;
                  try {
                    await submitLead({
                      fullName: 'Website Visitor',
                      email: emailInput,
                      source: 'Hero Direct Email Bar',
                      goal: 'Free Growth Audit & Blueprint'
                    });
                    alert('🎉 Email captured successfully! Check Admin Control Portal on Port 5175.');
                    e.target.reset();
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-slate-900/90 border border-orange-500/50 rounded-2xl shadow-xl shadow-orange-500/20 backdrop-blur-md transition-all hover:border-orange-400"
              >
                <div className="relative flex-1 w-full">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400 text-sm" />
                  <input
                    type="email"
                    name="visitorEmail"
                    required
                    placeholder="Enter your email to claim ₹15,000 Free Blueprint..."
                    className="w-full pl-10 pr-4 py-3 bg-transparent text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none font-medium"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 whitespace-nowrap shadow-md shadow-orange-500/20"
                >
                  <FaRocket /> Claim Free Blueprint
                </motion.button>
              </form>
            </motion.div>

            {/* Trust Badges */}
            <motion.div variants={fadeInUp} className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5"><FaCheckCircle className="text-emerald-400" /> 15+ Brands Scaled</span>
              <span className="flex items-center gap-1.5"><FaCheckCircle className="text-emerald-400" /> 450K+ Organic Views</span>
              <span className="flex items-center gap-1.5"><FaCheckCircle className="text-emerald-400" /> 2.8X - 3.5X Average Client ROAS</span>
            </motion.div>

          </motion.div>

          {/* Metric Dashboard Mockup Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-14 max-w-5xl mx-auto glass-card rounded-3xl p-6 sm:p-8 border border-violet-500/30 shadow-2xl relative group"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs uppercase tracking-widest text-violet-400 font-bold">REAL CAMPAIGN METRICS</span>
                <h3 className="font-heading font-bold text-xl text-white mt-1">Viral Vyapar Growth Engine Dashboard</h3>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-emerald-500/20">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                Active Campaigns Delivering Consistent Growth
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { title: 'Total Video Views', value: '85,400+', note: '+65% organic reach', color: 'text-orange-400', icon: <FaChartLine /> },
                { title: 'Qualified Leads', value: '240+', note: 'Instant WhatsApp delivery', color: 'text-violet-400', icon: <FaCheckCircle /> },
                { title: 'Avg Ad ROAS', value: '3.20X', note: 'Verified returns', color: 'text-emerald-400', icon: <FaCoins /> },
                { title: 'Client Revenue', value: '₹4.5 Lakhs+', note: 'Scaled across local businesses', color: 'text-amber-400', icon: <FaFire /> },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.04, y: -4 }}
                  className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-center sm:text-left transition-all hover:border-slate-700"
                >
                  <p className="text-xs text-slate-400 font-medium">{stat.title}</p>
                  <p className={`font-heading font-extrabold text-2xl sm:text-3xl ${stat.color} mt-1`}>{stat.value}</p>
                  <span className="text-[10px] text-emerald-400 flex items-center justify-center sm:justify-start gap-1 mt-1 font-semibold">
                    {stat.icon} {stat.note}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. CORE SERVICES SECTION WITH STAGGERED FADE IN & HOVER GLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="space-y-12"
        >
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs uppercase font-bold tracking-widest text-orange-400 bg-orange-500/10 px-3.5 py-1.5 rounded-full border border-orange-500/20">
              OUR VIRAL SOLUTIONS
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight mt-4">
              Everything You Need To <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-violet-400 bg-clip-text text-transparent">Dominate Your Market</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3">
              From viral scriptwriting to high-converting performance ads, we handle everything end-to-end so you can focus on running your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesList.map((service, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between group hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 group-hover:border-orange-500/40 group-hover:scale-110 transition-all duration-300">
                      {service.icon}
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-violet-300">
                      {service.badge}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-white group-hover:text-amber-300 transition-colors mb-2">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                    {service.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <Link
                    to={service.link}
                    className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 group-hover:text-orange-400 transition"
                  >
                    Explore Service <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button
                    onClick={() => openConsultation()}
                    className="text-xs font-semibold text-violet-400 hover:text-violet-300"
                  >
                    Book Strategy
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 3. INTERACTIVE INDUSTRY SOLUTIONS TAB SECTION */}
      <section className="bg-slate-950/80 py-16 border-y border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs uppercase font-bold tracking-widest text-violet-400 bg-violet-500/10 px-3.5 py-1.5 rounded-full border border-violet-500/20">
              TAILORED GROWTH
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight mt-4">
              Custom Marketing Blueprints <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">For Every Sector</span>
            </h2>
          </div>

          {/* Interactive Sliding Pill Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {Object.keys(industryData).map((ind) => {
              const isActive = activeTab === ind;
              return (
                <button
                  key={ind}
                  onClick={() => setActiveTab(ind)}
                  className={`relative px-5 py-3 rounded-2xl text-xs sm:text-sm font-heading font-semibold transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-gradient-to-r from-violet-600 to-orange-500 rounded-2xl shadow-lg shadow-violet-600/30"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{ind}</span>
                </button>
              );
            })}
          </div>

          {/* Animated Active Tab Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-card rounded-3xl p-6 sm:p-10 border border-violet-500/30 max-w-5xl mx-auto shadow-2xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                    {industryData[activeTab].title} Strategy
                  </span>
                  <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white mt-2 mb-3">
                    {industryData[activeTab].subtitle}
                  </h3>
                  
                  <ul className="space-y-3 mb-6">
                    {industryData[activeTab].highlights.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-3 text-xs sm:text-sm text-slate-300"
                      >
                        <FaCheckCircle className="text-emerald-400 text-base flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => openConsultation({ industry: activeTab })}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/20 flex items-center gap-2 transition"
                  >
                    <FaRocket /> Get Strategy for {activeTab}
                  </motion.button>
                </div>

                <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-4">
                  <h4 className="font-heading font-bold text-sm text-slate-200 uppercase tracking-wider">
                    Proven Growth Benchmarks
                  </h4>
                  <div className="space-y-3">
                    {industryData[activeTab].stats.map((stat, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.03 }}
                        className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                      >
                        <span className="text-xs text-slate-300 font-medium">Verified Result #{i + 1}</span>
                        <span className="font-heading font-extrabold text-base text-amber-400">{stat}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      {/* 4. PORTFOLIO SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="space-y-10"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
                VIRAL SUCCESS STORIES
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight mt-4">
                Real Brands, Real Views, <br />
                <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">Real Revenue</span>
              </h2>
            </div>
            <Link
              to="/portfolio"
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold inline-flex items-center gap-2 self-start md:self-auto hover:border-orange-400 transition"
            >
              View Full Portfolio <FaChevronRight size={10} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolioHighlights.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between group hover:border-violet-500/50 hover:shadow-2xl transition duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase">{item.industry}</span>
                    <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      {item.metric}
                    </span>
                  </div>
                  
                  <div className="bg-gradient-to-tr from-violet-950/80 to-slate-900 rounded-2xl p-6 border border-slate-800 mb-4 text-center group-hover:border-violet-500/30 transition">
                    <span className="text-3xl mb-2 block">{item.imageTag.split(' ')[0]}</span>
                    <p className="font-heading font-extrabold text-2xl text-white">{item.views}</p>
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Organic Reach Achieved</p>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{item.desc}</p>
                </div>

                <button
                  onClick={() => openConsultation()}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-orange-400 flex items-center justify-center gap-2 transition group-hover:border-orange-500/30"
                >
                  Replicate This Result <FaArrowRight size={10} />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 5. TESTIMONIALS WALL */}
      <section className="bg-slate-950/60 py-16 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
                CLIENT REVIEWS
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight mt-4">
                Loved By <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">500+ Business Owners</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between hover:border-amber-500/40 transition duration-300"
                >
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-3">
                      {[...Array(t.rating)].map((_, i) => (
                        <FaStar key={i} size={14} />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed mb-4">
                      "{t.comment}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-sm text-white">{t.name}</h4>
                      <p className="text-[11px] text-slate-400">{t.role} • {t.location}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      {t.metric}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION WITH ANIMATED TOGGLE */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="space-y-8"
        >
          <div className="text-center">
            <span className="text-xs uppercase font-bold tracking-widest text-violet-400 bg-violet-500/10 px-3.5 py-1.5 rounded-full border border-violet-500/20">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight mt-3">
              Got Questions? We Have Answers
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="glass-card rounded-2xl border border-slate-800 overflow-hidden transition"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? -1 : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-heading font-bold text-sm sm:text-base text-white hover:text-orange-400 transition"
                  >
                    <span className="flex items-center gap-2">
                      <FaQuestionCircle className="text-violet-400 text-sm flex-shrink-0" />
                      {faq.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-slate-400 text-lg font-bold"
                    >
                      {isOpen ? '−' : '+'}
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* 7. BOTTOM HIGH CONVERTING CTA BANNER WITH PULSING GLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-3xl p-8 sm:p-12 border border-orange-500/40 bg-gradient-to-r from-orange-950/70 via-slate-900 to-violet-950/70 text-center relative overflow-hidden shadow-2xl shadow-orange-500/10"
        >
          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30">
              <FaFire className="animate-pulse text-orange-400" /> ONLY 3 FREE AUDIT SLOTS REMAINING THIS WEEK
            </span>

            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              Ready To Make Your Business <br />
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">Go Viral & 10X Sales?</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
              Don't leave your revenue to chance. Partner with India's premier viral growth marketing team today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.06, boxShadow: '0 20px 40px rgba(249, 115, 22, 0.4)' }}
                whileTap={{ scale: 0.96 }}
                onClick={() => openConsultation()}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-heading font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition"
              >
                <FaRocket /> Book My Free Growth Strategy Session
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => openCalculator()}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-heading font-semibold text-sm transition flex items-center justify-center gap-2"
              >
                <FaCalculator className="text-violet-400" /> Calculate Growth Potential
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default Home;