import React, { useState, useEffect } from 'react'
import { Trophy, Lock, CheckCircle, AlertCircle, Zap } from 'lucide-react'
import { gameApi } from '../services/gameApi'

export function AchievementPanel() {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // 'all', 'unlocked', 'locked'

  useEffect(() => {
    loadAchievements()
  }, [])

  const loadAchievements = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await gameApi.getAchievements()
      setAchievements(data)
    } catch (err) {
      console.error('Failed to load achievements:', err)
      setError('Failed to load achievements. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getAchievementIcon = (requirement_type) => {
    switch (requirement_type) {
      case 'streak':
        return '🔥'
      case 'attribute_level':
        return '⭐'
      case 'level':
        return '🎖️'
      case 'total_completions':
        return '✅'
      default:
        return '🏆'
    }
  }

  const getProgressPercentage = (achievement) => {
    if (achievement.requirement_value === 0) return 0
    return Math.min(100, (achievement.user_progress / achievement.requirement_value) * 100)
  }

  const filteredAchievements = achievements.filter((achievement) => {
    if (filter === 'unlocked') return achievement.is_unlocked
    if (filter === 'locked') return !achievement.is_unlocked
    return true
  })

  const unlockedCount = achievements.filter(a => a.is_unlocked).length
  const totalCount = achievements.length

  if (loading) {
    return (
      <div className="bg-gray-800 border-4 border-double border-gray-700 p-8">
        <div className="text-center">
          <div className="animate-spin inline-block">
            <Trophy size={32} className="text-yellow-400" />
          </div>
          <p className="text-gray-300 mt-4">Loading achievements...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 border-4 border-double border-gray-700 p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-yellow-400 uppercase mb-2 border-b-2 border-gray-700 pb-2">
          Trophies
        </h2>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-300">
            <span className="text-yellow-400 font-bold">{unlockedCount}</span> of{' '}
            <span className="text-yellow-400 font-bold">{totalCount}</span> unlocked
          </div>
          <div className="w-48 h-2 bg-gray-900 border-2 border-gray-700">
            <div
              className="h-full bg-yellow-500 transition-all"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900 border-2 border-red-700 text-red-200 flex items-center">
          <AlertCircle size={18} className="mr-2" />
          {error}
          <button
            onClick={loadAchievements}
            className="ml-auto text-red-100 hover:text-red-50 font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4 border-b-2 border-gray-700 pb-4">
        {[
          { id: 'all', label: 'All' },
          { id: 'unlocked', label: `Unlocked (${unlockedCount})` },
          { id: 'locked', label: `Locked (${totalCount - unlockedCount})` },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id)}
            className={`px-4 py-2 font-medium transition-all ${
              filter === btn.id
                ? 'bg-yellow-700 text-yellow-200 border-b-2 border-yellow-400'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.length > 0 ? (
          filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`border-4 transition-all ${
                achievement.is_unlocked
                  ? 'border-yellow-600 bg-yellow-900'
                  : 'border-gray-600 bg-gray-700'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start">
                  {/* Icon */}
                  <div
                    className={`p-2 text-2xl w-14 h-14 flex items-center justify-center ${
                      achievement.is_unlocked
                        ? 'bg-yellow-600 border-2 border-yellow-500'
                        : 'bg-gray-600 border-2 border-gray-500'
                    } mr-3`}
                  >
                    {achievement.is_unlocked ? (
                      <Trophy size={24} className="text-white" />
                    ) : (
                      <Lock size={24} className="text-white" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`font-bold text-lg ${
                          achievement.is_unlocked
                            ? 'text-yellow-300'
                            : 'text-gray-300'
                        }`}
                      >
                        {achievement.name}
                      </h3>
                      {achievement.is_unlocked && (
                        <CheckCircle size={18} className="text-green-400" />
                      )}
                    </div>

                    <p className="text-sm text-gray-400 mt-1">
                      {achievement.description}
                    </p>

                    {/* Progress Bar */}
                    {!achievement.is_unlocked && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>
                            {achievement.user_progress}/{achievement.requirement_value}
                          </span>
                        </div>
                        <div className="w-full bg-gray-900 border-2 border-gray-700 h-3 overflow-hidden">
                          <div
                            className="bg-blue-600 h-full transition-all"
                            style={{
                              width: `${getProgressPercentage(achievement)}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Reward */}
                    <div className="mt-3 bg-gray-900 border-2 border-gray-600 p-2 flex items-center">
                      <Zap size={14} className="text-yellow-500 mr-2" />
                      <span className="text-xs text-gray-300">
                        <span className="text-yellow-400 font-bold">
                          {achievement.reward_xp} XP
                        </span>{' '}
                        - {achievement.reward_description}
                      </span>
                    </div>

                    {/* Type Badge */}
                    <div className="mt-2 flex items-center">
                      <span className="text-2xl mr-2">
                        {getAchievementIcon(achievement.requirement_type)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {achievement.requirement_type.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-8 text-gray-400">
            <Trophy size={32} className="mx-auto mb-2 opacity-50" />
            <p>No achievements to display</p>
          </div>
        )}
      </div>
    </div>
  )
}
