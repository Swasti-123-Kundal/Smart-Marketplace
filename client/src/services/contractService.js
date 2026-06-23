import api from './api';

const contractService = {
  getContracts: async () => {
    const response = await api.get('/contracts');
    return response.data;
  },

  getContractById: async (id) => {
    const response = await api.get(`/contracts/${id}`);
    return response.data;
  },

  updateContractStatus: async (id, statusData) => {
    // statusData: { status } (e.g., 'completed', 'active')
    const response = await api.put(`/contracts/${id}/status`, statusData);
    return response.data;
  },
};

export default contractService;
