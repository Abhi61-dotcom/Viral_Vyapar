import dns from 'dns';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Lead from './models/Lead.js';
import Traffic from './models/Traffic.js';
import ChatLog from './models/ChatLog.js';
import Admin from './models/Admin.js';

// Set public DNS resolvers to ensure Node.js resolves MongoDB Atlas SRV records on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // fallback if system restricts DNS override
}

let isConnected = false;

export const connectMongoDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('⚠️ MONGO_URI missing in .env file');
    return false;
  }

  if (isConnected) return true;

  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log(`\n=============================================================`);
    console.log(`🍃 CONNECTED TO MONGODB ATLAS CLOUD DATABASE SUCCESSFULLY!`);
    console.log(`=============================================================\n`);

    // Ensure default admin exists in MongoDB
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync('admin123', salt);
      await Admin.create({
        username: 'admin',
        email: 'choudharyabhishek1503@gmail.com',
        passwordHash: hashedPassword
      });
      console.log('✅ Default Admin Account created in MongoDB Atlas');
    }

    return true;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    return false;
  }
};

export { Lead, Traffic, ChatLog, Admin, isConnected };
