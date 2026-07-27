import mongoose from 'mongoose';

const ChatLogSchema = new mongoose.Schema({
  session: { type: String, default: 'guest' },
  userQuery: { type: String, required: true },
  aiReply: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.ChatLog || mongoose.model('ChatLog', ChatLogSchema);
