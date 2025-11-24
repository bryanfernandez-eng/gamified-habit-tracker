import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Sword, Shield, LogOut, Home, BarChart3, Settings, Menu, X } from "lucide-react"

export default function Navbar({ userStats = null }) {
  const { user, logout } = useAuth()
  const [displayStats, setDisplayStats] = useState({
    level: 1,
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)

  useEffect(() => {
    // Update display stats from received userStats prop
    if (userStats) {
      setDisplayStats({
        level: userStats.level || 1,
      })
    }
  }, [userStats])

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
    <nav className="bg-rulebook-paper border-b-4 border-double border-rulebook-charcoal fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex justify-between items-center h-14 sm:h-20">
          {/* Left Section - Logo */}
          <div className="flex items-center flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="border-2 border-rulebook-ink p-1 rounded-sm">
                <Sword className="w-5 h-5 text-rulebook-crimson" />
              </div>
              <a
                href="/dashboard"
                className="text-lg sm:text-xl font-serif font-bold text-rulebook-ink tracking-tight hover:text-rulebook-crimson transition-colors"
              >
                <span className="hidden xs:inline">Quest Tracker</span>
                <span className="xs:hidden">Quest</span>
              </a>
            </div>
          </div>

          {/* Center Section - Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <a
              href="/dashboard"
              className="group flex items-center text-rulebook-ink font-serif font-bold text-sm tracking-widest uppercase hover:text-rulebook-crimson transition-colors"
            >
              <Home className="w-4 h-4 mr-2 group-hover:text-rulebook-crimson transition-colors" />
              <span>Dashboard</span>
            </a>

            <a
              href="/leaderboard"
              className="group flex items-center text-rulebook-ink font-serif font-bold text-sm tracking-widest uppercase hover:text-rulebook-crimson transition-colors"
            >
              <BarChart3 className="w-4 h-4 mr-2 group-hover:text-rulebook-crimson transition-colors" />
              <span>Leaderboard</span>
            </a>

            <a
              href="/settings"
              className="group flex items-center text-rulebook-ink font-serif font-bold text-sm tracking-widest uppercase hover:text-rulebook-crimson transition-colors"
            >
              <Settings className="w-4 h-4 mr-2 group-hover:text-rulebook-crimson transition-colors" />
              <span>Settings</span>
            </a>

            {user?.is_superuser && (
              <a
                href="/admin"
                className="group flex items-center text-rulebook-royal font-serif font-bold text-sm tracking-widest uppercase hover:text-rulebook-ink transition-colors"
              >
                <Shield className="w-4 h-4 mr-2 group-hover:text-rulebook-ink transition-colors" />
                <span>Admin</span>
              </a>
            )}
          </div>

          {/* Right Section - User Profile & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* User Profile Card - Responsive */}
            <button
              onClick={() => setShowUserModal(true)}
              className="flex items-center gap-3 group"
            >
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-rulebook-ink font-serif font-bold text-sm uppercase tracking-wide group-hover:text-rulebook-crimson transition-colors">
                  {user?.display_name || user?.username}
                </span>
                <span className="text-rulebook-ink/60 text-xs font-mono">
                  Lvl. {displayStats.level}
                </span>
              </div>
              <div className="w-10 h-10 border-2 border-rulebook-charcoal bg-rulebook-paper flex items-center justify-center rounded-sm shadow-sm group-hover:border-rulebook-crimson transition-colors relative overflow-hidden">
                <div className="absolute inset-0 bg-rulebook-ink/5"></div>
                <span className="text-lg font-serif font-bold text-rulebook-ink group-hover:text-rulebook-crimson">{user?.username?.charAt(0).toUpperCase()}</span>
              </div>
            </button>

            {/* Desktop Logout Button */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center justify-center w-10 h-10 border-2 border-transparent hover:border-rulebook-ink rounded-sm text-rulebook-ink/60 hover:text-rulebook-crimson transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden flex items-center justify-center w-10 h-10 text-rulebook-ink hover:text-rulebook-crimson transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu - Collapsible */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen
            ? 'max-h-96 opacity-100 border-t-2 border-rulebook-charcoal/20 py-4'
            : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
          <div className="flex flex-col space-y-2 bg-rulebook-paper">
            <a
              href="/dashboard"
              onClick={closeMobileMenu}
              className="flex items-center px-4 py-3 text-rulebook-ink font-serif font-bold uppercase tracking-widest hover:bg-rulebook-ink/5 transition-colors"
            >
              <Home className="w-5 h-5 mr-3 text-rulebook-crimson" />
              <span>Dashboard</span>
            </a>

            <a
              href="/leaderboard"
              onClick={closeMobileMenu}
              className="flex items-center px-4 py-3 text-rulebook-ink font-serif font-bold uppercase tracking-widest hover:bg-rulebook-ink/5 transition-colors"
            >
              <BarChart3 className="w-5 h-5 mr-3 text-rulebook-crimson" />
              <span>Leaderboard</span>
            </a>

            <a
              href="/settings"
              onClick={closeMobileMenu}
              className="flex items-center px-4 py-3 text-rulebook-ink font-serif font-bold uppercase tracking-widest hover:bg-rulebook-ink/5 transition-colors"
            >
              <Settings className="w-5 h-5 mr-3 text-rulebook-crimson" />
              <span>Settings</span>
            </a>

            {user?.is_superuser && (
              <a
                href="/admin"
                onClick={closeMobileMenu}
                className="flex items-center px-4 py-3 text-rulebook-royal font-serif font-bold uppercase tracking-widest hover:bg-rulebook-ink/5 transition-colors"
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
              className="flex items-center px-4 py-3 text-rulebook-ink/60 font-serif font-bold uppercase tracking-widest hover:bg-rulebook-ink/5 hover:text-rulebook-crimson transition-colors w-full text-left"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      {showUserModal && (
        <div
          className="fixed inset-0 bg-rulebook-ink/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setShowUserModal(false)}
        >
          <div
            className="rulebook-card p-6 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-rulebook-charcoal">
              <h2 className="text-xl font-serif font-bold text-rulebook-ink uppercase tracking-wider">Character Sheet</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-rulebook-ink hover:text-rulebook-crimson transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-6 font-mono">
              {/* Username */}
              <div className="flex justify-between items-center border-b border-rulebook-ink/10 pb-2">
                <label className="text-xs uppercase text-rulebook-ink/60 font-bold tracking-wide">Username</label>
                <p className="text-rulebook-ink font-bold">{user?.username}</p>
              </div>

              {/* Display Name */}
              <div className="flex justify-between items-center border-b border-rulebook-ink/10 pb-2">
                <label className="text-xs uppercase text-rulebook-ink/60 font-bold tracking-wide">Display Name</label>
                <p className="text-rulebook-ink font-bold">{user?.display_name || 'Not set'}</p>
              </div>

              {/* Email */}
              <div className="flex justify-between items-center border-b border-rulebook-ink/10 pb-2">
                <label className="text-xs uppercase text-rulebook-ink/60 font-bold tracking-wide">Email</label>
                <p className="text-rulebook-ink font-bold">{user?.email}</p>
              </div>

              {/* Level */}
              <div className="flex justify-between items-center border-b border-rulebook-ink/10 pb-2">
                <label className="text-xs uppercase text-rulebook-ink/60 font-bold tracking-wide">Level</label>
                <p className="text-rulebook-crimson font-bold text-lg">Lvl. {displayStats.level}</p>
              </div>

              {/* Member Since */}
              <div className="flex justify-between items-center border-b border-rulebook-ink/10 pb-2">
                <label className="text-xs uppercase text-rulebook-ink/60 font-bold tracking-wide">Member Since</label>
                <p className="text-rulebook-ink font-bold">
                  {user?.date_joined ? new Date(user.date_joined).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>

              {/* Superuser Badge */}
              {user?.is_superuser && (
                <div className="mt-4 p-3 bg-rulebook-royal/10 border-2 border-rulebook-royal rounded-sm text-center">
                  <p className="text-rulebook-royal text-xs font-bold uppercase tracking-wide font-serif">⚡ Guild Master (Admin)</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-8 pt-4 border-t-4 border-double border-rulebook-charcoal/20">
              <button
                onClick={() => setShowUserModal(false)}
                className="w-full py-2 px-4 bg-rulebook-ink text-rulebook-paper hover:bg-rulebook-crimson transition-all font-serif font-bold uppercase text-sm rounded-sm"
              >
                Close Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
