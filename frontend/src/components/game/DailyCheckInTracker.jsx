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
      <div className="bg-gray-800 border-2 border-gray-700 p-4 text-center text-gray-400">
        <p>Loading check-in data...</p>
      </div>
    )
  }

  const calendar = getContributionCalendar()
  const weeks = []
  for (let i = 0; i < calendar.length; i += 7) {
    weeks.push(calendar.slice(i, i + 7))
  }

  return (
    <div className="bg-gray-800 border-2 border-gray-700 p-4 mt-4">
      {/* Check-In Button */}
      <div className="mb-4">
        <button
          onClick={handleCheckIn}
          disabled={checkingIn || checkinData?.checked_in_today}
          className={`w-full py-3 px-4 font-bold uppercase border-2 transition-all flex items-center justify-center gap-2 ${
            checkinData?.checked_in_today
              ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
              : checkingIn
              ? 'bg-yellow-700 border-yellow-600 text-yellow-200'
              : 'bg-yellow-600 border-yellow-500 text-yellow-100 hover:bg-yellow-500'
          }`}
        >
          <Check size={16} />
          {checkinData?.checked_in_today
            ? 'Checked In Today!'
            : checkingIn
            ? 'Checking In...'
            : 'Daily Check-In'}
        </button>

        {success && (
          <div className="mt-2 p-2 bg-green-900/30 border-2 border-green-600 text-green-300 text-center text-sm font-bold">
            ✓ You earned 100 XP!
          </div>
        )}

        {error && (
          <div className="mt-2 p-2 bg-red-900/30 border-2 border-red-600 text-red-300 text-center text-sm flex items-center justify-center gap-2">
            <AlertCircle size={14} />
            {error}
          </div>
        )}
      </div>

      {/* Contribution Calendar */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={16} className="text-purple-400" />
          <h3 className="text-sm font-bold text-gray-300 uppercase">
            Contribution Calendar ({checkinData?.total_checkins || 0} total)
          </h3>
        </div>

        <style>{`
          .checkin-scrollbar::-webkit-scrollbar {
            height: 8px;
          }
          .checkin-scrollbar::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
          }
          .checkin-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(90deg, #a855f7, #7c3aed);
            border-radius: 4px;
            border: 2px solid rgba(0, 0, 0, 0.1);
          }
          .checkin-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(90deg, #9333ea, #6d28d9);
          }
          .checkin-scrollbar {
            scrollbar-color: #a855f7 rgba(0, 0, 0, 0.2);
            scrollbar-width: thin;
          }
        `}</style>

        {/* Calendar Grid */}
        <div
          ref={calendarContainerRef}
          className="overflow-x-auto checkin-scrollbar"
        >
          <div className="inline-block">
            {weeks.length > 0 ? (
              <div className="flex gap-1">
                {weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1">
                    {week.map((day, dayIdx) => (
                      <div
                        key={`${weekIdx}-${dayIdx}`}
                        className={`w-3 h-3 border border-gray-700 ${
                          day.hasCheckin
                            ? 'bg-green-600'
                            : 'bg-gray-900'
                        }`}
                        title={day.date}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No check-ins yet. Start today!</p>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-900 border border-gray-700" />
            <div className="w-2 h-2 bg-green-800 border border-gray-700" />
            <div className="w-2 h-2 bg-green-600 border border-gray-700" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 p-3 bg-gray-700 border-2 border-gray-600 text-center">
        <p className="text-sm text-gray-300">
          <span className="font-bold text-yellow-400">{checkinData?.total_checkins || 0}</span> Total Check-ins
        </p>
        {checkinData?.checked_in_today && (
          <p className="text-xs text-green-400 mt-1">✓ Already checked in today!</p>
        )}
      </div>
    </div>
  )
}
