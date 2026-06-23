import mongoose from 'mongoose';

const reputationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1.0,
      max: 5.0,
    },
    projectsCompleted: {
      type: Number,
      default: 0,
    },
    onTimeDeliveryPercent: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    avgResponseTime: {
      type: Number,
      default: 2, // in hours
    },
    disputesCount: {
      type: Number,
      default: 0,
    },
    reputationScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Top Rated', 'Elite Freelancer'],
      default: 'Beginner',
    },
  },
  {
    timestamps: true,
  }
);

reputationSchema.index({ userId: 1 });
reputationSchema.index({ reputationScore: -1 });

const Reputation = mongoose.model('Reputation', reputationSchema);
export default Reputation;
