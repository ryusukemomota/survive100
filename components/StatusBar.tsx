'use client'

import { PlayerStats } from '@/types/game'

interface StatusBarProps {
  player: PlayerStats
}

export default function StatusBar({ player }: StatusBarProps) {
  const getBarColor = (current: number, max: number, isHC = false) => {
    if (isHC) {
      // ヘルス通貨は金額で色分け
      if (current > 5000) return 'bg-green-500'
      if (current > 2000) return 'bg-yellow-500'
      return 'bg-red-500'
    }
    const percentage = (current / max) * 100
    if (percentage > 70) return 'bg-green-500'
    if (percentage > 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const StatBar = ({ 
    label, 
    current, 
    max, 
    color 
  }: { 
    label: string
    current: number
    max: number
    color: string 
  }) => (
    <div className="mb-3">
      <div className="flex justify-between text-sm font-medium mb-1 text-gray-800">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-900 font-bold">{Math.round(current)}/{Math.round(max)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-300 ${getBarColor(current, max)}`}
          style={{ width: `${Math.max(0, (current / max) * 100)}%` }}
        />
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-lg p-4 shadow-md mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">SURVIVE 100</h2>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{player.age}歳</div>
          <div className="text-sm text-gray-600">残り: {100 - player.age}年</div>
          <div className="text-xs text-blue-600 font-semibold">AP: {player.actionPoints}/4</div>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm font-medium mb-1">
          <span className="text-gray-700">💰 ヘルス通貨（HC）</span>
          <span className="text-gray-900 font-bold">{Math.round(player.health).toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${getBarColor(player.health, player.maxHealth, true)}`}
            style={{ width: `${Math.min(100, (player.health / player.maxHealth) * 100)}%` }}
          />
        </div>
      </div>
      
      <StatBar 
        label="🛡️ 免疫力" 
        current={player.immunity} 
        max={player.maxImmunity}
        color="immunity"
      />
      <StatBar 
        label="💪 筋力" 
        current={player.strength} 
        max={player.maxStrength}
        color="strength"
      />
      <StatBar 
        label="🧠 精神力" 
        current={player.mental} 
        max={player.maxMental}
        color="mental"
      />
    </div>
  )
}