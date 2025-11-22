// frontend/src/components/Register.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Zap, Lock, User, Mail, UserPlus, ChevronRight, Loader } from 'lucide-react'
import { gameApi } from '../services/gameApi'
import ConnectionStatus from './ConnectionStatus'

export default function Register({ onToggleMode }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: account info, 2: survey
  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    email: '',
    password1: '',
    password2: ''
  })
  const [surveyData, setSurveyData] = useState({
    strength: 'neutral',
    intelligence: 'neutral',
    creativity: 'neutral',
    social: 'neutral',
    health: 'neutral'
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

  const validateAccountForm = () => {
    const errors = {}
    if (!formData.username.trim()) errors.username = 'Username is required'
    if (!formData.display_name.trim()) errors.display_name = 'Display name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    if (!formData.password1) errors.password1 = 'Password is required'
    if (formData.password1 !== formData.password2) errors.password2 = 'Passwords do not match'
    return errors
  }

  const handleNextStep = () => {
    const errors = validateAccountForm()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setStep(2)
  }

  const handleSurveyChange = (category, value) => {
    setSurveyData(prev => ({
      ...prev,
      [category]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFieldErrors({})

    const result = await register(formData)
    if (!result.success && result.fieldErrors) {
      setFieldErrors(result.fieldErrors)
      return
    }

    // If registration successful, create initial habits based on survey
    if (result.success) {
      try {
        console.log('Creating initial habits with survey data:', surveyData)
        const habitsResult = await gameApi.createInitialHabits(surveyData)
        console.log('Initial habits created:', habitsResult)
        // Registration and habit creation successful - navigate to home
      } catch (err) {
        console.error('Failed to create initial habits:', err)
        // Don't block on habit creation failure
      }
      navigate('/')
    }
  }

  const getFieldError = (fieldName) => {
    return fieldErrors[fieldName]
  }

  const categories = [
    { id: 'strength', label: 'Strength', icon: '💪', color: 'red' },
    { id: 'intelligence', label: 'Intelligence', icon: '🧠', color: 'blue' },
    { id: 'creativity', label: 'Creativity', icon: '🎨', color: 'purple' },
    { id: 'social', label: 'Social', icon: '👥', color: 'green' },
    { id: 'health', label: 'Health', icon: '❤️', color: 'pink' }
  ]

  const likelihoodOptions = [
    { value: 'very_unlikely', label: 'Very Unlikely', icon: '😞' },
    { value: 'somewhat_unlikely', label: 'Somewhat Unlikely', icon: '😟' },
    { value: 'neutral', label: 'Neutral', icon: '😐' },
    { value: 'somewhat_likely', label: 'Somewhat Likely', icon: '🙂' },
    { value: 'very_likely', label: 'Very Likely', icon: '😄' }
  ]

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-md my-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-yellow-400 mr-2" />
            <h1 className="text-3xl font-bold text-yellow-400 uppercase tracking-wider">Quest Tracker</h1>
          </div>
          <p className="text-gray-400 text-sm uppercase tracking-widest">
            {step === 1 ? 'Begin Your Journey' : 'Customize Your Path'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-gray-800 border-4 border-double border-gray-700 p-8 mb-6">
          {/* Step Indicator */}
          <div className="mb-8 flex gap-2">
            <div className={`flex-1 h-2 border-2 ${step === 1 ? 'bg-yellow-600 border-yellow-600' : 'bg-gray-600 border-gray-600'}`} />
            <div className={`flex-1 h-2 border-2 ${step === 2 ? 'bg-yellow-600 border-yellow-600' : 'bg-gray-600 border-gray-600'}`} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900 border-2 border-red-700 text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Account Creation */}
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); handleNextStep() }} className="space-y-5">
              <h2 className="text-xl font-bold text-yellow-400 uppercase mb-6">Create Your Account</h2>

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

              {/* Email Field */}
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

              {/* Next Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 font-bold uppercase tracking-wider border-2 bg-yellow-700 border-yellow-600 text-yellow-200 hover:bg-yellow-600 transition-all flex items-center justify-center gap-2 mt-8"
              >
                Next: Customize Path
                <ChevronRight size={18} />
              </button>
            </form>
          )}

          {/* Step 2: Habit Survey */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl font-bold text-yellow-400 uppercase mb-6">
                What habits will you work on?
              </h2>
              <p className="text-gray-400 text-sm">Rate your interest in each category. This will help us recommend daily quests for you.</p>

              {/* Survey Questions */}
              {categories.map((category) => (
                <div key={category.id}>
                  <label className="block text-sm font-bold text-yellow-400 uppercase tracking-wider mb-3">
                    {category.icon} {category.label}
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {likelihoodOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSurveyChange(category.id, option.value)}
                        className={`py-2 px-2 text-xs font-bold border-2 transition-all ${
                          surveyData[category.id] === option.value
                            ? `bg-${category.color}-700 border-${category.color}-600 text-${category.color}-200`
                            : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                        title={option.label}
                      >
                        {option.icon}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Form Actions */}
              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-4 font-bold uppercase tracking-wider border-2 bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 px-4 font-bold uppercase tracking-wider border-2 transition-all flex items-center justify-center gap-2 ${
                    loading
                      ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-yellow-700 border-yellow-600 text-yellow-200 hover:bg-yellow-600'
                  }`}
                >
                  <UserPlus size={18} />
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sign In Link */}
        {step === 1 && (
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-3">Already have an account?</p>
            <button
              onClick={onToggleMode}
              className="text-yellow-400 hover:text-yellow-300 font-bold uppercase text-sm tracking-wider"
            >
              Sign In Here
            </button>
          </div>
        )}
      </div>

      {/* Connection Status - Bottom Right */}
      <div className="absolute bottom-6 right-6">
        <ConnectionStatus />
      </div>
    </div>
  )
}
