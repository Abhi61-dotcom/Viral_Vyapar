import React from 'react';
import { FaShieldAlt, FaKey, FaSync, FaEnvelope, FaLock, FaTimes } from 'react-icons/fa';

export const SecurityModal = ({
  isOpen,
  onClose,
  currPassword,
  setCurrPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  otpInput,
  setOtpInput,
  otpSent,
  sendingOtp,
  pwdMessage,
  onRequestOtp,
  onVerifyAndChangePassword,
  adminEmail,
  isDark = true
}) => {
  if (!isOpen) return null;

  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const inputStyle = isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-lg glass-card rounded-3xl p-6 shadow-2xl relative border ${isDark ? 'border-amber-500/30' : 'border-amber-500/40 bg-white'}`}>
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer p-1"
        >
          <FaTimes />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-2xl">
            <FaShieldAlt className="text-xl" />
          </div>
          <div>
            <h3 className={`font-heading font-extrabold text-lg ${textPrimary}`}>Admin Security & Password 2FA</h3>
            <p className={`text-xs ${textSecondary}`}>Protected 2FA Email OTP Password Manager</p>
          </div>
        </div>

        <form onSubmit={onVerifyAndChangePassword} className="space-y-4">
          <div>
            <label className={`block text-xs font-semibold uppercase mb-1 ${textSecondary}`}>Current Password *</label>
            <input
              type="password"
              required
              placeholder="Enter current password..."
              value={currPassword}
              onChange={(e) => setCurrPassword(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-amber-500 font-medium ${inputStyle}`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold uppercase mb-1 ${textSecondary}`}>New Password *</label>
            <input
              type="password"
              required
              placeholder="Enter new strong password..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-amber-500 font-medium ${inputStyle}`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold uppercase mb-1 ${textSecondary}`}>Confirm New Password *</label>
            <input
              type="password"
              required
              placeholder="Confirm new password..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-amber-500 font-medium ${inputStyle}`}
            />
          </div>

          {!otpSent ? (
            <button
              type="button"
              onClick={onRequestOtp}
              disabled={sendingOtp}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
            >
              {sendingOtp ? <FaSync className="animate-spin" /> : <FaEnvelope />}
              <span>{sendingOtp ? 'Sending 2FA OTP Email...' : 'Send 2FA OTP to Email'}</span>
            </button>
          ) : (
            <div className="space-y-3 pt-2">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-medium flex items-center gap-2">
                <FaEnvelope className="shrink-0" />
                <span>2FA OTP sent to <b>{adminEmail}</b>. Please check inbox/spam.</span>
              </div>

              <div>
                <label className={`block text-xs font-semibold uppercase mb-1 ${textSecondary}`}>Enter 6-Digit OTP *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter 6-digit OTP code..."
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-mono tracking-widest focus:outline-none focus:border-emerald-500 ${inputStyle}`}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <FaKey />
                  <span>Verify OTP & Update Password</span>
                </button>
                <button
                  type="button"
                  onClick={onRequestOtp}
                  className={`px-3 py-3 font-semibold rounded-xl text-xs border ${isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-200 text-slate-800 border-slate-300'}`}
                >
                  Resend
                </button>
              </div>
            </div>
          )}
        </form>

        {pwdMessage.text && (
          <div className={`mt-4 p-3.5 rounded-xl text-xs font-bold ${pwdMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
            {pwdMessage.text}
          </div>
        )}
      </div>
    </div>
  );
};
