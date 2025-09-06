// frontend/src/components/ProtectedRoute.jsx
import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import NotFound from './NotFound'

export default function ProtectedRoute({ children, requireAdmin = false, fallback = <NotFound /> }) {
  const { user, isAuthenticated, loading } = useAuth()

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

  if (!isAuthenticated) {
    return fallback
  }

  if (requireAdmin && !user?.is_superuser) {
    return fallback
  }

  return children
}