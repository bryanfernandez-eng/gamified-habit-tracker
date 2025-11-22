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

  getLeaderboard: async () => {
    const response = await api.get('/api/game/stats/leaderboard/')
    return response.data
  },

  getAvailableCharacters: async () => {
    const response = await api.get('/api/game/stats/characters/')
    return response.data
  },

  selectCharacter: async (characterId) => {
    const response = await api.post('/api/game/stats/select_character/', {
      character_id: characterId
    })
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

  checkQuestLimit: async () => {
    const response = await api.get('/api/game/habits/check_limit/')
    return response.data
  },

  createHabit: async (habitData) => {
    const response = await api.post('/api/game/habits/', habitData)
    return response.data
  },

  updateHabit: async (habitId, habitData) => {
    const response = await api.put(`/api/game/habits/${habitId}/`, habitData)
    return response.data
  },

  deleteHabit: async (habitId) => {
    const response = await api.delete(`/api/game/habits/${habitId}/`)
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
  },

  // Onboarding
  createInitialHabits: async (surveyData) => {
    const response = await api.post('/api/create-initial-habits/', surveyData)
    return response.data
  },

  // Daily Check-In
  checkIn: async () => {
    const response = await api.post('/api/game/daily-checkin/check_in/')
    return response.data
  },

  getCheckInHistory: async () => {
    const response = await api.get('/api/game/daily-checkin/history/')
    return response.data
  }
}