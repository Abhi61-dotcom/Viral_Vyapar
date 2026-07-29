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

let cached = global.mongooseCached;
if (!cached) {
  cached = global.mongooseCached = { conn: null, promise: null };
}

export const connectMongoDB = async () => {
  const uri = process.env.MONGO_URI || DEFAULT_MONGO_URI;
  if (!uri) {
    return false;
  }

  if (cached.conn && mongoose.connection.readyState >= 1) {
    return true;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
      maxPoolSize: 10
    }).then((m) => {
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
      cached.promise = null;
      console.warn('MongoDB connection error:', err.message);
      return false;
    });
  }

  try {
    cached.conn = await cached.promise;
    return !!cached.conn;
  } catch (e) {
    cached.promise = null;
    return false;
  }
};

// Start background connection attempt on module load
connectMongoDB().catch(() => {});

export const isConnected = () => mongoose.connection.readyState >= 1;

export { Lead, Traffic, ChatLog, Admin };
