import api from './api';

const reputationService = {
  getLeaderboard: async (params = {}) => {
    const response = await api.get('/reputation/leaderboard', { params });
    return response.data;
  },

  getReputation: async (userId) => {
    const response = await api.get(`/reputation/${userId}`);
    return response.data;
  },

  recalculateReputation: async (userId) => {
    const response = await api.post(`/reputation/recalculate/${userId}`);
    return response.data;
  },
};

export default reputationService;
