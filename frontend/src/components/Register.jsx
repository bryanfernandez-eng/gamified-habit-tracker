// frontend/src/components/Register.jsx
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Register({ onToggleMode }) {
  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    email: '',
    password1: '',
    password2: ''
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const { register, loading, error } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFieldErrors({})
    
    const result = await register(formData)
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

  const getFieldError = (fieldName) => {
    return fieldErrors[fieldName]
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldError('username') ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Choose a unique username"
          />
          {getFieldError('username') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('username')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display Name
          </label>
          <input
            type="text"
            name="display_name"
            value={formData.display_name}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldError('display_name') ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="How others will see your name"
          />
          {getFieldError('display_name') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('display_name')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldError('email') ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="your.email@example.com"
          />
          {getFieldError('email') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password1"
            value={formData.password1}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldError('password1') ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="At least 6 characters"
          />
          {getFieldError('password1') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('password1')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldError('password2') ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Repeat your password"
          />
          {getFieldError('password2') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('password2')}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={onToggleMode}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Already have an account? Sign in
        </button>
      </div>
    </div>
  )
}