import React from 'react'
import {
  Shield,
  Heart,
  Zap,
  Brain,
  Users,
  Palette,
} from 'lucide-react'
 
import ZoroImg from '/src/assets/zoro.png'
export function CharacterAvatar() {
  // Stats for the character
  const stats = {
    level: 5,
    health: 80,
    xp: 75,
    strength: 12,
    intelligence: 15,
    creativity: 8,
    social: 10,
  }
  
  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-800 border-4 border-double border-yellow-600 rounded-none p-4 w-full max-w-sm">
        <div className="text-center mb-4 bg-gray-700 p-2 border-2 border-gray-600">
          <h2 className="text-xl font-bold text-yellow-400 uppercase">
            Hero Level {stats.level}
          </h2>
          <p className="text-gray-300">75/100 XP to next level</p>
        </div>
        
        <div className="relative mb-6">
          {/* Character Avatar - Pixel Art Style */}
          <div className="h-64 w-full flex justify-center items-center border-4 border-gray-600 bg-gray-900">
            <img src={ZoroImg} alt="Zoro Avatar" className="h-full object-contain" />
            {/* Replace with actual pixel art image when available */}
          </div>
          
          {/* Health Bar */}
          <div className="mt-4">
            <div className="flex items-center mb-1">
              <Heart size={16} className="text-red-500 mr-2" />
              <span className="text-sm font-medium text-gray-300">HP</span>
              <span className="ml-auto text-sm text-gray-300">
                {stats.health}/100
              </span>
            </div>
            <div className="w-full bg-gray-900 border-2 border-gray-600 h-4">
              <div
                className="bg-red-600 h-3 border-r-2 border-red-800"
                style={{ width: `${stats.health}%` }}
              ></div>
            </div>
          </div>
          
          {/* XP Bar */}
          <div className="mt-2">
            <div className="flex items-center mb-1">
              <Zap size={16} className="text-yellow-500 mr-2" />
              <span className="text-sm font-medium text-gray-300">EXP</span>
              <span className="ml-auto text-sm text-gray-300">
                {stats.xp}/100
              </span>
            </div>
            <div className="w-full bg-gray-900 border-2 border-gray-600 h-4">
              <div
                className="bg-yellow-600 h-3 border-r-2 border-yellow-800"
                style={{ width: `${stats.xp}%` }}
              ></div>
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
      </div>
    </div>
  )
}