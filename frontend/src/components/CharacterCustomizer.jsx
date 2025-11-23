import React, { useState, useEffect } from 'react'
import { Shield, Shirt, Palette, Loader } from 'lucide-react'
import { gameApi } from '../services/gameApi'
import DefaultImg from '/src/assets/default.png'
import ZoroImg from '/src/assets/zoro.png'

export function CharacterCustomizer({ onCharacterChanged }) {
  const [activeCategory, setActiveCategory] = useState('character')
  const [equipment, setEquipment] = useState([])
  const [characters, setCharacters] = useState([])
  const [currentCharacter, setCurrentCharacter] = useState('default')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [equippingId, setEquippingId] = useState(null)
  const [selectingCharacterId, setSelectingCharacterId] = useState(null)

  const categories = [
    {
      id: 'character',
      label: 'Characters',
      icon: <Palette size={18} />,
    },
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
    loadCharacters()
  }, [])

  const loadEquipment = async () => {
    try {
      setError(null)
      const data = await gameApi.getEquipment()
      setEquipment(data)
    } catch (err) {
      console.error('Failed to load equipment:', err)
      setError('Failed to load equipment')
    }
  }

  const loadCharacters = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await gameApi.getAvailableCharacters()
      setCharacters(data.available_characters)
      setCurrentCharacter(data.current_character)
    } catch (err) {
      console.error('Failed to load characters:', err)
      setError('Failed to load characters')
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

  const handleSelectCharacter = async (characterId) => {
    try {
      setSelectingCharacterId(characterId)
      await gameApi.selectCharacter(characterId)
      setCurrentCharacter(characterId)
      // Trigger stats refresh in parent component
      if (onCharacterChanged) {
        const updatedStats = await gameApi.getUserStats()
        onCharacterChanged(updatedStats)
      }
    } catch (err) {
      console.error('Failed to select character:', err)
      setError('Failed to select character')
    } finally {
      setSelectingCharacterId(null)
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

  const getCharacterImage = (characterId) => {
    const imageMap = {
      'default': DefaultImg,
      'zoro': ZoroImg,
    }
    return imageMap[characterId] || DefaultImg
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

  const filteredItems = activeCategory === 'character'
    ? characters
    : equipment.filter(item => item.equipment_type === activeCategory)

  const title = activeCategory === 'character' ? 'Characters' : 'Equipment & Items'

  return (
    <div className="bg-gray-800 border-4 border-double border-gray-700 p-4">
      <h2 className="text-2xl font-bold text-yellow-400 uppercase mb-4 border-b-2 border-gray-700 pb-2">
        {title}
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
          filteredItems.map((item) => {
            const isCharacter = activeCategory === 'character'
            const isUnlocked = isCharacter ? true : item.is_unlocked
            const isSelected = isCharacter && item.id === currentCharacter

            return (
              <div
                key={item.id}
                className={`border-4 ${
                  isUnlocked ? 'border-gray-600 bg-gray-700' : 'border-gray-700 bg-gray-800'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-center">
                    <div className="w-20 h-20 bg-gray-900 border-4 border-gray-600 flex items-center justify-center mr-4 overflow-hidden">
                      {activeCategory === 'character' ? (
                        <img
                          src={getCharacterImage(item.id)}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      ) : activeCategory === 'outfit' ? (
                        <Shirt size={24} className="text-yellow-500" />
                      ) : activeCategory === 'accessory' ? (
                        <Shield size={24} className="text-yellow-500" />
                      ) : activeCategory === 'theme' ? (
                        <Palette size={24} className="text-yellow-500" />
                      ) : null}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-medium ${
                          isUnlocked ? 'text-gray-200' : 'text-gray-500'
                        }`}
                      >
                        {item.name}
                      </h3>
                      {isCharacter && item.unlock_level && (
                        <p className="text-xs text-yellow-500 mt-1">
                          Unlock Level: {item.unlock_level}
                        </p>
                      )}
                      {!isCharacter && getStatBonusText(item.stat_bonus) && (
                        <p className="text-xs text-yellow-500 mt-1">
                          {getStatBonusText(item.stat_bonus)}
                        </p>
                      )}
                      {!isUnlocked && !isCharacter && item.unlock_requirement && (
                        <p className="text-xs text-gray-500 mt-1 border-t border-gray-600 pt-1">
                          Quest: {item.unlock_requirement}
                        </p>
                      )}
                    </div>
                    {isCharacter ? (
                      <button
                        onClick={() => handleSelectCharacter(item.id)}
                        disabled={selectingCharacterId === item.id}
                        className={`px-3 py-1 text-sm border-2 ${
                          isSelected
                            ? 'bg-green-700 text-green-300 border-green-600'
                            : 'bg-yellow-700 text-yellow-300 border-yellow-600 hover:bg-yellow-600'
                        } ${selectingCharacterId === item.id ? 'opacity-50' : ''}`}
                      >
                        {selectingCharacterId === item.id ? (
                          <Loader size={14} className="animate-spin inline" />
                        ) : isSelected ? (
                          'SELECTED'
                        ) : (
                          'SELECT'
                        )}
                      </button>
                    ) : (
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
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}