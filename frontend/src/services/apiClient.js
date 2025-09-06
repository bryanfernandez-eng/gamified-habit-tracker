// frontend/src/services/apiClient.js
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Token ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token might be invalid/expired
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      // Optionally redirect to login or trigger auth context logout
      window.location.reload()
    }
    return Promise.reject(error)
  }
)

export async function pingApi() {
  try {
    const res = await api.get('/api/health/')
    return res.status === 200 && res.data?.status === 'ok'
  } catch {
    return false
  }
}