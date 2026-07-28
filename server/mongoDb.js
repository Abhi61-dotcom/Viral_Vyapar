import dns from 'dns';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Lead from './models/Lead.js';
import Traffic from './models/Traffic.js';
import ChatLog from './models/ChatLog.js';
import Admin from './models/Admin.js';

if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
  } catch (e) {}
}

// Disable Mongoose command buffering so offline/deferred connections fail fast (<1ms) instead of hanging requests
mongoose.set('bufferCommands', false);

let cachedPromise = null;

export const connectMongoDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    return false;
  }

  if (mongoose.connection.readyState >= 1) {
    return true;
  }

  if (!cachedPromise) {
    cachedPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
      maxPoolSize: 10
    }).then((m) => {
      // Background seed default admin if needed
      Admin.findOne({ username: 'admin' }).then((existingAdmin) => {
        if (!existingAdmin) {
          const salt = bcrypt.genSaltSync(8);
          const hashedPassword = bcrypt.hashSync('admin123', salt);
          Admin.create({
            username: 'admin',
            email: 'choudharyabhishek1503@gmail.com',
            passwordHash: hashedPassword
          }).catch(() => {});
        }
      }).catch(() => {});
      return m;
    }).catch((err) => {
      cachedPromise = null;
      console.warn('MongoDB connection deferred:', err.message);
      return false;
    });
  }

  try {
    const res = await cachedPromise;
    return !!res;
  } catch (e) {
    cachedPromise = null;
    return false;
  }
};

export const isConnected = () => mongoose.connection.readyState >= 1;

export { Lead, Traffic, ChatLog, Admin };
