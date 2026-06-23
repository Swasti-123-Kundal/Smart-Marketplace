import api from './api';

const paymentService = {
  createOrder: async (contractId) => {
    const response = await api.post('/payments/create-order', { contractId });
    return response.data;
  },

  verifyPayment: async (verificationData) => {
    // verificationData: { razorpayOrderId, razorpayPaymentId, razorpaySignature }
    const response = await api.post('/payments/verify', verificationData);
    return response.data;
  },

  getPayments: async () => {
    const response = await api.get('/payments');
    return response.data;
  },
};

export default paymentService;
