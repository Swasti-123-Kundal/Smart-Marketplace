import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle global error responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Return a uniform error format
    const message = error.response?.data?.message || 'Something went wrong';
    const errors = error.response?.data?.errors || null;
    return Promise.reject({
      message,
      errors,
      status: error.response?.status,
    });
  }
);

export default api;
