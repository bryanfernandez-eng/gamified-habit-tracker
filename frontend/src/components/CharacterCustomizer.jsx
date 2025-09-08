import React, { useState } from 'react'
import { Shield, Shirt, Palette } from 'lucide-react'

export function CharacterCustomizer() {
  const [activeCategory, setActiveCategory] = useState('outfits')
  
  const categories = [
    {
      id: 'outfits',
      label: 'Outfits',
      icon: <Shirt size={18} />,
    },
    {
      id: 'accessories',
      label: 'Accessories',
      icon: <Shield size={18} />,
    },
    {
      id: 'colors',
      label: 'Colors',
      icon: <Palette size={18} />,
    },
  ]
  
  const items = {
    outfits: [
      {
        id: 1,
        name: 'Casual Outfit',
        unlocked: true,
        stats: '+1 Social',
      },
      {
        id: 2,
        name: 'Gym Champion',
        unlocked: true,
        stats: '+2 Strength',
      },
      {
        id: 3,
        name: "Scholar's Robe",
        unlocked: true,
        stats: '+2 Intelligence',
      },
      {
        id: 4,
        name: "Artist's Smock",
        unlocked: false,
        stats: '+2 Creativity',
        requirement: 'Reach Creativity Level 10',
      },
      {
        id: 5,
        name: 'Party Attire',
        unlocked: false,
        stats: '+3 Social',
        requirement: "Complete 'Social Butterfly' achievement",
      },
    ],
    accessories: [
      {
        id: 1,
        name: 'Reading Glasses',
        unlocked: true,
        stats: '+1 Intelligence',
      },
      {
        id: 2,
        name: 'Headband',
        unlocked: true,
        stats: '+1 Strength',
      },
      {
        id: 3,
        name: "Artist's Beret",
        unlocked: false,
        stats: '+2 Creativity',
        requirement: "Complete 'Creative Genius' achievement",
      },
      {
        id: 4,
        name: 'Party Hat',
        unlocked: false,
        stats: '+1 Social',
        requirement: 'Attend 5 social events',
      },
      {
        id: 5,
        name: 'Champion Medal',
        unlocked: false,
        stats: '+2 All Stats',
        requirement: 'Reach Level 10 in all stats',
      },
    ],
    colors: [
      {
        id: 1,
        name: 'Default',
        unlocked: true,
        stats: '',
      },
      {
        id: 2,
        name: 'Blue Theme',
        unlocked: true,
        stats: '',
      },
      {
        id: 3,
        name: 'Red Theme',
        unlocked: true,
        stats: '',
      },
      {
        id: 4,
        name: 'Purple Theme',
        unlocked: false,
        stats: '',
        requirement: 'Reach Level 15',
      },
      {
        id: 5,
        name: 'Gold Theme',
        unlocked: false,
        stats: '',
        requirement: 'Complete 10 achievements',
      },
    ],
  }
  
  return (
    <div className="bg-gray-800 border-4 border-double border-gray-700 p-4">
      <h2 className="text-2xl font-bold text-yellow-400 uppercase mb-4 border-b-2 border-gray-700 pb-2">
        Equipment & Items
      </h2>
      <div className="flex border-b-4 border-gray-700 mb-4">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`flex items-center px-6 py-2 uppercase font-medium text-sm ${
              activeCategory === category.id 
                ? 'bg-yellow-700 text-yellow-300 border-t-4 border-l-4 border-r-4 border-yellow-600' 
                : 'bg-gray-700 text-gray-400 border-t-4 border-l-4 border-r-4 border-gray-600 hover:bg-gray-600'
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items[activeCategory].map((item) => (
          <div
            key={item.id}
            className={`border-4 ${
              item.unlocked 
                ? 'border-gray-600 bg-gray-700' 
                : 'border-gray-700 bg-gray-800'
            }`}
          >
            <div className="p-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-800 border-2 border-gray-600 flex items-center justify-center mr-4">
                  {activeCategory === 'outfits' && (
                    <Shirt size={24} className="text-yellow-500" />
                  )}
                  {activeCategory === 'accessories' && (
                    <Shield size={24} className="text-yellow-500" />
                  )}
                  {activeCategory === 'colors' && (
                    <Palette size={24} className="text-yellow-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-medium ${
                      item.unlocked ? 'text-gray-200' : 'text-gray-500'
                    }`}
                  >
                    {item.name}
                  </h3>
                  {item.stats && (
                    <p className="text-xs text-yellow-500 mt-1">{item.stats}</p>
                  )}
                  {!item.unlocked && (
                    <p className="text-xs text-gray-500 mt-1 border-t border-gray-600 pt-1">
                      Quest: {item.requirement}
                    </p>
                  )}
                </div>
                <button
                  className={`px-3 py-1 text-sm border-2 ${
                    item.unlocked 
                      ? 'bg-yellow-700 text-yellow-300 border-yellow-600 hover:bg-yellow-600' 
                      : 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed'
                  }`}
                  disabled={!item.unlocked}
                >
                  {item.unlocked ? 'EQUIP' : 'LOCKED'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}