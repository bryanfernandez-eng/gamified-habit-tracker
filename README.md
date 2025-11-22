# Gamified Habit Tracker 🎮

Transform habit tracking into an engaging RPG-style game. Build your character, complete daily quests, unlock achievements, and compete on the leaderboard as you level up through habit completion.

## Requirements

- **Node.js** 18+
- **Python** 3.12+
- **Git**

## Quick Start

### 1. Clone & Install Backend

```bash
git clone https://github.com/YOUR_USERNAME/gamified-habit-tracker.git
cd gamified-habit-tracker/backend

python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py seed_achievements
python manage.py create_mock_users
```

### 2. Run Backend

```bash
python manage.py runserver
# Server at http://localhost:8000
```

### 3. Install & Run Frontend

```bash
cd ../frontend
npm install
npm run dev
# App at http://localhost:5173
```

## Test Accounts

**Default:**
- `johndoe` / `demo123` (admin)
- `reese` / `demo123` (user)

**Plus 49 more:** See `backend/mock_users_auth.txt` for all 51 accounts (levels 1-30)

## Key Features

- **Character Progression** - Level up and earn XP through habits
- **5 Attributes** - Strength, Intelligence, Creativity, Social, Health
- **Quest Limits** - Unlock more quests as you level (4 → 6 → 8 → 10 → unlimited)
- **Daily Check-ins** - 100 XP per day with GitHub-style calendar
- **21 Achievements** - Unlock badges through progression
- **Leaderboard** - Compete with other players globally

## Project Stack

- **Backend:** Django 5.2.6 + Django REST Framework
- **Frontend:** React 18 + Vite + Tailwind CSS
- **Database:** SQLite (dev)
- **Auth:** Token-based (dj-rest-auth)

---

**Version:** 1.0.0 | **Last Updated:** November 22, 2025
