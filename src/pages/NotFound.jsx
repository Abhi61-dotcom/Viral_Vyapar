import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaHome, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center text-center px-4 py-12">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-violet-600 to-orange-500 flex items-center justify-center text-white text-5xl mx-auto shadow-2xl shadow-violet-600/40 animate-float">
          <FaRocket />
        </div>

        <h1 className="font-heading font-extrabold text-6xl text-white tracking-tight">404</h1>
        
        <h2 className="font-heading font-bold text-2xl text-slate-200">
          Oops! Page Lost In Space
        </h2>

        <p className="text-slate-400 text-sm">
          The page you are looking for might have been moved or does not exist. Let's get your business back on track!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
          >
            <FaHome /> Back To Home
          </Link>
          <Link
            to="/services"
            className="px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-800"
          >
            <FaArrowLeft /> View Our Services
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
