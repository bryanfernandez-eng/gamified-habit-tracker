import React, { useState } from 'react'
import { X, Plus, Dumbbell, BookOpen, Brush, Users, Heart } from 'lucide-react'
import { gameApi } from '../services/gameApi'

export function HabitCreation({ onHabitCreated, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'strength',
    xp_reward: 50,
    frequency: 'daily',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const categories = [
    { id: 'strength', label: 'Strength', icon: Dumbbell, color: 'text-rulebook-crimson' },
    { id: 'intelligence', label: 'Intelligence', icon: BookOpen, color: 'text-rulebook-royal' },
    { id: 'creativity', label: 'Creativity', icon: Brush, color: 'text-rulebook-ink' },
    { id: 'social', label: 'Social', icon: Users, color: 'text-rulebook-forest' },
    { id: 'health', label: 'Health', icon: Heart, color: 'text-rulebook-crimson' },
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
      setError('Quest name is required')
      return
    }

    if (formData.xp_reward < 10) {
      setError('XP reward must be at least 10')
      return
    }

    try {
      setLoading(true)
      await gameApi.createHabit(formData)
      onHabitCreated()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create quest')
    } finally {
      setLoading(false)
    }
  }

  const selectedCategory = categories.find(c => c.id === formData.category)
  const CategoryIcon = selectedCategory?.icon

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-rulebook-ink/40 backdrop-blur-sm"
    >
      <div className="rulebook-card max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-6 border-b-2 border-rulebook-ink/20 pb-4">
          <h2 className="text-2xl font-serif font-bold text-rulebook-ink uppercase tracking-widest">Create Quest</h2>
          <button
            onClick={onClose}
            className="text-rulebook-ink/60 hover:text-rulebook-crimson transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rulebook-crimson/10 border-2 border-rulebook-crimson text-rulebook-crimson font-serif rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quest Name */}
          <div>
            <label className="block text-sm font-serif font-bold text-rulebook-ink/80 mb-2 uppercase tracking-wide">
              Quest Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Morning Exercise"
              className="w-full bg-rulebook-paper border-2 border-rulebook-ink/20 px-3 py-2 text-rulebook-ink font-mono placeholder-rulebook-ink/40 focus:border-rulebook-crimson focus:outline-none rounded-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-serif font-bold text-rulebook-ink/80 mb-2 uppercase tracking-wide">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Optional: Describe this quest..."
              rows="3"
              className="w-full bg-rulebook-paper border-2 border-rulebook-ink/20 px-3 py-2 text-rulebook-ink font-mono placeholder-rulebook-ink/40 focus:border-rulebook-crimson focus:outline-none rounded-sm resize-none"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-serif font-bold text-rulebook-ink/80 mb-2 uppercase tracking-wide">
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
                    className={`p-3 border-2 flex flex-col items-center justify-center transition-all rounded-sm ${formData.category === cat.id
                        ? 'border-rulebook-crimson bg-rulebook-crimson/10'
                        : 'border-rulebook-ink/20 bg-rulebook-ink/5 hover:border-rulebook-ink/40'
                      }`}
                    title={cat.label}
                  >
                    <Icon size={16} className={cat.color} />
                    <span className="text-[10px] text-rulebook-ink font-mono font-bold mt-1 text-center">{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* XP Reward */}
          <div>
            <label className="block text-sm font-serif font-bold text-rulebook-ink/80 mb-2 uppercase tracking-wide">
              XP Reward: <span className="text-rulebook-royal font-mono">{formData.xp_reward}</span>
            </label>
            <input
              type="range"
              name="xp_reward"
              value={formData.xp_reward}
              onChange={handleInputChange}
              min="10"
              max="200"
              step="5"
              className="w-full accent-rulebook-crimson"
            />
            <div className="flex justify-between text-xs text-rulebook-ink/50 font-mono mt-1">
              <span>10</span>
              <span>200</span>
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-serif font-bold text-rulebook-ink/80 mb-2 uppercase tracking-wide">
              Frequency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {frequencies.map(freq => (
                <button
                  key={freq.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, frequency: freq.id }))}
                  className={`py-2 px-3 border-2 font-serif font-bold text-sm uppercase tracking-wider transition-all rounded-sm ${formData.frequency === freq.id
                      ? 'border-rulebook-crimson bg-rulebook-crimson text-rulebook-paper'
                      : 'border-rulebook-ink/20 bg-rulebook-ink/5 text-rulebook-ink hover:border-rulebook-ink/40'
                    }`}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 font-serif font-bold uppercase tracking-widest border-2 flex items-center justify-center transition-all shadow-sm rounded-sm ${loading
                ? 'bg-rulebook-ink/20 border-rulebook-ink/20 text-rulebook-ink/40 cursor-not-allowed'
                : 'bg-rulebook-crimson border-rulebook-ink text-rulebook-paper hover:bg-rulebook-ink hover:border-rulebook-crimson'
              }`}
          >
            <Plus size={20} className="mr-2" />
            {loading ? 'Creating...' : 'Create Quest'}
          </button>
        </form>
      </div>
    </div>
  )
}
