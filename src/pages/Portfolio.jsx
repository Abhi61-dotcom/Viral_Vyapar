import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaRocket, FaEye, FaChartLine, FaCheckCircle, FaStar, FaPlay, FaFire, FaExternalLinkAlt } from 'react-icons/fa';

const Portfolio = () => {
  const { openConsultation } = useOutletContext();
  const [filter, setFilter] = useState('All');

  const caseStudies = [
    {
      category: 'Reels Marketing',
      title: 'Malhotra Furnishings - Hyper-Local Store Growth',
      client: 'Retail Store, Delhi NCR',
      views: '85K Organic Views',
      metric: '+85% Store Footfall',
      roas: 'N/A (Retail Footfall)',
      desc: 'Created hyper-local aesthetic reels showcasing trending home decor hacks. Generated 65+ direct WhatsApp inquiries in 30 days.',
      tags: ['Local Reels', 'Store Footfall', 'WhatsApp Nurture']
    },
    {
      category: 'Performance Ads',
      title: 'Aura Skin D2C - Scaling Shopify Sales',
      client: 'Skincare D2C Brand',
      views: '120K Ad Reach',
      metric: '₹3.5L Sales Generated',
      roas: '3.2X Verified ROAS',
      desc: 'Replaced static product ads with creator UGC video reels. Reduced customer acquisition cost (CAC) by 35% in 45 days.',
      tags: ['Meta Ads', 'Shopify Funnel', 'UGC Reels']
    },
    {
      category: 'Local SEO',
      title: 'Dr. Khanna Dental - Top Local Google Search',
      client: 'Clinic, Gurugram',
      views: '1,200+ Monthly Searches',
      metric: '4-5 Weekly Appointments',
      roas: '3.5X Patient ROI',
      desc: 'Optimized Google Business profile, created 25+ local citations, and collected genuine customer reviews.',
      tags: ['GMB Ranking', 'Local SEO', 'WhatsApp Leads']
    },
    {
      category: 'Performance Ads',
      title: 'Apex Heights - Real Estate Lead Gen',
      client: 'Appartments, Noida',
      views: '45K Targeted Views',
      metric: '22 Qualified Leads',
      roas: '₹240 Cost Per Lead',
      desc: 'Shot clean property walkthrough reels and launched targeted Meta lead forms with phone verification.',
      tags: ['Real Estate', 'Lead Gen', 'Walkthrough Reels']
    },
    {
      category: 'E-Commerce Funnel',
      title: 'Kavya Ethnicwear - Festive Growth',
      client: 'Fashion Store',
      views: '120K Reels Views',
      metric: '180+ Orders Shipped',
      roas: '2.9X ROAS',
      desc: 'Optimized mobile checkout funnel and launched festive creator reels across Instagram.',
      tags: ['Shopify', 'Creator Collab', 'Performance Ads']
    },
    {
      category: 'Reels Marketing',
      title: 'Spice Craft Kitchen - Local Cafe Launch',
      client: 'Bistro & Cafe, Mumbai',
      views: '65K Local Views',
      metric: '85+ Weekend Bookings',
      roas: '2.6X ROI',
      desc: 'Produced engaging food reels and partnered with local city food creators for launch weekend.',
      tags: ['Food Reels', 'Local Creator Event', 'Instagram Ads']
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
          Real & Authentic Growth Campaigns <br />
          <span className="text-gradient-fire">Driven For Growing Brands</span>
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
            Let's analyze your current brand position and outline a roadmap to generate your first 50,000 views and consistent daily leads.
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
