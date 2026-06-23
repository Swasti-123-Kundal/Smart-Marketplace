import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema(
  {
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Milestone title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    amount: {
      type: Number,
      required: [true, 'Milestone amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'submitted', 'approved', 'paid'],
      default: 'pending',
    },
    submissionText: {
      type: String,
      default: '',
    },
    submissionLink: {
      type: String,
      default: '',
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    actionedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

milestoneSchema.index({ contractId: 1 });
milestoneSchema.index({ status: 1 });

const Milestone = mongoose.model('Milestone', milestoneSchema);
export default Milestone;
