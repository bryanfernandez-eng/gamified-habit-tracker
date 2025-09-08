import React, { useState, useEffect } from 'react'
import {
  Check,
  Sword,
  Dumbbell,
  BookOpen,
  Brush,
  Users,
} from 'lucide-react'
import { gameApi } from '../services/gameApi'

export function HabitTracker() {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [userStats, setUserStats] = useState(null)

  useEffect(() => {
    loadHabits()
  }, [])

   const loadHabits = async () => {
    try {
      setLoading(true)
      const [habitsData, statsData] = await Promise.all([
        gameApi.getTodayHabits(),
        gameApi.getUserStats()
      ])
      setHabits(habitsData)
      setUserStats(statsData)
    } catch (error) {
      console.error('Failed to load habits:', error)
    } finally {
      setLoading(false)
    }
  }

  
  const [showXpPopup, setShowXpPopup] = useState({
    show: false,
    xp: 0,
    position: {
      x: 0,
      y: 0,
    },
  })
  
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'strength':
        return <Dumbbell size={18} className="text-red-400" />
      case 'intelligence':
        return <BookOpen size={18} className="text-blue-400" />
      case 'creativity':
        return <Brush size={18} className="text-purple-400" />
      case 'social':
        return <Users size={18} className="text-green-400" />
      default:
        return <Sword size={18} className="text-yellow-400" />
    }
  }
  
  const getCategoryColor = (category) => {
    switch (category) {
      case 'strength':
        return 'bg-red-900 border-red-700'
      case 'intelligence':
        return 'bg-blue-900 border-blue-700'
      case 'creativity':
        return 'bg-purple-900 border-purple-700'
      case 'social':
        return 'bg-green-900 border-green-700'
      default:
        return 'bg-yellow-900 border-yellow-700'
    }
  }
  
  const toggleHabit = async (habitId, event) => {
    try {
      const result = await gameApi.completeHabit(habitId)
      
      // Show XP popup
      const rect = event.currentTarget.getBoundingClientRect()
      setShowXpPopup({
        show: true,
        xp: result.xp_earned,
        position: {
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
        },
      })
      
      // Update user stats
      setUserStats(result.user_stats)
      
      // Reload habits to update completion status
      await loadHabits()
      
      // Hide XP popup after animation
      setTimeout(() => {
        setShowXpPopup(prev => ({ ...prev, show: false }))
      }, 1000)
    } catch (error) {
      console.error('Failed to complete habit:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading habits...</div>
  }
  
  return (
    <div className="bg-gray-800 border-4 border-double border-gray-700 p-4">
      <h2 className="text-2xl font-bold text-yellow-400 uppercase mb-4 border-b-2 border-gray-700 pb-2">
        Daily Quests
      </h2>
      <div className="space-y-4">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className={`border-4 ${habit.completed ? 'bg-gray-700 border-gray-600' : `${getCategoryColor(habit.category)}`}`}
          >
            <div className="flex items-center p-4">
              <div className="mr-4 bg-gray-900 p-2 border-2 border-gray-700">
                {getCategoryIcon(habit.category)}
              </div>
              <div className="flex-1">
                <h3
                  className={`font-medium ${habit.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}
                >
                  {habit.name}
                </h3>
                <div className="flex items-center text-xs text-gray-400 mt-1">
                  <span className="flex items-center">
                    <Sword size={12} className="mr-1" />
                    Streak: {habit.streak} days
                  </span>
                </div>
              </div>
              <div>
                <button
                  onClick={(e) => toggleHabit(habit.id, e)}
                  disabled={habit.completed}
                  className={`px-4 py-2 flex items-center ${
                    habit.completed 
                      ? 'bg-gray-600 text-gray-400 cursor-default border-2 border-gray-500' 
                      : 'bg-yellow-700 text-yellow-200 hover:bg-yellow-600 border-2 border-yellow-600'
                  }`}
                >
                  {habit.completed ? (
                    <>
                      <Check size={16} className="mr-1" />
                      DONE
                    </>
                  ) : (
                    <>
                      COMPLETE
                      <span className="ml-2 bg-yellow-800 px-2 py-0.5 text-xs">
                        +{habit.xp} XP
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showXpPopup.show && (
        <div
          className="fixed z-50 pointer-events-none animate-bounce"
          style={{
            left: `${showXpPopup.position.x}px`,
            top: `${showXpPopup.position.y - 20}px`,
          }}
        >
          <div className="bg-yellow-600 text-yellow-200 font-bold px-2 py-1 text-sm border-2 border-yellow-700">
            +{showXpPopup.xp} XP
          </div>
        </div>
      )}
    </div>
  )
}