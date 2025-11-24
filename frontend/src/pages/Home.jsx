import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Target, Trophy, TrendingUp, Users, Sparkles, Scroll, Feather, Map } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import ConnectionStatus from '../components/ConnectionStatus'

export default function Home() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  // Redirect to dashboard if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen bg-rulebook-paper text-rulebook-ink font-mono selection:bg-rulebook-crimson selection:text-rulebook-paper">
      {/* Navbar for Home */}
      <nav className="bg-rulebook-paper border-b-4 border-double border-rulebook-charcoal fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="border-2 border-rulebook-ink p-1 rounded-sm">
                <Scroll className="w-6 h-6 text-rulebook-crimson" />
              </div>
              <span className="text-2xl font-serif font-bold text-rulebook-ink tracking-tight">Quest Tracker</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="text-rulebook-ink font-serif font-bold hover:text-rulebook-crimson transition-colors uppercase tracking-widest text-sm"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2 bg-rulebook-ink text-rulebook-paper font-serif font-bold text-sm rounded-sm hover:bg-rulebook-crimson transition-colors shadow-sm uppercase tracking-widest border-2 border-transparent hover:border-rulebook-ink"
              >
                Start Quest
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b-4 border-double border-rulebook-charcoal/20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-4 py-2 bg-rulebook-paper border-2 border-rulebook-charcoal rounded-sm shadow-rulebook">
            <span className="text-rulebook-forest font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <Feather className="w-4 h-4" /> Adventure Awaits
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-rulebook-ink mb-8 leading-tight">
            The Manual for <br />
            <span className="text-rulebook-crimson italic decoration-rulebook-charcoal/30 underline decoration-2 underline-offset-8">Self-Mastery</span>
          </h1>
          <p className="text-lg text-rulebook-ink/80 mb-12 max-w-2xl mx-auto leading-relaxed border-l-4 border-rulebook-royal pl-6 italic">
            "A comprehensive system to track your daily deeds, enhance your attributes, and record your legend for posterity."
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => navigate('/register')}
              className="btn-primary w-full sm:w-auto"
            >
              Begin Adventure
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn-secondary w-full sm:w-auto"
            >
              Resume Game
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-rulebook-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-rulebook-ink mb-4 border-b-2 border-rulebook-charcoal inline-block pb-2 px-8">
              System Mechanics
            </h2>
            <p className="text-rulebook-ink/70 max-w-2xl mx-auto mt-6 font-serif italic text-lg">
              Core rules for your personal progression system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="rulebook-card p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Target className="w-24 h-24" />
              </div>
              <div className="w-12 h-12 border-2 border-rulebook-charcoal flex items-center justify-center rounded-sm mb-6 bg-rulebook-paper shadow-sm">
                <Target className="w-6 h-6 text-rulebook-crimson" />
              </div>
              <h3 className="text-xl font-serif font-bold text-rulebook-ink mb-3 uppercase tracking-wide">Quest Log</h3>
              <p className="text-rulebook-ink/80 leading-relaxed text-sm">
                Define your daily objectives. Categorize them by attribute to ensure balanced character development.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rulebook-card p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp className="w-24 h-24" />
              </div>
              <div className="w-12 h-12 border-2 border-rulebook-charcoal flex items-center justify-center rounded-sm mb-6 bg-rulebook-paper shadow-sm">
                <TrendingUp className="w-6 h-6 text-rulebook-forest" />
              </div>
              <h3 className="text-xl font-serif font-bold text-rulebook-ink mb-3 uppercase tracking-wide">Experience Points</h3>
              <p className="text-rulebook-ink/80 leading-relaxed text-sm">
                Gain XP for every completed task. Watch your level rise as you maintain consistency over time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rulebook-card p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Trophy className="w-24 h-24" />
              </div>
              <div className="w-12 h-12 border-2 border-rulebook-charcoal flex items-center justify-center rounded-sm mb-6 bg-rulebook-paper shadow-sm">
                <Trophy className="w-6 h-6 text-rulebook-royal" />
              </div>
              <h3 className="text-xl font-serif font-bold text-rulebook-ink mb-3 uppercase tracking-wide">Achievements</h3>
              <p className="text-rulebook-ink/80 leading-relaxed text-sm">
                Unlock badges of honor for your deeds. A record of your triumphs to display on your character sheet.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rulebook-card p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="w-24 h-24" />
              </div>
              <div className="w-12 h-12 border-2 border-rulebook-charcoal flex items-center justify-center rounded-sm mb-6 bg-rulebook-paper shadow-sm">
                <Sparkles className="w-6 h-6 text-rulebook-ink" />
              </div>
              <h3 className="text-xl font-serif font-bold text-rulebook-ink mb-3 uppercase tracking-wide">Inventory</h3>
              <p className="text-rulebook-ink/80 leading-relaxed text-sm">
                Earn equipment to customize your avatar. Visual rewards that reflect your status and dedication.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rulebook-card p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users className="w-24 h-24" />
              </div>
              <div className="w-12 h-12 border-2 border-rulebook-charcoal flex items-center justify-center rounded-sm mb-6 bg-rulebook-paper shadow-sm">
                <Users className="w-6 h-6 text-rulebook-crimson" />
              </div>
              <h3 className="text-xl font-serif font-bold text-rulebook-ink mb-3 uppercase tracking-wide">Guilds</h3>
              <p className="text-rulebook-ink/80 leading-relaxed text-sm">
                Compare your progress with other adventurers. Compete for glory on the global leaderboards.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rulebook-card p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="w-24 h-24" />
              </div>
              <div className="w-12 h-12 border-2 border-rulebook-charcoal flex items-center justify-center rounded-sm mb-6 bg-rulebook-paper shadow-sm">
                <Zap className="w-6 h-6 text-rulebook-forest" />
              </div>
              <h3 className="text-xl font-serif font-bold text-rulebook-ink mb-3 uppercase tracking-wide">Attributes</h3>
              <p className="text-rulebook-ink/80 leading-relaxed text-sm">
                STR, INT, CRE, SOC, HLT. Develop your core stats through specific actions and habits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Steps */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t-4 border-double border-rulebook-charcoal/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-rulebook-ink mb-6">
              Gameplay Loop
            </h2>
            <div className="space-y-8 pl-4 border-l-2 border-rulebook-charcoal/20">
              <div className="relative">
                <div className="absolute -left-[25px] top-0 w-4 h-4 bg-rulebook-crimson rounded-full border-2 border-rulebook-paper shadow-sm"></div>
                <h4 className="text-xl font-serif font-bold text-rulebook-ink mb-1">1. Draft Your Quests</h4>
                <p className="text-rulebook-ink/70 text-sm">Identify the habits you wish to cultivate. Assign them difficulty ratings and attribute types.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[25px] top-0 w-4 h-4 bg-rulebook-royal rounded-full border-2 border-rulebook-paper shadow-sm"></div>
                <h4 className="text-xl font-serif font-bold text-rulebook-ink mb-1">2. Execute Daily</h4>
                <p className="text-rulebook-ink/70 text-sm">Perform your tasks in the real world. Return to the log to mark them complete.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[25px] top-0 w-4 h-4 bg-rulebook-forest rounded-full border-2 border-rulebook-paper shadow-sm"></div>
                <h4 className="text-xl font-serif font-bold text-rulebook-ink mb-1">3. Reap Rewards</h4>
                <p className="text-rulebook-ink/70 text-sm">Collect XP and Gold. Unlock new chapters of your journey and expand your capabilities.</p>
              </div>
            </div>
            <div className="mt-10">
              <button onClick={() => navigate('/register')} className="flex items-center gap-2 text-rulebook-crimson font-bold hover:gap-3 transition-all uppercase tracking-widest text-sm border-b-2 border-rulebook-crimson pb-1">
                Start Campaign <Map className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Decorative Stat Block */}
          <div className="bg-rulebook-paper border-4 double border-rulebook-charcoal p-8 shadow-rulebook rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="border-b-2 border-rulebook-charcoal mb-4 pb-2 flex justify-between items-end">
              <h3 className="font-serif font-bold text-2xl uppercase">Character Sheet</h3>
              <span className="font-mono text-xs">Lvl. 1 Novice</span>
            </div>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between items-center">
                <span>STR (Strength)</span>
                <div className="w-32 h-2 bg-rulebook-charcoal/10 rounded-full overflow-hidden border border-rulebook-charcoal/20">
                  <div className="h-full bg-rulebook-crimson w-3/4"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>INT (Intelligence)</span>
                <div className="w-32 h-2 bg-rulebook-charcoal/10 rounded-full overflow-hidden border border-rulebook-charcoal/20">
                  <div className="h-full bg-rulebook-royal w-1/2"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>HLT (Health)</span>
                <div className="w-32 h-2 bg-rulebook-charcoal/10 rounded-full overflow-hidden border border-rulebook-charcoal/20">
                  <div className="h-full bg-rulebook-forest w-4/5"></div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t-2 border-rulebook-charcoal text-center">
              <p className="font-serif italic text-rulebook-ink/60 text-sm">"Consistency is the key to power."</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-rulebook-ink text-rulebook-paper text-center px-4 border-t-4 border-double border-rulebook-paper/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6 text-rulebook-paper">
            Write Your Legend
          </h2>
          <p className="text-rulebook-paper/80 text-lg mb-10 leading-relaxed font-mono">
            Join the guild of self-improvers. Your adventure begins with a single step.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-rulebook-paper text-rulebook-ink font-serif font-bold text-lg rounded-sm hover:bg-rulebook-crimson hover:text-rulebook-paper transition-colors shadow-lg uppercase tracking-widest border-2 border-transparent"
          >
            Create Character
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-rulebook-paper py-12 border-t-4 border-double border-rulebook-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Scroll className="w-5 h-5 text-rulebook-ink" />
              <span className="font-serif font-bold text-rulebook-ink">Quest Tracker</span>
            </div>
            <p className="text-xs font-mono text-rulebook-ink/60">
              EST. 2025 | THE GUILD OF HABITS
            </p>
            <div className="flex items-center gap-4">
              <ConnectionStatus />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
