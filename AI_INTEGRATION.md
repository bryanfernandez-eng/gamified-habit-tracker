# AI Integration - Dynamic XP Calculation

## Overview
The habit tracker now uses OpenAI's GPT-4o-mini to intelligently calculate XP rewards based on habit difficulty.

## How It Works

### 1. AI Analysis
When a user creates a habit, the AI analyzes:
- **Habit Name**: What the task is
- **Description**: Details about how to complete it
- **Frequency**: How often it needs to be done (daily/weekly/monthly)

### 2. Difficulty Scoring
The AI returns a difficulty score from 1-10:
- **1-2**: Very Easy (e.g., "Drink water", "Make bed")
- **3-4**: Easy (e.g., "15min walk", "Read 10 pages")
- **5-6**: Moderate (e.g., "30min workout", "Cook healthy meal")
- **7-8**: Hard (e.g., "Run 5 miles", "Study 2 hours")
- **9-10**: Very Hard (e.g., "Marathon training", "Write 3000 words")

### 3. XP Calculation
XP is calculated using the formula:
```
Base XP (by frequency):
- Daily: 50 XP
- Weekly: 100 XP
- Monthly: 150 XP

Difficulty Multiplier = 0.7 + (difficulty / 20)

Final XP = Base XP × Difficulty Multiplier
Capped at: 40 XP minimum, 200 XP maximum
```

## Real Examples (Tested)

### Example 1: Easy Daily Habit
```
Habit: "Drink Water"
Description: "Drink 8 glasses of water"
Frequency: Daily

AI-Calculated XP: 40 XP
```

### Example 2: Moderate Daily Habit
```
Habit: "Study Python"
Description: "Complete 2 hours of Python programming practice with exercises"
Frequency: Daily

AI-Calculated XP: 52 XP
```

### Example 3: Hard Daily Habit
```
Habit: "Run 5 miles"
Description: "Complete a 5-mile run maintaining pace under 9 min/mile"
Frequency: Daily

AI-Calculated XP: 55 XP
```

### Example 4: Complex Weekly Habit
```
Habit: "Write Novel Chapter"
Description: "Write and edit a complete 3000-word chapter with character development, plot progression, and detailed world-building"
Frequency: Weekly

AI-Calculated XP: 110 XP
```

### Example 5: Very Complex Monthly Habit
```
Habit: "Morning Workout"
Description: "30 minutes of cardio and strength training"
Frequency: Daily

AI-Calculated XP: 50 XP
```

## Setup

### 1. Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key

### 2. Add to Environment Variables
Add to your `.env` file or backend settings:
```bash
OPENAI_API_KEY=sk-proj-...your-key-here...
```

Or set as environment variable:
```bash
# Windows
set OPENAI_API_KEY=sk-proj-...your-key-here...

# Linux/Mac
export OPENAI_API_KEY=sk-proj-...your-key-here...
```

### 3. Cost Estimation
GPT-4o-mini pricing (as of 2025):
- **Input**: $0.15 per 1M tokens
- **Output**: $0.60 per 1M tokens

Average habit analysis uses ~200 tokens total = **$0.00015 per habit** (0.015 cents)

For 1000 habits created: **~$0.15 total cost**

## Fallback Behavior
If the OpenAI API key is not configured or the API fails:
- The system automatically falls back to a heuristic-based calculation
- Uses description length and frequency as proxies for difficulty
- Still provides reasonable XP values (40-200 range)
- No errors shown to users

## Files Modified
- `backend/api/ai_service.py` - New AI service for habit analysis
- `backend/api/models.py` - Updated Habit.calculate_xp_reward() to use AI
- User experience remains the same - XP is automatically calculated on habit creation

## Future Enhancements
Potential AI features to add:
- Personalized motivation messages
- Smart habit recommendations
- Progress insights and analytics
- Quest generation based on user history
