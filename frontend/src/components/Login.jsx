// frontend/src/components/Login.jsx
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Login({ onToggleMode }) {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const { login, loading, error } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFieldErrors({})
    
    const result = await login(formData)
    if (!result.success && result.fieldErrors) {
      setFieldErrors(result.fieldErrors)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const fillDemoCredentials = (userType) => {
    if (userType === 'admin') {
      setFormData({
        login: 'johndoe',
        password: 'demo123'
      })
    } else if (userType === 'user') {
      setFormData({
        login: 'reese', 
        password: 'demo123'
      })
    }
    setFieldErrors({}) // Clear any existing errors
  }

  const getFieldError = (fieldName) => {
    return fieldErrors[fieldName]
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
      
      {/* Demo User Quick Login */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fillDemoCredentials('admin')}
            className="flex-1 px-3 py-2 text-xs bg-red-600 text-white rounded hover:bg-red-700"
          >
            Super Admin 
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials('user')}
            className="flex-1 px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Normal User 
          </button>
        </div>
        <p className="text-xs text-blue-600 mt-2">
          Click to auto-fill credentials for testing
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username or Email
          </label>
          <input
            type="text"
            name="login"
            value={formData.login}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldError('login') || getFieldError('non_field_errors') ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your username or email"
          />
          {getFieldError('login') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('login')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldError('password') || getFieldError('non_field_errors') ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your password"
          />
          {getFieldError('password') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('password')}</p>
          )}
        </div>

        {getFieldError('non_field_errors') && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {getFieldError('non_field_errors')}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={onToggleMode}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Don't have an account? Create one
        </button>
      </div>
    </div>
  )
}