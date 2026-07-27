import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { connectMongoDB, Lead, Traffic, ChatLog, Admin, isConnected } from './mongoDb.js';
import { loadDB, saveDB } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'viral_vyapar_admin_secret_key_2026';

app.use(cors());
app.use(express.json());

// Initialize MongoDB Atlas connection
connectMongoDB();

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
    console.log(`📧 Gmail SMTP Transporter Active for: ${user}`);
  } else {
    // Fallback Ethereal test transporter
    nodemailer.createTestAccount().then(testAccount => {
      mailTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass }
      });
      console.log(`📧 Fallback Ethereal Test Account Active (${testAccount.user})`);
    }).catch(err => {
      console.warn('Nodemailer test account creation error:', err);
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
        <p>This backend server (Port 5000) stores database records in MongoDB Atlas, tracks live visitor traffic, processes AI WhatsApp chats, and handles form lead submissions.</p>
        <div class="links">
          <a href="http://localhost:5173/" class="btn-website">🌐 Open Public Frontend Website (Port 5173)</a>
          <a href="http://localhost:5175/" class="btn-admin">🔒 Open Admin Control Portal (Port 5175)</a>
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

// Admin Login
app.post('/api/auth/login', async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    const localDb = loadDB();
    let adminDoc = null;
    try {
      if (isConnected) {
        adminDoc = await Admin.findOne({ username: 'admin' });
      }
    } catch (e) {
      console.warn('Mongo find error during login:', e.message);
    }

    const passwordHash = adminDoc?.passwordHash || localDb.admin.passwordHash;
    const isMatch = bcrypt.compareSync(password.trim(), passwordHash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect Admin Password' });
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

// Send OTP to Admin Email for Password Reset
app.post('/api/auth/send-otp', authenticateAdmin, async (req, res) => {
  const { currentPassword } = req.body;
  if (!currentPassword) {
    return res.status(400).json({ error: 'Current password is required to request OTP' });
  }

  try {
    const localDb = loadDB();
    let adminDoc = null;
    try {
      adminDoc = await Admin.findOne({ username: 'admin' });
    } catch (e) {}

    const passwordHash = adminDoc?.passwordHash || localDb.admin.passwordHash;
    const isMatch = bcrypt.compareSync(currentPassword.trim(), passwordHash);

    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const targetEmail = 'choudharyabhishek1503@gmail.com';
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (adminDoc) {
      adminDoc.otpCode = otpCode;
      adminDoc.otpExpiresAt = expiresAt;
      await adminDoc.save();
    }

    localDb.otpStore = { code: otpCode, expiresAt: expiresAt.toISOString(), email: targetEmail };
    saveDB(localDb);

    console.log(`\n======================================================`);
    console.log(`🔒 EMAIL OTP GENERATED FOR ADMIN: ${targetEmail}`);
    console.log(`🔑 6-DIGIT VERIFICATION CODE: [ ${otpCode} ]`);
    console.log(`⏰ VALID UNTIL: ${expiresAt.toLocaleTimeString()}`);
    console.log(`======================================================\n`);

    if (mailTransporter) {
      try {
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
              <p style="font-size: 12px; color: #64748b;">If you did not request this OTP, please ignore this message.</p>
            </div>
          `
        };
        await mailTransporter.sendMail(mailOptions);
        console.log(`✅ REAL GMAIL EMAIL DELIVERED TO: ${targetEmail}`);
      } catch (err) {
        console.warn('Nodemailer send error:', err.message);
      }
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

// Change Admin Password using Verified Email OTP
app.post('/api/auth/verify-otp-change-password', authenticateAdmin, async (req, res) => {
  const { currentPassword, otp, newPassword } = req.body;

  if (!currentPassword || !otp || !newPassword) {
    return res.status(400).json({ error: 'Current password, OTP code, and new password are required' });
  }

  try {
    const localDb = loadDB();
    let adminDoc = null;
    try {
      adminDoc = await Admin.findOne({ username: 'admin' });
    } catch (e) {}

    const passwordHash = adminDoc?.passwordHash || localDb.admin.passwordHash;
    const isMatch = bcrypt.compareSync(currentPassword.trim(), passwordHash);

    if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });

    const activeOtp = adminDoc?.otpCode || localDb.otpStore?.code;
    const activeExpiry = adminDoc?.otpExpiresAt || localDb.otpStore?.expiresAt;

    if (!activeOtp) {
      return res.status(400).json({ error: 'No OTP requested. Please request an OTP first.' });
    }

    if (Date.now() > new Date(activeExpiry).getTime()) {
      if (adminDoc) { adminDoc.otpCode = null; await adminDoc.save(); }
      localDb.otpStore = null;
      saveDB(localDb);
      return res.status(400).json({ error: 'OTP code has expired. Please request a new OTP.' });
    }

    if (activeOtp.toString().trim() !== otp.toString().trim()) {
      return res.status(400).json({ error: 'Invalid OTP code entered. Please check your email.' });
    }

    // Generate new password hash
    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(newPassword.trim(), salt);

    // Update MongoDB Atlas
    if (adminDoc) {
      adminDoc.passwordHash = newHash;
      adminDoc.otpCode = null;
      await adminDoc.save();
    }

    // Update Local JSON DB
    localDb.admin.passwordHash = newHash;
    localDb.admin.updatedAt = new Date().toISOString();
    localDb.otpStore = null;
    saveDB(localDb);

    console.log(`\n======================================================`);
    console.log(`🔑 ADMIN PASSWORD UPDATED SUCCESSFULLY IN MONGODB & LOCAL DB`);
    console.log(`📧 CONFIRMED FOR: choudharyabhishek1503@gmail.com`);
    console.log(`======================================================\n`);

    return res.json({ success: true, message: 'Password updated successfully! Log in with your new password.' });
  } catch (err) {
    console.error('Password change error:', err);
    return res.status(500).json({ error: 'Failed to update password' });
  }
});

// Track Page Views & Visitor Hits in MongoDB
app.post('/api/analytics/track', async (req, res) => {
  const { path, device = 'Desktop' } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const today = new Date().toISOString().split('T')[0];

  try {
    await Traffic.create({
      path: path || '/',
      ip,
      device,
      date: today,
      timestamp: new Date()
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record analytics' });
  }
});

// Submit Lead into MongoDB Atlas (with Email Deduplication & Visit Count)
app.post('/api/leads/submit', async (req, res) => {
  const { fullName, phone, email, businessName, businessType, goal, budget, source } = req.body;

  if (!fullName && !phone && !email) {
    return res.status(400).json({ error: 'Name, Phone, or Email is required' });
  }

  const normalizedEmail = email ? email.toLowerCase().trim() : null;
  const now = new Date();

  try {
    let existingLead = null;
    if (normalizedEmail && normalizedEmail !== 'n/a') {
      existingLead = await Lead.findOne({ email: normalizedEmail });
    }

    if (existingLead) {
      existingLead.visitCount = (existingLead.visitCount || 1) + 1;
      existingLead.lastVisitedAt = now;

      if (fullName && fullName !== 'Website Visitor') existingLead.fullName = fullName;
      if (phone && phone !== 'N/A') existingLead.phone = phone;
      if (businessName && businessName !== 'N/A') existingLead.businessName = businessName;
      if (businessType && businessType !== 'General Business') existingLead.businessType = businessType;
      if (goal) existingLead.goal = goal;
      if (budget && budget !== 'Not Specified') existingLead.budget = budget;
      if (source) existingLead.source = source;

      if (!existingLead.visitHistory) existingLead.visitHistory = [];
      existingLead.visitHistory.push({ timestamp: now, source: source || 'Website Visit' });

      await existingLead.save();

      console.log(`🍃 MONGODB RE-VISIT UPDATED: ${existingLead.email} (Total Visits: ${existingLead.visitCount})`);
      return res.json({ success: true, lead: existingLead, isExisting: true });
    }

    const newLead = await Lead.create({
      fullName: fullName || 'Website Visitor',
      phone: phone || 'N/A',
      email: email || 'N/A',
      businessName: businessName || 'N/A',
      businessType: businessType || 'General Business',
      goal: goal || 'Increase Sales & Leads',
      budget: budget || 'Not Specified',
      status: 'New',
      source: source || 'Website Form',
      visitCount: 1,
      lastVisitedAt: now,
      createdAt: now,
      visitHistory: [{ timestamp: now, source: source || 'Website Form' }]
    });

    console.log(`🍃 NEW MONGODB ATLAS LEAD CREATED: ${newLead.email} (${newLead.fullName})`);
    return res.json({ success: true, lead: newLead, isExisting: false });
  } catch (err) {
    console.error('Lead save error in MongoDB:', err);
    return res.status(500).json({ error: 'Failed to submit lead to database' });
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

  try {
    await ChatLog.create({
      session: session || 'guest',
      userQuery: message,
      aiReply: botReply,
      timestamp: new Date()
    });
  } catch (err) {
    console.warn('Chat log save error:', err.message);
  }

  res.json({ success: true, reply: botReply });
});

/* ==========================================================================
   PROTECTED ADMIN ENDPOINTS
   ========================================================================== */

// Dashboard Stats & Analytics Summary from MongoDB
app.get('/api/admin/stats', authenticateAdmin, async (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  try {
    const totalTraffic = await Traffic.countDocuments();
    const todayTraffic = await Traffic.countDocuments({ date: today });

    const totalLeads = await Lead.countDocuments();
    const startOfToday = new Date(today);
    const todayLeads = await Lead.countDocuments({ createdAt: { $gte: startOfToday } });

    const newLeadsCount = await Lead.countDocuments({ status: 'New' });
    const contactedLeadsCount = await Lead.countDocuments({ status: 'Contacted' });
    const convertedLeadsCount = await Lead.countDocuments({ status: 'Converted' });

    // Top Pages
    const topPagesAgg = await Traffic.aggregate([
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    const topPages = topPagesAgg.map(p => ({ path: p._id, count: p.count }));

    // Device breakdown
    const mobileCount = await Traffic.countDocuments({ device: 'Mobile' });
    const desktopCount = await Traffic.countDocuments({ device: 'Desktop' });

    res.json({
      success: true,
      stats: {
        todayTraffic,
        totalTraffic,
        todayLeads,
        totalLeads,
        newLeadsCount,
        contactedLeadsCount,
        convertedLeadsCount,
        conversionRate: totalLeads > 0 ? ((convertedLeadsCount / totalLeads) * 100).toFixed(1) : '0.0',
        topPages,
        deviceCounts: { Mobile: mobileCount, Desktop: desktopCount }
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch MongoDB stats' });
  }
});

// Get Leads with filtering, search & date filter from MongoDB
app.get('/api/admin/leads', authenticateAdmin, async (req, res) => {
  const { status, search, date } = req.query;
  const filter = {};

  if (status && status !== 'All') {
    filter.status = status;
  }

  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    filter.$or = [
      { createdAt: { $gte: startDate, $lt: endDate } },
      { lastVisitedAt: { $gte: startDate, $lt: endDate } }
    ];
  }

  if (search) {
    const q = search.trim();
    const searchRegex = new RegExp(q, 'i');
    filter.$or = [
      { fullName: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
      { businessName: searchRegex }
    ];
  }

  try {
    const leads = await Lead.find(filter).sort({ lastVisitedAt: -1, createdAt: -1 }).lean();
    const formattedLeads = leads.map(l => ({
      ...l,
      id: l._id.toString()
    }));
    res.json({ success: true, leads: formattedLeads });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leads from MongoDB' });
  }
});

// Update Lead Status in MongoDB
app.patch('/api/admin/leads/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ success: true, lead: { ...lead.toObject(), id: lead._id.toString() } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update lead status' });
  }
});

// Delete Lead from MongoDB
app.delete('/api/admin/leads/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await Lead.findByIdAndDelete(id);
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

// Get AI WhatsApp Chat Logs from MongoDB
app.get('/api/admin/chat-logs', authenticateAdmin, async (req, res) => {
  try {
    const logs = await ChatLog.find().sort({ timestamp: -1 }).limit(200).lean();
    res.json({ success: true, chatLogs: logs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat logs' });
  }
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
