import api from './api';

const chatService = {
  getHistory: async (roomId) => {
    const response = await api.get(`/messages/${roomId}`);
    return response.data;
  },

  getConversations: async () => {
    const response = await api.get('/messages/conversations');
    return response.data;
  },
};

export default chatService;
