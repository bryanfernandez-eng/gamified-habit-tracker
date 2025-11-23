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
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-yellow-400 mr-2" />
            <h1 className="text-3xl font-bold text-yellow-400 uppercase tracking-wider">Quest Tracker</h1>
          </div>
          <p className="text-gray-400 text-sm uppercase tracking-widest">
            Begin Your Journey
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-gray-800 border-4 border-double border-gray-700 p-8 mb-6">

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900 border-2 border-red-700 text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Account Creation Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-xl font-bold text-yellow-400 uppercase mb-6">Create Your Account</h2>

              {/* Top Row: Username and Display Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Username Field */}
                <div>
                  <label className="block text-sm font-bold text-yellow-400 uppercase tracking-wider mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-3 text-gray-500" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleAccountChange}
                      required
                      className={`w-full pl-10 pr-4 py-2 bg-gray-900 border-2 text-gray-200 placeholder-gray-500 focus:outline-none transition-all ${
                        getFieldError('username')
                          ? 'border-red-600 focus:border-red-500'
                          : 'border-gray-700 focus:border-yellow-600'
                      }`}
                      placeholder="Choose a unique username"
                    />
                  </div>
                  {getFieldError('username') && (
                    <p className="mt-1 text-xs text-red-400">{getFieldError('username')}</p>
                  )}
                </div>

                {/* Display Name Field */}
                <div>
                  <label className="block text-sm font-bold text-yellow-400 uppercase tracking-wider mb-2">
                    Display Name
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-3 text-gray-500" />
                    <input
                      type="text"
                      name="display_name"
                      value={formData.display_name}
                      onChange={handleAccountChange}
                      required
                      className={`w-full pl-10 pr-4 py-2 bg-gray-900 border-2 text-gray-200 placeholder-gray-500 focus:outline-none transition-all ${
                        getFieldError('display_name')
                          ? 'border-red-600 focus:border-red-500'
                          : 'border-gray-700 focus:border-yellow-600'
                      }`}
                      placeholder="How others will see your name"
                    />
                  </div>
                  {getFieldError('display_name') && (
                    <p className="mt-1 text-xs text-red-400">{getFieldError('display_name')}</p>
                  )}
                </div>
              </div>

              {/* Email Field - Full Width */}
              <div>
                <label className="block text-sm font-bold text-yellow-400 uppercase tracking-wider mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleAccountChange}
                    required
                    className={`w-full pl-10 pr-4 py-2 bg-gray-900 border-2 text-gray-200 placeholder-gray-500 focus:outline-none transition-all ${
                      getFieldError('email')
                        ? 'border-red-600 focus:border-red-500'
                        : 'border-gray-700 focus:border-yellow-600'
                    }`}
                    placeholder="your.email@example.com"
                  />
                </div>
                {getFieldError('email') && (
                  <p className="mt-1 text-xs text-red-400">{getFieldError('email')}</p>
                )}
              </div>

              {/* Password Row: Password and Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password Field */}
                <div>
                  <label className="block text-sm font-bold text-yellow-400 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-3 text-gray-500" />
                    <input
                      type="password"
                      name="password1"
                      value={formData.password1}
                      onChange={handleAccountChange}
                      required
                      className={`w-full pl-10 pr-4 py-2 bg-gray-900 border-2 text-gray-200 placeholder-gray-500 focus:outline-none transition-all ${
                        getFieldError('password1')
                          ? 'border-red-600 focus:border-red-500'
                          : 'border-gray-700 focus:border-yellow-600'
                      }`}
                      placeholder="At least 8 characters"
                    />
                  </div>
                  {getFieldError('password1') && (
                    <p className="mt-1 text-xs text-red-400">{getFieldError('password1')}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-bold text-yellow-400 uppercase tracking-wider mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-3 text-gray-500" />
                    <input
                      type="password"
                      name="password2"
                      value={formData.password2}
                      onChange={handleAccountChange}
                      required
                      className={`w-full pl-10 pr-4 py-2 bg-gray-900 border-2 text-gray-200 placeholder-gray-500 focus:outline-none transition-all ${
                        getFieldError('password2')
                          ? 'border-red-600 focus:border-red-500'
                          : 'border-gray-700 focus:border-yellow-600'
                      }`}
                      placeholder="Repeat your password"
                    />
                  </div>
                  {getFieldError('password2') && (
                    <p className="mt-1 text-xs text-red-400">{getFieldError('password2')}</p>
                  )}
                </div>
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 font-bold uppercase tracking-wider border-2 transition-all flex items-center justify-center gap-2 mt-8 ${
                  loading
                    ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-yellow-700 border-yellow-600 text-yellow-200 hover:bg-yellow-600'
                }`}
              >
                <UserPlus size={18} />
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </form>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
            <p className="text-gray-400 text-sm mb-3">Already have an account?</p>
            <button
              onClick={() => navigate('/login')}
              className="text-yellow-400 hover:text-yellow-300 font-bold uppercase text-sm tracking-wider"
            >
              Sign In Here
            </button>

            {/* Back to Home */}
            <div className="mt-6">
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 border-2 border-gray-600 text-gray-200 hover:bg-gray-600 hover:border-gray-500 transition-all font-bold uppercase text-sm w-full"
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
