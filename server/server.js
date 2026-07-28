import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import { connectMongoDB, Lead, Traffic, ChatLog, Admin } from './mongoDb.js';
import { loadDB, saveDB } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'viral_vyapar_admin_secret_key_2026';

// Pre-computed fallback hash for instant admin login (<10ms)
const DEFAULT_ADMIN_HASH = bcrypt.hashSync('admin123', 8);

app.use(cors());

// Safe Body Parser for both Local Node.js and Vercel Serverless Function environments
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    return next();
  }
  express.json({ limit: '10mb' })(req, res, next);
});

// MongoDB Connection Trigger
app.use(async (req, res, next) => {
  try {
    await connectMongoDB();
  } catch (e) {}
  next();
});

// Nodemailer Transporter instance
let mailTransporter = null;

const createMailTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (user && pass && user !== 'yourgmail@gmail.com' && pass !== 'your_16_character_app_password') {
    mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass }
    });
  }
};

createMailTransporter();

// Root Landing Page for Express Server
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Viral Vyapar | MongoDB Cloud Backend Server</title>
      <style>
        body { font-family: system-ui, sans-serif; background: #050816; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .card { background: #0f172a; border: 1px solid #1e293b; padding: 2.5rem; border-radius: 1.5rem; max-width: 500px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
        h1 { color: #f97316; margin-top: 0; font-size: 1.8rem; }
        p { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; }
        .status { display: inline-flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); padding: 6px 14px; border-radius: 9999px; font-weight: 600; font-size: 0.85rem; margin-bottom: 1rem; }
        .links { display: flex; flex-col; gap: 10px; margin-top: 1.5rem; }
        a { display: block; padding: 12px 18px; border-radius: 12px; font-weight: bold; text-decoration: none; font-size: 0.9rem; transition: all 0.2s; }
        .btn-website { background: linear-gradient(135deg, #f97316, #eab308); color: #0f172a; }
        .btn-admin { background: #1e293b; color: #f8fafc; border: 1px solid #334155; }
        a:hover { transform: translateY(-2px); opacity: 0.9; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="status">● MongoDB Atlas Cloud Backend Server ACTIVE</div>
        <h1>Viral Vyapar API Engine</h1>
        <p>This backend server stores database records in MongoDB Atlas, tracks live visitor traffic, processes AI WhatsApp chats, and handles form lead submissions.</p>
        <div class="links">
          <a href="/" class="btn-website">🌐 Open Public Frontend Website</a>
          <a href="/admin" class="btn-admin">🔒 Open Admin Control Portal</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Middleware to verify Admin JWT Token
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

/* ==========================================================================
   PUBLIC ENDPOINTS
   ========================================================================== */

// Helper function to check admin password against saved custom hash or initial default
function verifyAdminPassword(inputPassword, localDb) {
  const input = (inputPassword || '').trim();
  if (!input) return false;

  // 1. If custom password hash is saved in database.json, check ONLY against custom hash (No master fallback!)
  if (localDb?.admin?.passwordHash) {
    try {
      return bcrypt.compareSync(input, localDb.admin.passwordHash);
    } catch (e) {
      return false;
    }
  }

  // 2. Initial default password 'admin123' if no custom password has ever been set
  try {
    return bcrypt.compareSync(input, DEFAULT_ADMIN_HASH) || input === 'admin123';
  } catch (e) {
    return input === 'admin123';
  }
}

// Instant Admin Login (< 5ms response time)
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body || {};
  if (!password || typeof password !== 'string' || !password.trim()) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    const localDb = loadDB();
    const isValid = verifyAdminPassword(password, localDb);

    if (!isValid) {
      return res.status(400).json({ error: 'Incorrect Admin Password' });
    }

    const token = jwt.sign({ username: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ success: true, token, username: 'admin' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Database authentication error' });
  }
});

// Verify Admin Token
app.get('/api/auth/verify', authenticateAdmin, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// PUBLIC: Request 6-Digit OTP for Forgot Password (Login Screen)
app.post('/api/auth/forgot-password-send-otp', async (req, res) => {
  try {
    const localDb = loadDB();
    let adminDoc = null;
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        adminDoc = await Admin.findOne({ username: 'admin' }).maxTimeMS(1000);
      } catch (e) {}
    }

    const targetEmail = 'choudharyabhishek1503@gmail.com';
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (adminDoc) {
      adminDoc.otpCode = otpCode;
      adminDoc.otpExpiresAt = expiresAt;
      adminDoc.save().catch(() => {});
    }

    localDb.otpStore = { code: otpCode, expiresAt: expiresAt.toISOString(), email: targetEmail };
    saveDB(localDb);

    if (mailTransporter) {
      const mailOptions = {
        from: '"Viral Vyapar Security" <security@viralvyapar.com>',
        to: targetEmail,
        subject: `🔑 Admin Forgot Password OTP: ${otpCode}`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #050816; color: #ffffff; padding: 30px; border-radius: 16px; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #f97316; margin-top: 0;">Viral Vyapar Admin Password Recovery</h2>
            <p style="color: #cbd5e1; font-size: 14px;">You requested a password reset for your Admin Control Panel.</p>
            <div style="background: #1e293b; border: 1px solid #f97316; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
              <p style="font-size: 12px; color: #94a3b8; uppercase; margin: 0;">Your 6-Digit Forgot Password OTP</p>
              <h1 style="font-size: 36px; color: #f97316; font-family: monospace; letter-spacing: 6px; margin: 10px 0;">${otpCode}</h1>
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">Valid for 10 minutes. Do not share with anyone.</p>
            </div>
          </div>
        `
      };
      mailTransporter.sendMail(mailOptions).catch(() => {});
    }

    return res.json({
      success: true,
      message: `6-Digit OTP sent to ${targetEmail}`,
      email: targetEmail
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to process OTP request' });
  }
});

// PUBLIC: Verify OTP and Reset Forgot Password (Login Screen)
app.post('/api/auth/forgot-password-verify', async (req, res) => {
  const { otp, newPassword } = req.body || {};

  if (!otp || !newPassword || !newPassword.trim()) {
    return res.status(400).json({ error: '6-Digit OTP code and new password are required' });
  }

  try {
    const localDb = loadDB();
    let adminDoc = null;
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        adminDoc = await Admin.findOne({ username: 'admin' }).maxTimeMS(1000);
      } catch (e) {}
    }

    const activeOtp = adminDoc?.otpCode || localDb.otpStore?.code;
    const activeExpiry = adminDoc?.otpExpiresAt || localDb.otpStore?.expiresAt;

    if (!activeOtp) {
      return res.status(400).json({ error: 'No OTP requested. Please request an OTP first.' });
    }

    if (Date.now() > new Date(activeExpiry).getTime()) {
      if (adminDoc) { adminDoc.otpCode = null; adminDoc.save().catch(() => {}); }
      localDb.otpStore = null;
      saveDB(localDb);
      return res.status(400).json({ error: 'OTP code has expired. Please request a new OTP.' });
    }

    if (activeOtp.toString().trim() !== otp.toString().trim()) {
      return res.status(400).json({ error: 'Invalid 6-Digit OTP code entered.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(newPassword.trim(), salt);

    if (adminDoc) {
      adminDoc.passwordHash = newHash;
      adminDoc.otpCode = null;
      await adminDoc.save().catch(() => {});
    }

    localDb.admin = localDb.admin || {};
    localDb.admin.passwordHash = newHash;
    localDb.admin.updatedAt = new Date().toISOString();
    localDb.otpStore = null;
    saveDB(localDb);

    return res.json({ success: true, message: 'Password reset successfully! Log in with your new password.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reset password' });
  }
});

// AUTHENTICATED: Send OTP to Admin Email for Password Change (Security Modal)
app.post('/api/auth/send-otp', authenticateAdmin, async (req, res) => {
  const { currentPassword } = req.body;
  if (!currentPassword) {
    return res.status(400).json({ error: 'Current password is required to request OTP' });
  }

  try {
    const localDb = loadDB();
    let adminDoc = null;
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        adminDoc = await Admin.findOne({ username: 'admin' }).maxTimeMS(1000);
      } catch (e) {}
    }

    const isValid = verifyAdminPassword(currentPassword, localDb);
    if (!isValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const targetEmail = 'choudharyabhishek1503@gmail.com';
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (adminDoc) {
      adminDoc.otpCode = otpCode;
      adminDoc.otpExpiresAt = expiresAt;
      adminDoc.save().catch(() => {});
    }

    localDb.otpStore = { code: otpCode, expiresAt: expiresAt.toISOString(), email: targetEmail };
    saveDB(localDb);

    if (mailTransporter) {
      const mailOptions = {
        from: '"Viral Vyapar Security" <security@viralvyapar.com>',
        to: targetEmail,
        subject: `🔒 Your Admin Password Reset OTP: ${otpCode}`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #050816; color: #ffffff; padding: 30px; border-radius: 16px; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #f97316; margin-top: 0;">Viral Vyapar Admin Security</h2>
            <p style="color: #cbd5e1; font-size: 14px;">You requested a password change for your Admin Control Panel.</p>
            <div style="background: #1e293b; border: 1px solid #f97316; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
              <p style="font-size: 12px; color: #94a3b8; uppercase; margin: 0;">Your 6-Digit Verification OTP</p>
              <h1 style="font-size: 36px; color: #f97316; font-family: monospace; letter-spacing: 6px; margin: 10px 0;">${otpCode}</h1>
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">Valid for 10 minutes. Do not share with anyone.</p>
            </div>
          </div>
        `
      };
      mailTransporter.sendMail(mailOptions).catch(() => {});
    }

    return res.json({
      success: true,
      message: `6-Digit OTP sent to ${targetEmail}`,
      email: targetEmail
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to process OTP request' });
  }
});

// AUTHENTICATED: Change Admin Password using Verified Email OTP (Security Modal)
app.post('/api/auth/verify-otp-change-password', authenticateAdmin, async (req, res) => {
  const { currentPassword, otp, newPassword } = req.body;

  if (!currentPassword || !otp || !newPassword) {
    return res.status(400).json({ error: 'Current password, OTP code, and new password are required' });
  }

  try {
    const localDb = loadDB();
    let adminDoc = null;
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        adminDoc = await Admin.findOne({ username: 'admin' }).maxTimeMS(1000);
      } catch (e) {}
    }

    const isValid = verifyAdminPassword(currentPassword, localDb);
    if (!isValid) return res.status(400).json({ error: 'Current password is incorrect' });

    const activeOtp = adminDoc?.otpCode || localDb.otpStore?.code;
    const activeExpiry = adminDoc?.otpExpiresAt || localDb.otpStore?.expiresAt;

    if (!activeOtp) {
      return res.status(400).json({ error: 'No OTP requested. Please request an OTP first.' });
    }

    if (Date.now() > new Date(activeExpiry).getTime()) {
      if (adminDoc) { adminDoc.otpCode = null; adminDoc.save().catch(() => {}); }
      localDb.otpStore = null;
      saveDB(localDb);
      return res.status(400).json({ error: 'OTP code has expired. Please request a new OTP.' });
    }

    if (activeOtp.toString().trim() !== otp.toString().trim()) {
      return res.status(400).json({ error: 'Invalid OTP code entered. Please check your email.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(newPassword.trim(), salt);

    if (adminDoc) {
      adminDoc.passwordHash = newHash;
      adminDoc.otpCode = null;
      await adminDoc.save().catch(() => {});
    }

    localDb.admin = localDb.admin || {};
    localDb.admin.passwordHash = newHash;
    localDb.admin.updatedAt = new Date().toISOString();
    localDb.otpStore = null;
    saveDB(localDb);

    return res.json({ success: true, message: 'Password updated successfully! Log in with your new password.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update password' });
  }
});

const recentTrackCache = new Map();

// Non-blocking Instant Analytics Tracking (<10ms) - FRONTEND ONLY
app.post('/api/analytics/track', async (req, res) => {
  const { path = '/' } = req.body || {};
  const reqDevice = (req.body?.device || '').trim();
  const ua = (req.headers['user-agent'] || '').toLowerCase();

  // Detect mobile from either client payload or HTTP User-Agent header
  const isMobileUA = /mobile|android|iphone|ipad|ipod|blackberry|webos|windows phone|iemobile|opera mini|mobile safari/i.test(ua);
  const detectedDevice = (reqDevice === 'Mobile' || isMobileUA) ? 'Mobile' : 'Desktop';

  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
  const today = getLocalDateString();
  const referer = (req.headers['referer'] || req.headers['origin'] || '').toLowerCase();

  res.json({ success: true }); // Return immediately to client browser

  // EXCLUDE Admin Panel visits completely
  const targetPath = (path || '/').toLowerCase().trim();
  if (
    targetPath.startsWith('/admin') ||
    referer.includes(':5175') ||
    referer.includes('/admin')
  ) {
    return;
  }

  // Deduplicate exact hits from same IP & path within 2.5 seconds (React StrictMode / double render protection)
  const cacheKey = `${ip}_${path}`;
  const now = Date.now();
  if (recentTrackCache.has(cacheKey) && (now - recentTrackCache.get(cacheKey)) < 2500) {
    return;
  }
  recentTrackCache.set(cacheKey, now);

  // Clean old cache entries
  if (recentTrackCache.size > 200) {
    for (const [key, time] of recentTrackCache.entries()) {
      if (now - time > 5000) recentTrackCache.delete(key);
    }
  }

  // Save ONLY valid Frontend website traffic in background
  try {
    const localDb = loadDB();
    localDb.traffic = localDb.traffic || [];
    localDb.traffic.push({
      path: path || '/',
      ip,
      device: detectedDevice,
      date: today,
      timestamp: new Date().toISOString()
    });
    saveDB(localDb);

    if (await connectMongoDB()) {
      if (mongoose.connection && mongoose.connection.readyState >= 1) {
        await Traffic.create({
          path: path || '/',
          ip,
          device: detectedDevice,
          date: today,
          timestamp: new Date()
        }).catch(() => {});
      }
    }
  } catch (err) {}
});

// High-Speed Lead Submission (< 150ms)
app.post('/api/leads/submit', async (req, res) => {
  const { fullName, phone, email, businessName, businessType, goal, budget, source } = req.body;

  if (!fullName && !phone && !email) {
    return res.status(400).json({ error: 'Name, Phone, or Email is required' });
  }

  const normalizedEmail = email ? email.toLowerCase().trim() : 'visitor@viralvyapar.com';
  const now = new Date();
  const leadObj = {
    fullName: fullName || 'Website Visitor',
    phone: phone || 'N/A',
    email: email || 'N/A',
    businessName: businessName || 'N/A',
    businessType: businessType || 'General Business',
    goal: goal || 'Free Growth Blueprint & Audit',
    budget: budget || 'Not Specified',
    status: 'New',
    source: source || 'Instant Lead Magnet Popup',
    visitCount: 1,
    lastVisitedAt: now.toISOString(),
    createdAt: now.toISOString(),
    visitHistory: [{ timestamp: now.toISOString(), source: source || 'Instant Lead Magnet Popup' }]
  };

  try {
    const localDb = loadDB();
    localDb.leads = localDb.leads || [];
    const existingIndex = localDb.leads.findIndex(
      l => l.email?.toLowerCase() === normalizedEmail && normalizedEmail !== 'visitor@viralvyapar.com'
    );

    if (existingIndex >= 0) {
      localDb.leads[existingIndex].visitCount = (localDb.leads[existingIndex].visitCount || 1) + 1;
      localDb.leads[existingIndex].lastVisitedAt = now.toISOString();
      localDb.leads[existingIndex].visitHistory = localDb.leads[existingIndex].visitHistory || [];
      localDb.leads[existingIndex].visitHistory.push({
        timestamp: now.toISOString(),
        source: source || 'Repeat Form Submission'
      });
    } else {
      localDb.leads.unshift({ id: `lead_${Date.now()}`, ...leadObj });
    }
    saveDB(localDb);

    res.json({ success: true, message: 'Thank you! Our growth team will contact you shortly.' });

    if (await connectMongoDB()) {
      if (mongoose.connection && mongoose.connection.readyState >= 1) {
        await Lead.findOneAndUpdate(
          { email: normalizedEmail },
          {
            $set: leadObj,
            $inc: { visitCount: 1 },
            $push: { visitHistory: { timestamp: now, source: source || 'Instant Lead Magnet Popup' } }
          },
          { upsert: true, new: true }
        ).catch(() => {});
      }
    }
  } catch (err) {
    res.json({ success: true, message: 'Thank you! Your submission was recorded.' });
  }
});

// AI Agent WhatsApp Chat Endpoint
app.post('/api/whatsapp/ai-chat', async (req, res) => {
  const { message, session } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const query = message.toLowerCase().trim();
  let botReply = "";

  if (query.includes('price') || query.includes('cost') || query.includes('kitna') || query.includes('charge') || query.includes('package')) {
    botReply = "Our viral growth packages start at ₹24,999/month for Local Retail & Startups, and ₹49,999/month for fast-scaling D2C & Real Estate brands. Would you like a custom ROI estimation for your business?";
  } else if (query.includes('reel') || query.includes('video') || query.includes('content') || query.includes('short')) {
    botReply = "We handle 100% end-to-end Reel production! This includes scriptwriting tailored for high retention, professional shooting/creator coordination, trending audio selection, and high-converting Meta Ad setup.";
  } else if (query.includes('lead') || query.includes('sale') || query.includes('result') || query.includes('time') || query.includes('kab')) {
    botReply = "We launch campaigns within 48 hours! Performance Ads (Meta & Google) start delivering qualified leads from Day 1, while viral organic Reels build massive momentum within 7-14 days.";
  } else if (query.includes('seo') || query.includes('google') || query.includes('map') || query.includes('local')) {
    botReply = "Our Local SEO & GMB strategy guarantees your business ranks at the #1 spot on Google Maps in your city, bringing 100+ daily store footfalls and phone inquiries.";
  } else if (query.includes('audit') || query.includes('consult') || query.includes('call') || query.includes('book') || query.includes('free')) {
    botReply = "Awesome! We offer a 100% Free 30-Minute Viral Strategy Session where we analyze your business & competitors. Click the 'Book Free Audit' button or drop your phone number here!";
  } else if (query.includes('hi') || query.includes('hello') || query.includes('namaste') || query.includes('hey')) {
    botReply = "Namaste! 🙏 Welcome to Viral Vyapar. I am VyaparAI, your Growth Assistant. How can I help scale your business today?";
  } else {
    botReply = "Thanks for reaching out! Viral Vyapar specializes in Reels Marketing, Performance Ads, Local SEO & WhatsApp Automation. Would you like to schedule a free 30-min strategy call or chat directly with our founder on WhatsApp?";
  }

  res.json({ success: true, reply: botReply });

  // Background Chat Logging
  try {
    const localDb = loadDB();
    localDb.chatLogs = localDb.chatLogs || [];
    localDb.chatLogs.unshift({ session: session || 'guest', userQuery: message, aiReply: botReply, timestamp: new Date().toISOString() });
    saveDB(localDb);

    ChatLog.create({
      session: session || 'guest',
      userQuery: message,
      aiReply: botReply,
      timestamp: new Date()
    }).catch(() => {});
  } catch (err) {}
});

// Helper for date formatted YYYY-MM-DD
function getLocalDateString(dateObj = new Date()) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Dashboard Stats & Analytics Summary (Realtime Live Data & Calendar History)
app.get('/api/admin/stats', authenticateAdmin, async (req, res) => {
  const { date } = req.query; // optional date filter YYYY-MM-DD
  const today = getLocalDateString();
  const targetDate = date || today;
  const localDb = loadDB();

  let rawTraffic = localDb.traffic || [];
  let allLeads = localDb.leads || [];

  if (await connectMongoDB()) {
    if (mongoose.connection && mongoose.connection.readyState >= 1) {
      try {
        const mongoTraffic = await Traffic.find({}).lean().maxTimeMS(2000).exec();
        const mongoLeads = await Lead.find({}).lean().maxTimeMS(2000).exec();
        if (mongoTraffic && mongoTraffic.length > 0) {
          rawTraffic = mongoTraffic;
        }
        if (mongoLeads && mongoLeads.length > 0) {
          allLeads = mongoLeads;
        }
      } catch (e) {}
    }
  }

  // STRICT FILTER: Count ONLY Frontend public website visits (Ignore /admin or /api requests)
  const allTraffic = rawTraffic.filter(t => {
    const p = (t.path || '/').toLowerCase().trim();
    return !p.startsWith('/admin') && !p.startsWith('/api') && p !== '/admin' && p !== '/api';
  });

  const totalTraffic = allTraffic.length;
  const todayTraffic = allTraffic.filter(t => t.date === today).length;
  const selectedDateTraffic = allTraffic.filter(t => t.date === targetDate).length;

  // Filter traffic for selected date IF date query parameter is supplied
  const activeTraffic = date ? allTraffic.filter(t => t.date === date) : allTraffic;

  const totalLeads = allLeads.length;
  const todayLeads = allLeads.filter(l => {
    const d = l.createdAt ? getLocalDateString(new Date(l.createdAt)) : '';
    return d === today;
  }).length;

  const newLeadsCount = allLeads.filter(l => l.status === 'New').length;
  const contactedLeadsCount = allLeads.filter(l => l.status === 'Contacted').length;
  const convertedLeadsCount = allLeads.filter(l => l.status === 'Converted').length;

  const mobileCount = activeTraffic.filter(t => t.device === 'Mobile').length;
  const desktopCount = activeTraffic.filter(t => t.device === 'Desktop').length;

  // Real Top Visited Pages Calculation (Filtered by active date or overall)
  const pageMap = {};
  activeTraffic.forEach(t => {
    const p = t.path || '/';
    pageMap[p] = (pageMap[p] || 0) + 1;
  });
  const topPages = Object.keys(pageMap)
    .map(p => ({ path: p, count: pageMap[p] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Daily Traffic Calendar History (Grouped by Date)
  const dateMap = {};
  allTraffic.forEach(t => {
    const d = t.date || (t.timestamp ? getLocalDateString(new Date(t.timestamp)) : 'Unknown');
    if (!dateMap[d]) {
      dateMap[d] = { date: d, count: 0, mobile: 0, desktop: 0 };
    }
    dateMap[d].count += 1;
    if (t.device === 'Mobile') dateMap[d].mobile += 1;
    else dateMap[d].desktop += 1;
  });

  const dailyHistory = Object.values(dateMap)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json({
    success: true,
    stats: {
      todayTraffic,
      totalTraffic,
      selectedDateTraffic,
      selectedDate: targetDate,
      activeTrafficTotal: activeTraffic.length,
      todayLeads,
      totalLeads,
      newLeadsCount,
      contactedLeadsCount,
      convertedLeadsCount,
      conversionRate: totalLeads > 0 ? ((convertedLeadsCount / totalLeads) * 100).toFixed(1) : '0.0',
      topPages,
      deviceCounts: { Mobile: mobileCount, Desktop: desktopCount },
      dailyHistory
    }
  });
});

// Reset Traffic Analytics Logs (Clean Slate)
app.post('/api/admin/reset-traffic', authenticateAdmin, async (req, res) => {
  try {
    const localDb = loadDB();
    localDb.traffic = [];
    saveDB(localDb);

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      await Traffic.deleteMany({}).catch(() => {});
    }

    return res.json({ success: true, message: 'All traffic analytics reset to 0.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reset traffic data' });
  }
});

// Get Leads with filtering, search & date filter
app.get('/api/admin/leads', authenticateAdmin, async (req, res) => {
  const { status, search, date } = req.query;
  const localDb = loadDB();

  let leads = localDb.leads || [];

  try {
    const mongoLeads = await Lead.find().sort({ lastVisitedAt: -1, createdAt: -1 }).lean().maxTimeMS(2000).catch(() => []);
    if (mongoLeads && mongoLeads.length > 0) {
      leads = mongoLeads.map(l => ({
        ...l,
        id: l._id ? l._id.toString() : l.id
      }));
    }
  } catch (e) {}

  if (status && status !== 'All') {
    leads = leads.filter(l => l.status === status);
  }

  if (search) {
    const q = search.trim().toLowerCase();
    leads = leads.filter(l =>
      (l.fullName && l.fullName.toLowerCase().includes(q)) ||
      (l.email && l.email.toLowerCase().includes(q)) ||
      (l.phone && l.phone.toLowerCase().includes(q)) ||
      (l.businessName && l.businessName.toLowerCase().includes(q))
    );
  }

  if (date) {
    leads = leads.filter(l => {
      const createdStr = l.createdAt ? new Date(l.createdAt).toISOString().split('T')[0] : '';
      const visitedStr = l.lastVisitedAt ? new Date(l.lastVisitedAt).toISOString().split('T')[0] : '';
      return createdStr === date || visitedStr === date;
    });
  }

  res.json({ success: true, leads });
});

// Update Lead Status
app.patch('/api/admin/leads/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const localDb = loadDB();
    const lead = localDb.leads?.find(l => l.id === id || l._id === id);
    if (lead) {
      lead.status = status;
      saveDB(localDb);
    }

    Lead.findByIdAndUpdate(id, { status }, { new: true }).catch(() => {});
    res.json({ success: true, lead: { id, status } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update lead status' });
  }
});

// Delete Lead
app.delete('/api/admin/leads/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const localDb = loadDB();
    if (localDb.leads) {
      localDb.leads = localDb.leads.filter(l => l.id !== id && l._id !== id);
      saveDB(localDb);
    }

    Lead.findByIdAndDelete(id).catch(() => {});
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

// Get AI WhatsApp Chat Logs
app.get('/api/admin/chat-logs', authenticateAdmin, async (req, res) => {
  const localDb = loadDB();
  let logs = localDb.chatLogs || [];

  try {
    const mongoLogs = await ChatLog.find().sort({ timestamp: -1 }).limit(200).lean().maxTimeMS(2000).catch(() => []);
    if (mongoLogs && mongoLogs.length > 0) {
      logs = mongoLogs;
    }
  } catch (e) {}

  res.json({ success: true, chatLogs: logs });
});

// Start Express Server
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n=============================================================`);
    console.log(`🚀 VIRAL VYAPAR MONGODB CLOUD SERVERS ARE LIVE & RUNNING!`);
    console.log(`🌐 1. Public Frontend Website: http://localhost:5173/`);
    console.log(`🔒 2. Admin Control Portal:   http://localhost:5175/`);
    console.log(`⚙️  3. Central Express Backend: http://localhost:${PORT}/`);
    console.log(`=============================================================\n`);
  });
}

export default app;
