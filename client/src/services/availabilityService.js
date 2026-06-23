import api from './api';

const availabilityService = {
  setAvailability: async (data) => {
    const response = await api.post('/availability', data);
    return response.data;
  },

  getMyAvailability: async () => {
    const response = await api.get('/availability/my');
    return response.data;
  },

  getUserAvailability: async (userId) => {
    const response = await api.get(`/availability/user/${userId}`);
    return response.data;
  },
};

export default availabilityService;
