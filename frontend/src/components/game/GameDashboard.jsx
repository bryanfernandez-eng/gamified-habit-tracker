import React, { useState } from 'react'
import { Layout } from './Layout'
import { TabNavigation } from './TabNavigation'
import { CharacterAvatar } from './CharacterAvatar'
import { HabitTracker } from '../HabitTracker'
import { StatsDisplay } from '../StatsDisplay'
import { AchievementPanel } from '../AchievementPanel'
import { CharacterCustomizer } from '../CharacterCustomizer'

export function GameDashboard() {
  const [activeTab, setActiveTab] = useState('habits')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleHabitCompleted = () => {
    // Trigger CharacterAvatar refresh
    setRefreshTrigger(prev => prev + 1)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'habits':
        return <HabitTracker onHabitCompleted={handleHabitCompleted} />
      case 'stats':
        return <StatsDisplay />
      case 'achievements':
        return <AchievementPanel />
      case 'customize':
        return <CharacterCustomizer />
      default:
        return <HabitTracker onHabitCompleted={handleHabitCompleted} />
    }
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Character */}
        <div className="lg:col-span-1">
          <CharacterAvatar refreshTrigger={refreshTrigger} />
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