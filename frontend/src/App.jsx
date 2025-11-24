// frontend/src/App.jsx
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { gameApi } from './services/gameApi'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import AdminPage from './components/AdminPage'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import ConnectionStatus from './components/ConnectionStatus'
import Leaderboard from './pages/Leaderboard'
import Settings from './pages/Settings'
import Home from './pages/Home'
import { Tower } from './pages/Tower'

function AuthScreen() {
  const location = useLocation()
  const isRegisterPage = location.pathname === '/register'

  return (
    <div className="min-h-screen bg-rulebook-paper flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-transparent">
          {isRegisterPage ? (
            <Register />
          ) : (
            <Login />
          )}

          <div className="mt-6 pt-6 border-t-2 border-rulebook-charcoal/10">
            <div className="text-center">
              <div className="mb-2">
                <span className="text-sm text-rulebook-ink/60 font-serif italic">Guild Connection:</span>
              </div>
              <ConnectionStatus />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth()
  const [userStats, setUserStats] = useState(null)
  const [updateTrigger, setUpdateTrigger] = useState(0)

  // Load initial stats when user authenticates
  useEffect(() => {
    if (isAuthenticated && !userStats) {
      gameApi.getUserStats()
        .then(stats => {
          setUserStats(stats)
        })
        .catch(err => {
          console.error('[App] Failed to load initial stats:', err)
        })
    }
  }, [isAuthenticated])

  const handleStatsUpdate = (stats) => {
    if (stats) {
      setUserStats(stats)
      setUpdateTrigger(prev => prev + 1)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-rulebook-paper flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-block">
              <div className="relative w-16 h-16">
                {/* Outer rotating border */}
                <div className="absolute inset-0 border-4 border-transparent border-t-rulebook-crimson border-r-rulebook-crimson rounded-full animate-spin"></div>
                {/* Inner pulsing circle */}
                <div className="absolute inset-2 border-2 border-rulebook-ink rounded-full animate-pulse"></div>
                {/* Center feather */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-rulebook-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-serif font-bold text-rulebook-ink uppercase tracking-widest mb-3">Opening Tome...</h2>
          <p className="text-rulebook-ink/60 text-sm uppercase tracking-wide font-mono">Preparing your adventure...</p>
          <div className="mt-6 flex gap-2 justify-center">
            <div className="w-2 h-2 bg-rulebook-crimson rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-rulebook-crimson rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-rulebook-crimson rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {isAuthenticated && <Navbar userStats={userStats} />}
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute fallback={<Home />}>
              <Dashboard userStats={userStats} onStatsUpdate={handleStatsUpdate} updateTrigger={updateTrigger} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={<AuthScreen />}
        />
        <Route
          path="/register"
          element={<AuthScreen />}
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true} fallback={isAuthenticated ? <NotFound /> : <Home />}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute fallback={<Home />}>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute fallback={<Home />}>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tower"
          element={
            <ProtectedRoute fallback={<Home />}>
              <Tower />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}