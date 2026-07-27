import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'data', 'database.json');

// Ensure data directory exists
const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial 100% Real Clean database structure with Email OTP security configuration
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
    otpStore: null, // { code, expiresAt, email }
    traffic: [],
    leads: [],
    chatLogs: []
  };
};

export const loadDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    const cleanData = getCleanData();
    fs.writeFileSync(DB_FILE, JSON.stringify(cleanData, null, 2), 'utf8');
    return cleanData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const data = JSON.parse(raw);
    if (!data.admin.email) {
      data.admin.email = 'choudharyabhishek1503@gmail.com';
    }
    return data;
  } catch (err) {
    const cleanData = getCleanData();
    fs.writeFileSync(DB_FILE, JSON.stringify(cleanData, null, 2), 'utf8');
    return cleanData;
  }
};

export const saveDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving DB:', err);
  }
};

export const resetDBToClean = () => {
  const cleanData = getCleanData();
  fs.writeFileSync(DB_FILE, JSON.stringify(cleanData, null, 2), 'utf8');
  return cleanData;
};
