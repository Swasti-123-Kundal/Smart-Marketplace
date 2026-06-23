import mongoose from 'mongoose';

const projectActivitySchema = new mongoose.Schema(
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
    activityType: {
      type: String,
      required: true,
      enum: [
        'project_created',
        'milestone_submitted',
        'milestone_approved',
        'payment_released',
        'task_created',
        'file_uploaded',
        'workspace_joined',
      ],
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

projectActivitySchema.index({ projectId: 1 });

const ProjectActivity = mongoose.model('ProjectActivity', projectActivitySchema);
export default ProjectActivity;
