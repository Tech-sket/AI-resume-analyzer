const mongoose = require('mongoose');

// User Schema - Compatible with string UUIDs
const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, sparse: true, unique: true, index: true },
  phone_number: { type: String, sparse: true, unique: true, index: true },
  password_hash: { type: String, required: true },
  created_at: { type: Date, default: Date.now, index: true },
  updated_at: { type: Date, default: Date.now }
});

// Analysis Schema
const AnalysisSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  user_id: { type: String, required: true, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
  job_role: { type: String, required: true },
  tfidf_score: { type: Number, default: 0 },
  ats_score: { type: Number, default: 0 },
  skill_match_json: { type: String, default: '{}' },
  recommendation: { type: String, default: '' },
  analysis_json: { type: String, default: '{}' },
  resume_url: { type: String, default: '' },
  created_at: { type: Date, default: Date.now, index: true }
});


// Password Reset Schema with TTL (auto-expires after 1 hour)
const PasswordResetSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  user_id: { type: String, required: true, index: true },
  token: { type: String, required: true },
  identifier: { type: String, required: true },
  expires_at: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
  reset_ticket: { type: String, sparse: true, unique: true },
  reset_ticket_expires_at: { type: Date, sparse: true },
  verified_at: { type: Date, sparse: true },
  created_at: { type: Date, default: Date.now, index: true }
});

// Export Models
const User = mongoose.model('User', UserSchema);
const Analysis = mongoose.model('Analysis', AnalysisSchema);
const PasswordReset = mongoose.model('PasswordReset', PasswordResetSchema);

module.exports = {
  User,
  Analysis,
  PasswordReset
};