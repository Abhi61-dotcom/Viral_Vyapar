import React from 'react';
import { FaKey, FaEnvelope, FaShieldAlt, FaSync, FaTimes } from 'react-icons/fa';

export const ForgotPasswordModal = ({
  isOpen,
  onClose,
  forgotStep,
  setForgotStep,
  forgotOtpInput,
  setForgotOtpInput,
  forgotNewPassword,
  setForgotNewPassword,
  forgotConfirmPassword,
  setForgotConfirmPassword,
  forgotLoading,
  forgotMsg,
  onRequestOtp,
  onVerifyAndReset,
  adminEmail,
  isDark = true
}) => {
  if (!isOpen) return null;

  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const inputStyle = isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-md glass-card rounded-3xl p-6 shadow-2xl relative border ${isDark ? 'border-amber-500/30' : 'border-amber-500/40 bg-white'}`}>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer p-1"
        >
          <FaTimes />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-xl">
            <FaKey />
          </div>
          <div>
            <h3 className={`font-heading font-extrabold text-base ${textPrimary}`}>Admin 2FA Password Recovery</h3>
            <p className={`text-[11px] ${textSecondary}`}>Reset password via 2FA Email OTP</p>
          </div>
        </div>

        {forgotStep === 'request' ? (
          <div className="space-y-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-400 font-medium">
              We will send a 6-digit OTP code to registered admin email: <b>{adminEmail}</b>
            </div>

            <button
              type="button"
              onClick={onRequestOtp}
              disabled={forgotLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              {forgotLoading ? <FaSync className="animate-spin" /> : <FaEnvelope />}
              <span>{forgotLoading ? 'Sending 2FA OTP Email...' : 'Send Recovery OTP to Email'}</span>
            </button>
          </div>
        ) : (
          <form onSubmit={onVerifyAndReset} className="space-y-3 text-xs">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-400 font-medium flex items-center gap-2">
              <FaEnvelope className="shrink-0" />
              <span>OTP code sent to <b>{adminEmail}</b>. Please check inbox/spam.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Enter 6-Digit OTP *</label>
              <input
                type="text"
                required
                placeholder="Enter 6-digit OTP code..."
                value={forgotOtpInput}
                onChange={(e) => setForgotOtpInput(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-xs font-mono tracking-widest focus:outline-none focus:border-amber-500 ${inputStyle}`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">New Strong Password *</label>
              <input
                type="password"
                required
                placeholder="Enter new admin password..."
                value={forgotNewPassword}
                onChange={(e) => setForgotNewPassword(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-amber-500 ${inputStyle}`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Confirm New Password *</label>
              <input
                type="password"
                required
                placeholder="Confirm new admin password..."
                value={forgotConfirmPassword}
                onChange={(e) => setForgotConfirmPassword(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-amber-500 ${inputStyle}`}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={forgotLoading}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
              >
                {forgotLoading ? <FaSync className="animate-spin" /> : <FaShieldAlt />}
                <span>Verify & Reset Password</span>
              </button>
              <button
                type="button"
                onClick={() => setForgotStep('request')}
                className={`px-3 py-3 font-semibold rounded-xl text-xs border ${isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-200 text-slate-800 border-slate-300'}`}
              >
                Resend
              </button>
            </div>
          </form>
        )}

        {forgotMsg.text && (
          <div className={`mt-3 p-3 rounded-xl text-xs font-bold ${forgotMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
            {forgotMsg.text}
          </div>
        )}
      </div>
    </div>
  );
};
