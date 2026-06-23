import api from './api';

const proposalService = {
  submitProposal: async (proposalData) => {
    const response = await api.post('/proposals', proposalData);
    return response.data;
  },

  getProposalsForProject: async (projectId) => {
    const response = await api.get(`/proposals/project/${projectId}`);
    return response.data;
  },

  getMyProposals: async () => {
    const response = await api.get('/proposals/my');
    return response.data;
  },

  acceptProposal: async (id) => {
    const response = await api.put(`/proposals/${id}/accept`);
    return response.data;
  },

  rejectProposal: async (id) => {
    const response = await api.put(`/proposals/${id}/reject`);
    return response.data;
  },
};

export default proposalService;
