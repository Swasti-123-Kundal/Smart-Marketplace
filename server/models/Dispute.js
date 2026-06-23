import mongoose from 'mongoose';

const disputeSchema = new mongoose.Schema(
  {
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
      required: true,
    },
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      required: [true, 'Dispute reason is required'],
      enum: ['Work Quality', 'Late Delivery', 'Scam', 'Payment Issue'],
    },
    description: {
      type: String,
      required: [true, 'Dispute description is required'],
      trim: true,
    },
    proofs: {
      type: [String],
      default: [],
    },
    replyText: {
      type: String,
      default: '',
    },
    replyProofs: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['Open', 'Under Review', 'Resolved', 'Closed'],
      default: 'Open',
    },
    decision: {
      type: String,
      enum: ['Refund Client', 'Release Payment', 'Close Dispute'],
      default: null,
    },
    adminRemarks: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

disputeSchema.index({ contractId: 1 });
disputeSchema.index({ status: 1 });

const Dispute = mongoose.model('Dispute', disputeSchema);
export default Dispute;
