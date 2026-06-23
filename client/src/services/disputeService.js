import api from './api';

const disputeService = {
  raiseDispute: async (disputeData) => {
    const response = await api.post('/disputes', disputeData);
    return response.data;
  },

  getDisputeByContract: async (contractId) => {
    const response = await api.get(`/disputes/contract/${contractId}`);
    return response.data;
  },

  submitReply: async (disputeId, replyData) => {
    const response = await api.post(`/disputes/${disputeId}/reply`, replyData);
    return response.data;
  },

  getAllDisputes: async () => {
    const response = await api.get('/disputes/admin');
    return response.data;
  },

  resolveDispute: async (disputeId, resolveData) => {
    const response = await api.post(`/disputes/${disputeId}/resolve`, resolveData);
    return response.data;
  },
};

export default disputeService;
