import crypto from 'crypto';
import getRazorpayInstance from '../config/razorpay.js';

/**
 * Create a Razorpay order.
 * @param {number} amount - Amount in INR (will be converted to paise)
 * @param {string} receipt - Receipt/reference ID
 * @returns {Promise<Object>} Razorpay order
 */
export const createOrder = async (amount, receipt) => {
  const razorpay = getRazorpayInstance();

  const options = {
    amount: Math.round(amount * 100), // Convert to paise
    currency: 'INR',
    receipt,
    payment_capture: 1, // Auto-capture
  };

  const order = await razorpay.orders.create(options);
  return order;
};

/**
 * Verify Razorpay payment signature.
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 * @returns {boolean}
 */
export const verifyPayment = (orderId, paymentId, signature) => {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
};
