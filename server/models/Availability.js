import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Available', 'Busy', 'Vacation'],
      required: true,
      default: 'Available',
    },
    timeSlots: [
      {
        start: {
          type: String, // format "HH:MM" e.g., "10:00"
          required: true,
        },
        end: {
          type: String, // format "HH:MM" e.g., "17:00"
          required: true,
        },
        status: {
          type: String,
          enum: ['Available', 'Busy', 'Vacation'],
          required: true,
          default: 'Available',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate availability entries for the same user on the same date
availabilitySchema.index({ userId: 1, date: 1 }, { unique: true });

const Availability = mongoose.model('Availability', availabilitySchema);
export default Availability;
