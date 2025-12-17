'use client'

import { Action } from '@/types/game'

interface ActionPanelProps {
  actions: Action[]
  player: { health: number; actionPoints: number }
  diseases: any[] // 現在の病気リスト
  onActionSelect: (action: Action) => void
}

export default function ActionPanel({ actions, player, diseases, onActionSelect }: ActionPanelProps) {
  const canAfford = (action: Action) => {
    return action.apCost <= player.actionPoints && 
           (action.hcCost <= player.health || action.hcCost === 0)
  }

  // 治療アクションは現在の病気に対応するもののみ表示
  const availableActions = actions.filter(action => {
    if (action.type !== 'treatment') return true
    return diseases.some(disease => disease.type === action.targetDiseaseType)
  })



  const groupedActions = availableActions.reduce((groups, action) => {
    if (!groups[action.type]) groups[action.type] = []
    groups[action.type].push(action)
    return groups
  }, {} as Record<string, Action[]>)

  const typeLabels = {
    work: '💼 仕事',
    food: '🍽️ 食事',
    exercise: '🏃 運動',
    rest: '😴 休養',
    medical: '🏥 医療',
    treatment: '⚕️ 治療'
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-md mb-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        年間アクション選択 (残り: {player.actionPoints}AP)
      </h3>
      

      
      {Object.entries(groupedActions).map(([type, typeActions]) => (
        <div key={type} className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            {typeLabels[type as keyof typeof typeLabels]}
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {typeActions.map((action) => (
              <button
                key={action.id}
                onClick={() => onActionSelect(action)}
                disabled={!canAfford(action)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  !canAfford(action)
                    ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-blue-300 hover:border-blue-500 hover:bg-blue-50 active:scale-95'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{action.icon}</span>
                    <div>
                      <div className="font-medium text-sm text-gray-900">{action.name}</div>
                      <div className="text-xs text-gray-600">{action.description}</div>
                      {action.riskWarning && (
                        <div className="text-xs text-red-500 mt-1">⚠️ {action.riskWarning}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-700">
                    <div className="font-semibold">AP: {action.apCost}</div>
                    {action.hcCost > 0 && <div className="font-semibold">HC: {action.hcCost.toLocaleString()}</div>}
                    {action.healthEffect > 0 && <div className="text-green-600 font-semibold">+{action.healthEffect.toLocaleString()}HC</div>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}