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
          <div className="mt-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </Layout>
  )
}