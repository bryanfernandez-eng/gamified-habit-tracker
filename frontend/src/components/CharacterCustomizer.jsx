import React, { useState, useEffect } from 'react'
import { Shield, Shirt, Palette, Loader, Lock, Check } from 'lucide-react'
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
      label: 'Heroes',
      icon: <Palette size={18} />,
    },
    {
      id: 'outfit',
      label: 'Armor',
      icon: <Shirt size={18} />,
    },
    {
      id: 'accessory',
      label: 'Relics',
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
      <div className="rulebook-card p-6">
        <h2 className="text-2xl font-serif font-bold text-rulebook-ink uppercase mb-6 border-b-2 border-rulebook-ink/20 pb-4">
          Equipment & Items
        </h2>
        <div className="flex items-center justify-center py-16">
          <Loader className="animate-spin text-rulebook-crimson mr-3" size={24} />
          <p className="text-rulebook-ink/60 font-serif">Loading armory...</p>
        </div>
      </div>
    )
  }

  const filteredItems = activeCategory === 'character'
    ? characters
    : equipment.filter(item => item.equipment_type === activeCategory)

  const title = activeCategory === 'character' ? 'Hero Roster' : 'Equipment & Items'

  return (
    <div className="rulebook-card p-6">
      <h2 className="text-2xl font-serif font-bold text-rulebook-ink uppercase mb-6 border-b-2 border-rulebook-ink/20 pb-4">
        {title}
      </h2>

      {/* Tabs */}
      <div className="flex border-b border-rulebook-ink/20 mb-6 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`flex items-center px-6 py-3 font-serif font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${activeCategory === category.id
                ? 'text-rulebook-crimson border-b-4 border-rulebook-crimson bg-rulebook-ink/5'
                : 'text-rulebook-ink/60 hover:text-rulebook-ink hover:bg-rulebook-ink/5'
              }`}
            onClick={() => setActiveCategory(category.id)}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rulebook-crimson/10 border-2 border-rulebook-crimson text-rulebook-crimson font-serif font-bold rounded-sm">
          <p>{error}</p>
          <button
            onClick={loadEquipment}
            className="mt-2 px-3 py-1 text-sm bg-rulebook-crimson text-rulebook-paper border border-rulebook-ink hover:bg-rulebook-ink transition-colors uppercase tracking-wide"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center text-rulebook-ink/40 py-12 font-serif italic">
            No items discovered in this category yet.
          </div>
        ) : (
          filteredItems.map((item) => {
            const isCharacter = activeCategory === 'character'
            const isUnlocked = isCharacter ? true : item.is_unlocked
            const isSelected = isCharacter && item.id === currentCharacter

            return (
              <div
                key={item.id}
                className={`border-2 relative group transition-all duration-300 ${isUnlocked
                    ? 'border-rulebook-ink/20 bg-rulebook-ink/5 hover:border-rulebook-crimson/50'
                    : 'border-rulebook-ink/10 bg-rulebook-ink/5 opacity-70'
                  }`}
              >
                {/* Corner Accents for unlocked items */}
                {isUnlocked && (
                  <>
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-rulebook-ink/30"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-rulebook-ink/30"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-rulebook-ink/30"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-rulebook-ink/30"></div>
                  </>
                )}

                <div className="p-4">
                  <div className="flex items-start">
                    {/* Item Icon/Image */}
                    <div className={`w-20 h-20 border-2 flex items-center justify-center mr-4 overflow-hidden shrink-0 ${isUnlocked ? 'border-rulebook-ink/30 bg-white/50' : 'border-rulebook-ink/10 bg-rulebook-ink/10'
                      }`}>
                      {activeCategory === 'character' ? (
                        <img
                          src={getCharacterImage(item.id)}
                          alt={item.name}
                          className="w-full h-full object-contain filter sepia-[.2]"
                        />
                      ) : activeCategory === 'outfit' ? (
                        <Shirt size={32} className={isUnlocked ? "text-rulebook-ink" : "text-rulebook-ink/30"} />
                      ) : activeCategory === 'accessory' ? (
                        <Shield size={32} className={isUnlocked ? "text-rulebook-ink" : "text-rulebook-ink/30"} />
                      ) : activeCategory === 'theme' ? (
                        <Palette size={32} className={isUnlocked ? "text-rulebook-ink" : "text-rulebook-ink/30"} />
                      ) : null}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className={`font-serif font-bold text-lg leading-tight mb-1 ${isUnlocked ? 'text-rulebook-ink' : 'text-rulebook-ink/50'
                          }`}>
                          {item.name}
                        </h3>
                        {!isUnlocked && <Lock size={14} className="text-rulebook-ink/40 ml-2 shrink-0" />}
                      </div>

                      {isCharacter && item.unlock_level && (
                        <p className="text-xs text-rulebook-crimson font-mono mt-1">
                          Unlock Level: {item.unlock_level}
                        </p>
                      )}

                      {!isCharacter && getStatBonusText(item.stat_bonus) && (
                        <p className="text-xs text-rulebook-forest font-mono font-bold mt-1">
                          {getStatBonusText(item.stat_bonus)}
                        </p>
                      )}

                      {!isUnlocked && !isCharacter && item.unlock_requirement && (
                        <p className="text-xs text-rulebook-ink/50 mt-2 border-t border-rulebook-ink/10 pt-1 font-serif italic">
                          Quest: {item.unlock_requirement}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 flex justify-end">
                    {isCharacter ? (
                      <button
                        onClick={() => handleSelectCharacter(item.id)}
                        disabled={selectingCharacterId === item.id || isSelected}
                        className={`px-4 py-2 text-xs font-serif font-bold uppercase tracking-widest border-2 transition-all shadow-sm ${isSelected
                            ? 'bg-rulebook-forest text-rulebook-paper border-rulebook-ink cursor-default'
                            : 'bg-rulebook-crimson text-rulebook-paper border-rulebook-ink hover:bg-rulebook-ink hover:border-rulebook-crimson'
                          } ${selectingCharacterId === item.id ? 'opacity-80 cursor-wait' : ''}`}
                      >
                        {selectingCharacterId === item.id ? (
                          <span className="flex items-center gap-2">
                            <Loader size={12} className="animate-spin" /> SUMMONING...
                          </span>
                        ) : isSelected ? (
                          <span className="flex items-center gap-2">
                            <Check size={12} /> ACTIVE HERO
                          </span>
                        ) : (
                          'SUMMON'
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEquip(item.id)}
                        disabled={!item.is_unlocked || equippingId === item.id}
                        className={`px-4 py-2 text-xs font-serif font-bold uppercase tracking-widest border-2 transition-all shadow-sm ${item.is_unlocked
                            ? item.is_equipped
                              ? 'bg-rulebook-forest text-rulebook-paper border-rulebook-ink'
                              : 'bg-rulebook-crimson text-rulebook-paper border-rulebook-ink hover:bg-rulebook-ink hover:border-rulebook-crimson'
                            : 'bg-rulebook-ink/20 text-rulebook-ink/40 border-rulebook-ink/20 cursor-not-allowed'
                          } ${equippingId === item.id ? 'opacity-80 cursor-wait' : ''}`}
                      >
                        {equippingId === item.id ? (
                          <span className="flex items-center gap-2">
                            <Loader size={12} className="animate-spin" /> EQUIPPING...
                          </span>
                        ) : item.is_equipped ? (
                          <span className="flex items-center gap-2">
                            <Check size={12} /> EQUIPPED
                          </span>
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