import api from './api'

export const authService = {
  register: (username, email, password) =>
    api.post('/api/auth/register', { username, email, password }),
  
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),
  
  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('current_user')
    return api.post('/api/auth/logout')
  },
  
  refreshToken: (refreshToken) =>
    api.post('/api/auth/refresh', { refresh_token: refreshToken }),
}

export const userService = {
  getUsers: () => api.get('/api/users/'),
  
  getUser: (userId) => api.get(`/api/users/${userId}`),
  
  searchUser: (username) => api.get(`/api/users/search/${username}`),
  
  updateProfile: (userId, data) => api.put(`/api/users/${userId}`, data),
  
  getUserStatus: (userId) => api.get(`/api/users/${userId}/status`),
  
  getCurrentUser: () => api.get('/api/me'),
}

export const messageService = {
  sendMessage: (data) => api.post('/api/messages/', data),
  
  getChat: (userId, skip = 0, limit = 50) =>
    api.get(`/api/messages/chat/${userId}?skip=${skip}&limit=${limit}`),
  
  getMessage: (messageId) => api.get(`/api/messages/${messageId}`),
  
  updateMessage: (messageId, data) => api.put(`/api/messages/${messageId}`, data),
  
  deleteMessage: (messageId) => api.delete(`/api/messages/${messageId}`),
}

export const auditService = {
  createLog: (data) => api.post('/api/audit/log', data),
  
  getLogs: (skip = 0, limit = 100) =>
    api.get(`/api/audit/logs?skip=${skip}&limit=${limit}`),
  
  getAllLogs: (skip = 0, limit = 100) =>
    api.get(`/api/audit/all-logs?skip=${skip}&limit=${limit}`),
}
