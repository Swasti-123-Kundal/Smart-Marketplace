import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coverLetter: {
      type: String,
      required: [true, 'Cover letter is required'],
      maxlength: [1000, 'Cover letter cannot exceed 1000 characters'],
    },
    expectedBudget: {
      type: Number,
      required: [true, 'Expected budget is required'],
      min: [100, 'Budget must be at least ₹100'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one proposal per freelancer per project
proposalSchema.index({ projectId: 1, freelancerId: 1 }, { unique: true });
proposalSchema.index({ freelancerId: 1 });
proposalSchema.index({ status: 1 });

const Proposal = mongoose.model('Proposal', proposalSchema);
export default Proposal;
