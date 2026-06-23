import Payment from '../models/Payment.js';
import Contract from '../models/Contract.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createOrder, verifyPayment } from '../services/razorpayService.js';
import { createNotification } from '../services/notificationService.js';

/**
 * @desc    Create Razorpay order
 * @route   POST /api/payments/create-order
 * @access  Private (Client)
 */
export const createPaymentOrder = asyncHandler(async (req, res) => {
  const { contractId } = req.body;

  const contract = await Contract.findById(contractId).populate('projectId', 'title');
  if (!contract) throw ApiError.notFound('Contract not found');

  if (contract.clientId.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Not authorized');
  }

  // Check if already paid
  const existingPayment = await Payment.findOne({
    contractId,
    status: 'paid',
  });
  if (existingPayment) throw ApiError.conflict('Payment already made for this contract');

  // Create Razorpay order
  const order = await createOrder(contract.budget, `contract_${contractId}`);

  // Create pending payment record
  const payment = await Payment.create({
    clientId: req.user._id,
    freelancerId: contract.freelancerId,
    contractId,
    amount: contract.budget,
    razorpayOrderId: order.id,
    status: 'pending',
  });

  res.json({
    success: true,
    order,
    payment,
    key: process.env.RAZORPAY_KEY_ID,
  });
});

/**
 * @desc    Verify Razorpay payment
 * @route   POST /api/payments/verify
 * @access  Private (Client)
 */
export const verifyPaymentHandler = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  // Verify signature
  const isValid = verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);
  if (!isValid) throw ApiError.badRequest('Payment verification failed');

  // Update payment record
  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId },
    {
      razorpayPaymentId,
      razorpaySignature,
      status: 'paid',
    },
    { new: true }
  );

  if (!payment) throw ApiError.notFound('Payment record not found');

  // Activate contract
  await Contract.findByIdAndUpdate(payment.contractId, {
    status: 'in_progress',
    startedAt: new Date(),
  });

  // Notify freelancer
  const io = req.app.get('io');
  const contract = await Contract.findById(payment.contractId).populate('projectId', 'title');

  await createNotification(io, {
    userId: payment.freelancerId,
    type: 'payment_received',
    title: 'Payment Received! 💰',
    message: `Payment of ₹${payment.amount} received for "${contract.projectId.title}"`,
    link: `/freelancer/earnings`,
  });

  res.json({
    success: true,
    message: 'Payment verified and contract activated',
    payment,
  });
});

/**
 * @desc    Get payment history
 * @route   GET /api/payments
 * @access  Private
 */
export const getPayments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const query = {};

  if (req.user.role === 'client') {
    query.clientId = req.user._id;
  } else if (req.user.role === 'freelancer') {
    query.freelancerId = req.user._id;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Payment.countDocuments(query);

  const payments = await Payment.find(query)
    .populate('clientId', 'name profileImage')
    .populate('freelancerId', 'name profileImage')
    .populate({
      path: 'contractId',
      select: 'projectId',
      populate: { path: 'projectId', select: 'title' },
    })
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  // Calculate totals
  const totalPaid = await Payment.aggregate([
    { $match: { ...query, status: 'paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  res.json({
    success: true,
    payments,
    totalAmount: totalPaid[0]?.total || 0,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});
