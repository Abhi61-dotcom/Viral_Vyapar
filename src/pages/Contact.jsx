import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaInstagram, FaPaperPlane, FaCheckCircle, FaFire, FaClock, FaBuilding } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    businessName: '',
    city: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      const msg = encodeURIComponent(
        `Hi Viral Vyapar Team ! Direct Contact Inquiry:\nName: ${formData.name}\nBusiness: ${formData.businessName} (${formData.city})\nPhone: ${formData.phone}\nMessage: ${formData.message}`
      );
      window.open(`https://wa.me/919667065637?text=${msg}`, '_blank');
    }, 1500);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Header */}
      <section className="pt-8 text-center max-w-4xl mx-auto px-4">
        <span className="text-xs uppercase font-bold tracking-widest text-orange-400 bg-orange-500/10 px-3.5 py-1.5 rounded-full border border-orange-500/20">
          GET IN TOUCH
        </span>
        <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-white tracking-tight mt-4">
          Let's Talk About Your <br />
          <span className="text-gradient-fire">Next Big Growth Surge</span>
        </h1>
        <p className="text-slate-300 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
          Have a question or ready to launch your viral campaign? Reach out to our team directly via phone, WhatsApp, or form.
        </p>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Contact Details */}
          <div className="space-y-6">
            <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-6">
              <h3 className="font-heading font-bold text-xl text-white">Direct Contacts</h3>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl">
                  <FaWhatsapp size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400">WhatsApp Sales & Audit</h4>
                  <a href="https://wa.me/919667065637?text=Hello%20Viral%20Vyapar%20Team!%20I%20want%20to%20grow%20my%20business%20with%20your%20digital%20marketing%20services." target="_blank" rel="noreferrer" className="text-sm font-bold text-white hover:text-emerald-400 transition">
                    +91 96670 65637
                  </a>
                  <p className="text-[11px] text-slate-500">Available 24/7 for quick inquiries</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-pink-500/10 border border-pink-500/30 text-pink-400 rounded-2xl">
                  <FaInstagram size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400">Instagram Official</h4>
                  <a href="https://www.instagram.com/viral_mintofficial?igsh=a3lvaHE3NXFoaGp6" target="_blank" rel="noreferrer" className="text-sm font-bold text-white hover:text-pink-400 transition">
                    @viral_mintofficial
                  </a>
                  <p className="text-[11px] text-slate-500">Daily Reels, Case Studies & Viral Strategies</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-violet-500/10 border border-violet-500/30 text-violet-400 rounded-2xl">
                  <FaPhoneAlt size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400">Call Us Directly</h4>
                  <a href="tel:+919667065637" className="text-sm font-bold text-white hover:text-violet-400 transition">
                    +91 96670 65637
                  </a>
                  <p className="text-[11px] text-slate-500">Mon - Sat: 9:30 AM - 7:30 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl">
                  <FaEnvelope size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400">Email Proposals</h4>
                  <p className="text-sm font-bold text-white">choudharyabhishek1503@gmail.com</p>
                  <p className="text-[11px] text-slate-500">Typical response within 2 hours</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
              <h3 className="font-heading font-bold text-xl text-white flex items-center gap-2">
                <FaBuilding className="text-orange-400" /> Office Locations
              </h3>
              
              <div className="pt-2 border-t border-slate-800 space-y-3 text-xs text-slate-300">
                <div>
                  <p className="font-bold text-white text-sm">Gurugram Studio (HQ)</p>
                  <p className="text-slate-400">Level 8, DLF Cyber City, Phase 2, Gurugram, Haryana - 122002</p>
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Mumbai Regional Lab</p>
                  <p className="text-slate-400">Bandra Kurla Complex (BKC), Bandra East, Mumbai - 400051</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2 glass-card rounded-3xl p-6 sm:p-10 border border-violet-500/30">
            {!submitted ? (
              <>
                <div className="mb-6">
                  <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                    Send Us A Direct Message
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Fill out the details below and our lead growth strategist will contact you within 15 minutes.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vikramaditya Singh"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number (WhatsApp) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Business Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Imperial Jewels & Apparel"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">City / Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Delhi NCR, Mumbai, Jaipur"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Tell Us About Your Growth Target</label>
                    <textarea
                      rows="4"
                      placeholder="Briefly describe what products/services you sell and what your main challenge is..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 text-slate-950 font-bold text-sm shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 transition"
                  >
                    <FaPaperPlane /> Send Message & Connect on WhatsApp
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500 text-3xl flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <FaCheckCircle />
                </div>
                <h3 className="font-heading font-extrabold text-3xl text-white mb-2">Message Sent!</h3>
                <p className="text-slate-300 text-sm mb-6">
                  Thank you <span className="text-amber-400 font-bold">{formData.name}</span>. Connecting you to our lead growth manager...
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-slate-900 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Send Another Message
                </button>
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
};

export default Contact;
