import React, { useState } from 'react'
import { X, Plus, Dumbbell, BookOpen, Brush, Users, Heart, Trash2 } from 'lucide-react'
import { gameApi } from '../services/gameApi'

export function HabitEditor({ habit, onHabitUpdated, onClose }) {
  const [formData, setFormData] = useState({
    name: habit.name,
    description: habit.description || '',
    category: habit.category,
    xp_reward: habit.xp_reward,
    frequency: habit.frequency,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const categories = [
    { id: 'strength', label: 'Strength', icon: Dumbbell, color: 'text-red-400' },
    { id: 'intelligence', label: 'Intelligence', icon: BookOpen, color: 'text-blue-400' },
    { id: 'creativity', label: 'Creativity', icon: Brush, color: 'text-purple-400' },
    { id: 'social', label: 'Social', icon: Users, color: 'text-green-400' },
    { id: 'health', label: 'Health', icon: Heart, color: 'text-pink-400' },
  ]

  const frequencies = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'xp_reward' ? parseInt(value, 10) || 0 : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('Habit name is required')
      return
    }

    if (formData.xp_reward < 10) {
      setError('XP reward must be at least 10')
      return
    }

    try {
      setLoading(true)
      await gameApi.updateHabit(habit.id, formData)
      onHabitUpdated()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update habit')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      await gameApi.deleteHabit(habit.id)
      onHabitUpdated()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete habit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="bg-gray-900 border-4 border-yellow-600 max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-yellow-400 uppercase">Edit Quest</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900 border-2 border-red-700 text-red-200">
            {error}
          </div>
        )}

        {!showDeleteConfirm ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Habit Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quest Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Morning Exercise"
                className="w-full bg-gray-800 border-2 border-gray-700 px-3 py-2 text-gray-200 placeholder-gray-500 focus:border-yellow-600 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Optional: Describe this quest..."
                rows="3"
                className="w-full bg-gray-800 border-2 border-gray-700 px-3 py-2 text-gray-200 placeholder-gray-500 focus:border-yellow-600 focus:outline-none"
              />
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <div className="grid grid-cols-5 gap-2">
                {categories.map(cat => {
                  const Icon = cat.icon
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                      className={`p-3 border-2 flex flex-col items-center justify-center transition-all ${
                        formData.category === cat.id
                          ? 'border-yellow-500 bg-yellow-900'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                      title={cat.label}
                    >
                      <Icon size={16} className={cat.color} />
                      <span className="text-xs text-gray-300 mt-1 text-center">{cat.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* XP Reward */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                XP Reward: {formData.xp_reward}
              </label>
              <input
                type="range"
                name="xp_reward"
                value={formData.xp_reward}
                onChange={handleInputChange}
                min="10"
                max="200"
                step="5"
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10</span>
                <span>200</span>
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Frequency
              </label>
              <div className="grid grid-cols-3 gap-2">
                {frequencies.map(freq => (
                  <button
                    key={freq.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, frequency: freq.id }))}
                    className={`py-2 px-3 border-2 font-medium transition-all ${
                      formData.frequency === freq.id
                        ? 'border-yellow-500 bg-yellow-900 text-yellow-300'
                        : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 font-bold uppercase border-2 transition-all ${
                  loading
                    ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-yellow-700 border-yellow-600 text-yellow-200 hover:bg-yellow-600'
                }`}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-3 bg-red-700 border-2 border-red-600 text-red-200 hover:bg-red-600 font-bold"
                title="Delete habit"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-red-900 border-2 border-red-700 p-4">
              <p className="text-red-200">
                Are you sure you want to delete this quest? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-700 border-2 border-red-600 text-red-200 hover:bg-red-600 font-bold disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete Quest'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-700 border-2 border-gray-600 text-gray-200 hover:bg-gray-600 font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
