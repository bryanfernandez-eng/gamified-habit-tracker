import React, { useCallback, useEffect, useState } from 'react'
import {
  Check,
  Sword,
  Dumbbell,
  BookOpen,
  Brush,
  Users,
  Plus,
  Edit2,
  Sparkles,
  X,
} from 'lucide-react'
import { gameApi } from '../services/gameApi'
import { HabitCreation } from './HabitCreation'
import { HabitEditor } from './HabitEditor'

// Constants
const SOUND_FREQUENCY_START = 800
const SOUND_FREQUENCY_END = 400
const SOUND_DURATION = 0.1
const SOUND_VOLUME_START = 0.3
const SOUND_VOLUME_END = 0.01
const XP_POPUP_DURATION = 1000
const CELEBRATION_MODAL_DURATION = 3000

export function HabitTracker({ onHabitCompleted }) {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreation, setShowCreation] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null)
  const [celebrationModal, setCelebrationModal] = useState({ show: false, xp: 0, habitName: '' })
  const [completingHabitId, setCompletingHabitId] = useState(null)

  const [showXpPopup, setShowXpPopup] = useState({
    show: false,
    xp: 0,
    position: { x: 0, y: 0 },
  })

  const loadHabits = useCallback(async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) setLoading(true)
      const habitsData = await gameApi.getTodayHabits()
      setHabits(habitsData)
    } catch (error) {
      console.error('Failed to load habits:', error)
    } finally {
      if (isInitialLoad) setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadHabits(true)
  }, [loadHabits])

  const getCategoryIcon = useCallback((category) => {
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
  }, [])

  const getCategoryColor = useCallback((category) => {
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
  }, [])

  const getCanCompleteAndCooldown = useCallback((habit) => {
    // Use completed_today field from API if available (more reliable)
    if (habit.completed_today === true) {
      const lastCompleted = habit.last_completed_at ? new Date(habit.last_completed_at) : new Date()
      const now = new Date()

      // Calculate cooldown period based on frequency
      let cooldownMs = 0

      if (habit.frequency === 'daily') {
        // Reset at midnight
        const nextMidnight = new Date(lastCompleted)
        nextMidnight.setDate(nextMidnight.getDate() + 1)
        nextMidnight.setHours(0, 0, 0, 0)
        cooldownMs = nextMidnight.getTime() - now.getTime()
      } else if (habit.frequency === 'weekly') {
        // Reset after 7 days
        const nextWeek = new Date(lastCompleted.getTime() + 7 * 24 * 60 * 60 * 1000)
        cooldownMs = nextWeek.getTime() - now.getTime()
      } else if (habit.frequency === 'monthly') {
        // Reset after 30 days
        const nextMonth = new Date(lastCompleted.getTime() + 30 * 24 * 60 * 60 * 1000)
        cooldownMs = nextMonth.getTime() - now.getTime()
      }

      if (cooldownMs > 0) {
        // Convert milliseconds to human readable format
        const hours = Math.floor(cooldownMs / (1000 * 60 * 60))
        const minutes = Math.floor((cooldownMs % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((cooldownMs % (1000 * 60)) / 1000)

        let timeStr = ''
        if (hours > 0) timeStr += `${hours}h `
        if (minutes > 0 || hours > 0) timeStr += `${minutes}m `
        if (seconds > 0 || (hours === 0 && minutes === 0)) timeStr += `${seconds}s`

        const timeRemaining = timeStr.trim()
        if (timeRemaining) {
          return {
            canComplete: false,
            timeRemaining,
            status: `Already completed today. Available in ${timeRemaining}`
          }
        }
      }
    }

    // Check if last_completed_at field exists for fallback cooldown calculation
    if (habit.last_completed_at && habit.last_completed_at !== null && habit.last_completed_at !== undefined) {
      const lastCompleted = new Date(habit.last_completed_at)
      const now = new Date()

      // Check if the date is invalid
      if (!isNaN(lastCompleted.getTime())) {
        // Calculate cooldown period based on frequency
        let cooldownMs = 0

        if (habit.frequency === 'daily') {
          // Reset at midnight
          const nextMidnight = new Date(lastCompleted)
          nextMidnight.setDate(nextMidnight.getDate() + 1)
          nextMidnight.setHours(0, 0, 0, 0)
          cooldownMs = nextMidnight.getTime() - now.getTime()
        } else if (habit.frequency === 'weekly') {
          // Reset after 7 days
          const nextWeek = new Date(lastCompleted.getTime() + 7 * 24 * 60 * 60 * 1000)
          cooldownMs = nextWeek.getTime() - now.getTime()
        } else if (habit.frequency === 'monthly') {
          // Reset after 30 days
          const nextMonth = new Date(lastCompleted.getTime() + 30 * 24 * 60 * 60 * 1000)
          cooldownMs = nextMonth.getTime() - now.getTime()
        }

        if (cooldownMs > 0) {
          // Convert milliseconds to human readable format
          const hours = Math.floor(cooldownMs / (1000 * 60 * 60))
          const minutes = Math.floor((cooldownMs % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((cooldownMs % (1000 * 60)) / 1000)

          let timeStr = ''
          if (hours > 0) timeStr += `${hours}h `
          if (minutes > 0 || hours > 0) timeStr += `${minutes}m `
          if (seconds > 0 || (hours === 0 && minutes === 0)) timeStr += `${seconds}s`

          const timeRemaining = timeStr.trim()
          if (timeRemaining) {
            return {
              canComplete: false,
              timeRemaining,
              status: `Already completed today. Available in ${timeRemaining}`
            }
          }
        }
      }
    }

    // Default: habit is ready to complete
    return { canComplete: true, timeRemaining: null, status: 'Ready to complete' }
  }, [])

  const toggleHabit = useCallback(async (habitId, event) => {
    try {
      const habit = habits.find(h => h.id === habitId)

      if (!habit) {
        console.error('Habit not found')
        return
      }

      const { canComplete } = getCanCompleteAndCooldown(habit)

      if (!canComplete) {
        console.warn('Habit not ready to complete')
        return
      }

      setCompletingHabitId(habitId)
      const habitName = habit?.name || 'Quest'

      const result = await gameApi.completeHabit(habitId)

      // Play coin sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(SOUND_FREQUENCY_START, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(SOUND_FREQUENCY_END, audioContext.currentTime + SOUND_DURATION)

      gainNode.gain.setValueAtTime(SOUND_VOLUME_START, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(SOUND_VOLUME_END, audioContext.currentTime + SOUND_DURATION)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + SOUND_DURATION)

      // Show celebration modal
      setCelebrationModal({
        show: true,
        xp: result.xp_earned,
        habitName: habitName
      })

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

      // Optimistically update habit state immediately
      const updatedHabits = habits.map(h => {
        if (h.id === habitId) {
          return {
            ...h,
            completed_today: true,
            last_completed_at: new Date().toISOString(),
            streak: (h.streak || 0) + 1
          }
        }
        return h
      })
      setHabits(updatedHabits)

      // Reload habits in background to verify and get any server-side updates
      loadHabits()

      // Trigger character avatar refresh with stats from server response
      if (onHabitCompleted && result.user_stats) {
        onHabitCompleted(result.user_stats)
      }

      // Hide XP popup after animation
      setTimeout(() => {
        setShowXpPopup(prev => ({ ...prev, show: false }))
      }, XP_POPUP_DURATION)

      // Auto-close celebration modal after 3 seconds
      setTimeout(() => {
        setCelebrationModal(prev => ({ ...prev, show: false }))
      }, CELEBRATION_MODAL_DURATION)
    } catch (error) {
      console.error('Failed to complete habit:', error)
      alert(`Error: ${error.response?.data?.error || error.message || 'Failed to complete habit'}`)
      // Reload habits if there was an error
      loadHabits()
    } finally {
      setCompletingHabitId(null)
    }
  }, [habits, onHabitCompleted, loadHabits, getCanCompleteAndCooldown])

  if (loading) {
    return <div className="text-center py-8">Loading habits...</div>
  }
  
  return (
    <>
      <div className="bg-gray-800 border-4 border-double border-gray-700 p-4">
        <div className="flex justify-between items-center mb-4 border-b-2 border-gray-700 pb-2">
          <h2 className="text-2xl font-bold text-yellow-400 uppercase">
            Daily Quests
          </h2>
          <button
            onClick={() => setShowCreation(true)}
            className="flex items-center px-4 py-2 bg-yellow-700 border-2 border-yellow-600 text-yellow-200 hover:bg-yellow-600 font-medium"
          >
            <Plus size={16} className="mr-1" />
            New Quest
          </button>
        </div>
        <div className="space-y-4">
        {habits.map((habit) => {
          const { canComplete, status } = getCanCompleteAndCooldown(habit)
          return (
            <div
              key={habit.id}
              className={`border-4 transition-all ${!canComplete ? 'bg-gray-700 border-gray-600 opacity-75' : `${getCategoryColor(habit.category)} hover:shadow-lg`}`}
            >
              <div className="flex items-center p-4">
                <div className={`mr-4 p-2 border-2 ${!canComplete ? 'bg-gray-800 border-gray-600' : 'bg-gray-900 border-gray-700'}`}>
                  {getCategoryIcon(habit.category)}
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-medium ${!canComplete ? 'text-gray-500' : 'text-gray-200'}`}
                  >
                    {habit.name}
                  </h3>
                  <div className="flex items-center text-xs mt-1">
                    <span className={`flex items-center ${!canComplete ? 'text-gray-500' : 'text-gray-400'}`}>
                      <Sword size={12} className="mr-1" />
                      Streak: {habit.streak} days
                    </span>
                  </div>
                  {!canComplete && (
                    <p className="text-xs text-red-400 mt-2">{status}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingHabit(habit)}
                    className="px-3 py-2 bg-purple-700 border-2 border-purple-600 text-purple-200 hover:bg-purple-600 transition-all font-bold"
                    title="Edit quest"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => toggleHabit(habit.id, e)}
                    disabled={!canComplete || completingHabitId === habit.id}
                    className={`px-4 py-2 flex items-center transition-all font-bold ${
                      !canComplete
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed border-2 border-gray-500 relative'
                        : completingHabitId === habit.id
                        ? 'bg-yellow-600 text-yellow-200 border-2 border-yellow-600'
                        : 'bg-yellow-700 text-yellow-200 hover:bg-yellow-600 hover:shadow-lg hover:shadow-yellow-600/50 border-2 border-yellow-600 active:scale-95'
                    }`}
                    title={!canComplete ? status : 'Complete this quest'}
                  >
                    {completingHabitId === habit.id ? (
                      <>
                        <div className="animate-spin mr-1">
                          <Check size={16} />
                        </div>
                        COMPLETING...
                      </>
                    ) : !canComplete ? (
                      <>
                        <span className="animate-pulse mr-1">⏱️</span>
                        ON COOLDOWN
                      </>
                    ) : (
                      <>
                        COMPLETE
                        <span className="ml-2 bg-yellow-800 px-2 py-0.5 text-xs font-bold">
                          +{habit.xp_reward} XP
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
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

        {celebrationModal.show && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
          >
            <div className="bg-gray-800 border-4 border-double border-yellow-600 p-8 max-w-md w-full text-center relative overflow-hidden">
              {/* Animated sparkles background */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-ping"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  >
                    <Sparkles size={20} className="text-yellow-400" />
                  </div>
                ))}
              </div>

              {/* Close button */}
              <button
                onClick={() => setCelebrationModal(prev => ({ ...prev, show: false }))}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>

              {/* Content */}
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-yellow-400 uppercase mb-3 tracking-wider">
                  Quest Complete!
                </h2>
                <p className="text-gray-200 text-lg font-semibold mb-2">
                  {celebrationModal.habitName}
                </p>
                <div className="text-4xl font-bold text-yellow-300 my-6">
                  +{celebrationModal.xp} XP
                </div>
                <p className="text-gray-400 text-sm uppercase tracking-widest">
                  Amazing work, hero!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {showCreation && (
        <HabitCreation
          onHabitCreated={() => {
            setShowCreation(false)
            loadHabits()
          }}
          onClose={() => setShowCreation(false)}
        />
      )}

      {editingHabit && (
        <HabitEditor
          habit={editingHabit}
          onHabitUpdated={() => {
            setEditingHabit(null)
            loadHabits()
          }}
          onClose={() => setEditingHabit(null)}
        />
      )}
    </>
  )
}