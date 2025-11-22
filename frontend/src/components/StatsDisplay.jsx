import React from 'react'
import {
  Shield,
  Brain,
  Palette,
  Users,
  Heart,
} from 'lucide-react'

export function StatsDisplay() {
  const stats = {
    strength: {
      level: 12,
      xp: 65,
      nextLevel: 100,
      description: 'Physical power and endurance',
      recentHabits: ['Morning Workout', 'Take the stairs', '10,000 steps'],
    },
    intelligence: {
      level: 15,
      xp: 80,
      nextLevel: 100,
      description: 'Knowledge and mental acuity',
      recentHabits: [
        'Read for 30 minutes',
        'Learn a new word',
        'Solve a puzzle',
      ],
    },
    creativity: {
      level: 8,
      xp: 45,
      nextLevel: 100,
      description: 'Artistic and innovative thinking',
      recentHabits: [
        'Practice drawing',
        'Write in journal',
        'Play an instrument',
      ],
    },
    social: {
      level: 10,
      xp: 30,
      nextLevel: 100,
      description: 'Communication and relationships',
      recentHabits: [
        'Call a friend',
        'Attend social event',
        'Give a compliment',
      ],
    },
    health: {
      level: 14,
      xp: 90,
      nextLevel: 100,
      description: 'Physical wellbeing and vitality',
      recentHabits: ['Drink water', '8 hours of sleep', 'Eat a healthy meal'],
    },
  }
  
  const StatCard = ({
    name,
    icon,
    color,
    bgColor,
    borderColor,
    stat,
  }) => {
    return (
      <div
        className={`${bgColor} border-4 border-double ${borderColor} overflow-hidden`}
      >
        <div className={`p-3 border-b-2 ${borderColor}`}>
          <div className="flex items-center">
            <div className={`p-2 ${color} border-2  mr-3`}>
              {icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-200 uppercase">{name}</h3>
              <p className="text-sm text-gray-400">{stat.description}</p>
            </div>
            <div className="ml-auto">
              <span className={`text-2xl font-bold ${color}`}>
                {stat.level}
              </span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1 text-gray-300">
              <span>To level {stat.level + 1}</span>
              <span>
                {stat.xp}/{stat.nextLevel} XP
              </span>
            </div>
            <div className="w-full bg-gray-900 border-2 border-gray-700 h-4">
              <div
                className={`${color} h-3 border-r-2 border-gray-700`}
                style={{
                  width: `${stat.xp}%`,
                }}
              ></div>
            </div>
          </div>
          <div className="border-2 border-gray-700 bg-gray-800 p-2">
            <h4 className="font-medium text-sm text-yellow-400 uppercase mb-2 border-b border-gray-700 pb-1">
              Recent Quests:
            </h4>
            <ul className="text-sm text-gray-300">
              {stat.recentHabits.map((habit, index) => (
                <li key={index} className="flex items-center py-1">
                  <span className={`w-2 h-2 ${color} mr-2`}></span>
                  {habit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-gray-800 border-4 border-double border-gray-700 p-4">
      <h2 className="text-2xl font-bold text-yellow-400 uppercase mb-4 border-b-2 border-gray-700 pb-2">
        Character Stats
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          name="Strength"
          icon={<Shield size={16} />}
          color="text-red-500"
          bgColor="bg-red-900"
          borderColor="border-red-700"
          stat={stats.strength}
        />
        <StatCard
          name="Intelligence"
          icon={<Brain size={16} />}
          color="text-blue-500"
          bgColor="bg-blue-900"
          borderColor="border-blue-700"
          stat={stats.intelligence}
        />
        <StatCard
          name="Creativity"
          icon={<Palette size={16} />}
          color="text-purple-500"
          bgColor="bg-purple-900"
          borderColor="border-purple-700"
          stat={stats.creativity}
        />
        <StatCard
          name="Social"
          icon={<Users size={16} />}
          color="text-green-500"
          bgColor="bg-green-900"
          borderColor="border-green-700"
          stat={stats.social}
        />
        <StatCard
          name="Health"
          icon={<Heart size={16} />}
          color="text-pink-500"
          bgColor="bg-pink-900"
          borderColor="border-pink-700"
          stat={stats.health}
        />
      </div>
    </div>
  )
}