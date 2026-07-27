import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaRocket, FaEye, FaChartLine, FaCheckCircle, FaStar, FaPlay, FaFire, FaExternalLinkAlt } from 'react-icons/fa';

const Portfolio = () => {
  const { openConsultation } = useOutletContext();
  const [filter, setFilter] = useState('All');

  const caseStudies = [
    {
      category: 'Reels Marketing',
      title: 'Malhotra Furnishings - Hyper-Local Store Explosion',
      client: 'Retail Store, Delhi NCR',
      views: '2.4M Organic Views',
      metric: '+320% Store Footfall',
      roas: 'N/A (Retail Footfall)',
      desc: 'Created 12 hyper-local aesthetic reels showcasing viral home decor hacks. Generated 450+ direct WhatsApp inquiries in 30 days.',
      tags: ['Local Reels', 'Store Footfall', 'WhatsApp Bot']
    },
    {
      category: 'Performance Ads',
      title: 'Aura Skin D2C - Scaling Shopify Revenue',
      client: 'Skincare D2C Brand',
      views: '4.8M Ad Impressions',
      metric: '₹28L Monthly Revenue',
      roas: '5.2X Verified ROAS',
      desc: 'Replaced static product ads with creator UGC video reels. Reduced customer acquisition cost (CAC) by 62% in 45 days.',
      tags: ['Meta Ads', 'Shopify Funnel', 'UGC Reels']
    },
    {
      category: 'Local SEO',
      title: 'Dr. Khanna Dental - #1 Google Maps Ranking',
      client: 'Multi-Specialty Clinic, Gurugram',
      views: '15,000+ Local Searches',
      metric: '18 Daily Patient Leads',
      roas: '12X Patient ROI',
      desc: 'Optimized GMB profile, built 150+ local citations and automated 5-star review collection via WhatsApp.',
      tags: ['GMB Ranking', 'Local SEO', 'WhatsApp CRM']
    },
    {
      category: 'Performance Ads',
      title: 'Apex Heights - Real Estate Lead Gen',
      client: 'Luxury Apartments, Noida',
      views: '850K Targeted Views',
      metric: '140 Site Visit Leads',
      roas: '₹165 Cost Per Lead',
      desc: 'Shot high-definition drone property reels and launched targeted Meta lead forms with instant mobile OTP verification.',
      tags: ['Real Estate', 'Lead Gen', 'Drone Reels']
    },
    {
      category: 'E-Commerce Funnel',
      title: 'Kavya Ethnicwear - Festive Season Boom',
      client: 'Fashion E-Commerce',
      views: '3.1M Reels Views',
      metric: '4,200+ Orders Shipped',
      roas: '4.7X ROAS',
      desc: 'Designed high-speed mobile checkout funnel and executed festive influencer collab reels across Instagram.',
      tags: ['Shopify', 'Influencer Collab', 'Performance Ads']
    },
    {
      category: 'Reels Marketing',
      title: 'Spice Craft Kitchen - Viral Cafe Launch',
      client: 'Bistro & Cafe, Mumbai',
      views: '1.9M Local Views',
      metric: '600+ Weekend Bookings',
      roas: '3.8X ROI',
      desc: 'Produced mouth-watering viral food reels and partnered with top 10 Mumbai food creators for launch weekend.',
      tags: ['Food Reels', 'Influencer Event', 'Zomato Ads']
    }
  ];

  const categories = ['All', 'Reels Marketing', 'Performance Ads', 'Local SEO', 'E-Commerce Funnel'];

  const filteredItems = filter === 'All'
    ? caseStudies
    : caseStudies.filter(item => item.category === filter);

  return (
    <div className="space-y-20 pb-16">
      
      {/* Header */}
      <section className="pt-8 pb-10 text-center max-w-4xl mx-auto px-4">
        <span className="text-xs uppercase font-bold tracking-widest text-orange-400 bg-orange-500/10 px-3.5 py-1.5 rounded-full border border-orange-500/20">
          PROVEN CASE STUDIES
        </span>
        <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-white tracking-tight mt-4">
          Real Growth Campaigns That <br />
          <span className="text-gradient-fire">Generated Millions In Sales</span>
        </h1>
        <p className="text-slate-300 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
          Explore our real campaign results across Instagram Reels, Performance Ads, Local SEO, and E-commerce Funnels.
        </p>
      </section>

      {/* Filter Buttons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-heading font-semibold transition-all ${
                filter === cat
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-lg shadow-orange-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col justify-between hover:border-violet-500/40 transition group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
                    {item.category}
                  </span>
                  <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    {item.metric}
                  </span>
                </div>

                <div className="bg-gradient-to-tr from-slate-900 via-violet-950/40 to-slate-900 p-5 rounded-2xl border border-slate-800 mb-5">
                  <p className="text-xs text-slate-400 font-semibold">{item.client}</p>
                  <p className="font-heading font-extrabold text-2xl text-white mt-1">{item.views}</p>
                  <p className="text-xs text-amber-400 font-bold mt-1">ROAS / Return: {item.roas}</p>
                </div>

                <h3 className="font-heading font-bold text-xl text-white group-hover:text-amber-300 transition mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                  {item.desc}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {item.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[10px] font-medium bg-slate-900 text-slate-400 px-2.5 py-1 rounded-md border border-slate-800">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => openConsultation({ goal: `Replicate: ${item.title}` })}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-orange-400 flex items-center justify-center gap-2 transition"
              >
                <FaRocket /> Replicate This Result
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 text-center">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-violet-500/30 bg-gradient-to-tr from-violet-950/60 to-slate-900">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-3">
            Want Your Case Study Featured Next?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6">
            Let's analyze your current brand position and outline a roadmap to generate your first 1 Million views and 100+ daily sales.
          </p>
          <button
            onClick={() => openConsultation()}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-orange-500/20 inline-flex items-center gap-2 hover:scale-105 transition"
          >
            <FaRocket /> Claim Free Case Study Growth Strategy
          </button>
        </div>
      </section>

    </div>
  );
};

export default Portfolio;
