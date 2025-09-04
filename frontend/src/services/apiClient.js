import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000',
  // REMOVE withCredentials here for now (we’ll add it back when doing auth)
  timeout: 4000,
})

export async function pingApi() {
  try {
    // explicitly ensure no cookies for this GET
    const res = await api.get('/api/health/', { withCredentials: false })
    return res.status === 200 && res.data?.status === 'ok'
  } catch {
    return false
  }
}
