import mongoose from 'mongoose';

const VisitHistorySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  source: { type: String, default: 'Website Visit' }
});

const LeadSchema = new mongoose.Schema({
  fullName: { type: String, default: 'Website Visitor' },
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  phone: { type: String, default: 'N/A' },
  businessName: { type: String, default: 'N/A' },
  businessType: { type: String, default: 'General Business' },
  goal: { type: String, default: 'Increase Sales & Leads' },
  budget: { type: String, default: 'Not Specified' },
  status: { type: String, default: 'New', enum: ['New', 'Contacted', 'Converted'] },
  source: { type: String, default: 'Website Form' },
  visitCount: { type: Number, default: 1 },
  lastVisitedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  visitHistory: [VisitHistorySchema]
}, { timestamps: true });

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
