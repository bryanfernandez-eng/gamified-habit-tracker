import React, { useState } from 'react'
import { Layout } from './Layout'
import { TabNavigation } from './TabNavigation'
import { CharacterAvatar } from './CharacterAvatar'
import { HabitTracker } from '../HabitTracker'
import { StatsDisplay } from '../StatsDisplay'
import { AchievementPanel } from '../AchievementPanel'
import { CharacterCustomizer } from '../CharacterCustomizer'
import { Shield, Brain, Palette, Users, Heart } from 'lucide-react'

export function GameDashboard() {
  const [activeTab, setActiveTab] = useState('dailyQuests')

  // Daily quests: one per category
  const dailyQuests = {
    strength: "Morning Workout",
    intelligence: "Read for 30 minutes",
    creativity: "Practice drawing",
    social: "Call a friend",
    health: "Drink water",
  }

  const questMeta = {
    strength: { icon: <Shield size={16} />, color: "text-red-500", bgColor: "bg-red-900", borderColor: "border-red-700" },
    intelligence: { icon: <Brain size={16} />, color: "text-blue-500", bgColor: "bg-blue-900", borderColor: "border-blue-700" },
    creativity: { icon: <Palette size={16} />, color: "text-purple-500", bgColor: "bg-purple-900", borderColor: "border-purple-700" },
    social: { icon: <Users size={16} />, color: "text-green-500", bgColor: "bg-green-900", borderColor: "border-green-700" },
    health: { icon: <Heart size={16} />, color: "text-pink-500", bgColor: "bg-pink-900", borderColor: "border-pink-700" },
  }

  const QuestCard = ({ name, icon, color, bgColor, borderColor, quest }) => (
    <div className={`${bgColor} border-4 border-double ${borderColor} p-4`}>
      <div className="flex items-center">
        <div className={`p-2 ${color} border-2 border-gray-700 mr-3`}>{icon}</div>
        <div>
          <h3 className="font-bold text-gray-200 uppercase">{name}</h3>
          <p className="text-sm text-gray-400">Today's quest: {quest}</p>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'habits':
        return <HabitTracker />
      case 'stats':
        return <StatsDisplay />
      case 'achievements':
        return <AchievementPanel />
      case 'customize':
        return <CharacterCustomizer />
      case 'dailyQuests':
        return (
          <div className="bg-gray-800 border-4 border-double border-gray-700 p-4">
            <h2 className="text-2xl font-bold text-yellow-400 uppercase mb-4 border-b-2 border-gray-700 pb-2">
              Daily Quests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(dailyQuests).map(([key, quest]) => (
                <QuestCard
                  key={key}
                  name={key.charAt(0).toUpperCase() + key.slice(1)}
                  quest={quest}
                  {...questMeta[key]}
                />
              ))}
            </div>
          </div>
        )
      default:
        return <HabitTracker />
    }
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Character */}
        <div className="lg:col-span-1">
          <CharacterAvatar />
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="mt-6">{renderTabContent()}</div>
        </div>
      </div>
    </Layout>
  )
}
