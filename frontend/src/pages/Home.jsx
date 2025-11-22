import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Target, Trophy, TrendingUp, Users, Sparkles } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navbar for Home */}
      <nav className="bg-gray-900 border-b-4 border-double border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Zap className="w-6 h-6 text-yellow-400 mr-2" />
              <span className="text-xl font-bold text-yellow-400 uppercase">Quest Tracker</span>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-yellow-600 text-yellow-100 hover:bg-yellow-500 font-bold uppercase rounded-sm transition-all border-2 border-yellow-500"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-yellow-400 mb-6 uppercase tracking-wider">
            Gamify Your Habits
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform healthy habits into an epic RPG adventure. Track your progress, level up your character,
            and unlock achievements as you build consistency and discipline.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-yellow-600 text-yellow-100 hover:bg-yellow-500 font-bold uppercase text-lg rounded-sm transition-all border-2 border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/50"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/leaderboard')}
              className="px-8 py-3 bg-gray-700 text-gray-200 hover:bg-gray-600 font-bold uppercase text-lg rounded-sm transition-all border-2 border-gray-600 hover:border-yellow-400"
            >
              View Leaderboard
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t-4 border-gray-700">
        <h2 className="text-4xl font-bold text-yellow-400 mb-12 text-center uppercase">
          Core Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-800 border-4 border-gray-700 p-6 hover:border-yellow-500 transition-all">
            <div className="flex items-center mb-4">
              <Target className="w-8 h-8 text-yellow-400 mr-3" />
              <h3 className="text-xl font-bold text-yellow-300 uppercase">Track Habits</h3>
            </div>
            <p className="text-gray-300">
              Log your daily habits across 5 categories: Strength, Intelligence, Creativity, Social, and Health.
              Build streaks and maintain consistency.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-800 border-4 border-gray-700 p-6 hover:border-yellow-500 transition-all">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-8 h-8 text-yellow-400 mr-3" />
              <h3 className="text-xl font-bold text-yellow-300 uppercase">Earn XP & Level Up</h3>
            </div>
            <p className="text-gray-300">
              Complete habits to earn XP and progress through levels. Unlock new achievements and equipment
              as you advance your journey.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-800 border-4 border-gray-700 p-6 hover:border-yellow-500 transition-all">
            <div className="flex items-center mb-4">
              <Sparkles className="w-8 h-8 text-yellow-400 mr-3" />
              <h3 className="text-xl font-bold text-yellow-300 uppercase">Customize Character</h3>
            </div>
            <p className="text-gray-300">
              Unlock outfits, accessories, and themes. Equip gear that grants stat bonuses and customize
              your unique character appearance.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-gray-800 border-4 border-gray-700 p-6 hover:border-yellow-500 transition-all">
            <div className="flex items-center mb-4">
              <Trophy className="w-8 h-8 text-yellow-400 mr-3" />
              <h3 className="text-xl font-bold text-yellow-300 uppercase">Earn Achievements</h3>
            </div>
            <p className="text-gray-300">
              Unlock 24+ unique achievements based on streaks, levels, attribute progression, and habit
              completion milestones.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-gray-800 border-4 border-gray-700 p-6 hover:border-yellow-500 transition-all">
            <div className="flex items-center mb-4">
              <Users className="w-8 h-8 text-yellow-400 mr-3" />
              <h3 className="text-xl font-bold text-yellow-300 uppercase">Compete Online</h3>
            </div>
            <p className="text-gray-300">
              View the global leaderboard and see how your progress compares with other players.
              Climb the ranks and become a legend.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-gray-800 border-4 border-gray-700 p-6 hover:border-yellow-500 transition-all">
            <div className="flex items-center mb-4">
              <Zap className="w-8 h-8 text-yellow-400 mr-3" />
              <h3 className="text-xl font-bold text-yellow-300 uppercase">5 Core Attributes</h3>
            </div>
            <p className="text-gray-300">
              Develop Strength, Intelligence, Creativity, Social, and Health attributes. Each habit
              contributes to specific attributes for balanced growth.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t-4 border-gray-700">
        <h2 className="text-4xl font-bold text-yellow-400 mb-12 text-center uppercase">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 border-4 border-yellow-500 p-6 text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-3">1</div>
            <h3 className="text-yellow-300 font-bold uppercase mb-2">Create Habits</h3>
            <p className="text-gray-400 text-sm">
              Define your habits with custom names, categories, and XP rewards.
            </p>
          </div>

          <div className="bg-gray-800 border-4 border-gray-700 p-6 text-center hover:border-yellow-500 transition-all">
            <div className="text-4xl font-bold text-yellow-400 mb-3">2</div>
            <h3 className="text-yellow-300 font-bold uppercase mb-2">Log Daily</h3>
            <p className="text-gray-400 text-sm">
              Complete your quests each day and watch your streaks grow.
            </p>
          </div>

          <div className="bg-gray-800 border-4 border-gray-700 p-6 text-center hover:border-yellow-500 transition-all">
            <div className="text-4xl font-bold text-yellow-400 mb-3">3</div>
            <h3 className="text-yellow-300 font-bold uppercase mb-2">Earn Rewards</h3>
            <p className="text-gray-400 text-sm">
              Gain XP, unlock achievements, and unlock new equipment.
            </p>
          </div>

          <div className="bg-gray-800 border-4 border-gray-700 p-6 text-center hover:border-yellow-500 transition-all">
            <div className="text-4xl font-bold text-yellow-400 mb-3">4</div>
            <h3 className="text-yellow-300 font-bold uppercase mb-2">Level Up</h3>
            <p className="text-gray-400 text-sm">
              Progress through levels and rise up the global leaderboard.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t-4 border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold text-yellow-400 mb-2">5</div>
            <p className="text-gray-300 font-bold uppercase">Core Attributes</p>
          </div>
          <div>
            <div className="text-5xl font-bold text-yellow-400 mb-2">24+</div>
            <p className="text-gray-300 font-bold uppercase">Achievements</p>
          </div>
          <div>
            <div className="text-5xl font-bold text-yellow-400 mb-2">30+</div>
            <p className="text-gray-300 font-bold uppercase">Equipment Items</p>
          </div>
          <div>
            <div className="text-5xl font-bold text-yellow-400 mb-2">∞</div>
            <p className="text-gray-300 font-bold uppercase">Progression</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t-4 border-gray-700 text-center mb-16">
        <h2 className="text-4xl font-bold text-yellow-400 mb-6 uppercase">
          Ready to Start Your Adventure?
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Join thousands of players building better habits through gamification.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-10 py-4 bg-yellow-600 text-yellow-100 hover:bg-yellow-500 font-bold uppercase text-lg rounded-sm transition-all border-2 border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/50"
        >
          Create Your Account
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-gray-700 bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>Quest Tracker © 2024 | Gamifying Habits, One Quest at a Time</p>
        </div>
      </footer>
    </div>
  )
}
