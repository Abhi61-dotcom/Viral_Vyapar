import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// On Vercel (read-only filesystem), use /tmp directory for fallback JSON DB
const DB_FILE = process.env.VERCEL
  ? path.join('/tmp', 'database.json')
  : path.join(__dirname, 'data', 'database.json');

// Initial clean database structure
const getCleanData = () => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync('admin123', salt);

  return {
    admin: {
      username: 'admin',
      email: 'choudharyabhishek1503@gmail.com',
      passwordHash: hashedPassword,
      updatedAt: new Date().toISOString()
    },
    otpStore: null,
    traffic: [],
    leads: [],
    chatLogs: []
  };
};

export const loadDB = () => {
  try {
    const dataDir = path.dirname(DB_FILE);
    if (!fs.existsSync(dataDir)) {
      try { fs.mkdirSync(dataDir, { recursive: true }); } catch (e) {}
    }

    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const data = JSON.parse(raw);
      if (data && data.admin) {
        if (!data.admin.email) {
          data.admin.email = 'choudharyabhishek1503@gmail.com';
        }
        return data;
      }
    }

    const cleanData = getCleanData();
    try { fs.writeFileSync(DB_FILE, JSON.stringify(cleanData, null, 2), 'utf8'); } catch (e) {}
    return cleanData;
  } catch (err) {
    return getCleanData();
  }
};

export const saveDB = (data) => {
  try {
    const dataDir = path.dirname(DB_FILE);
    if (!fs.existsSync(dataDir)) {
      try { fs.mkdirSync(dataDir, { recursive: true }); } catch (e) {}
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.warn('DB Save Warning (Read-only FS or Vercel):', err.message);
  }
};

export const resetDBToClean = () => {
  const cleanData = getCleanData();
  try { fs.writeFileSync(DB_FILE, JSON.stringify(cleanData, null, 2), 'utf8'); } catch (e) {}
  return cleanData;
};
