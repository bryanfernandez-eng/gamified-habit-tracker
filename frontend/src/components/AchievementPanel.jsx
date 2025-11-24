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
      <div className="rulebook-card p-8">
        <div className="text-center">
          <div className="animate-spin inline-block">
            <Trophy size={32} className="text-rulebook-crimson" />
          </div>
          <p className="text-rulebook-ink/60 mt-4 font-serif">Loading achievements...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rulebook-card p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-rulebook-ink uppercase mb-2 border-b-2 border-rulebook-ink/20 pb-2">
          Trophies
        </h2>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-rulebook-ink/60 font-mono">
            <span className="text-rulebook-crimson font-bold">{unlockedCount}</span> of{' '}
            <span className="text-rulebook-ink font-bold">{totalCount}</span> unlocked
          </div>
          <div className="w-48 h-2 bg-rulebook-ink/10 border border-rulebook-ink/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-rulebook-crimson transition-all"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rulebook-crimson/10 border-2 border-rulebook-crimson text-rulebook-crimson flex items-center rounded-sm">
          <AlertCircle size={18} className="mr-2" />
          {error}
          <button
            onClick={loadAchievements}
            className="ml-auto text-rulebook-crimson font-bold hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6 border-b-2 border-rulebook-ink/10 pb-4">
        {[
          { id: 'all', label: 'All' },
          { id: 'unlocked', label: `Unlocked (${unlockedCount})` },
          { id: 'locked', label: `Locked (${totalCount - unlockedCount})` },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id)}
            className={`px-4 py-2 font-serif font-bold text-sm uppercase tracking-wider transition-all rounded-sm ${filter === btn.id
                ? 'bg-rulebook-ink text-rulebook-paper'
                : 'bg-transparent text-rulebook-ink/40 hover:text-rulebook-ink hover:bg-rulebook-ink/5'
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
              className={`border-2 transition-all p-1 ${achievement.is_unlocked
                  ? 'border-rulebook-crimson bg-rulebook-paper'
                  : 'border-rulebook-ink/20 bg-rulebook-ink/5'
                }`}
            >
              <div className={`p-4 h-full border ${achievement.is_unlocked ? 'border-rulebook-crimson/20' : 'border-transparent'}`}>
                <div className="flex items-start">
                  {/* Icon */}
                  <div
                    className={`p-2 text-2xl w-14 h-14 flex items-center justify-center border-2 rounded-sm ${achievement.is_unlocked
                        ? 'bg-rulebook-crimson text-rulebook-paper border-rulebook-crimson'
                        : 'bg-transparent text-rulebook-ink/20 border-rulebook-ink/20'
                      } mr-3`}
                  >
                    {achievement.is_unlocked ? (
                      <Trophy size={24} />
                    ) : (
                      <Lock size={24} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`font-serif font-bold text-lg ${achievement.is_unlocked
                            ? 'text-rulebook-ink'
                            : 'text-rulebook-ink/40'
                          }`}
                      >
                        {achievement.name}
                      </h3>
                      {achievement.is_unlocked && (
                        <CheckCircle size={18} className="text-rulebook-forest" />
                      )}
                    </div>

                    <p className={`text-sm mt-1 font-mono ${achievement.is_unlocked ? 'text-rulebook-ink/70' : 'text-rulebook-ink/40'}`}>
                      {achievement.description}
                    </p>

                    {/* Progress Bar */}
                    {!achievement.is_unlocked && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-rulebook-ink/40 mb-1 font-mono">
                          <span>Progress</span>
                          <span>
                            {achievement.user_progress}/{achievement.requirement_value}
                          </span>
                        </div>
                        <div className="w-full bg-rulebook-ink/10 border border-rulebook-ink/20 h-2 overflow-hidden rounded-full">
                          <div
                            className="bg-rulebook-ink/40 h-full transition-all"
                            style={{
                              width: `${getProgressPercentage(achievement)}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Reward */}
                    <div className={`mt-3 border p-2 flex items-center rounded-sm ${achievement.is_unlocked
                        ? 'bg-rulebook-royal/5 border-rulebook-royal/20'
                        : 'bg-transparent border-rulebook-ink/10'
                      }`}>
                      <Zap size={14} className={`${achievement.is_unlocked ? 'text-rulebook-royal' : 'text-rulebook-ink/30'} mr-2`} />
                      <span className={`text-xs font-mono ${achievement.is_unlocked ? 'text-rulebook-ink/80' : 'text-rulebook-ink/40'}`}>
                        <span className={`font-bold ${achievement.is_unlocked ? 'text-rulebook-royal' : ''}`}>
                          {achievement.reward_xp} XP
                        </span>{' '}
                        - {achievement.reward_description}
                      </span>
                    </div>

                    {/* Type Badge */}
                    <div className="mt-2 flex items-center opacity-60">
                      <span className="text-xl mr-2 grayscale">
                        {getAchievementIcon(achievement.requirement_type)}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rulebook-ink/50">
                        {achievement.requirement_type.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-12 text-rulebook-ink/40 border-2 border-dashed border-rulebook-ink/20 rounded-sm">
            <Trophy size={32} className="mx-auto mb-2 opacity-50" />
            <p className="font-serif italic">No achievements to display</p>
          </div>
        )}
      </div>
    </div>
  )
}
