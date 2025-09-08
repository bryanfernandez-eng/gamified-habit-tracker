// frontend/src/services/gameApi.js
import { api } from './apiClient'

export const gameApi = {
  // User Stats
  getUserStats: async () => {
    const response = await api.get('/api/game/stats/')
    return response.data
  },

  getDetailedStats: async () => {
    const response = await api.get('/api/game/stats/detailed/')
    return response.data
  },

  // Habits
  getHabits: async () => {
    const response = await api.get('/api/game/habits/')
    return response.data
  },

  getTodayHabits: async () => {
    const response = await api.get('/api/game/habits/today/')
    return response.data
  },

  createHabit: async (habitData) => {
    const response = await api.post('/api/game/habits/', habitData)
    return response.data
  },

  completeHabit: async (habitId, notes = '') => {
    const response = await api.post('/api/game/habits/complete/', {
      habit_id: habitId,
      notes
    })
    return response.data
  },

  // Achievements
  getAchievements: async () => {
    const response = await api.get('/api/game/achievements/')
    return response.data
  },

  getUnlockedAchievements: async () => {
    const response = await api.get('/api/game/achievements/unlocked/')
    return response.data
  },

  // Equipment
  getEquipment: async () => {
    const response = await api.get('/api/game/equipment/')
    return response.data
  },

  getEquippedItems: async () => {
    const response = await api.get('/api/game/equipment/equipped/')
    return response.data
  },

  equipItem: async (equipmentId) => {
    const response = await api.post(`/api/game/equipment/${equipmentId}/equip/`)
    return response.data
  }
}