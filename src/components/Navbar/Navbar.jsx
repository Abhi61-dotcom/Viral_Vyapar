import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaRocket, FaBars, FaTimes, FaFire, FaCalculator, FaPhoneAlt, FaChevronRight } from 'react-icons/fa';

const Navbar = ({ onOpenCalculator, onOpenConsultation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Industries', path: '/industries' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-violet-900 via-fuchsia-900 to-indigo-900 text-white text-[11px] sm:text-xs py-1.5 px-4 text-center border-b border-violet-500/20 flex items-center justify-center gap-2 font-medium">
        <span className="bg-amber-500 text-black text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
          <FaFire /> Limited Slot
        </span>
        <span>🚀 Grow Your Business 10X with Viral Reels & Performance Ads!</span>
        <button
          onClick={onOpenConsultation}
          className="underline font-bold hover:text-amber-300 ml-1 inline-flex items-center gap-0.5"
        >
          Claim Free Audit <FaChevronRight size={10} />
        </button>
      </div>

      {/* Navbar Container */}
      <nav className={`transition-all duration-300 ${scrolled ? 'glass-nav py-3' : 'bg-[#050816]/70 backdrop-blur-md py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-orange-500 flex items-center justify-center text-white text-xl shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform">
              <FaRocket className="transform group-hover:rotate-12 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-tight leading-none">
                VIRAL<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">VYAPAR</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold font-body">
                Viral Growth Agency
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-white bg-violet-600/20 border border-violet-500/30 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={onOpenCalculator}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition hover:border-violet-500/50"
            >
              <FaCalculator className="text-violet-400" /> ROI Calculator
            </button>
            <button
              onClick={onOpenConsultation}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 hover:from-violet-500 hover:to-orange-400 text-white text-xs font-bold shadow-lg shadow-violet-600/30 hover:scale-105 transition duration-200 flex items-center gap-2"
            >
              <FaPhoneAlt /> Get Free Audit
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onOpenConsultation}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-orange-500 text-white text-xs font-bold"
            >
              Free Audit
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden glass-nav border-b border-slate-800 px-4 pt-3 pb-6 animate-fadeIn">
          <div className="flex flex-col space-y-2 mb-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-3 rounded-xl text-base font-semibold transition ${
                  location.pathname === link.path
                    ? 'bg-violet-600/30 text-white border border-violet-500/40'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenCalculator();
              }}
              className="py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
            >
              <FaCalculator className="text-violet-400" /> ROI Calculator
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenConsultation();
              }}
              className="py-3 bg-gradient-to-r from-violet-600 to-orange-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30"
            >
              <FaPhoneAlt /> Book Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
