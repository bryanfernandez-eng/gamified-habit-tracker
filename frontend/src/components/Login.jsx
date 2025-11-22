// frontend/src/components/Login.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Zap, Lock, User, LogIn } from 'lucide-react'
import ConnectionStatus from './ConnectionStatus'

export default function Login({ onToggleMode }) {
  const navigate = useNavigate()
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
    if (result.success) {
      navigate('/dashboard', { replace: true })
    } else if (result.fieldErrors) {
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
    setFieldErrors({})
  }

  const getFieldError = (fieldName) => {
    return fieldErrors[fieldName]
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md flex-1 flex flex-col justify-center">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-yellow-400 mr-2" />
            <h1 className="text-3xl font-bold text-yellow-400 uppercase tracking-wider">Quest Tracker</h1>
          </div>
          <p className="text-gray-400 text-sm uppercase tracking-widest">Enter your credentials to begin</p>
        </div>

        {/* Main Card */}
        <div className="bg-gray-800 border-4 border-double border-gray-700 p-8 mb-6">
          {/* Demo User Quick Login */}
          <div className="mb-8 p-4 bg-yellow-900/30 border-2 border-yellow-600/50">
            <p className="text-xs text-yellow-500 uppercase tracking-wide mb-3 font-bold">Quick Demo Login</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="flex-1 px-4 py-2 text-xs font-bold bg-red-700 text-red-200 border-2 border-red-600 hover:bg-red-600 uppercase transition-all"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('user')}
                className="flex-1 px-4 py-2 text-xs font-bold bg-yellow-700 text-yellow-200 border-2 border-yellow-600 hover:bg-yellow-600 uppercase transition-all"
              >
                User
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900 border-2 border-red-700 text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username/Email Field */}
            <div>
              <label className="block text-sm font-bold text-yellow-400 uppercase tracking-wider mb-2">
                Username or Email
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  required
                  className={`w-full pl-10 pr-4 py-2 bg-gray-900 border-2 text-gray-200 placeholder-gray-500 focus:outline-none transition-all ${
                    getFieldError('login') || getFieldError('non_field_errors')
                      ? 'border-red-600 focus:border-red-500'
                      : 'border-gray-700 focus:border-yellow-600'
                  }`}
                  placeholder="Enter your username"
                />
              </div>
              {getFieldError('login') && (
                <p className="mt-1 text-xs text-red-400">{getFieldError('login')}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-yellow-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full pl-10 pr-4 py-2 bg-gray-900 border-2 text-gray-200 placeholder-gray-500 focus:outline-none transition-all ${
                    getFieldError('password') || getFieldError('non_field_errors')
                      ? 'border-red-600 focus:border-red-500'
                      : 'border-gray-700 focus:border-yellow-600'
                  }`}
                  placeholder="Enter your password"
                />
              </div>
              {getFieldError('password') && (
                <p className="mt-1 text-xs text-red-400">{getFieldError('password')}</p>
              )}
            </div>

            {/* Non-field Errors */}
            {getFieldError('non_field_errors') && (
              <div className="p-3 bg-red-900 border-2 border-red-700 text-red-200 text-sm">
                {getFieldError('non_field_errors')}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 font-bold uppercase tracking-wider border-2 transition-all flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-yellow-700 border-yellow-600 text-yellow-200 hover:bg-yellow-600'
              }`}
            >
              <LogIn size={18} />
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-3">Don't have an account?</p>
          <button
            onClick={onToggleMode}
            className="text-yellow-400 hover:text-yellow-300 font-bold uppercase text-sm tracking-wider"
          >
            Create Account Here
          </button>
        </div>
      </div>

      {/* Connection Status - Bottom Right */}
      <div className="absolute bottom-6 right-6">
        <ConnectionStatus />
      </div>
    </div>
  )
}
