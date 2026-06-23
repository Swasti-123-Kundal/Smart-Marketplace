import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    budget: {
      type: Number,
      required: true,
      min: [100, 'Budget must be at least ₹100'],
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'submitted', 'completed'],
      default: 'pending',
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
contractSchema.index({ clientId: 1 });
contractSchema.index({ freelancerId: 1 });
contractSchema.index({ status: 1 });
contractSchema.index({ projectId: 1 });

const Contract = mongoose.model('Contract', contractSchema);
export default Contract;
