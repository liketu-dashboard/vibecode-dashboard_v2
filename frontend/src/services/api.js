import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3000000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const analyticsAPI = {
  getAnalytics: (period = '90D') => 
    api.get(`/analytics?period=${period}`),
  
  getDailyActiveUsers: (days = 90) => 
    api.get(`/analytics/daily-active-users?days=${days}`),
  
  getHealthCheck: () => 
    api.get('/analytics/health'),
};

export default api;
