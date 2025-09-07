// frontend/src/services/userApi.js
import { api } from './apiClient'

export const userApi = {
  // Get all users
  getUsers: async () => {
    const response = await api.get('/api/admin/users/')
    return response.data
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await api.get('/api/admin/users/stats/')
    return response.data
  },

  // Get single user
  getUser: async (userId) => {
    const response = await api.get(`/api/admin/users/${userId}/`)
    return response.data
  },

  // Create new user
  createUser: async (userData) => {
    const response = await api.post('/api/admin/users/', userData)
    return response.data
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await api.put(`/api/admin/users/${userId}/`, userData)
    return response.data
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/api/admin/users/${userId}/`)
    return response.data
  }
}