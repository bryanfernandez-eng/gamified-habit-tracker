import React, { useState, useEffect } from 'react'
import { X, Dumbbell, BookOpen, Brush, Users, Heart, Plus } from 'lucide-react'
import { gameApi } from '../services/gameApi'

// Predefined quests templates
const PREDEFINED_QUESTS = [
  // Strength
  { name: 'Hit the Gym', description: 'Complete a workout session', category: 'strength', xp_reward: 50, frequency: 'daily' },
  { name: 'Morning Pushups', description: 'Do 20 pushups in the morning', category: 'strength', xp_reward: 30, frequency: 'daily' },
  { name: 'Evening Run', description: 'Go for an evening run', category: 'strength', xp_reward: 60, frequency: 'daily' },

  // Intelligence
  { name: 'Read a Book', description: 'Read at least 20 pages', category: 'intelligence', xp_reward: 50, frequency: 'daily' },
  { name: 'Learn New Skill', description: 'Spend time learning a new skill', category: 'intelligence', xp_reward: 75, frequency: 'daily' },
  { name: 'Study Session', description: 'Study for at least 1 hour', category: 'intelligence', xp_reward: 40, frequency: 'daily' },

  // Creativity
  { name: 'Creative Writing', description: 'Write or journal for 15 minutes', category: 'creativity', xp_reward: 40, frequency: 'daily' },
  { name: 'Draw or Sketch', description: 'Create an artwork', category: 'creativity', xp_reward: 50, frequency: 'daily' },
  { name: 'Music Practice', description: 'Practice your instrument', category: 'creativity', xp_reward: 55, frequency: 'daily' },

  // Social
  { name: 'Call a Friend', description: 'Call or video chat with someone', category: 'social', xp_reward: 40, frequency: 'daily' },
  { name: 'Social Hangout', description: 'Spend time with friends', category: 'social', xp_reward: 50, frequency: 'daily' },
  { name: 'Community Service', description: 'Help someone in need', category: 'social', xp_reward: 60, frequency: 'daily' },

  // Health
  { name: 'Drink Water', description: 'Drink 8 glasses of water', category: 'health', xp_reward: 20, frequency: 'daily' },
  { name: 'Sleep 8 Hours', description: 'Get a full night of sleep', category: 'health', xp_reward: 30, frequency: 'daily' },
  { name: 'Healthy Meal', description: 'Eat a nutritious meal', category: 'health', xp_reward: 25, frequency: 'daily' },
  { name: 'Meditation', description: 'Meditate for 10 minutes', category: 'health', xp_reward: 35, frequency: 'daily' },
]

const getCategoryIcon = (category) => {
  const iconProps = { size: 16, className: 'mr-1' }
  switch (category) {
    case 'strength':
      return <Dumbbell {...iconProps} className="text-red-400 mr-1" />
    case 'intelligence':
      return <BookOpen {...iconProps} className="text-blue-400 mr-1" />
    case 'creativity':
      return <Brush {...iconProps} className="text-purple-400 mr-1" />
    case 'social':
      return <Users {...iconProps} className="text-green-400 mr-1" />
    case 'health':
      return <Heart {...iconProps} className="text-pink-400 mr-1" />
    default:
      return <Dumbbell {...iconProps} />
  }
}

const getCategoryColor = (category) => {
  switch (category) {
    case 'strength':
      return 'bg-red-900/20 border-red-700/50'
    case 'intelligence':
      return 'bg-blue-900/20 border-blue-700/50'
    case 'creativity':
      return 'bg-purple-900/20 border-purple-700/50'
    case 'social':
      return 'bg-green-900/20 border-green-700/50'
    case 'health':
      return 'bg-pink-900/20 border-pink-700/50'
    default:
      return 'bg-gray-900/20 border-gray-700/50'
  }
}

export function ImportQuests({ onQuestsImported, onClose }) {
  const [selectedQuests, setSelectedQuests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [questLimit, setQuestLimit] = useState(null)

  const categories = ['all', 'strength', 'intelligence', 'creativity', 'social', 'health']

  // Load quest limit when modal opens
  useEffect(() => {
    const loadLimit = async () => {
      try {
        const limitData = await gameApi.checkQuestLimit()
        setQuestLimit(limitData)
      } catch (err) {
        console.error('Failed to load quest limit:', err)
      }
    }
    loadLimit()
  }, [])

  const filteredQuests = selectedCategory === 'all'
    ? PREDEFINED_QUESTS
    : PREDEFINED_QUESTS.filter(q => q.category === selectedCategory)

  const canImportMore = questLimit ? questLimit.quests_remaining > 0 : true

  const toggleQuest = (questName) => {
    setSelectedQuests(prev =>
      prev.includes(questName)
        ? prev.filter(q => q !== questName)
        : [...prev, questName]
    )
  }

  const selectAll = () => {
    if (selectedQuests.length === filteredQuests.length) {
      setSelectedQuests([])
    } else {
      setSelectedQuests(filteredQuests.map(q => q.name))
    }
  }

  const handleImport = async () => {
    if (selectedQuests.length === 0) {
      setError('Please select at least one quest to import')
      return
    }

    // Check quest limit
    if (questLimit && selectedQuests.length > questLimit.quests_remaining) {
      setError(
        `You can only import ${questLimit.quests_remaining} more quest(s). ` +
        `You have ${questLimit.current_quests}/${questLimit.max_quests} quests. ` +
        `Reach level ${questLimit.next_level_milestone} to create more.`
      )
      return
    }

    try {
      setLoading(true)
      setError('')

      const questsToImport = PREDEFINED_QUESTS.filter(q => selectedQuests.includes(q.name))

      // Import each quest
      await Promise.all(
        questsToImport.map(quest => gameApi.createHabit(quest))
      )

      onQuestsImported()
      setSelectedQuests([])
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to import quests')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #a855f7, #7c3aed);
          border-radius: 4px;
          border: 2px solid rgba(0, 0, 0, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #9333ea, #6d28d9);
        }
        .custom-scrollbar {
          scrollbar-color: #a855f7 rgba(0, 0, 0, 0.2);
          scrollbar-width: thin;
        }
      `}</style>
      <div className="bg-gray-900 border-4 border-purple-600 max-w-2xl w-full mx-4 p-6 my-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-purple-400 uppercase">Import Quests</h2>
            {questLimit && (
              <p className="text-xs text-gray-400 mt-1">
                {questLimit.quests_remaining} slot{questLimit.quests_remaining !== 1 ? 's' : ''} available
                {questLimit.max_quests < 999 && (
                  <span className="ml-2">
                    • Reach Level {questLimit.next_level_milestone} for more
                  </span>
                )}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border-2 border-red-600 text-red-300 rounded">
            {error}
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-6">
          <p className="text-sm font-bold text-gray-400 uppercase mb-3">Filter by Category</p>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 text-xs font-bold uppercase border-2 transition-all ${
                  selectedCategory === cat
                    ? 'bg-purple-700 border-purple-600 text-purple-200'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Quests List with Custom Scrollbar */}
        <div className="max-h-96 overflow-y-auto mb-6 custom-scrollbar">
          <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-gray-700 pr-2">
            <p className="text-sm font-bold text-gray-300">
              {selectedQuests.length} / {filteredQuests.length} selected
            </p>
            <button
              onClick={selectAll}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 uppercase"
            >
              {selectedQuests.length === filteredQuests.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="space-y-2 pr-2">
            {filteredQuests.map((quest) => (
              <label
                key={quest.name}
                className={`flex items-start p-3 border-2 cursor-pointer transition-all ${
                  getCategoryColor(quest.category)
                } ${selectedQuests.includes(quest.name) ? 'border-purple-500 bg-purple-900/20' : 'border-gray-700'}`}
              >
                <input
                  type="checkbox"
                  checked={selectedQuests.includes(quest.name)}
                  onChange={() => toggleQuest(quest.name)}
                  className="mt-1 mr-3 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center">
                    {getCategoryIcon(quest.category)}
                    <span className="font-bold text-gray-200">{quest.name}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{quest.description}</p>
                  <div className="flex gap-3 mt-2 text-xs text-gray-500">
                    <span>XP: {quest.xp_reward}</span>
                    <span>Frequency: {quest.frequency}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-700 border-2 border-gray-600 text-gray-200 hover:bg-gray-600 font-bold uppercase transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={
              loading ||
              selectedQuests.length === 0 ||
              (questLimit && selectedQuests.length > questLimit.quests_remaining)
            }
            title={
              questLimit && selectedQuests.length > questLimit.quests_remaining
                ? `You can only import ${questLimit.quests_remaining} quest(s)`
                : ''
            }
            className={`flex-1 px-4 py-3 font-bold uppercase border-2 transition-all flex items-center justify-center gap-2 ${
              loading ||
              selectedQuests.length === 0 ||
              (questLimit && selectedQuests.length > questLimit.quests_remaining)
                ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                : 'bg-purple-700 border-purple-600 text-purple-200 hover:bg-purple-600'
            }`}
          >
            <Plus size={16} />
            {loading ? 'Importing...' : `Import (${selectedQuests.length})`}
          </button>
        </div>
      </div>
    </div>
  )
}
