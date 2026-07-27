import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  username: { type: String, default: 'admin', unique: true },
  email: { type: String, default: 'choudharyabhishek1503@gmail.com' },
  passwordHash: { type: String, required: true },
  otpCode: { type: String, default: null },
  otpExpiresAt: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
