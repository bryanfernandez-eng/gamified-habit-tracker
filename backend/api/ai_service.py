"""
AI service for intelligent habit analysis and XP calculation
"""
import os
from openai import OpenAI
from django.conf import settings


class AIService:
    """Service for AI-powered habit analysis using OpenAI"""

    def __init__(self):
        # Initialize OpenAI client
        api_key = getattr(settings, 'OPENAI_API_KEY', os.getenv('OPENAI_API_KEY'))
        self.client = OpenAI(api_key=api_key) if api_key else None
        self.model = "gpt-4o-mini"  # Cost-effective model

    def calculate_habit_difficulty(self, habit_name, description, frequency):
        """
        Use AI to analyze habit difficulty and return a score from 1-10.

        Args:
            habit_name: Name of the habit
            description: Description of the habit
            frequency: How often the habit should be done (daily/weekly/monthly)

        Returns:
            int: Difficulty score from 1 (very easy) to 10 (very difficult)
        """
        if not self.client:
            # Fallback to simple heuristic if no API key
            print("[AI SERVICE] WARNING: No API key found - using fallback heuristic")
            return self._fallback_difficulty_calculation(habit_name, description, frequency)

        try:
            print(f"[AI SERVICE] Analyzing habit: '{habit_name}'")
            print(f"   Description: '{description or 'No description'}'")
            print(f"   Frequency: {frequency}")

            prompt = f"""Analyze this habit and rate its difficulty on a scale of 1-10.

Habit: {habit_name}
Description: {description or "No description provided"}
Frequency: {frequency}

Consider these factors:
- Time commitment required
- Physical/mental effort needed
- Complexity of the task
- Consistency required
- Prerequisites or skills needed

Response format: Return ONLY a single number from 1-10, where:
1-2 = Very Easy (e.g., "Drink water", "Make bed")
3-4 = Easy (e.g., "15min walk", "Read 10 pages")
5-6 = Moderate (e.g., "30min workout", "Cook healthy meal")
7-8 = Hard (e.g., "Run 5 miles", "Study 2 hours")
9-10 = Very Hard (e.g., "Complete marathon training", "Write 3000 words")

Return only the number, nothing else."""

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert habit coach analyzing task difficulty. Respond with only a single number from 1-10."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,  # Lower temperature for more consistent scoring
                max_tokens=10
            )

            # Parse the response
            difficulty_str = response.choices[0].message.content.strip()
            difficulty = int(difficulty_str)

            # Ensure it's in valid range
            difficulty = max(1, min(10, difficulty))

            print(f"[AI SERVICE] SUCCESS: AI returned difficulty: {difficulty}/10")

            return difficulty

        except Exception as e:
            print(f"[AI SERVICE] ERROR: AI calculation failed: {e}")
            print(f"[AI SERVICE] WARNING: Falling back to heuristic")
            # Fallback to heuristic
            return self._fallback_difficulty_calculation(habit_name, description, frequency)

    def _fallback_difficulty_calculation(self, habit_name, description, frequency):
        """
        Fallback heuristic-based difficulty calculation if AI is unavailable.
        """
        print(f"[FALLBACK] Using heuristic calculation")

        # Base difficulty by frequency
        base_difficulty = {
            'daily': 4,
            'weekly': 5,
            'monthly': 6,
        }.get(frequency, 5)

        # Adjust based on description length (proxy for complexity)
        desc_length = len(description) if description else 0
        difficulty = base_difficulty

        if desc_length < 50:
            difficulty = max(1, base_difficulty - 1)  # Simpler task
        elif desc_length > 150:
            difficulty = min(10, base_difficulty + 2)  # More complex task

        print(f"[FALLBACK] Heuristic difficulty: {difficulty}/10 (desc length: {desc_length})")

        return difficulty

    def calculate_xp_from_difficulty(self, difficulty, frequency):
        """
        Calculate XP reward based on AI-determined difficulty and frequency.

        Args:
            difficulty: Difficulty score from 1-10
            frequency: How often the habit should be done (daily/weekly/monthly)

        Returns:
            int: XP reward from 40-200
        """
        # Base XP by frequency
        base_xp = {
            'daily': 50,
            'weekly': 100,
            'monthly': 150,
        }.get(frequency, 50)

        # Scale XP by difficulty (difficulty 5 = 1.0x, difficulty 10 = 1.5x)
        # Formula: multiplier = 0.7 + (difficulty / 20)
        # This gives: difficulty 1 = 0.75x, difficulty 5 = 0.95x, difficulty 10 = 1.2x
        difficulty_multiplier = 0.7 + (difficulty / 20)

        # Calculate final XP
        calculated_xp = int(base_xp * difficulty_multiplier)

        # Ensure it's within valid range (40-200)
        final_xp = max(40, min(200, calculated_xp))

        print(f"[XP CALC] Base: {base_xp} x Multiplier: {difficulty_multiplier:.2f} = {calculated_xp} -> Final: {final_xp} XP")

        return final_xp


# Singleton instance
ai_service = AIService()
