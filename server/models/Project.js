import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [100, 'Budget must be at least ₹100'],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    skillsRequired: {
      type: [String],
      required: [true, 'At least one skill is required'],
      validate: {
        validator: (v) => v.length > 0,
        message: 'At least one skill is required',
      },
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'completed', 'cancelled'],
      default: 'open',
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
projectSchema.index({ clientId: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ skillsRequired: 1 });
projectSchema.index({ title: 'text', description: 'text' });
projectSchema.index({ createdAt: -1 });

// Virtual for proposal count
projectSchema.virtual('proposalCount', {
  ref: 'Proposal',
  localField: '_id',
  foreignField: 'projectId',
  count: true,
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
