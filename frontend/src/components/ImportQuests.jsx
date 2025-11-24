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
      return <Dumbbell {...iconProps} className="text-rulebook-crimson mr-1" />
    case 'intelligence':
      return <BookOpen {...iconProps} className="text-rulebook-royal mr-1" />
    case 'creativity':
      return <Brush {...iconProps} className="text-rulebook-ink mr-1" />
    case 'social':
      return <Users {...iconProps} className="text-rulebook-forest mr-1" />
    case 'health':
      return <Heart {...iconProps} className="text-rulebook-crimson mr-1" />
    default:
      return <Dumbbell {...iconProps} />
  }
}

const getCategoryColor = (category) => {
  switch (category) {
    case 'strength':
      return 'bg-rulebook-crimson/10 border-rulebook-crimson/30'
    case 'intelligence':
      return 'bg-rulebook-royal/10 border-rulebook-royal/30'
    case 'creativity':
      return 'bg-rulebook-ink/10 border-rulebook-ink/30'
    case 'social':
      return 'bg-rulebook-forest/10 border-rulebook-forest/30'
    case 'health':
      return 'bg-rulebook-crimson/10 border-rulebook-crimson/30'
    default:
      return 'bg-rulebook-ink/5 border-rulebook-ink/20'
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
      className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto bg-rulebook-ink/40 backdrop-blur-sm"
    >
      <style>{`
        .quest-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .quest-scrollbar::-webkit-scrollbar-track {
          background: rgba(43, 43, 43, 0.1);
          border-radius: 3px;
        }
        .quest-scrollbar::-webkit-scrollbar-thumb {
          background: #8B0000;
          border-radius: 3px;
        }
        .quest-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #B22222;
        }
        .quest-scrollbar {
          scrollbar-color: #8B0000 rgba(43, 43, 43, 0.1);
          scrollbar-width: thin;
        }
      `}</style>
      <div className="rulebook-card max-w-2xl w-full mx-4 p-6 my-8">
        <div className="flex justify-between items-center mb-6 border-b-2 border-rulebook-ink/20 pb-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-rulebook-ink uppercase tracking-widest">Import Quests</h2>
            {questLimit && (
              <p className="text-xs text-rulebook-ink/60 mt-1 font-mono">
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

        {/* Category Filter */}
        <div className="mb-6">
          <p className="text-sm font-serif font-bold text-rulebook-ink/80 uppercase mb-3 tracking-wide">Filter by Category</p>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 text-xs font-serif font-bold uppercase tracking-wider border-2 transition-all rounded-sm ${selectedCategory === cat
                    ? 'bg-rulebook-crimson border-rulebook-crimson text-rulebook-paper'
                    : 'bg-rulebook-ink/5 border-rulebook-ink/20 text-rulebook-ink hover:border-rulebook-ink/40'
                  }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Quests List with Custom Scrollbar */}
        <div className="max-h-96 overflow-y-auto mb-6 quest-scrollbar">
          <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-rulebook-ink/20 pr-2">
            <p className="text-sm font-mono font-bold text-rulebook-ink">
              {selectedQuests.length} / {filteredQuests.length} selected
            </p>
            <button
              onClick={selectAll}
              className="text-xs font-serif font-bold text-rulebook-crimson hover:text-rulebook-royal uppercase transition-colors"
            >
              {selectedQuests.length === filteredQuests.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="space-y-2 pr-2">
            {filteredQuests.map((quest) => (
              <label
                key={quest.name}
                className={`flex items-start p-3 border-2 cursor-pointer transition-all rounded-sm ${getCategoryColor(quest.category)
                  } ${selectedQuests.includes(quest.name) ? 'border-rulebook-crimson bg-rulebook-crimson/10' : 'border-rulebook-ink/20'}`}
              >
                <input
                  type="checkbox"
                  checked={selectedQuests.includes(quest.name)}
                  onChange={() => toggleQuest(quest.name)}
                  className="mt-1 mr-3 cursor-pointer accent-rulebook-crimson"
                />
                <div className="flex-1">
                  <div className="flex items-center">
                    {getCategoryIcon(quest.category)}
                    <span className="font-serif font-bold text-rulebook-ink">{quest.name}</span>
                  </div>
                  <p className="text-xs text-rulebook-ink/60 mt-1 font-mono">{quest.description}</p>
                  <div className="flex gap-3 mt-2 text-xs text-rulebook-ink/50 font-mono">
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
            className="flex-1 px-4 py-3 bg-rulebook-ink/10 border-2 border-rulebook-ink/20 text-rulebook-ink hover:bg-rulebook-ink/20 font-serif font-bold uppercase tracking-wider transition-all rounded-sm"
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
            className={`flex-1 px-4 py-3 font-serif font-bold uppercase tracking-wider border-2 transition-all flex items-center justify-center gap-2 shadow-sm rounded-sm ${loading ||
                selectedQuests.length === 0 ||
                (questLimit && selectedQuests.length > questLimit.quests_remaining)
                ? 'bg-rulebook-ink/20 border-rulebook-ink/20 text-rulebook-ink/40 cursor-not-allowed'
                : 'bg-rulebook-crimson border-rulebook-ink text-rulebook-paper hover:bg-rulebook-ink hover:border-rulebook-crimson'
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
