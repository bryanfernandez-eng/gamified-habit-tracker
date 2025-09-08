import React from 'react'
import {
  CheckSquare,
  BarChart,
  Trophy,
  Shirt,
} from 'lucide-react'

export function TabNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    {
      id: 'habits',
      label: 'Quests',
      icon: <CheckSquare size={18} />,
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
    <div className="flex overflow-x-auto bg-gray-800 border-4 border-gray-700">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex items-center px-6 py-3 font-medium text-sm whitespace-nowrap uppercase ${
            activeTab === tab.id 
              ? 'bg-yellow-700 text-yellow-300 border-t-4 border-yellow-500' 
              : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="mr-2">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  )
}