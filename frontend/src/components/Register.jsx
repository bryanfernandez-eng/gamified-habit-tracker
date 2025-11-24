// frontend/src/components/Register.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Zap, Lock, User, Mail, UserPlus, Home } from 'lucide-react'
import ConnectionStatus from './ConnectionStatus'

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    email: '',
    password1: '',
    password2: ''
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const { register, loading, error } = useAuth()

  const handleAccountChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.username.trim()) errors.username = 'Username is required'
    if (!formData.display_name.trim()) errors.display_name = 'Display name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    if (!formData.password1) errors.password1 = 'Password is required'
    if (formData.password1 !== formData.password2) errors.password2 = 'Passwords do not match'
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFieldErrors({})

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    const result = await register(formData)
    if (!result.success && result.fieldErrors) {
      setFieldErrors(result.fieldErrors)
      return
    }

    if (result.success) {
      navigate('/dashboard', { replace: true })
    }
  }

  const getFieldError = (fieldName) => {
    return fieldErrors[fieldName]
  }

  return (
    <div className="min-h-screen bg-rulebook-paper flex flex-col items-center py-8 overflow-y-auto font-mono text-rulebook-ink">
      <div className="w-full max-w-8xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="border-2 border-rulebook-ink p-1 rounded-sm mr-3">
              <Zap className="w-6 h-6 text-rulebook-crimson" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-rulebook-ink uppercase tracking-wider">Quest Tracker</h1>
          </div>
          <p className="text-rulebook-ink/60 text-sm uppercase tracking-widest font-serif">
            Begin Your Journey
          </p>
        </div>

        {/* Main Card */}
        <div className="rulebook-card p-8 mb-6">

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-rulebook-crimson/10 border-2 border-rulebook-crimson text-rulebook-crimson text-sm font-bold">
              {error}
            </div>
          )}

          {/* Account Creation Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-xl font-serif font-bold text-rulebook-ink uppercase mb-6 border-b-2 border-rulebook-ink/20 pb-2">Create Your Account</h2>

            {/* Top Row: Username and Display Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-bold text-rulebook-ink uppercase tracking-wider mb-2 font-serif">
                  Username
                </label>
                <div className="relative group">
                  <User size={18} className="absolute left-0 top-3 text-rulebook-ink/50 group-focus-within:text-rulebook-crimson transition-colors" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleAccountChange}
                    required
                    className={`w-full pl-8 pr-4 py-2 bg-transparent border-b-2 text-rulebook-ink placeholder-rulebook-ink/30 focus:outline-none transition-all font-mono text-sm ${getFieldError('username')
                        ? 'border-rulebook-crimson focus:border-rulebook-crimson'
                        : 'border-rulebook-ink/30 focus:border-rulebook-crimson'
                      }`}
                    placeholder="Choose a unique username"
                  />
                </div>
                {getFieldError('username') && (
                  <p className="mt-1 text-xs text-rulebook-crimson font-bold">{getFieldError('username')}</p>
                )}
              </div>

              {/* Display Name Field */}
              <div>
                <label className="block text-sm font-bold text-rulebook-ink uppercase tracking-wider mb-2 font-serif">
                  Display Name
                </label>
                <div className="relative group">
                  <User size={18} className="absolute left-0 top-3 text-rulebook-ink/50 group-focus-within:text-rulebook-crimson transition-colors" />
                  <input
                    type="text"
                    name="display_name"
                    value={formData.display_name}
                    onChange={handleAccountChange}
                    required
                    className={`w-full pl-8 pr-4 py-2 bg-transparent border-b-2 text-rulebook-ink placeholder-rulebook-ink/30 focus:outline-none transition-all font-mono text-sm ${getFieldError('display_name')
                        ? 'border-rulebook-crimson focus:border-rulebook-crimson'
                        : 'border-rulebook-ink/30 focus:border-rulebook-crimson'
                      }`}
                    placeholder="How others will see your name"
                  />
                </div>
                {getFieldError('display_name') && (
                  <p className="mt-1 text-xs text-rulebook-crimson font-bold">{getFieldError('display_name')}</p>
                )}
              </div>
            </div>

            {/* Email Field - Full Width */}
            <div>
              <label className="block text-sm font-bold text-rulebook-ink uppercase tracking-wider mb-2 font-serif">
                Email
              </label>
              <div className="relative group">
                <Mail size={18} className="absolute left-0 top-3 text-rulebook-ink/50 group-focus-within:text-rulebook-crimson transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleAccountChange}
                  required
                  className={`w-full pl-8 pr-4 py-2 bg-transparent border-b-2 text-rulebook-ink placeholder-rulebook-ink/30 focus:outline-none transition-all font-mono text-sm ${getFieldError('email')
                      ? 'border-rulebook-crimson focus:border-rulebook-crimson'
                      : 'border-rulebook-ink/30 focus:border-rulebook-crimson'
                    }`}
                  placeholder="your.email@example.com"
                />
              </div>
              {getFieldError('email') && (
                <p className="mt-1 text-xs text-rulebook-crimson font-bold">{getFieldError('email')}</p>
              )}
            </div>

            {/* Password Row: Password and Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password Field */}
              <div>
                <label className="block text-sm font-bold text-rulebook-ink uppercase tracking-wider mb-2 font-serif">
                  Password
                </label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-0 top-3 text-rulebook-ink/50 group-focus-within:text-rulebook-crimson transition-colors" />
                  <input
                    type="password"
                    name="password1"
                    value={formData.password1}
                    onChange={handleAccountChange}
                    required
                    className={`w-full pl-8 pr-4 py-2 bg-transparent border-b-2 text-rulebook-ink placeholder-rulebook-ink/30 focus:outline-none transition-all font-mono text-sm ${getFieldError('password1')
                        ? 'border-rulebook-crimson focus:border-rulebook-crimson'
                        : 'border-rulebook-ink/30 focus:border-rulebook-crimson'
                      }`}
                    placeholder="At least 8 characters"
                  />
                </div>
                {getFieldError('password1') && (
                  <p className="mt-1 text-xs text-rulebook-crimson font-bold">{getFieldError('password1')}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-bold text-rulebook-ink uppercase tracking-wider mb-2 font-serif">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-0 top-3 text-rulebook-ink/50 group-focus-within:text-rulebook-crimson transition-colors" />
                  <input
                    type="password"
                    name="password2"
                    value={formData.password2}
                    onChange={handleAccountChange}
                    required
                    className={`w-full pl-8 pr-4 py-2 bg-transparent border-b-2 text-rulebook-ink placeholder-rulebook-ink/30 focus:outline-none transition-all font-mono text-sm ${getFieldError('password2')
                        ? 'border-rulebook-crimson focus:border-rulebook-crimson'
                        : 'border-rulebook-ink/30 focus:border-rulebook-crimson'
                      }`}
                    placeholder="Repeat your password"
                  />
                </div>
                {getFieldError('password2') && (
                  <p className="mt-1 text-xs text-rulebook-crimson font-bold">{getFieldError('password2')}</p>
                )}
              </div>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary flex items-center justify-center gap-2 mt-8 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
            >
              <UserPlus size={18} />
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-rulebook-ink/60 text-sm mb-3 font-serif italic">Already have an account?</p>
          <button
            onClick={() => navigate('/login')}
            className="text-rulebook-crimson hover:text-rulebook-ink font-bold uppercase text-sm tracking-widest font-serif border-b-2 border-transparent hover:border-rulebook-ink transition-all"
          >
            Sign In Here
          </button>

          {/* Back to Home */}
          <div className="mt-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 px-4 py-2 text-rulebook-ink/60 hover:text-rulebook-crimson transition-all font-bold uppercase text-sm w-full font-serif tracking-widest"
            >
              <Home size={16} />
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Connection Status - Bottom Right */}
      <div className="absolute bottom-6 right-6">
        <ConnectionStatus />
      </div>
    </div>
  )
}
