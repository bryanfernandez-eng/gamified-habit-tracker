import React, { useState, useEffect } from 'react'
import { Shield, Shirt, Palette, Loader } from 'lucide-react'
import { gameApi } from '../services/gameApi'

export function CharacterCustomizer() {
  const [activeCategory, setActiveCategory] = useState('outfit')
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [equippingId, setEquippingId] = useState(null)
  
  const categories = [
    {
      id: 'outfit',
      label: 'Outfits',
      icon: <Shirt size={18} />,
    },
    {
      id: 'accessory',
      label: 'Accessories',
      icon: <Shield size={18} />,
    },
    {
      id: 'theme',
      label: 'Themes',
      icon: <Palette size={18} />,
    },
  ]

  useEffect(() => {
    loadEquipment()
  }, [])

  const loadEquipment = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await gameApi.getEquipment()
      setEquipment(data)
    } catch (err) {
      console.error('Failed to load equipment:', err)
      setError('Failed to load equipment')
    } finally {
      setLoading(false)
    }
  }

  const handleEquip = async (itemId) => {
    try {
      setEquippingId(itemId)
      await gameApi.equipItem(itemId)
      // Refresh equipment data
      await loadEquipment()
    } catch (err) {
      console.error('Failed to equip item:', err)
      setError('Failed to equip item')
    } finally {
      setEquippingId(null)
    }
  }

  const getStatBonusText = (statBonus) => {
    if (!statBonus || Object.keys(statBonus).length === 0) {
      return ''
    }

    const bonuses = Object.entries(statBonus)
      .map(([attr, value]) => `+${value} ${attr.charAt(0).toUpperCase() + attr.slice(1)}`)
      .join(', ')

    return bonuses
  }

  if (loading) {
    return (
      <div className="bg-gray-800 border-4 border-double border-gray-700 p-4">
        <h2 className="text-2xl font-bold text-yellow-400 uppercase mb-4 border-b-2 border-gray-700 pb-2">
          Equipment & Items
        </h2>
        <div className="flex items-center justify-center py-16">
          <Loader className="animate-spin text-yellow-400 mr-3" size={24} />
          <p className="text-gray-300">Loading equipment...</p>
        </div>
      </div>
    )
  }

  const filteredItems = equipment.filter(item => item.equipment_type === activeCategory)
  
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

      {error && (
        <div className="mb-4 p-3 bg-red-900 border-2 border-red-700 text-red-200">
          <p>{error}</p>
          <button
            onClick={loadEquipment}
            className="mt-2 px-3 py-1 text-sm bg-red-700 border-2 border-red-600 hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-8">
            No items available in this category
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`border-4 ${
                item.is_unlocked ? 'border-gray-600 bg-gray-700' : 'border-gray-700 bg-gray-800'
              }`}
            >
              <div className="p-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-800 border-2 border-gray-600 flex items-center justify-center mr-4">
                    {activeCategory === 'outfit' && (
                      <Shirt size={24} className="text-yellow-500" />
                    )}
                    {activeCategory === 'accessory' && (
                      <Shield size={24} className="text-yellow-500" />
                    )}
                    {activeCategory === 'theme' && (
                      <Palette size={24} className="text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-medium ${
                        item.is_unlocked ? 'text-gray-200' : 'text-gray-500'
                      }`}
                    >
                      {item.name}
                    </h3>
                    {getStatBonusText(item.stat_bonus) && (
                      <p className="text-xs text-yellow-500 mt-1">
                        {getStatBonusText(item.stat_bonus)}
                      </p>
                    )}
                    {!item.is_unlocked && item.unlock_requirement && (
                      <p className="text-xs text-gray-500 mt-1 border-t border-gray-600 pt-1">
                        Quest: {item.unlock_requirement}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleEquip(item.id)}
                    disabled={!item.is_unlocked || equippingId === item.id}
                    className={`px-3 py-1 text-sm border-2 ${
                      item.is_unlocked
                        ? item.is_equipped
                          ? 'bg-green-700 text-green-300 border-green-600 hover:bg-green-600'
                          : 'bg-yellow-700 text-yellow-300 border-yellow-600 hover:bg-yellow-600'
                        : 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed'
                    } ${equippingId === item.id ? 'opacity-50' : ''}`}
                  >
                    {equippingId === item.id ? (
                      <Loader size={14} className="animate-spin inline" />
                    ) : item.is_equipped ? (
                      'EQUIPPED'
                    ) : item.is_unlocked ? (
                      'EQUIP'
                    ) : (
                      'LOCKED'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}