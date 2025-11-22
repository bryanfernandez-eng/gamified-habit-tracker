// frontend/src/App.jsx
import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
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

function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true)
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isLogin ? (
            <Login onToggleMode={() => setIsLogin(false)} />
          ) : (
            <Register onToggleMode={() => setIsLogin(true)} />
          )}
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="mb-2">
                <span className="text-sm text-gray-500">API Connection:</span>
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

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-block">
              <div className="relative w-16 h-16">
                {/* Outer rotating border */}
                <div className="absolute inset-0 border-4 border-transparent border-t-yellow-400 border-r-yellow-400 rounded-full animate-spin"></div>
                {/* Inner pulsing circle */}
                <div className="absolute inset-2 border-2 border-yellow-600 rounded-full animate-pulse"></div>
                {/* Center lightning bolt */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11.857 4.793L8.5 11h3L8.143 15.207L11 8H8l3.857-3.207z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-yellow-400 uppercase tracking-widest mb-3">Initializing Quest Tracker</h2>
          <p className="text-gray-400 text-sm uppercase tracking-wide">Preparing your adventure...</p>
          <div className="mt-6 flex gap-2 justify-center">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard /> : <Home />}
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