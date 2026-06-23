import mongoose from 'mongoose';

const skillVerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skill: {
      type: String,
      required: true,
      enum: ['React', 'Node', 'MongoDB', 'Express', 'JavaScript'],
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    attemptDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent multiple verified credentials for the same skill per user
skillVerificationSchema.index({ userId: 1, skill: 1 }, { unique: true });

const SkillVerification = mongoose.model('SkillVerification', skillVerificationSchema);
export default SkillVerification;
