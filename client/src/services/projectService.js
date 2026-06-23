import api from './api';

const projectService = {
  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  getProjects: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.minBudget) params.append('minBudget', filters.minBudget);
    if (filters.maxBudget) params.append('maxBudget', filters.maxBudget);
    if (filters.skills) params.append('skills', filters.skills);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await api.get(`/projects?${params.toString()}`);
    return response.data;
  },

  getProjectById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  updateProject: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  getMyProjects: async () => {
    const response = await api.get('/projects/my');
    return response.data;
  },
};

export default projectService;
