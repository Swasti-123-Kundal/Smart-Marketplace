import api from './api';

const milestoneService = {
  createMilestone: async (contractId, milestoneData) => {
    const response = await api.post(`/milestones/contract/${contractId}`, milestoneData);
    return response.data;
  },

  getContractMilestones: async (contractId) => {
    const response = await api.get(`/milestones/contract/${contractId}`);
    return response.data;
  },

  submitMilestone: async (milestoneId, submissionData) => {
    const response = await api.post(`/milestones/${milestoneId}/submit`, submissionData);
    return response.data;
  },

  approveMilestone: async (milestoneId) => {
    const response = await api.post(`/milestones/${milestoneId}/approve`);
    return response.data;
  },

  rejectMilestone: async (milestoneId, rejectData) => {
    const response = await api.post(`/milestones/${milestoneId}/reject`, rejectData);
    return response.data;
  },

  payMilestone: async (milestoneId) => {
    const response = await api.post(`/milestones/${milestoneId}/pay`);
    return response.data;
  },
};

export default milestoneService;
