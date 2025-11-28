// frontend/src/components/Login.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Zap, Lock, User, LogIn, Home } from 'lucide-react'
import ConnectionStatus from './ConnectionStatus'

export default function Login() {
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
    <div className="min-h-screen bg-rulebook-paper flex flex-col items-center justify-center px-4 font-mono text-rulebook-ink">
      <div className="w-full max-w-md flex-1 flex flex-col justify-center">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="border-2 border-rulebook-ink p-1 rounded-sm mr-3">
              <Zap className="w-6 h-6 text-rulebook-crimson" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-rulebook-ink uppercase tracking-wider">Quest Tracker</h1>
          </div>
          <p className="text-rulebook-ink/60 text-sm uppercase tracking-widest font-serif">Enter your credentials to begin</p>
        </div>

        {/* Main Card */}
        <div className="rulebook-card p-8 mb-6">
          {/* Demo User Quick Login */}
          <div className="mb-8 p-4 bg-rulebook-ink/5 border-2 border-rulebook-ink/20 rounded-sm">
            <p className="text-xs text-rulebook-ink/70 uppercase tracking-wide mb-3 font-bold font-serif">Quick Demo Login</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="flex-1 px-4 py-2 text-xs font-bold bg-rulebook-crimson text-rulebook-paper border-2 border-rulebook-ink hover:bg-rulebook-ink hover:text-rulebook-paper uppercase transition-all font-serif"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('user')}
                className="flex-1 px-4 py-2 text-xs font-bold bg-transparent text-rulebook-ink border-2 border-rulebook-ink hover:bg-rulebook-royal hover:text-rulebook-paper hover:border-rulebook-royal uppercase transition-all font-serif"
              >
                User
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-rulebook-crimson/10 border-2 border-rulebook-crimson text-rulebook-crimson text-sm font-bold">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username/Email Field */}
            <div>
              <label className="block text-sm font-bold text-rulebook-ink uppercase tracking-wider mb-2 font-serif">
                Username or Email
              </label>
              <div className="relative group">
                <User size={18} className="absolute left-0 top-3 text-rulebook-ink/50 group-focus-within:text-rulebook-crimson transition-colors" />
                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  required
                  className={`w-full pl-8 pr-4 py-2 bg-transparent border-b-2 text-rulebook-ink placeholder-rulebook-ink/30 focus:outline-none transition-all font-mono ${getFieldError('login') || getFieldError('non_field_errors')
                      ? 'border-rulebook-crimson focus:border-rulebook-crimson'
                      : 'border-rulebook-ink/30 focus:border-rulebook-crimson'
                    }`}
                  placeholder="Enter your username"
                />
              </div>
              {getFieldError('login') && (
                <p className="mt-1 text-xs text-rulebook-crimson font-bold">{getFieldError('login')}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-rulebook-ink uppercase tracking-wider mb-2 font-serif">
                Password
              </label>
              <div className="relative group">
                <Lock size={18} className="absolute left-0 top-3 text-rulebook-ink/50 group-focus-within:text-rulebook-crimson transition-colors" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full pl-8 pr-4 py-2 bg-transparent border-b-2 text-rulebook-ink placeholder-rulebook-ink/30 focus:outline-none transition-all font-mono ${getFieldError('password') || getFieldError('non_field_errors')
                      ? 'border-rulebook-crimson focus:border-rulebook-crimson'
                      : 'border-rulebook-ink/30 focus:border-rulebook-crimson'
                    }`}
                  placeholder="Enter your password"
                />
              </div>
              {getFieldError('password') && (
                <p className="mt-1 text-xs text-rulebook-crimson font-bold">{getFieldError('password')}</p>
              )}
            </div>

            {/* Non-field Errors */}
            {getFieldError('non_field_errors') && (
              <div className="p-3 bg-rulebook-crimson/10 border-2 border-rulebook-crimson text-rulebook-crimson text-sm font-bold">
                {getFieldError('non_field_errors')}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
            >
              <LogIn size={18} />
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-rulebook-ink/60 text-sm mb-3 font-serif italic">Don't have an account?</p>
          <button
            onClick={() => navigate('/register')}
            className="text-rulebook-crimson hover:text-rulebook-ink font-bold uppercase text-sm tracking-widest font-serif border-b-2 border-transparent hover:border-rulebook-ink transition-all"
          >
            Create Account Here
          </button>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-4 py-2 text-rulebook-ink/60 hover:text-rulebook-crimson transition-all font-bold uppercase text-sm w-full font-serif tracking-widest"
          >
            <Home size={16} />
            Back to Home
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
