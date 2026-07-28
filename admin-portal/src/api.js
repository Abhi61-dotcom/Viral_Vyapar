const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api';

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('vv_admin_token') || localStorage.getItem('vv_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const adminLogin = async (password) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await res.json();
    if (res.ok && data.token) {
      sessionStorage.setItem('vv_admin_token', data.token);
      return { success: true, token: data.token };
    } else {
      return { error: data.error || 'Incorrect Admin Password' };
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      return { error: 'Connection timed out. Please check backend server.' };
    }
    return { error: 'Failed to connect to backend server' };
  }
};

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

export const requestAdminOtp = async (currentPassword) => {
  try {
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ currentPassword })
    });
    return await res.json();
  } catch (err) {
    return { error: 'Failed to dispatch Email OTP' };
  }
};

export const verifyOtpChangePassword = async (currentPassword, otp, newPassword) => {
  try {
    const res = await fetch(`${API_BASE}/auth/verify-otp-change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ currentPassword, otp, newPassword })
    });
    return await res.json();
  } catch (err) {
    return { error: 'Server error verifying OTP and changing password' };
  }
};

export const forgotPasswordSendOtp = async () => {
  try {
    const res = await fetch(`${API_BASE}/auth/forgot-password-send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return await res.json();
  } catch (err) {
    return { error: 'Server error sending OTP. Please check backend.' };
  }
};

export const forgotPasswordVerify = async (otp, newPassword) => {
  try {
    const res = await fetch(`${API_BASE}/auth/forgot-password-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp, newPassword })
    });
    return await res.json();
  } catch (err) {
    return { error: 'Server error verifying OTP and resetting password.' };
  }
};

export const fetchAdminStats = async (date = '') => {
  try {
    const url = date ? `${API_BASE}/admin/stats?date=${date}` : `${API_BASE}/admin/stats`;
    const res = await fetch(url, {
      headers: getAuthHeaders()
    });
    return await res.json();
  } catch (err) {
    return { error: 'Failed to fetch stats' };
  }
};

export const fetchAdminLeads = async (status = 'All', search = '', date = '') => {
  try {
    const params = { status, search };
    if (date) params.date = date;
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/leads?${query}`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  } catch (err) {
    return { error: 'Failed to fetch leads' };
  }
};

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

export const resetAdminTraffic = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/reset-traffic`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return await res.json();
  } catch (err) {
    return { error: 'Failed to reset traffic data' };
  }
};
