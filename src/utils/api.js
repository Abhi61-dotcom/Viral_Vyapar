const API_BASE = '/api';

// Helper to get auth header
const getAuthHeaders = () => {
  const token = localStorage.getItem('vv_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

let lastTrackedPath = '';
let lastTrackedTime = 0;

// Track Page Analytics (With Robust Mobile Detection & Route Deduplication)
export const trackPageView = async (path) => {
  const now = Date.now();
  if (path === lastTrackedPath && (now - lastTrackedTime) < 800) {
    return;
  }
  lastTrackedPath = path;
  lastTrackedTime = now;

  try {
    const ua = navigator.userAgent || '';
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua);
    const isSmallScreen = window.innerWidth <= 1024;
    const isMobile = isMobileUA || (isTouchDevice && isSmallScreen);
    const device = isMobile ? 'Mobile' : 'Desktop';

    await fetch(`${API_BASE}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, device })
    });
  } catch (err) {
    console.warn('Analytics tracking error:', err);
  }
};

// Submit Lead Form
export const submitLead = async (leadData) => {
  try {
    const res = await fetch(`${API_BASE}/leads/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    });
    return await res.json();
  } catch (err) {
    console.error('Lead submission error:', err);
    return { error: 'Server unavailable. Please try on WhatsApp directly.' };
  }
};

// Send Message to AI WhatsApp Agent
export const sendAiChatMessage = async (message, session) => {
  try {
    const res = await fetch(`${API_BASE}/whatsapp/ai-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, session })
    });
    return await res.json();
  } catch (err) {
    return {
      success: true,
      reply: "Namaste! 🙏 Thanks for your message. How can I help scale your business today?"
    };
  }
};

// Admin Login
export const adminLogin = async (password) => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('vv_admin_token', data.token);
    }
    return data;
  } catch (err) {
    return { error: 'Failed to connect to authentication server' };
  }
};

// Verify Admin Token
export const verifyAdminToken = async () => {
  try {
    const res = await fetch(`${API_BASE}/auth/verify`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
};

// Change Admin Password
export const changeAdminPassword = async (currentPassword, newPassword) => {
  try {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    return await res.json();
  } catch (err) {
    return { error: 'Server error changing password' };
  }
};

// Get Admin Stats
export const fetchAdminStats = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  } catch (err) {
    return { error: 'Failed to fetch admin stats' };
  }
};

// Get Admin Leads List
export const fetchAdminLeads = async (status = 'All', search = '') => {
  try {
    const query = new URLSearchParams({ status, search }).toString();
    const res = await fetch(`${API_BASE}/admin/leads?${query}`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  } catch (err) {
    return { error: 'Failed to fetch leads' };
  }
};

// Update Lead Status
export const updateLeadStatus = async (id, status) => {
  try {
    const res = await fetch(`${API_BASE}/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ status })
    });
    return await res.json();
  } catch (err) {
    return { error: 'Failed to update status' };
  }
};

// Delete Lead
export const deleteLead = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/admin/leads/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await res.json();
  } catch (err) {
    return { error: 'Failed to delete lead' };
  }
};

// Fetch AI Chat Logs
export const fetchChatLogs = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/chat-logs`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  } catch (err) {
    return { error: 'Failed to fetch chat logs' };
  }
};

// Request Admin Password Reset OTP
export const requestAdminOtp = async (currentPassword) => {
  try {
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ currentPassword })
    });
    return await res.json();
  } catch (err) {
    return { error: 'Failed to request OTP' };
  }
};

// Verify OTP & Change Password
export const verifyOtpChangePassword = async (currentPassword, otp, newPassword) => {
  try {
    const res = await fetch(`${API_BASE}/auth/verify-otp-change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ currentPassword, otp, newPassword })
    });
    return await res.json();
  } catch (err) {
    return { error: 'Failed to change password' };
  }
};
