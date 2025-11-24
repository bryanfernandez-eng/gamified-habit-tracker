import ForestGreenBg from '/src/assets/themes/forest-green.png'
import ForestPixelBg from '/src/assets/themes/forest-pixel.jpg'
import ForestStandardBg from '/src/assets/themes/forest-standard.png'

// White background as a data URL for Default Theme
const WHITE_BG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4='

/**
 * Maps theme names to their corresponding background images
 * For Level 1 players, three forest themes are available with different backgrounds
 */
export const THEME_BACKGROUNDS = {
  'Default Theme': WHITE_BG, // White background
  'Forest Green': ForestGreenBg, // Green forest background
  'Forest Pixel': ForestPixelBg, // Pixel art forest background
  'Forest Standard': ForestStandardBg, // Standard forest background
}

/**
 * Maps theme names to their preview/thumbnail images
 * Used in the equipment customizer to display theme previews
 */
export const THEME_PREVIEW_IMAGES = {
  'Default Theme': null, // No preview image for default (white)
  'Forest Green': ForestGreenBg,
  'Forest Pixel': ForestPixelBg,
  'Forest Standard': ForestStandardBg,
}

/**
 * Gets the appropriate background image for a theme
 * @param {string} themeName - The name of the selected theme
 * @returns {string|null} - The background image URL or null if no background
 */
export function getThemeBackground(themeName) {
  return THEME_BACKGROUNDS[themeName] || null
}

/**
 * Gets the preview image for a theme in the customizer
 * @param {string} themeName - The name of the theme
 * @returns {string|null} - The preview image URL or null if no preview
 */
export function getThemePreviewImage(themeName) {
  return THEME_PREVIEW_IMAGES[themeName] || null
}
