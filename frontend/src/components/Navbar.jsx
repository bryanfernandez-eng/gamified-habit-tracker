import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Sword, 
  Shield, 
  LogOut, 
  Home,
  User,
  Zap,
  Heart
} from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [userStats, setUserStats] = useState({
    level: 1,
    hp: 100,
    xp: 0,
    nextLevelXp: 100
  })

  // Simulate some user stats (in real app, these would come from backend)
  useEffect(() => {
    // You can fetch real user stats here
    setUserStats({
      level: 5,
      hp: 80,
      xp: 75,
      nextLevelXp: 100
    })
  }, [user])

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav className="bg-gray-900 border-b-4 border-double border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-3">
            {/* Logo/Title with pixelated border */}
            <div className="flex items-center bg-gray-800 border-4 border-double border-yellow-600 px-4 py-2">
              <Sword className="w-6 h-6 text-yellow-400 mr-2 animate-pulse" />
              <a href="/" className="text-xl font-bold text-yellow-400 uppercase tracking-wider">
                Quest Tracker
              </a>
            </div>
            
            {/* Navigation Items */}
            <div className="flex items-center space-x-2">
              <a 
                href="/" 
                className="group flex items-center px-4 py-2 bg-gray-800 border-2 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-yellow-600 hover:text-yellow-400 transition-all uppercase text-xs font-bold"
              >
                <Home className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                <span>Dashboard</span>
              </a>
              
              {user?.is_superuser && (
                <a 
                  href="/admin" 
                  className="group flex items-center px-4 py-2 bg-red-900 border-2 border-red-700 text-red-300 hover:bg-red-800 hover:border-red-500 hover:text-red-200 transition-all uppercase text-xs font-bold"
                >
                  <Shield className="w-4 h-4 mr-2 group-hover:animate-spin" />
                  <span>Admin</span>
                </a>
              )}
            </div>
          </div>
          
          {/* User Section */}
          <div className="flex items-center space-x-3">
            {/* Mini Stats Display */}
            <div className="hidden md:flex items-center space-x-2">
              {/* HP Bar */}
              <div className="bg-gray-800 border-2 border-gray-700 px-3 py-1">
                <div className="flex items-center">
                  <Heart className="w-4 h-4 text-red-500 mr-2" />
                  <div className="w-20 bg-gray-900 border border-gray-600 h-2">
                    <div 
                      className="bg-red-600 h-full"
                      style={{ width: `${userStats.hp}%` }}
                    />
                  </div>
                  <span className="ml-2 text-xs text-gray-400">{userStats.hp}/100</span>
                </div>
              </div>
              
              {/* XP Bar */}
              <div className="bg-gray-800 border-2 border-gray-700 px-3 py-1">
                <div className="flex items-center">
                  <Zap className="w-4 h-4 text-yellow-500 mr-2" />
                  <div className="w-20 bg-gray-900 border border-gray-600 h-2">
                    <div 
                      className="bg-yellow-600 h-full"
                      style={{ width: `${(userStats.xp / userStats.nextLevelXp) * 100}%` }}
                    />
                  </div>
                  <span className="ml-2 text-xs text-gray-400">{userStats.xp}/{userStats.nextLevelXp}</span>
                </div>
              </div>
            </div>
            
            {/* User Info */}
            <div className="bg-gray-800 border-4 border-double border-gray-700 px-4 py-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-600 border-2 border-yellow-500 flex items-center justify-center mr-3">
                  <span className="text-xs font-bold text-gray-900">
                    {userStats.level}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-yellow-400 text-sm font-bold uppercase">
                    {user?.display_name || user?.username}
                  </span>
                  <span className="text-gray-500 text-xs uppercase">
                    Level {userStats.level} Hero
                  </span>
                </div>
              </div>
            </div>
            
            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="group flex items-center px-4 py-2 bg-gray-800 border-2 border-gray-700 text-gray-300 hover:bg-red-900 hover:border-red-600 hover:text-red-300 transition-all uppercase text-xs font-bold"
            >
              <LogOut className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}