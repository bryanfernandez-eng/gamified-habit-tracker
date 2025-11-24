import React, { useState, useEffect, useRef } from 'react'
import { Calendar, Check, AlertCircle } from 'lucide-react'
import { gameApi } from '../../services/gameApi'

export function DailyCheckInTracker({ onCheckInSuccess }) {
  const [checkinData, setCheckinData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checkingIn, setCheckingIn] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const calendarContainerRef = useRef(null)

  // Load check-in history on mount
  useEffect(() => {
    loadCheckinHistory()
  }, [])

  // Auto-scroll to the right when data loads
  useEffect(() => {
    if (calendarContainerRef.current && checkinData) {
      setTimeout(() => {
        calendarContainerRef.current.scrollLeft = calendarContainerRef.current.scrollWidth
      }, 0)
    }
  }, [checkinData])

  const loadCheckinHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await gameApi.getCheckInHistory()
      setCheckinData(data)
    } catch (err) {
      console.error('Failed to load check-in history:', err)
      setError('Failed to load check-in history')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async () => {
    try {
      setCheckingIn(true)
      setError(null)
      const result = await gameApi.checkIn()

      // Update local data
      setSuccess(true)
      if (checkinData) {
        const today = new Date().toISOString().split('T')[0]
        setCheckinData({
          ...checkinData,
          checked_in_today: true,
          checkin_dates: [...checkinData.checkin_dates, today],
          total_checkins: checkinData.total_checkins + 1
        })
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)

      // Call parent callback to update stats
      onCheckInSuccess?.(result.user_stats)
    } catch (err) {
      console.error('Check-in failed:', err)
      setError(err.response?.data?.error || 'Failed to check in. Try again tomorrow!')
      setTimeout(() => setError(null), 3000)
    } finally {
      setCheckingIn(false)
    }
  }

  // Calculate contribution calendar data
  const getContributionCalendar = () => {
    if (!checkinData?.checkin_dates) return []

    const today = new Date()
    const oneYearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000)

    // Create a set of check-in dates for fast lookup
    const checkinSet = new Set(checkinData.checkin_dates)

    // Generate array of last 365 days
    const calendar = []
    const current = new Date(oneYearAgo)

    while (current <= today) {
      const dateStr = current.toISOString().split('T')[0]
      calendar.push({
        date: dateStr,
        hasCheckin: checkinSet.has(dateStr)
      })
      current.setDate(current.getDate() + 1)
    }

    return calendar
  }

  if (loading) {
    return (
      <div className="rulebook-card p-4 text-center text-rulebook-ink/60">
        <p className="font-serif">Loading check-in data...</p>
      </div>
    )
  }

  const calendar = getContributionCalendar()
  const weeks = []
  for (let i = 0; i < calendar.length; i += 7) {
    weeks.push(calendar.slice(i, i + 7))
  }

  return (
    <div className="rulebook-card p-4 mt-4">
      {/* Check-In Button */}
      <div className="mb-4">
        <button
          onClick={handleCheckIn}
          disabled={checkingIn || checkinData?.checked_in_today}
          className={`w-full py-3 px-4 font-serif font-bold uppercase tracking-wider border-2 transition-all flex items-center justify-center gap-2 rounded-sm shadow-sm ${checkinData?.checked_in_today
              ? 'bg-rulebook-ink/10 border-rulebook-ink/20 text-rulebook-ink/40 cursor-not-allowed'
              : checkingIn
                ? 'bg-rulebook-ink text-rulebook-paper border-rulebook-ink'
                : 'bg-rulebook-crimson text-rulebook-paper border-rulebook-ink hover:bg-rulebook-ink hover:border-rulebook-crimson'
            }`}
        >
          <Check size={18} />
          {checkinData?.checked_in_today
            ? 'Checked In Today!'
            : checkingIn
              ? 'Signing Ledger...'
              : 'Daily Check-In'}
        </button>

        {success && (
          <div className="mt-2 p-2 bg-rulebook-forest/10 border-2 border-rulebook-forest text-rulebook-forest text-center text-sm font-serif font-bold">
            ✓ You earned 100 XP!
          </div>
        )}

        {error && (
          <div className="mt-2 p-2 bg-rulebook-crimson/10 border-2 border-rulebook-crimson text-rulebook-crimson text-center text-sm flex items-center justify-center gap-2 font-serif font-bold">
            <AlertCircle size={14} />
            {error}
          </div>
        )}
      </div>

      {/* Contribution Calendar */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3 border-b border-rulebook-ink/10 pb-2">
          <Calendar size={16} className="text-rulebook-royal" />
          <h3 className="text-sm font-bold text-rulebook-ink uppercase tracking-wide font-serif">
            Adventure Log ({checkinData?.total_checkins || 0} days)
          </h3>
        </div>

        <style>{`
          .checkin-scrollbar::-webkit-scrollbar {
            height: 8px;
          }
          .checkin-scrollbar::-webkit-scrollbar-track {
            background: rgba(43, 43, 43, 0.05);
            border-radius: 4px;
          }
          .checkin-scrollbar::-webkit-scrollbar-thumb {
            background: #8B0000;
            border-radius: 4px;
            border: 2px solid #F0E6D2;
          }
          .checkin-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #2B2B2B;
          }
          .checkin-scrollbar {
            scrollbar-color: #8B0000 rgba(43, 43, 43, 0.05);
            scrollbar-width: thin;
          }
        `}</style>

        {/* Calendar Grid */}
        <div
          ref={calendarContainerRef}
          className="overflow-x-auto checkin-scrollbar pb-2"
        >
          <div className="inline-block">
            {weeks.length > 0 ? (
              <div className="flex gap-1">
                {weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1">
                    {week.map((day, dayIdx) => (
                      <div
                        key={`${weekIdx}-${dayIdx}`}
                        className={`w-3 h-3 border ${day.hasCheckin
                            ? 'bg-rulebook-crimson border-rulebook-ink/40'
                            : 'bg-rulebook-ink/5 border-rulebook-ink/10'
                          }`}
                        title={day.date}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-rulebook-ink/40 font-serif italic">No check-ins yet. Start your journey today!</p>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-3 text-xs text-rulebook-ink/60 font-mono uppercase tracking-wide">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-rulebook-ink/5 border border-rulebook-ink/10" />
            <div className="w-2 h-2 bg-rulebook-crimson/40 border border-rulebook-ink/20" />
            <div className="w-2 h-2 bg-rulebook-crimson border border-rulebook-ink/40" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 p-3 bg-rulebook-ink/5 border border-rulebook-ink/10 text-center rounded-sm">
        <p className="text-sm text-rulebook-ink font-serif">
          <span className="font-bold text-rulebook-crimson text-lg">{checkinData?.total_checkins || 0}</span> Total Check-ins
        </p>
        {checkinData?.checked_in_today && (
          <p className="text-xs text-rulebook-forest mt-1 font-bold font-serif uppercase tracking-wide">✓ Ledger Signed Today</p>
        )}
      </div>
    </div>
  )
}
