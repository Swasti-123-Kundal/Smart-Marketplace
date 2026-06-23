import api from './api';

const reviewService = {
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  getFreelancerReviews: async (freelancerId) => {
    const response = await api.get(`/reviews/freelancer/${freelancerId}`);
    return response.data;
  },
};

export default reviewService;
