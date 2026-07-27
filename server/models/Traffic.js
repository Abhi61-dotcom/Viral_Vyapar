import mongoose from 'mongoose';

const TrafficSchema = new mongoose.Schema({
  path: { type: String, default: '/' },
  ip: { type: String, default: '127.0.0.1' },
  device: { type: String, default: 'Desktop' },
  date: { type: String, index: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Traffic || mongoose.model('Traffic', TrafficSchema);
