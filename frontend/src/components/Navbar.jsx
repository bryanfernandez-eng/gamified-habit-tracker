// frontend/src/components/Navbar.jsx
import React from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav className="bg-white shadow border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <a href="/" className="text-xl font-bold text-gray-900">
              Habit Tracker
            </a>
            <a href="/" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </a>
            {user?.is_superuser && (
              <a href="/admin" className="text-red-600 hover:text-red-800">
                Admin
              </a>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              {user?.display_name || user?.first_name || user?.username}
            </span>
            <button 
              onClick={handleLogout}
              className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}