import apiClient from './config';

export default {
  login(email, password) {
    return apiClient.post('/api/token', { email, password });
  },
};