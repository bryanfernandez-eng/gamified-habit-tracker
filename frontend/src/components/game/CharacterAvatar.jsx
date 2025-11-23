import React, { useCallback, useEffect, useState } from 'react'
import {
  Brain,
  Heart,
  Palette,
  Shield,
  Users,
  Zap,
} from 'lucide-react'

import { gameApi } from '../../services/gameApi'
import { DailyCheckInTracker } from './DailyCheckInTracker'
import DefaultImg from '/src/assets/default.png'
import ZoroImg from '/src/assets/zoro.png'

export function CharacterAvatar({ refreshTrigger, userStats: externalStats }) {
  const [stats, setStats] = useState({
    level: 1,
    current_hp: 100,
    max_hp: 100,
    current_xp: 0,
    next_level_xp: 100,
    strength: 1,
    intelligence: 1,
    creativity: 1,
    social: 1,
    health: 1,
  })
  const [showLevelUpPopup, setShowLevelUpPopup] = useState(false)
  const [levelUpData, setLevelUpData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadStats = useCallback(async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) setLoading(true)
      setError(null)
      const data = await gameApi.getUserStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to load stats:', err)
      setError('Failed to load character stats')
    } finally {
      if (isInitialLoad) setLoading(false)
    }
  }, [])

  // Initialize stats on component mount only
  useEffect(() => {
    loadStats(true) // Initial load, show loading state
  }, [])

  // Update with external stats immediately (optimistic update)
  useEffect(() => {
    if (externalStats) {
      console.log('CharacterAvatar: Received externalStats, updating:', externalStats)
      console.log('CharacterAvatar: Previous stats:', stats)

      // Check if user leveled up (comparing to current stats level)
      if (externalStats.level && externalStats.level > stats.level) {
        setLevelUpData({
          newLevel: externalStats.level,
          oldLevel: stats.level,
          currentXp: externalStats.current_xp,
          nextLevelXp: externalStats.next_level_xp,
        })
        setShowLevelUpPopup(true)

        // Auto-hide popup after 4 seconds
        const timer = setTimeout(() => {
          setShowLevelUpPopup(false)
        }, 4000)

        // Update stats and cleanup timer
        setStats(externalStats)
        setError(null)
        return () => clearTimeout(timer)
      }

      setStats(externalStats)
      setError(null)
    }
  }, [externalStats])

  // Verify stats with server when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      loadStats(false) // Don't show loading, just update silently
    }
  }, [refreshTrigger])

  const xpPercentage = Math.min(100, (stats.current_xp / stats.next_level_xp) * 100)
  const hpPercentage = (stats.current_hp / stats.max_hp) * 100

  const getCharacterImage = () => {
    const characterMap = {
      'default': DefaultImg,
      'zoro': ZoroImg
    }
    return characterMap[stats.selected_character] || DefaultImg
  }

  const handleCheckInSuccess = (updatedStats) => {
    // Update stats with the returned data from check-in
    setStats(updatedStats)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center">
        <div className="bg-gray-800 border-4 border-double border-yellow-600 rounded-none p-4 w-full max-w-sm">
          <div className="text-center py-8 text-gray-400">
            <div className="animate-spin inline-block mb-2">
              <Zap size={24} className="text-yellow-400" />
            </div>
            <p>Loading character...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-800 border-4 border-double border-yellow-600 rounded-none p-4 w-full max-w-sm">
        <div className="text-center mb-4 bg-gray-700 p-2 border-2 border-gray-600">
          <h2 className="text-xl font-bold text-yellow-400 uppercase">
            Hero Level {stats.level}
          </h2>
          <p className="text-gray-300 text-sm">
            {stats.current_xp}/{stats.next_level_xp} XP to next level
          </p>
        </div>

        <div className="relative mb-6">
          {/* Character Avatar - Pixel Art Style */}
          <div className="h-64 w-full flex justify-center items-center border-4 border-gray-600 bg-gray-900">
            <img src={getCharacterImage()} alt="Character Avatar" className="h-full object-contain" />
          </div>

          {/* Health Bar */}
          <div className="mt-4">
            <div className="flex items-center mb-1">
              <Heart size={16} className="text-red-500 mr-2" />
              <span className="text-sm font-medium text-gray-300">HP</span>
              <span className="ml-auto text-sm text-gray-300">
                {stats.current_hp}/{stats.max_hp}
              </span>
            </div>
            <div className="w-full bg-gray-900 border-2 border-gray-600 h-4">
              <div
                className="bg-red-600 h-3 border-r-2 border-red-800 transition-all"
                style={{ width: `${hpPercentage}%` }}
              />
            </div>
          </div>

          {/* XP Bar */}
          <div className="mt-2">
            <div className="flex items-center mb-1">
              <Zap size={16} className="text-yellow-500 mr-2" />
              <span className="text-sm font-medium text-gray-300">EXP</span>
              <span className="ml-auto text-sm text-gray-300">
                {stats.current_xp}/{stats.next_level_xp}
              </span>
            </div>
            <div className="w-full bg-gray-900 border-2 border-gray-600 h-4">
              <div
                className="bg-yellow-600 h-3 border-r-2 border-yellow-800 transition-all"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm bg-gray-700 p-3 border-2 border-gray-600">
          <div className="flex items-center">
            <Shield size={16} className="text-red-500 mr-2" />
            <span className="text-gray-300">STR: {stats.strength}</span>
          </div>
          <div className="flex items-center">
            <Brain size={16} className="text-blue-500 mr-2" />
            <span className="text-gray-300">INT: {stats.intelligence}</span>
          </div>
          <div className="flex items-center">
            <Palette size={16} className="text-purple-500 mr-2" />
            <span className="text-gray-300">CRE: {stats.creativity}</span>
          </div>
          <div className="flex items-center">
            <Users size={16} className="text-green-500 mr-2" />
            <span className="text-gray-300">SOC: {stats.social}</span>
          </div>
        </div>

        {/* Health Attribute */}
        <div className="mt-3 text-sm bg-gray-700 p-3 border-2 border-gray-600 flex items-center">
          <Heart size={16} className="text-pink-500 mr-2" />
          <span className="text-gray-300">HEA: {stats.health}</span>
        </div>

        {error && (
          <div className="mt-3 text-xs text-red-300 bg-red-900 border-2 border-red-700 p-2">
            {error}
          </div>
        )}
      </div>

      {/* Daily Check-In Tracker */}
      <div className="w-full max-w-sm">
        <DailyCheckInTracker onCheckInSuccess={handleCheckInSuccess} />
      </div>

      {/* Level Up Popup */}
      {showLevelUpPopup && levelUpData && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="pointer-events-auto animate-bounce">
            <div className="bg-gradient-to-b from-yellow-400 to-yellow-600 border-4 border-yellow-200 p-8 shadow-2xl" style={{ boxShadow: '0 0 30px rgba(250, 204, 21, 0.8)' }}>
              <div className="text-center">
                <div className="text-6xl mb-4 animate-pulse">⭐</div>
                <h1 className="text-4xl font-black text-yellow-900 uppercase tracking-widest mb-2">
                  LEVEL UP!
                </h1>
                <p className="text-2xl font-bold text-yellow-800 mb-4">
                  Level {levelUpData.oldLevel} → {levelUpData.newLevel}
                </p>
                <div className="bg-yellow-500 text-yellow-900 px-4 py-2 border-2 border-yellow-700 mb-4 font-bold">
                  🎉 Congratulations, Hero! 🎉
                </div>
                <p className="text-yellow-800 text-sm mb-6">
                  Your power grows ever stronger!
                </p>
                <button
                  onClick={() => setShowLevelUpPopup(false)}
                  className="px-6 py-2 bg-yellow-700 border-2 border-yellow-600 text-yellow-100 font-bold uppercase hover:bg-yellow-600 transition-all"
                >
                  AWESOME! 🎊
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
