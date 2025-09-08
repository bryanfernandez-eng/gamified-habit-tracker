import React from 'react'
import { Trophy, Lock, CheckCircle } from 'lucide-react'

export function AchievementPanel() {
  const achievements = [
    {
      id: 1,
      name: 'Early Riser',
      description: 'Complete morning workout 5 days in a row',
      progress: 3,
      total: 5,
      unlocked: false,
      reward: '+5 Strength, Morning Hero outfit',
    },
    {
      id: 2,
      name: 'Bookworm',
      description: 'Read for 30 minutes for 10 days',
      progress: 10,
      total: 10,
      unlocked: true,
      reward: "+10 Intelligence, Scholar's Glasses",
    },
    {
      id: 3,
      name: 'Social Butterfly',
      description: 'Complete 15 social activities',
      progress: 8,
      total: 15,
      unlocked: false,
      reward: '+10 Social, Party Hat accessory',
    },
    {
      id: 4,
      name: 'Creative Genius',
      description: 'Practice a creative hobby 20 times',
      progress: 12,
      total: 20,
      unlocked: false,
      reward: "+15 Creativity, Artist's Beret",
    },
    {
      id: 5,
      name: 'Fitness Fanatic',
      description: 'Complete 30 workout sessions',
      progress: 30,
      total: 30,
      unlocked: true,
      reward: '+20 Strength, Gym Champion outfit',
    },
  ]
  
  return (
    <div className="bg-gray-800 border-4 border-double border-gray-700 p-4">
      <h2 className="text-2xl font-bold text-yellow-400 uppercase mb-4 border-b-2 border-gray-700 pb-2">
        Trophies
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`border-4 ${
              achievement.unlocked 
                ? 'border-yellow-600 bg-yellow-900' 
                : 'border-gray-600 bg-gray-700'
            }`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div
                  className={`p-2 ${
                    achievement.unlocked 
                      ? 'bg-yellow-600 border-2 border-yellow-500' 
                      : 'bg-gray-600 border-2 border-gray-500'
                  } text-white mr-3`}
                >
                  {achievement.unlocked ? (
                    <Trophy size={20} />
                  ) : (
                    <Lock size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3
                      className={`font-bold ${
                        achievement.unlocked 
                          ? 'text-yellow-300' 
                          : 'text-gray-300'
                      }`}
                    >
                      {achievement.name}
                    </h3>
                    {achievement.unlocked && (
                      <CheckCircle
                        size={16}
                        className="text-green-400 ml-2"
                      />
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {achievement.description}
                  </p>
                  {!achievement.unlocked && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>
                          {achievement.progress}/{achievement.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-900 border-2 border-gray-700 h-3">
                        <div
                          className="bg-blue-600 h-2"
                          style={{
                            width: `${(achievement.progress / achievement.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                  <div className="mt-2 text-sm bg-gray-800 border-2 border-gray-600 p-2">
                    <span className="font-medium text-yellow-500">
                      Reward:{' '}
                    </span>
                    <span className="text-gray-300">{achievement.reward}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}