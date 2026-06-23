import api from './api';

const teamService = {
  inviteMember: async (inviteData) => {
    const response = await api.post('/team/invite', inviteData);
    return response.data;
  },

  getMyInvitations: async () => {
    const response = await api.get('/team/invitations/my');
    return response.data;
  },

  respondToInvitation: async (id, accept) => {
    const response = await api.post(`/team/invitations/${id}/respond`, { accept });
    return response.data;
  },

  getProjectMembers: async (projectId) => {
    const response = await api.get(`/team/project/${projectId}/members`);
    return response.data;
  },

  removeMember: async (projectId, userId) => {
    const response = await api.delete(`/team/project/${projectId}/members/${userId}`);
    return response.data;
  },

  createTask: async (projectId, taskData) => {
    const response = await api.post(`/team/project/${projectId}/tasks`, taskData);
    return response.data;
  },

  getTasks: async (projectId) => {
    const response = await api.get(`/team/project/${projectId}/tasks`);
    return response.data;
  },

  updateTask: async (taskId, taskData) => {
    const response = await api.put(`/team/tasks/${taskId}`, taskData);
    return response.data;
  },

  uploadFile: async (projectId, fileData) => {
    const response = await api.post(`/team/project/${projectId}/files`, fileData);
    return response.data;
  },

  getFiles: async (projectId) => {
    const response = await api.get(`/team/project/${projectId}/files`);
    return response.data;
  },

  sendChatMessage: async (projectId, messageData) => {
    const response = await api.post(`/team/project/${projectId}/chat`, messageData);
    return response.data;
  },

  getChatMessages: async (projectId) => {
    const response = await api.get(`/team/project/${projectId}/chat`);
    return response.data;
  },

  getActivities: async (projectId) => {
    const response = await api.get(`/team/project/${projectId}/activities`);
    return response.data;
  },

  markChatAsRead: async (projectId) => {
    const response = await api.post(`/team/project/${projectId}/chat/read`);
    return response.data;
  },
};

export default teamService;
