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
import { getThemeBackground } from '../../utils/themeBackgrounds'
import DefaultImg from '/src/assets/default.png'
import ZoroImg from '/src/assets/zoro.png'
import PixelForestBg from '/src/assets/pixel-forest-bg.png'

export function CharacterAvatar({ refreshTrigger, userStats: externalStats, onStatsUpdate }) {
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
    id: null,
    selected_theme: 'Default Theme',
  })
  const [equippedWeapon, setEquippedWeapon] = useState(null)
  const [showLevelUpPopup, setShowLevelUpPopup] = useState(false)
  const [levelUpData, setLevelUpData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const loadStats = useCallback(async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) setLoading(true)
      setError(null)
      const data = await gameApi.getUserStats()
      setStats(data)

      // Load equipped weapon
      const equippedItems = await gameApi.getEquippedItems()
      const weapon = equippedItems.find(item => item.equipment_slot === 'weapon')
      setEquippedWeapon(weapon || null)
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
      // Skip level-up popup on initial load (only after first render)
      if (!isInitialLoad && externalStats.level && externalStats.level > stats.level) {
        setLevelUpData({
          newLevel: externalStats.level,
          oldLevel: stats.level,
          currentXp: externalStats.current_xp,
          nextLevelXp: externalStats.next_level_xp,
        })
        setShowLevelUpPopup(true)
        playLevelUpSound()

        // Auto-hide popup after 4 seconds
        const timer = setTimeout(() => {
          setShowLevelUpPopup(false)
        }, 4000)

        // Update stats and cleanup timer
        setStats(externalStats)
        setError(null)
        return () => clearTimeout(timer)
      }

      // Mark initial load as complete after first externalStats update
      if (isInitialLoad) {
        setIsInitialLoad(false)
      }

      setStats(externalStats)
      setError(null)
    }
  }, [externalStats, isInitialLoad, stats.level])

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

  const getBackgroundImage = () => {
    const themeBackground = getThemeBackground(stats.selected_theme)
    return themeBackground || PixelForestBg
  }

  // Play level up sound effect
  const playLevelUpSound = () => {
    // Create a simple retro level-up sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext)()
      const now = audioContext.currentTime

      // Create oscillator for the sound
      const osc = audioContext.createOscillator()
      const gain = audioContext.createGain()

      osc.connect(gain)
      gain.connect(audioContext.destination)

      // Set up the frequency sweep (low to high for "level up" effect)
      osc.frequency.setValueAtTime(400, now)
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1)
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.2)

      // Volume envelope
      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.05, now + 0.5)

      osc.start(now)
      osc.stop(now + 0.5)
    } catch {
      console.log('Audio not available')
    }
  }

  const handleCheckInSuccess = (updatedStats) => {
    // Update stats with the returned data from check-in
    // This will trigger the externalStats effect to check for level-ups
    if (updatedStats) {
      setStats(updatedStats)

      // Call parent callback to update navbar and other components
      onStatsUpdate?.(updatedStats)

      // Check if user leveled up from daily check-in
      if (updatedStats.level && updatedStats.level > stats.level) {
        setLevelUpData({
          newLevel: updatedStats.level,
          oldLevel: stats.level,
          currentXp: updatedStats.current_xp,
          nextLevelXp: updatedStats.next_level_xp,
        })
        setShowLevelUpPopup(true)
        playLevelUpSound()

        // Auto-hide popup after 4 seconds
        const timer = setTimeout(() => {
          setShowLevelUpPopup(false)
        }, 4000)

        return () => clearTimeout(timer)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center">
        <div className="rulebook-card p-4 w-full max-w-sm">
          <div className="text-center py-8 text-rulebook-ink/60">
            <div className="animate-spin inline-block mb-2">
              <Zap size={24} className="text-rulebook-crimson" />
            </div>
            <p className="font-serif">Loading character...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="rulebook-card p-4 w-full max-w-sm">
        <div className="text-center mb-4 bg-rulebook-ink/5 p-2 border-b-2 border-rulebook-ink/10">
          <h2 className="text-xl font-serif font-bold text-rulebook-ink uppercase tracking-widest">
            Hero Level {stats.level}
          </h2>
          <p className="text-rulebook-ink/60 text-xs font-mono uppercase tracking-wide">
            {stats.current_xp}/{stats.next_level_xp} XP to next level
          </p>
        </div>

        <div className="relative mb-6">
          {/* Character Avatar - Parchment Frame with Theme Background */}
          <div
            className="h-64 w-full flex justify-center items-center border-2 border-rulebook-charcoal p-2 relative bg-cover bg-center overflow-hidden"
            style={{ backgroundImage: `url(${getBackgroundImage()})` }}
          >
            {/* Overlay to blend background with parchment theme */}
            <div className="absolute inset-0 bg-rulebook-paper/20 backdrop-sepia-[.2]"></div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-rulebook-crimson z-10"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-rulebook-crimson z-10"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-rulebook-crimson z-10"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-rulebook-crimson z-10"></div>

            {/* Character with optional weapon overlay */}
            <div className="h-full w-full flex justify-center items-center relative z-10">
              <img src={getCharacterImage()} alt="Character Avatar" className="h-full object-contain filter drop-shadow-md absolute" />
              {equippedWeapon && equippedWeapon.sprite_path && equippedWeapon.name !== 'None' && (
                <img src={`/src/assets/${equippedWeapon.sprite_path}`} alt={equippedWeapon.name} className="h-full object-contain filter drop-shadow-md" />
              )}
            </div>
          </div>

          {/* Health Bar */}
          <div className="mt-4">
            <div className="flex items-center mb-1">
              <Heart size={14} className="text-[#A8896B] mr-2" />
              <span className="text-xs font-bold text-rulebook-ink/70 font-serif uppercase tracking-wide">HP</span>
              <span className="ml-auto text-xs font-mono font-bold text-rulebook-ink/70">
                {stats.current_hp}/{stats.max_hp}
              </span>
            </div>
            <div className="w-full bg-rulebook-ink/10 border border-rulebook-ink/20 h-3 rounded-sm overflow-hidden">
              <div
                className="bg-[#A8896B] h-full transition-all duration-500 ease-out"
                style={{ width: `${hpPercentage}%` }}
              />
            </div>
          </div>

          {/* XP Bar */}
          <div className="mt-2">
            <div className="flex items-center mb-1">
              <Zap size={14} className="text-rulebook-royal mr-2" />
              <span className="text-xs font-bold text-rulebook-ink/70 font-serif uppercase tracking-wide">EXP</span>
              <span className="ml-auto text-xs font-mono font-bold text-rulebook-ink/70">
                {stats.current_xp}/{stats.next_level_xp}
              </span>
            </div>
            <div className="w-full bg-rulebook-ink/10 border border-rulebook-ink/20 h-3 rounded-sm overflow-hidden">
              <div
                className="bg-rulebook-royal h-full transition-all duration-500 ease-out"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 text-xs bg-rulebook-ink/5 p-3 border border-rulebook-ink/10 rounded-sm">
          <div className="flex items-center">
            <Shield size={14} className="text-[#A0746F] mr-2" />
            <span className="text-rulebook-ink font-mono font-bold">STR: {stats.strength}</span>
          </div>
          <div className="flex items-center">
            <Brain size={14} className="text-[#6B8E9F] mr-2" />
            <span className="text-rulebook-ink font-mono font-bold">INT: {stats.intelligence}</span>
          </div>
          <div className="flex items-center">
            <Palette size={14} className="text-[#9B8FA5] mr-2" />
            <span className="text-rulebook-ink font-mono font-bold">CRE: {stats.creativity}</span>
          </div>
          <div className="flex items-center">
            <Users size={14} className="text-[#8B9F75] mr-2" />
            <span className="text-rulebook-ink font-mono font-bold">SOC: {stats.social}</span>
          </div>
        </div>

        {/* Health Attribute */}
        <div className="mt-3 text-xs bg-rulebook-ink/5 p-3 border border-rulebook-ink/10 rounded-sm flex items-center">
          <Heart size={14} className="text-[#A8896B] mr-2" />
          <span className="text-rulebook-ink font-mono font-bold">HEA: {stats.health}</span>
        </div>

        {error && (
          <div className="mt-3 text-xs text-rulebook-crimson bg-rulebook-crimson/10 border border-rulebook-crimson p-2 font-bold text-center">
            {error}
          </div>
        )}
      </div>

      {/* Daily Check-In Tracker */}
      <div className="w-full max-w-sm mt-6">
        <DailyCheckInTracker onCheckInSuccess={handleCheckInSuccess} />
      </div>

      {/* Level Up Popup */}
      {showLevelUpPopup && levelUpData && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none bg-rulebook-ink/20 backdrop-blur-sm">
          <div className="pointer-events-auto">
            <div className="rulebook-card p-8 shadow-2xl">
              <div className="text-center">
                <h1 className="text-4xl font-serif font-black text-rulebook-ink uppercase tracking-widest mb-2">
                  LEVEL UP!
                </h1>
                <p className="text-2xl font-serif font-bold text-rulebook-crimson mb-4">
                  Level {levelUpData.oldLevel} → {levelUpData.newLevel}
                </p>
                <div className="bg-rulebook-royal/10 text-rulebook-royal px-4 py-2 border-2 border-rulebook-royal mb-4 font-bold font-serif uppercase tracking-wider">
                  Congratulations, Hero!
                </div>
                <p className="text-rulebook-ink/70 text-sm mb-6 font-mono">
                  Your power grows ever stronger!
                </p>
                <button
                  onClick={() => setShowLevelUpPopup(false)}
                  className="px-6 py-2 bg-rulebook-crimson text-rulebook-paper border-2 border-rulebook-ink font-serif font-bold uppercase hover:bg-rulebook-ink transition-all shadow-md"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
