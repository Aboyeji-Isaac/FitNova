import apiClient, { getAuthToken, setAuthToken } from './apiClient';

// Auth endpoints
export const auth = {
  signup: (data) => apiClient.post('/auth/signup', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  getCurrentUser: () => apiClient.get('/auth/me'),
  verifyToken: (token) => apiClient.post('/auth/verify-token', {}, {
    headers: { Authorization: `Bearer ${token}` }
  }),
};

// Onboarding endpoints
export const onboarding = {
  completeSetup: (data) => apiClient.post('/onboarding/setup', data),
  getStatus: () => apiClient.get('/onboarding/status'),
};

// User endpoints
export const users = {
  getProfile: (userId) => apiClient.get(`/users/profile/${userId}`),
  updateProfile: (data) => apiClient.put('/users/profile', data),
  getActiveChallenges: () => apiClient.get('/users/challenges/active'),
  getStats: (userId) => apiClient.get(`/users/stats/${userId}`),
};

// Challenge endpoints
export const challenges = {
  getAll: () => apiClient.get('/challenges'),
  getById: (id) => apiClient.get(`/challenges/${id}`),
  create: (data) => apiClient.post('/challenges', data),
  update: (id, data) => apiClient.put(`/challenges/${id}`, data),
  delete: (id) => apiClient.delete(`/challenges/${id}`),
  join: (id) => apiClient.post(`/challenges/${id}/join`),
  leave: (id) => apiClient.post(`/challenges/${id}/leave`),
};

// Progress endpoints
export const progress = {
  submit: (data) => apiClient.post('/progress', data),
  getHistory: (challengeId) => apiClient.get(`/progress/${challengeId}`),
  getDaily: (challengeId) => apiClient.get(`/progress/daily/${challengeId}`),
};

// Leaderboard endpoints
export const leaderboard = {
  getGlobal: (limit) => apiClient.get('/leaderboard', { params: { limit } }),
  getByChallenge: (challengeId, limit) => 
    apiClient.get(`/leaderboard/${challengeId}`, { params: { limit } }),
  getUserRank: (challengeId, userId) => 
    apiClient.get(`/leaderboard/${challengeId}/user/${userId}`),
};

export { getAuthToken, setAuthToken };

