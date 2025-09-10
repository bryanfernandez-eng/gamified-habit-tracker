import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Sword, Shield, LogOut, Home, BarChart3, Settings, Menu, X } from "lucide-react"

export default function Navbar() {
  const { user, logout } = useAuth()
  const [userStats, setUserStats] = useState({
    level: 1,
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // You can fetch real user stats here
    setUserStats({
      level: 5,
    })
  }, [user])

  const handleLogout = async () => {
    await logout()
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav className="bg-gray-900 border-b-4 border-double border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Left Section - Logo */}
          <div className="flex items-center flex-shrink-0">
            <div className="flex items-center bg-gray-800 border-2 border-yellow-600 px-2 sm:px-6 py-1 sm:py-2 shadow-md h-8 sm:h-10">
              <Sword className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mr-1 sm:mr-2" />
              <a
                href="/"
                className="text-sm sm:text-lg font-bold text-yellow-400 uppercase tracking-wider hover:text-yellow-300 transition-colors"
              >
                <span className="hidden xs:inline">Quest Tracker</span>
                <span className="xs:hidden">Quest</span>
              </a>
            </div>
          </div>

          {/* Center Section - Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-3">
            <a
              href="/"
              className="group flex items-center px-4 py-2 bg-gray-800 border-2 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-yellow-600 hover:text-yellow-400 transition-all duration-200 uppercase text-xs font-bold rounded-sm h-10"
            >
              <Home className="w-4 h-4 mr-2 group-hover:animate-bounce" />
              <span>Dashboard</span>
            </a>

            <a
              href="/leaderboard"
              className="group flex items-center px-4 py-2 bg-gray-800 border-2 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-yellow-600 hover:text-yellow-400 transition-all duration-200 uppercase text-xs font-bold rounded-sm h-10"
            >
              <BarChart3 className="w-4 h-4 mr-2 group-hover:animate-pulse" />
              <span>Leaderboard</span>
            </a>

            <a
              href="/settings"
              className="group flex items-center px-4 py-2 bg-gray-800 border-2 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-yellow-600 hover:text-yellow-400 transition-all duration-200 uppercase text-xs font-bold rounded-sm h-10"
            >
              <Settings className="w-4 h-4 mr-2 group-hover:animate-spin" />
              <span>Settings</span>
            </a>

            {user?.is_superuser && (
              <a
                href="/admin"
                className="group flex items-center px-4 py-2 bg-red-900 border-2 border-red-700 text-red-300 hover:bg-red-800 hover:border-red-500 hover:text-red-200 transition-all duration-200 uppercase text-xs font-bold rounded-sm h-10"
              >
                <Shield className="w-4 h-4 mr-2 group-hover:animate-spin" />
                <span>Admin</span>
              </a>
            )}
          </div>

          {/* Right Section - User Profile & Mobile Menu Button */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* User Profile Card - Responsive */}
            <div className="bg-gray-800 border-2 border-gray-700 px-2 sm:px-4 py-1 sm:py-2 shadow-md rounded-sm h-8 sm:h-10 flex items-center">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-yellow-600 to-yellow-500 border-2 border-yellow-400 flex items-center justify-center mr-2 sm:mr-3 rounded-sm shadow-inner">
                <span className="text-xs font-bold text-white">{userStats.level}</span>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-400 text-xs sm:text-sm font-bold uppercase tracking-wide mr-1 sm:mr-2 truncate max-w-20 sm:max-w-none">
                  {user?.display_name || user?.username}
                </span>
                <span className="text-gray-400 text-xs uppercase tracking-wider hidden sm:inline">
                  Lv.{userStats.level}
                </span>
              </div>
            </div>

            {/* Desktop Logout Button */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex group items-center px-4 py-2 bg-gray-800 border-2 border-gray-700 text-gray-300 hover:bg-red-900 hover:border-red-600 hover:text-red-300 transition-all duration-200 uppercase text-xs font-bold rounded-sm shadow-md h-10"
            >
              <LogOut className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
              <span className="hidden md:inline">Logout</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 border-2 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-yellow-600 hover:text-yellow-400 transition-all duration-200 rounded-sm"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu - Collapsible */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen 
            ? 'max-h-96 opacity-100 border-t border-gray-700 py-3' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="flex flex-col space-y-2">
            <a
              href="/"
              onClick={closeMobileMenu}
              className="flex items-center px-4 py-3 bg-gray-800 border-2 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-yellow-600 hover:text-yellow-400 transition-all text-sm font-bold rounded-sm min-h-12 active:bg-gray-600"
            >
              <Home className="w-5 h-5 mr-3" />
              <span>Dashboard</span>
            </a>
            
            <a
              href="/leaderboard"
              onClick={closeMobileMenu}
              className="flex items-center px-4 py-3 bg-gray-800 border-2 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-yellow-600 hover:text-yellow-400 transition-all text-sm font-bold rounded-sm min-h-12 active:bg-gray-600"
            >
              <BarChart3 className="w-5 h-5 mr-3" />
              <span>Leaderboard</span>
            </a>
            
            <a
              href="/settings"
              onClick={closeMobileMenu}
              className="flex items-center px-4 py-3 bg-gray-800 border-2 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-yellow-600 hover:text-yellow-400 transition-all text-sm font-bold rounded-sm min-h-12 active:bg-gray-600"
            >
              <Settings className="w-5 h-5 mr-3" />
              <span>Settings</span>
            </a>

            {user?.is_superuser && (
              <a
                href="/admin"
                onClick={closeMobileMenu}
                className="flex items-center px-4 py-3 bg-red-900 border-2 border-red-700 text-red-300 hover:bg-red-800 hover:border-red-500 hover:text-red-200 transition-all text-sm font-bold rounded-sm min-h-12 active:bg-red-700"
              >
                <Shield className="w-5 h-5 mr-3" />
                <span>Admin</span>
              </a>
            )}

            {/* Mobile Logout Button */}
            <button
              onClick={() => {
                handleLogout()
                closeMobileMenu()
              }}
              className="flex items-center px-4 py-3 bg-gray-800 border-2 border-gray-700 text-gray-300 hover:bg-red-900 hover:border-red-600 hover:text-red-300 transition-all text-sm font-bold rounded-sm min-h-12 w-full text-left active:bg-red-700"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}