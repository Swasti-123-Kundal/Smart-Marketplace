import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['Frontend Developer', 'Backend Developer', 'UI Designer', 'QA Engineer'],
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

teamMemberSchema.index({ projectId: 1, userId: 1 }, { unique: true });

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
export default TeamMember;
