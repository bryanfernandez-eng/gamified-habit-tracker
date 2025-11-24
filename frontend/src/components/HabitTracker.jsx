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
  Download,
} from 'lucide-react'
import { gameApi } from '../services/gameApi'
import { HabitCreation } from './HabitCreation'
import { HabitEditor } from './HabitEditor'
import { ImportQuests } from './ImportQuests'

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
  const [showImport, setShowImport] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null)
  const [celebrationModal, setCelebrationModal] = useState({ show: false, xp: 0, habitName: '' })
  const [completingHabitId, setCompletingHabitId] = useState(null)
  const [questLimit, setQuestLimit] = useState(null)

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

      // Load quest limit info
      const limitData = await gameApi.checkQuestLimit()
      setQuestLimit(limitData)
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
        return <Dumbbell size={18} className="text-rulebook-crimson" />
      case 'intelligence':
        return <BookOpen size={18} className="text-rulebook-royal" />
      case 'creativity':
        return <Brush size={18} className="text-purple-700" />
      case 'social':
        return <Users size={18} className="text-rulebook-forest" />
      default:
        return <Sword size={18} className="text-rulebook-ink" />
    }
  }, [])

  const getCategoryBorderColor = useCallback((category) => {
    switch (category) {
      case 'strength':
        return 'border-rulebook-crimson'
      case 'intelligence':
        return 'border-rulebook-royal'
      case 'creativity':
        return 'border-purple-700'
      case 'social':
        return 'border-rulebook-forest'
      default:
        return 'border-rulebook-ink'
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
            status: 'Already completed today.'
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
          return {
            canComplete: false,
            timeRemaining: null,
            status: 'Already completed today.'
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
      console.log('HabitTracker: Full API response:', result)
      console.log('HabitTracker: user_stats from response:', result.user_stats)

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
      if (event.currentTarget) {
        const rect = event.currentTarget.getBoundingClientRect()
        setShowXpPopup({
          show: true,
          xp: result.xp_earned,
          position: {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
          },
        })
      } else {
        // Fallback if event.currentTarget is not available
        setShowXpPopup({
          show: true,
          xp: result.xp_earned,
          position: {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
          },
        })
      }

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

      // Trigger character avatar refresh with stats from server response
      // The server response already contains updated user stats, so no need to refetch habits
      if (onHabitCompleted && result.user_stats) {
        console.log('HabitTracker: Calling onHabitCompleted with stats:', result.user_stats)
        onHabitCompleted(result.user_stats)
      } else {
        console.log('HabitTracker: Missing onHabitCompleted or user_stats', {
          hasCallback: !!onHabitCompleted,
          hasStats: !!result.user_stats
        })
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
      // Reload habits if there was an error
      loadHabits()
    } finally {
      setCompletingHabitId(null)
    }
  }, [habits, onHabitCompleted, loadHabits, getCanCompleteAndCooldown])

  if (loading) {
    return <div className="text-center py-8 font-serif text-rulebook-ink">Loading quests...</div>
  }

  return (
    <>
      <div className="rulebook-card p-6">
        <div className="flex justify-between items-center mb-6 border-b-2 border-rulebook-ink/20 pb-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-rulebook-ink uppercase tracking-wider">
              Daily Quests
            </h2>
            {questLimit && (
              <p className="text-xs text-rulebook-ink/60 mt-1 font-mono">
                {questLimit.current_quests}/{questLimit.max_quests} Quests
                {questLimit.max_quests < 999 && (
                  <span className="ml-2">
                    • Reach Level {questLimit.next_level_milestone} for more
                  </span>
                )}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowImport(true)}
              disabled={questLimit && !questLimit.can_create}
              className={`flex items-center px-4 py-2 border-2 font-bold uppercase text-xs tracking-wider transition-all font-serif ${questLimit && !questLimit.can_create
                ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                : 'bg-transparent border-rulebook-ink text-rulebook-ink hover:bg-rulebook-ink hover:text-rulebook-paper'
                }`}
              title={
                questLimit && !questLimit.can_create
                  ? `Quest limit reached (${questLimit.current_quests}/${questLimit.max_quests})`
                  : 'Import predefined quests'
              }
            >
              <Download size={16} className="mr-2" />
              Import Quests
            </button>
            <button
              onClick={() => setShowCreation(true)}
              disabled={questLimit && !questLimit.can_create}
              className={`flex items-center px-4 py-2 border-2 font-bold uppercase text-xs tracking-wider transition-all font-serif ${questLimit && !questLimit.can_create
                ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                : 'bg-rulebook-crimson border-rulebook-crimson text-rulebook-paper hover:bg-rulebook-ink hover:border-rulebook-ink'
                }`}
              title={
                questLimit && !questLimit.can_create
                  ? `Quest limit reached (${questLimit.current_quests}/${questLimit.max_quests}). Reach level ${questLimit.next_level_milestone} for more.`
                  : 'Create a new quest'
              }
            >
              <Plus size={16} className="mr-2" />
              New Quest
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {habits.map((habit) => {
            const { canComplete, status } = getCanCompleteAndCooldown(habit)
            return (
              <div
                key={habit.id}
                className={`border-2 transition-all p-1 ${!canComplete
                  ? 'bg-rulebook-ink/5 border-rulebook-ink/20 opacity-75'
                  : `bg-rulebook-paper ${getCategoryBorderColor(habit.category)} hover:shadow-md`
                  }`}
              >
                <div className="flex items-center p-3 border border-rulebook-ink/10 h-full">
                  <div className={`mr-4 p-2 border-2 rounded-sm ${!canComplete
                    ? 'border-rulebook-ink/20 text-rulebook-ink/40'
                    : `${getCategoryBorderColor(habit.category)} bg-rulebook-paper`
                    }`}>
                    {getCategoryIcon(habit.category)}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-serif font-bold text-lg ${!canComplete ? 'text-rulebook-ink/50 line-through decoration-2' : 'text-rulebook-ink'}`}
                    >
                      {habit.name}
                    </h3>
                    <div className="flex items-center text-xs mt-1 font-mono">
                      <span className={`flex items-center ${!canComplete ? 'text-rulebook-ink/40' : 'text-rulebook-ink/70'}`}>
                        <Sword size={12} className="mr-1" />
                        Streak: {habit.streak} days
                      </span>
                    </div>
                    {!canComplete && (
                      <p className="text-xs text-rulebook-crimson mt-1 font-bold italic">{status}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingHabit(habit)}
                      className="px-3 py-2 text-rulebook-ink/60 hover:text-rulebook-ink transition-all"
                      title="Edit quest"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => toggleHabit(habit.id, e)}
                      disabled={!canComplete || completingHabitId === habit.id}
                      className={`px-4 py-2 flex items-center transition-all font-bold uppercase text-xs tracking-wider border-2 font-serif ${!canComplete
                        ? 'bg-transparent border-rulebook-ink/20 text-rulebook-ink/40 cursor-not-allowed'
                        : completingHabitId === habit.id
                          ? 'bg-rulebook-ink text-rulebook-paper border-rulebook-ink'
                          : 'bg-transparent border-rulebook-ink text-rulebook-ink hover:bg-rulebook-ink hover:text-rulebook-paper'
                        }`}
                      title={!canComplete ? status : 'Complete this quest'}
                    >
                      {completingHabitId === habit.id ? (
                        <>
                          <div className="animate-spin mr-2">
                            <Check size={14} />
                          </div>
                          Signing...
                        </>
                      ) : !canComplete ? (
                        <>
                          <span className="mr-2">✓</span>
                          Done
                        </>
                      ) : (
                        <>
                          Complete
                          <span className="ml-2 bg-rulebook-ink/10 px-1.5 py-0.5 text-[10px] rounded-sm">
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
            <div className="bg-rulebook-paper text-rulebook-ink font-bold px-3 py-1 text-sm border-2 border-rulebook-ink shadow-lg font-serif">
              +{showXpPopup.xp} XP
            </div>
          </div>
        )}
      </div>

      {/* Celebration Modal - Rendered outside card to avoid positioning context issues */}
      {celebrationModal.show && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-rulebook-ink/80 backdrop-blur-sm transition-opacity duration-300 pointer-events-none"
        >
          <div className="rulebook-card p-8 max-w-md w-full text-center relative overflow-hidden bg-rulebook-paper transform transition-all duration-300 scale-100 pointer-events-auto">
            {/* Subtle corner decorations instead of flickering sparkles */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-rulebook-crimson/20 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-rulebook-crimson/20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-rulebook-crimson/20 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-rulebook-crimson/20 pointer-events-none"></div>

            {/* Subtle glow animation - no flicker */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-rulebook-crimson rounded-full blur-3xl animate-pulse"></div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setCelebrationModal(prev => ({ ...prev, show: false }))}
              className="absolute top-3 right-3 text-rulebook-ink/40 hover:text-rulebook-crimson transition-colors z-20"
            >
              <X size={24} />
            </button>

            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-3xl font-serif font-bold text-rulebook-ink uppercase mb-3 tracking-wider">
                Quest Complete!
              </h2>
              <p className="text-rulebook-ink/80 text-lg font-serif italic mb-2">
                {celebrationModal.habitName}
              </p>
              <div className="text-5xl font-serif font-bold text-rulebook-crimson my-8 border-y-2 border-rulebook-ink/10 py-4">
                +{celebrationModal.xp} XP
              </div>
              <p className="text-rulebook-ink/60 text-sm uppercase tracking-widest font-serif">
                Well done, adventurer!
              </p>
            </div>
          </div>
        </div>
      )}

      {showCreation && (
        <HabitCreation
          onHabitCreated={() => {
            setShowCreation(false)
            loadHabits()
          }}
          onClose={() => setShowCreation(false)}
        />
      )}

      {showImport && (
        <ImportQuests
          onQuestsImported={() => {
            setShowImport(false)
            loadHabits()
          }}
          onClose={() => setShowImport(false)}
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