import { useEffect, useState } from 'react'
import {
  Shield,
  Brain,
  Palette,
  Users,
  Heart,
  Zap,
} from 'lucide-react'
import { gameApi } from '../services/gameApi'

export function StatsDisplay() {
  const [userStats, setUserStats] = useState(null)
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const statsData = await gameApi.getUserStats()
        const habitsData = await gameApi.getHabits()
        setUserStats(statsData)
        setHabits(habitsData)
      } catch (err) {
        console.error('Failed to load stats:', err)
        setError('Failed to load character stats')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const getAttributeDescription = (attribute) => {
    const descriptions = {
      strength: 'Physical power and endurance',
      intelligence: 'Knowledge and mental acuity',
      creativity: 'Artistic and innovative thinking',
      social: 'Communication and relationships',
      health: 'Physical wellbeing and vitality',
    }
    return descriptions[attribute] || ''
  }

  if (loading) {
    return (
      <div className="rulebook-card p-6">
        <h2 className="text-2xl font-serif font-bold text-rulebook-ink uppercase mb-6 border-b-2 border-rulebook-ink/20 pb-4">
          Character Stats
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Zap className="w-8 h-8 text-rulebook-crimson mx-auto mb-2 animate-spin" />
            <p className="text-rulebook-ink/60 font-serif">Loading stats...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !userStats) {
    return (
      <div className="rulebook-card p-6">
        <h2 className="text-2xl font-serif font-bold text-rulebook-ink uppercase mb-6 border-b-2 border-rulebook-ink/20 pb-4">
          Character Stats
        </h2>
        <div className="p-4 bg-rulebook-crimson/10 border-2 border-rulebook-crimson text-rulebook-crimson rounded-sm font-serif">
          {error || 'Failed to load stats'}
        </div>
      </div>
    )
  }

  const getHabitsByCategory = (category) => {
    return habits.filter(h => h.category === category)
  }

  const getCategoryHabitsInfo = (category) => {
    const categoryHabits = getHabitsByCategory(category)
    const completedCount = categoryHabits.filter(h => h.completed_today).length
    const totalXpFromCategory = categoryHabits.reduce((sum, h) => sum + (h.xp_reward || 0), 0)

    return {
      total: categoryHabits.length,
      completed: completedCount,
      totalXp: totalXpFromCategory,
      habits: categoryHabits,
    }
  }

  const stats = {
    strength: {
      level: userStats.strength,
      description: getAttributeDescription('strength'),
      habitsInfo: getCategoryHabitsInfo('strength'),
    },
    intelligence: {
      level: userStats.intelligence,
      description: getAttributeDescription('intelligence'),
      habitsInfo: getCategoryHabitsInfo('intelligence'),
    },
    creativity: {
      level: userStats.creativity,
      description: getAttributeDescription('creativity'),
      habitsInfo: getCategoryHabitsInfo('creativity'),
    },
    social: {
      level: userStats.social,
      description: getAttributeDescription('social'),
      habitsInfo: getCategoryHabitsInfo('social'),
    },
    health: {
      level: userStats.health,
      description: getAttributeDescription('health'),
      habitsInfo: getCategoryHabitsInfo('health'),
    },
  }

  const StatCard = ({
    name,
    icon,
    color,
    bgColor,
    borderColor,
    stat,
  }) => {
    return (
      <div
        className={`bg-rulebook-paper border-2 ${borderColor} overflow-hidden shadow-sm`}
      >
        {/* Header */}
        <div className={`p-3 border-b ${borderColor} bg-opacity-10 ${bgColor}`}>
          <div className="flex items-center">
            <div className={`p-2 ${color} border-2 ${borderColor} mr-3 bg-white/50`}>
              {icon}
            </div>
            <div>
              <h3 className="font-serif font-bold text-rulebook-ink uppercase tracking-wide">{name}</h3>
              <p className="text-xs text-rulebook-ink/60 font-mono">{stat.description}</p>
            </div>
            <div className="ml-auto">
              <span className={`text-2xl font-serif font-bold ${color}`}>
                {stat.level}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className={`p-3 border-b ${borderColor} bg-rulebook-ink/5`}>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="text-center">
              <p className="text-rulebook-ink/50 uppercase text-[10px] font-bold tracking-wider">Quests</p>
              <p className={`font-bold ${color} text-lg`}>{stat.habitsInfo.completed}/{stat.habitsInfo.total}</p>
            </div>
            <div className="text-center">
              <p className="text-rulebook-ink/50 uppercase text-[10px] font-bold tracking-wider">Total XP</p>
              <p className="font-bold text-rulebook-ink text-lg">{stat.habitsInfo.totalXp}</p>
            </div>
            <div className="text-center">
              <p className="text-rulebook-ink/50 uppercase text-[10px] font-bold tracking-wider">Progress</p>
              <p className={`font-bold ${color} text-lg`}>{stat.habitsInfo.total > 0 ? Math.round((stat.habitsInfo.completed / stat.habitsInfo.total) * 100) : 0}%</p>
            </div>
          </div>
        </div>

        {/* Recent Habits */}
        {stat.habitsInfo.total > 0 && (
          <div className="p-3">
            <h4 className="text-[10px] font-bold text-rulebook-ink/40 uppercase mb-2 border-b border-rulebook-ink/10 pb-1 font-serif tracking-widest">
              Active Quests
            </h4>
            <div className="space-y-1 max-h-40 overflow-y-auto stats-scrollbar">
              {stat.habitsInfo.habits.slice(0, 5).map((habit) => (
                <div key={habit.id} className={`flex items-center justify-between text-xs p-2 rounded-sm border-l-2 ${borderColor} bg-rulebook-ink/5 hover:bg-rulebook-ink/10 transition`}>
                  <span className={`flex-1 font-mono ${habit.completed_today ? 'text-rulebook-ink/40 line-through' : 'text-rulebook-ink'}`}>
                    {habit.name}
                  </span>
                  <span className="text-rulebook-ink/60 font-bold ml-1 text-xs">+{habit.xp_reward}</span>
                </div>
              ))}
              {stat.habitsInfo.total > 5 && (
                <p className="text-xs text-rulebook-ink/40 italic text-center py-1 font-serif">+{stat.habitsInfo.total - 5} more</p>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {stat.habitsInfo.total === 0 && (
          <div className="p-3 text-center text-xs text-rulebook-ink/40 font-serif italic">
            No quests in this category yet
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="rulebook-card p-6">
      <style>{`
        .stats-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .stats-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
        }
        .stats-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(43, 43, 43, 0.2);
          border-radius: 2px;
        }
        .stats-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(43, 43, 43, 0.4);
        }
      `}</style>
      <h2 className="text-2xl font-serif font-bold text-rulebook-ink uppercase mb-6 border-b-2 border-rulebook-ink/20 pb-4">
        Character Stats
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          name="Strength"
          icon={<Shield size={16} />}
          color="text-[#A0746F]" // Dusty Terracotta
          bgColor="bg-[#A0746F]"
          borderColor="border-[#A0746F]"
          stat={stats.strength}
        />
        <StatCard
          name="Intelligence"
          icon={<Brain size={16} />}
          color="text-[#6B8E9F]" // Soft Sage Blue
          bgColor="bg-[#6B8E9F]"
          borderColor="border-[#6B8E9F]"
          stat={stats.intelligence}
        />
        <StatCard
          name="Creativity"
          icon={<Palette size={16} />}
          color="text-[#9B8FA5]" // Dusty Lavender
          bgColor="bg-[#9B8FA5]"
          borderColor="border-[#9B8FA5]"
          stat={stats.creativity}
        />
        <StatCard
          name="Social"
          icon={<Users size={16} />}
          color="text-[#8B9F75]" // Soft Olive
          bgColor="bg-[#8B9F75]"
          borderColor="border-[#8B9F75]"
          stat={stats.social}
        />
        <StatCard
          name="Health"
          icon={<Heart size={16} />}
          color="text-[#A8896B]" // Warm Sepia
          bgColor="bg-[#A8896B]"
          borderColor="border-[#A8896B]"
          stat={stats.health}
        />
      </div>
    </div>
  )
}