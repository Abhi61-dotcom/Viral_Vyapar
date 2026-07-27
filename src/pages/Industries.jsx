import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaRocket, FaShoppingBag, FaStore, FaBuilding, FaGraduationCap, FaUtensils, FaUserMd, FaCheckCircle, FaChartLine } from 'react-icons/fa';

const Industries = () => {
  const { openConsultation } = useOutletContext();

  const industriesList = [
    {
      icon: <FaShoppingBag className="text-3xl text-orange-400" />,
      name: "E-Commerce & D2C Brands",
      tagline: "Scale your monthly orders & reduce CAC with viral product video reels.",
      metrics: "5.4X Avg ROAS | 65% Lower CAC",
      strategy: [
        "UGC Video Reel Ads targeting high-intent online shoppers",
        "Retargeting cart abandoners via automated WhatsApp discount codes",
        "Influencer unboxing & review video syndication",
        "Shopify funnel conversion rate optimization"
      ]
    },
    {
      icon: <FaStore className="text-3xl text-violet-400" />,
      name: "Local Retail & Showrooms",
      tagline: "Drive 100+ daily footfalls to your clothing, jewelry, or electronics store.",
      metrics: "300% Footfall Increase | #1 GMB Rank",
      strategy: [
        "Hyper-local Instagram reels showing store walk-throughs & new stock arrivals",
        "Google Maps #1 ranking optimization within a 10km radius",
        "Festival sale event countdowns & WhatsApp coupon claims",
        "Customer review collection & local community trust building"
      ]
    },
    {
      icon: <FaBuilding className="text-3xl text-emerald-400" />,
      name: "Real Estate & Property Developers",
      tagline: "Generate verified site visit leads for residential & commercial properties.",
      metrics: "₹165 Lead Cost | ₹2.5Cr+ Sold",
      strategy: [
        "Cinematic drone walk-through reels of sample flats & plots",
        "High-intent Meta lead forms with instant mobile OTP verification",
        "Automated site visit scheduling via WhatsApp bot",
        "Builder branding & buyer trust testimonials"
      ]
    },
    {
      icon: <FaGraduationCap className="text-3xl text-amber-400" />,
      name: "Coaching, EdTech & Consultants",
      tagline: "Fill your webinars, workshops, and coaching programs with eager students.",
      metrics: "5,000+ Attendees | 8.2X Event ROI",
      strategy: [
        "Thought leadership reel clips answering core student pain points",
        "High-converting webinar registration landing pages",
        "Automated WhatsApp & Email reminder sequences",
        "YouTube In-stream ad campaigns targeting relevant skill keywords"
      ]
    },
    {
      icon: <FaUtensils className="text-3xl text-pink-400" />,
      name: "Restaurants, Cafes & Food Brands",
      tagline: "Mouth-watering food reels that make your dishes go viral across your city.",
      metrics: "1.5M+ Local Views | 500+ Weekend Orders",
      strategy: [
        "High-resolution aesthetic food preparation & tasting reel videos",
        "Food blogger & local creator collaboration events",
        "Zomato & Swiggy ad campaign management",
        "Table reservation & party booking WhatsApp automation"
      ]
    },
    {
      icon: <FaUserMd className="text-3xl text-cyan-400" />,
      name: "Healthcare Clinics & Doctors",
      tagline: "Establish doctor authority & get continuous patient appointment inquiries.",
      metrics: "20+ Daily Leads | #1 Doctor Rank",
      strategy: [
        "Educational doctor reels addressing common health concerns",
        "Google Maps Local SEO for instant nearby patient search",
        "Patient testimonial videos building emotional trust",
        "Seamless WhatsApp appointment booking workflow"
      ]
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* Header */}
      <section className="pt-8 pb-10 text-center max-w-4xl mx-auto px-4">
        <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
          INDUSTRIES WE SERVE
        </span>
        <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-white tracking-tight mt-4">
          Specialized Marketing Blueprints <br />
          <span className="text-gradient-cyan">Tailored For Your Industry</span>
        </h1>
        <p className="text-slate-300 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
          We don't believe in one-size-fits-all. Every industry requires a distinct viral creative strategy, ad funnel, and targeting blueprint.
        </p>
      </section>

      {/* Industry Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industriesList.map((item, idx) => (
            <div key={idx} className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col justify-between hover:border-violet-500/40 transition">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    {item.metrics}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-xl text-white mb-2">{item.name}</h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-6">{item.tagline}</p>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Proven Growth Plan:</h4>
                <ul className="space-y-2 mb-6">
                  {item.strategy.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <FaCheckCircle className="text-emerald-400 text-xs flex-shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => openConsultation({ industry: item.name })}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-orange-400 flex items-center justify-center gap-2 transition"
              >
                <FaRocket /> Get Strategy For {item.name}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 text-center">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-violet-500/30 bg-gradient-to-tr from-violet-950/60 to-slate-900">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-3">
            Don't See Your Industry Listed Here?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6">
            We have engineered growth strategies for over 30+ sub-niches. Talk to our team to craft your custom blueprint.
          </p>
          <button
            onClick={() => openConsultation()}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-orange-500/20 inline-flex items-center gap-2 hover:scale-105 transition"
          >
            <FaRocket /> Request Custom Industry Consultation
          </button>
        </div>
      </section>

    </div>
  );
};

export default Industries;
