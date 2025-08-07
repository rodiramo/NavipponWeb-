import mongoose from "mongoose";

const VerificationCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    length: 6,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
  },
  used: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3, // Max 3 attempts per code
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-delete expired documents
VerificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index for faster queries
VerificationCodeSchema.index({ email: 1, code: 1 });

const VerificationCode = mongoose.model(
  "VerificationCode",
  VerificationCodeSchema
);

export default VerificationCode;
