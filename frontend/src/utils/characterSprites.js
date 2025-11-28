// Character sprite imports
import DefaultImg from '/src/assets/characters/default/level1-default.png';
import ZoroImg from '/src/assets/characters/zoro/zoro-default.png';
import ZoroSwordImg from '/src/assets/characters/zoro/zoro-sword.png';
import CyberpunkImg from '/src/assets/characters/cyberpunk/cyberpunk-default.png';
import CyberpunkCorruptedImg from '/src/assets/characters/cyberpunk/cyberpunk-corrupted.png';
import CyberpunkAscendedImg from '/src/assets/characters/cyberpunk/cyberpunk-ascended.png';

/**
 * Get the correct character sprite based on selected appearance or character
 * @param {Object} appearance - The selected_appearance object with sprite_path
 * @param {string} character - The selected_character id (fallback)
 * @returns {string} - The sprite image path
 */
export const getCharacterSprite = (appearance, character) => {
  // If appearance with sprite_path is provided, use it
  if (appearance?.sprite_path) {
    const spriteMap = {
      'characters/default/level1-default.png': DefaultImg,
      'characters/zoro/zoro-default.png': ZoroImg,
      'characters/zoro/zoro-sword.png': ZoroSwordImg,
      'characters/cyberpunk/cyberpunk-default.png': CyberpunkImg,
      'characters/cyberpunk/cyberpunk-corrupted.png': CyberpunkCorruptedImg,
      'characters/cyberpunk/cyberpunk-ascended.png': CyberpunkAscendedImg,
    };

    return spriteMap[appearance.sprite_path] || DefaultImg;
  }

  // Fallback to character-based selection
  const characterMap = {
    'default': DefaultImg,
    'zoro': ZoroImg,
    'cyberpunk': CyberpunkImg,
  };

  return characterMap[character] || DefaultImg;
};

/**
 * Get character sprite for a specific character ID (used in character selection)
 * @param {string} characterId - The character ID
 * @returns {string} - The default sprite image for that character
 */
export const getCharacterDefaultSprite = (characterId) => {
  const characterMap = {
    'default': DefaultImg,
    'zoro': ZoroImg,
    'cyberpunk': CyberpunkImg,
  };

  return characterMap[characterId] || DefaultImg;
};
