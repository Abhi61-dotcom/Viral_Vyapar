import dns from 'dns';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Lead from './models/Lead.js';
import Traffic from './models/Traffic.js';
import ChatLog from './models/ChatLog.js';
import Admin from './models/Admin.js';

// Enable bufferCommands so queries wait safely during initial connection
mongoose.set('bufferCommands', true);

const DEFAULT_MONGO_URI = 'mongodb+srv://jaatabhishek61_db_user:tN36kivXbe6WAcbs@cluster0.sksgdt0.mongodb.net/viral_vyapar?retryWrites=true&w=majority&appName=Cluster0';

export const connectMongoDB = async () => {
  const uri = process.env.MONGO_URI || DEFAULT_MONGO_URI;
  if (!uri) {
    return false;
  }

  if (mongoose.connection.readyState >= 1) {
    return true;
  }

  if (!cachedPromise) {
    cachedPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1500,
      connectTimeoutMS: 1500,
      maxPoolSize: 5
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
