import mongoose from 'mongoose';

const teamInvitationSchema = new mongoose.Schema(
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
    role: {
      type: String,
      required: true,
      enum: ['Frontend Developer', 'Backend Developer', 'UI Designer', 'QA Engineer'],
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

teamInvitationSchema.index({ freelancerId: 1 });
teamInvitationSchema.index({ projectId: 1 });

const TeamInvitation = mongoose.model('TeamInvitation', teamInvitationSchema);
export default TeamInvitation;
