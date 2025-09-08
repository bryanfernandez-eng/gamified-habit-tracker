import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Sword, Shield, LogOut, Home, BarChart3, Settings } from "lucide-react"

export default function Navbar() {
  const { user, logout } = useAuth()
  const [userStats, setUserStats] = useState({
    level: 1,
  })

  useEffect(() => {
    // You can fetch real user stats here
    setUserStats({
      level: 5,
    })
  }, [user])

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav className="bg-gray-900 border-b-4 border-double border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left Section - Logo */}
          <div className="flex items-center">
            <div className="flex items-center bg-gray-800 border-4 border-double border-yellow-600 px-3 py-1.5 shadow-md">
              <Sword className="w-5 h-5 text-yellow-400 mr-2" />
              <a
                href="/"
                className="text-lg font-bold text-yellow-400 uppercase tracking-wider hover:text-yellow-300 transition-colors"
              >
                Quest Tracker
              </a>
            </div>
          </div>

          {/* Center Section - Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <a
              href="/"
              className="group flex items-center px-3 py-1.5 bg-gray-800 border-2 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-yellow-600 hover:text-yellow-400 transition-all duration-200 uppercase text-xs font-bold rounded-sm"
            >
              <Home className="w-4 h-4 mr-1.5 group-hover:animate-bounce" />
              <span>Dashboard</span>
            </a>

            <a
              href="/leaderboard"
              className="group flex items-center px-3 py-1.5 bg-gray-800 border-2 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-yellow-600 hover:text-yellow-400 transition-all duration-200 uppercase text-xs font-bold rounded-sm"
            >
              <BarChart3 className="w-4 h-4 mr-1.5 group-hover:animate-pulse" />
              <span>Leaderboard</span>
            </a>

            <a
              href="/settings"
              className="group flex items-center px-3 py-1.5 bg-gray-800 border-2 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-yellow-600 hover:text-yellow-400 transition-all duration-200 uppercase text-xs font-bold rounded-sm"
            >
              <Settings className="w-4 h-4 mr-1.5 group-hover:animate-spin" />
              <span>Settings</span>
            </a>

            {user?.is_superuser && (
              <a
                href="/admin"
                className="group flex items-center px-3 py-1.5 bg-red-900 border-2 border-red-700 text-red-300 hover:bg-red-800 hover:border-red-500 hover:text-red-200 transition-all duration-200 uppercase text-xs font-bold rounded-sm"
              >
                <Shield className="w-4 h-4 mr-1.5 group-hover:animate-spin" />
                <span>Admin</span>
              </a>
            )}
          </div>

          {/* Right Section - User Profile */}
          <div className="flex items-center space-x-2">
            {/* User Profile Card */}
            <div className="bg-gray-800 border-2 border-gray-700 px-3 py-1.5 shadow-md rounded-sm">
              <div className="flex items-center">
                <div className="w-7 h-7 bg-gradient-to-br from-yellow-600 to-yellow-500 border-2 border-yellow-400 flex items-center justify-center mr-2 rounded-sm shadow-inner">
                  <span className="text-xs font-bold text-white">{userStats.level}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-yellow-400 text-xs font-bold uppercase tracking-wide">
                    {user?.display_name || user?.username}
                  </span>
                  <span className="text-gray-400 text-xs uppercase tracking-wider">Level {userStats.level} Hero</span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="group flex items-center px-3 py-1.5 bg-gray-800 border-2 border-gray-700 text-gray-300 hover:bg-red-900 hover:border-red-600 hover:text-red-300 transition-all duration-200 uppercase text-xs font-bold rounded-sm shadow-md"
            >
              <LogOut className="w-4 h-4 mr-1.5 group-hover:rotate-180 transition-transform duration-300" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="md:hidden border-t border-gray-700 py-2">
          <div className="flex justify-center space-x-2">
            <a
              href="/"
              className="flex items-center px-3 py-1.5 bg-gray-800 border-2 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-all text-xs font-bold rounded-sm"
            >
              <Home className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </a>
            <a
              href="/leaderboard"
              className="flex items-center px-3 py-1.5 bg-gray-800 border-2 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-all text-xs font-bold rounded-sm"
            >
              <BarChart3 className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Leaderboard</span>
            </a>
            <a
              href="/settings"
              className="flex items-center px-3 py-1.5 bg-gray-800 border-2 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-all text-xs font-bold rounded-sm"
            >
              <Settings className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Settings</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}