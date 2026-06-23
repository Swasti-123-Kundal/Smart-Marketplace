import mongoose from 'mongoose';

const teamTaskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    deadline: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['Todo', 'In Progress', 'Completed'],
      default: 'Todo',
    },
  },
  {
    timestamps: true,
  }
);

teamTaskSchema.index({ projectId: 1 });

const TeamTask = mongoose.model('TeamTask', teamTaskSchema);
export default TeamTask;
