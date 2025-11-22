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
      <div className="bg-gray-800 border-4 border-double border-gray-700 p-4">
        <h2 className="text-2xl font-bold text-yellow-400 uppercase mb-4 border-b-2 border-gray-700 pb-2">
          Character Stats
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2 animate-spin" />
            <p className="text-gray-400">Loading stats...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !userStats) {
    return (
      <div className="bg-gray-800 border-4 border-double border-gray-700 p-4">
        <h2 className="text-2xl font-bold text-yellow-400 uppercase mb-4 border-b-2 border-gray-700 pb-2">
          Character Stats
        </h2>
        <div className="p-4 bg-red-900/30 border-2 border-red-700 text-red-300 rounded">
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
        className={`${bgColor} border-4 border-double ${borderColor} overflow-hidden`}
      >
        {/* Header */}
        <div className={`p-3 border-b-2 ${borderColor}`}>
          <div className="flex items-center">
            <div className={`p-2 ${color} border-2 mr-3`}>
              {icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-200 uppercase">{name}</h3>
              <p className="text-sm text-gray-400">{stat.description}</p>
            </div>
            <div className="ml-auto">
              <span className={`text-2xl font-bold ${color}`}>
                {stat.level}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="p-3 border-b-2 border-gray-700 bg-gray-900/50">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <p className="text-gray-500">Quests</p>
              <p className={`font-bold ${color}`}>{stat.habitsInfo.completed}/{stat.habitsInfo.total}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Total XP</p>
              <p className="font-bold text-yellow-400">{stat.habitsInfo.totalXp}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Progress</p>
              <p className="font-bold text-blue-400">{stat.habitsInfo.total > 0 ? Math.round((stat.habitsInfo.completed / stat.habitsInfo.total) * 100) : 0}%</p>
            </div>
          </div>
        </div>

        {/* Recent Habits */}
        {stat.habitsInfo.total > 0 && (
          <div className="p-3">
            <h4 className="text-xs font-bold text-gray-300 uppercase mb-2 border-b border-gray-700 pb-1">
              Active Quests
            </h4>
            <div className="space-y-1 max-h-40 overflow-y-auto stats-scrollbar">
              {stat.habitsInfo.habits.slice(0, 5).map((habit) => (
                <div key={habit.id} className="flex items-center justify-between text-xs p-1 bg-gray-800 rounded border-l-2 border-yellow-500">
                  <span className={`flex-1 ${habit.completed_today ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                    {habit.name}
                  </span>
                  <span className="text-yellow-400 font-bold ml-1">+{habit.xp_reward}</span>
                </div>
              ))}
              {stat.habitsInfo.total > 5 && (
                <p className="text-xs text-gray-500 italic text-center py-1">+{stat.habitsInfo.total - 5} more</p>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {stat.habitsInfo.total === 0 && (
          <div className="p-3 text-center text-xs text-gray-500">
            No quests in this category yet
          </div>
        )}
      </div>
    )
  }
  
  return (
    <div className="bg-gray-800 border-4 border-double border-gray-700 p-4">
      <style>{`
        .stats-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .stats-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 3px;
        }
        .stats-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #fbbf24, #f59e0b);
          border-radius: 3px;
          border: 1px solid rgba(0, 0, 0, 0.2);
        }
        .stats-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #f59e0b, #d97706);
        }
        .stats-scrollbar {
          scrollbar-color: #fbbf24 rgba(0, 0, 0, 0.3);
          scrollbar-width: thin;
        }
      `}</style>
      <h2 className="text-2xl font-bold text-yellow-400 uppercase mb-4 border-b-2 border-gray-700 pb-2">
        Character Stats
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          name="Strength"
          icon={<Shield size={16} />}
          color="text-red-500"
          bgColor="bg-red-900"
          borderColor="border-red-700"
          stat={stats.strength}
        />
        <StatCard
          name="Intelligence"
          icon={<Brain size={16} />}
          color="text-blue-500"
          bgColor="bg-blue-900"
          borderColor="border-blue-700"
          stat={stats.intelligence}
        />
        <StatCard
          name="Creativity"
          icon={<Palette size={16} />}
          color="text-purple-500"
          bgColor="bg-purple-900"
          borderColor="border-purple-700"
          stat={stats.creativity}
        />
        <StatCard
          name="Social"
          icon={<Users size={16} />}
          color="text-green-500"
          bgColor="bg-green-900"
          borderColor="border-green-700"
          stat={stats.social}
        />
        <StatCard
          name="Health"
          icon={<Heart size={16} />}
          color="text-pink-500"
          bgColor="bg-pink-900"
          borderColor="border-pink-700"
          stat={stats.health}
        />
      </div>
    </div>
  )
}