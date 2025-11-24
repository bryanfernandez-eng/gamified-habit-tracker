import React, { useState } from 'react'
import { Layout } from './Layout'
import { TabNavigation } from './TabNavigation'
import { CharacterAvatar } from './CharacterAvatar'
import { HabitTracker } from '../HabitTracker'
import { StatsDisplay } from '../StatsDisplay'
import { AchievementPanel } from '../AchievementPanel'
import { CharacterCustomizer } from '../CharacterCustomizer'

export function GameDashboard({ userStats, onStatsUpdate, updateTrigger }) {
  const [activeTab, setActiveTab] = useState('habits')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'habits':
        return <HabitTracker onHabitCompleted={onStatsUpdate} />
      case 'stats':
        return <StatsDisplay />
      case 'achievements':
        return <AchievementPanel />
      case 'customize':
        return <CharacterCustomizer onCharacterChanged={onStatsUpdate} userStats={userStats} />
      default:
        return <HabitTracker onHabitCompleted={onStatsUpdate} />
    }
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Character */}
        <div className="lg:col-span-1">
          <CharacterAvatar refreshTrigger={updateTrigger} userStats={userStats} onStatsUpdate={onStatsUpdate} />
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="mt-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </Layout>
  )
}