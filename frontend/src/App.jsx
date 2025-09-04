// src/App.jsx
import ConnectionStatus from './components/ConnectionStatus'

export default function App() {
  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <div className="p-6 bg-white rounded-xl shadow">
        <h1 className="text-xl font-semibold mb-3">Gamified Habit Tracker</h1>
        <ConnectionStatus />
        <p className="text-xs text-gray-500 mt-3">
          API base: {import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'}
        </p>
      </div>
    </div>
  )
}
