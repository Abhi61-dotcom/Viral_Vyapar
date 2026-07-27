import React, { useState, useEffect, useRef } from 'react';
import { FaWhatsapp, FaTimes, FaPaperPlane, FaFire, FaRobot, FaUser, FaPhoneAlt, FaSync, FaComments } from 'react-icons/fa';
import { sendAiChatMessage } from '../../utils/api';

const WhatsAppFloatingBtn = ({ onOpenConsultation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const targetPhoneNumber = "919667065637"; // Target WhatsApp & Call Number: +91 96670 65637
  const displayPhoneNumber = "+91 96670 65637";

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Namaste! 🙏 I am VyaparAI, your Growth Assistant. Ask me anything about scaling your business, or chat directly on WhatsApp at ${displayPhoneNumber}!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const sessionId = useRef(`session_${Math.random().toString(36).substr(2, 6)}`);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Open direct native WhatsApp app / web chat with pre-filled greeting message
  const handleOpenDirectWhatsApp = (customMsg = null) => {
    const textToMessage = customMsg || "Hi Viral Vyapar Team ! I want to grow my business with your digital marketing services.";
    const encoded = encodeURIComponent(textToMessage);
    window.open(`https://wa.me/${targetPhoneNumber}?text=${encoded}`, '_blank');
  };

  const handleSend = async (customText = null) => {
    const textToSend = customText || inputMsg;
    if (!textToSend.trim()) return;

    const userMessage = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customText) setInputMsg('');
    setIsTyping(true);

    try {
      const response = await sendAiChatMessage(textToSend, sessionId.current);
      const aiReply = response?.reply || "I am glad to help! Would you like to talk directly to our team on WhatsApp?";

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Thanks for your query! Click below to chat directly with our team on WhatsApp (${displayPhoneNumber}).`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    "Reels Marketing Pricing?",
    "Meta Ads ROAS Guarantee?",
    "Local SEO Google Maps Rank",
    "Book Free Growth Audit"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      
      {/* AI Assistant Drawer Modal */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 glass-card rounded-3xl p-4 border border-emerald-500/40 shadow-2xl shadow-emerald-500/20 backdrop-blur-2xl flex flex-col h-[500px]">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-lg shadow-lg shadow-emerald-500/30">
                  <FaWhatsapp />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#050816] rounded-full"></span>
              </div>
              <div>
                <h4 className="font-heading font-bold text-white text-sm flex items-center gap-1.5">
                  Viral Vyapar WhatsApp
                </h4>
                <p className="text-[10px] text-emerald-400 font-medium">Official No: {displayPhoneNumber}</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
              aria-label="Close chat"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Direct WhatsApp CTA Card */}
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3 mb-3 text-center">
            <p className="text-xs text-emerald-200 font-semibold mb-2">
              Want instant response on WhatsApp?
            </p>
            <button
              onClick={() => handleOpenDirectWhatsApp()}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition"
            >
              <FaWhatsapp className="text-lg" />
              <span>Message on WhatsApp ({displayPhoneNumber})</span>
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs mb-3">
            {messages.map((m, index) => (
              <div
                key={index}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-md ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 italic bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 w-max">
                <FaRobot className="animate-spin text-emerald-400" /> VyaparAI is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Chips */}
          <div className="flex flex-wrap gap-1 mb-2">
            {quickPrompts.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => {
                  if (prompt === "Book Free Growth Audit") {
                    onOpenConsultation();
                  } else {
                    handleSend(prompt);
                  }
                }}
                className="text-[10px] font-medium bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-300 px-2.5 py-1 rounded-full transition"
              >
                ⚡ {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Type query or click WhatsApp above..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white p-2.5 rounded-xl text-xs flex items-center justify-center transition shadow-lg shadow-emerald-500/20"
            >
              <FaPaperPlane size={13} />
            </button>
          </form>

        </div>
      )}

      {/* Floating Trigger Button - AI WHATSAPP ASSISTANT LAUNCHER */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white p-4 rounded-full shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Chat on WhatsApp AI Assistant"
        title="Click to open VyaparAI WhatsApp Assistant (+91 96670 65637)"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-300 text-[9px] font-bold text-slate-950 items-center justify-center">LIVE</span>
        </span>
        <FaWhatsapp className="text-2xl" />
        <span className="font-heading font-bold text-sm pr-1">
          Chat on WhatsApp
        </span>
      </button>

    </div>
  );
};

export default WhatsAppFloatingBtn;
