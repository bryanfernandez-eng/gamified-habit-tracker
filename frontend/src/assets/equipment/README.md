# Equipment Sprites Directory

This directory holds the pixel art sprites for visual equipment that can be equipped on characters.

## Directory Structure

```
equipment/
├── helmets/     - Head equipment (helmets, hats, crowns)
├── weapons/     - Weapons (swords, axes, staffs)
├── chest/       - Body armor (chest plates, shirts, robes)
├── legs/        - Leg armor (pants, greaves, skirts)
└── feet/        - Footwear (boots, shoes, sandals)
```

## Sprite Specifications

When generating AI sprites for equipment, follow these guidelines:

### Technical Requirements
- **Format:** PNG with transparent background
- **Dimensions:** Match base character size (recommend 128x128px or 256x256px)
- **Alignment:** Center the equipment on the canvas, consistent across all sprites
- **Style:** Pixel art matching the existing character aesthetic

### Content Guidelines
- Each sprite should show **ONLY the equipment piece** (e.g., helmet sprite = just the helmet)
- Do not include the full character body in equipment sprites
- Equipment should be positioned as if worn by the character
- Maintain consistent perspective and lighting direction

### Naming Convention
- Use kebab-case filenames: `iron-helmet.png`, `wooden-sword.png`
- Names should match the equipment ID in the database

## Adding New Equipment

1. Generate the sprite using AI (following specs above)
2. Save to the appropriate subdirectory
3. Add equipment to database with:
   - `equipment_slot`: helmet/weapon/chest/legs/feet
   - `sprite_path`: relative path (e.g., `equipment/helmets/iron-helmet.png`)
   - `gold_cost`: price in gold
4. The sprite will automatically render when equipped

## Example Database Entry

```python
Equipment(
    name="Iron Helmet",
    equipment_type="outfit",
    equipment_slot="helmet",
    sprite_path="equipment/helmets/iron-helmet.png",
    gold_cost=500,
    stat_bonus={"strength": 2},
    description="A sturdy iron helmet that protects your head"
)
```

## Layer Rendering Order

Equipment sprites are rendered in this order (bottom to top):
1. Base Character
2. Feet
3. Legs
4. Chest
5. Helmet
6. Weapon (on top)

This ensures proper visual layering when multiple items are equipped.
