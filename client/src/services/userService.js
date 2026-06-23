import api from './api';

const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  uploadAvatar: async (formData) => {
    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-t-data', // Axios handles file boundaries automatically if passed form-data
      },
    });
    return response.data;
  },

  getFreelancers: async (filters = {}) => {
    const response = await api.get(`/users/freelancers`, { params: filters });
    return response.data;
  },

  getFreelancerById: async (id) => {
    const response = await api.get(`/users/freelancers/${id}`);
    return response.data;
  },
};

export default userService;
