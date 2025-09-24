import React from 'react'
import { CheckSquare, BarChart, Trophy, Shirt, CalendarDays } from 'lucide-react'

export function TabNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    {
      id: 'dailyQuests',
      label: 'Daily Quests',
      icon: <CalendarDays size={18} />,
    },
    {
      id: 'stats',
      label: 'Stats',
      icon: <BarChart size={18} />,
    },
    {
      id: 'achievements',
      label: 'Trophies',
      icon: <Trophy size={18} />,
    },
    {
      id: 'customize',
      label: 'Equipment',
      icon: <Shirt size={18} />,
    },    
  ]

  return (
    <div className="flex space-x-4 border-b border-gray-700">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            activeTab === tab.id
              ? 'bg-gray-700 text-yellow-400'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <span className="mr-2">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  )
}
