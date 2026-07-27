import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaInstagram, FaYoutube, FaLinkedin, FaFacebook, FaWhatsapp, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaFire, FaCheckCircle, FaPaperPlane } from 'react-icons/fa';

const Footer = ({ onOpenConsultation }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 relative overflow-hidden pt-16 pb-8">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top CTA Banner in Footer */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 mb-16 border border-violet-500/30 bg-gradient-to-r from-violet-950/60 via-slate-900 to-amber-950/40 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-semibold mb-3 border border-orange-500/30">
                <FaFire /> READY TO DOMINATE YOUR MARKET?
              </div>
              <h3 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
                Let's Make Your <span className="text-gradient-fire">Vyapar Go Viral!</span>
              </h3>
              <p className="text-sm text-slate-300 mt-2 max-w-xl">
                Get a custom viral strategy roadmap tailored for your business. Guaranteed increase in brand awareness & sales within 30 days.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <button
                onClick={onOpenConsultation}
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 text-slate-950 font-heading font-bold text-sm shadow-xl shadow-orange-500/20 hover:scale-105 transition flex items-center justify-center gap-2"
              >
                <FaRocket /> Book Free 30-Min Strategy Call
              </button>
              <a
                href="https://wa.me/919667065637?text=Hi%20Viral%20Vyapar%20Team%20!%20I%20want%20to%20grow%20my%20business%20with%20your%20digital%20marketing%20services."
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition"
              >
                <FaWhatsapp className="text-emerald-400 text-base" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Viral Vyapar Logo" className="h-9 w-auto max-w-[40px] object-contain rounded-xl shadow-lg shadow-violet-500/20" />
              <span className="font-heading font-extrabold text-2xl text-white tracking-tight">
                VIRAL<span className="text-orange-400">VYAPAR</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400 pr-4">
              India's premier data-driven growth & viral digital marketing agency. We turn local shops, e-commerce stores, real estate agencies & services into viral brands generating massive revenue.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a href="https://www.instagram.com/viral_mintofficial?igsh=a3lvaHE3NXFoaGp6" target="_blank" rel="noreferrer" title="Follow Viral Vyapar on Instagram @viral_mintofficial" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500 text-slate-300 hover:text-pink-400 flex items-center justify-center transition">
                <FaInstagram size={16} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-500 text-slate-300 hover:text-red-400 flex items-center justify-center transition">
                <FaYoutube size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 text-slate-300 hover:text-blue-400 flex items-center justify-center transition">
                <FaLinkedin size={16} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-600 text-slate-300 hover:text-blue-500 flex items-center justify-center transition">
                <FaFacebook size={16} />
              </a>
              <a href="https://wa.me/919667065637?text=Hi%20Viral%20Vyapar%20Team%20!%20I%20want%20to%20grow%20my%20business%20with%20your%20digital%20marketing%20services." target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 flex items-center justify-center transition">
                <FaWhatsapp size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/" className="hover:text-amber-400 transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-amber-400 transition">About Us</Link></li>
              <li><Link to="/services" className="hover:text-amber-400 transition">Services</Link></li>
              <li><Link to="/industries" className="hover:text-amber-400 transition">Industries We Serve</Link></li>
              <li><Link to="/portfolio" className="hover:text-amber-400 transition">Case Studies & Portfolio</Link></li>
              <li><Link to="/pricing" className="hover:text-amber-400 transition">Pricing Plans</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
              Viral Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/services" className="hover:text-amber-400 transition">Instagram Reels & Shorts</Link></li>
              <li><Link to="/services" className="hover:text-amber-400 transition">Meta & Google Ads</Link></li>
              <li><Link to="/services" className="hover:text-amber-400 transition">Local SEO & Google Maps</Link></li>
              <li><Link to="/services" className="hover:text-amber-400 transition">WhatsApp CRM Automation</Link></li>
              <li><Link to="/services" className="hover:text-amber-400 transition">E-commerce Funnel Optimization</Link></li>
              <li><Link to="/services" className="hover:text-amber-400 transition">Influencer Marketing</Link></li>
            </ul>
          </div>

          {/* Newsletter / Contact Info */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
              Growth Newsletter
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe for weekly viral tactics & marketing tips:
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter business email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition"
                >
                  <FaPaperPlane />
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <FaCheckCircle /> Subscribed successfully!
                </p>
              )}
            </form>

            <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2"><FaPhoneAlt className="text-amber-400" /> +91 96670 65637</p>
              <p className="flex items-center gap-2"><FaEnvelope className="text-amber-400" /> hello@viralvyapar.com</p>
              <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-amber-400" /> Cyber City, Gurugram & Bandra, Mumbai</p>
            </div>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Viral Vyapar Digital Growth Private Limited. All rights reserved.</p>
          <div className="flex space-x-4">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Refund Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
