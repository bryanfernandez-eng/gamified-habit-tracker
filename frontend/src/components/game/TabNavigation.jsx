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
    <div className="flex overflow-x-auto bg-rulebook-paper border-b-4 border-double border-rulebook-charcoal mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex items-center px-6 py-3 font-serif font-bold text-sm whitespace-nowrap uppercase tracking-wider transition-colors ${activeTab === tab.id
              ? 'text-rulebook-crimson border-b-4 border-rulebook-crimson bg-rulebook-ink/5'
              : 'text-rulebook-ink/60 hover:text-rulebook-ink hover:bg-rulebook-ink/5'
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