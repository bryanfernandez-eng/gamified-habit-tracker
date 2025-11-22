import React, { useState, useEffect } from 'react'
import {
  Shield,
  Heart,
  Zap,
  Brain,
  Users,
  Palette,
} from 'lucide-react'
import { gameApi } from '../../services/gameApi'
import ZoroImg from '/src/assets/zoro.png'

export function CharacterAvatar({ refreshTrigger }) {
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadStats()
  }, [refreshTrigger])

  const loadStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await gameApi.getUserStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to load stats:', err)
      setError('Failed to load character stats')
    } finally {
      setLoading(false)
    }
  }

  const xpPercentage = Math.min(100, (stats.current_xp / stats.next_level_xp) * 100)
  const hpPercentage = (stats.current_hp / stats.max_hp) * 100

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
            <img src={ZoroImg} alt="Zoro Avatar" className="h-full object-contain" />
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
    </div>
  )
}
