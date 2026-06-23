import api from './api';

const skillService = {
  getQuiz: async (skill) => {
    const response = await api.get(`/skills/quiz/${skill}`);
    return response.data;
  },

  submitAnswers: async (skill, answers) => {
    const response = await api.post(`/skills/verify/${skill}`, { answers });
    return response.data;
  },

  getVerifications: async () => {
    const response = await api.get('/skills/verifications');
    return response.data;
  },
};

export default skillService;
