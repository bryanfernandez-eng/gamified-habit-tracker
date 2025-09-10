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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
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
          element={isAuthenticated ? <Dashboard /> : <AuthScreen />} 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin={true} fallback={isAuthenticated ? <NotFound /> : <AuthScreen />}>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/leaderboard" 
          element={<Leaderboard />} 
        />
        <Route 
          path="/settings" 
          element={<Settings />} 
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