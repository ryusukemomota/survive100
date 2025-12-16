'use client'

import { Disease } from '@/types/game'

interface DiseasePanelProps {
  diseases: Disease[]
}

export default function DiseasePanel({ diseases }: DiseasePanelProps) {
  if (diseases.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-2">✨</span>
          <span className="text-green-800 font-medium">健康状態良好！</span>
        </div>
      </div>
    )
  }

  const getSeverityColor = (severity: number) => {
    if (severity >= 4) return 'bg-red-100 border-red-300 text-red-800'
    if (severity >= 3) return 'bg-orange-100 border-orange-300 text-orange-800'
    return 'bg-yellow-100 border-yellow-300 text-yellow-800'
  }

  const getSeverityIcon = (severity: number) => {
    if (severity >= 4) return '🚨'
    if (severity >= 3) return '⚠️'
    return '⚡'
  }

  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold mb-3">現在の病気</h3>
      {diseases.map((disease) => (
        <div
          key={disease.id}
          className={`rounded-lg p-3 mb-2 border ${getSeverityColor(disease.severity)}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xl mr-2">{getSeverityIcon(disease.severity)}</span>
              <div>
                <div className="font-medium">{disease.name}</div>
                <div className="text-sm opacity-80">{disease.description}</div>
                <div className="text-xs mt-1 space-y-1">
                  <div>💰 治療費: {disease.treatmentCost?.toLocaleString()}HC</div>
                  {disease.treatmentSuccess > 0 ? (
                    <div>🎯 治癒率: {disease.treatmentSuccess}%</div>
                  ) : (
                    <div>⚕️ 慢性疾患（症状管理のみ）</div>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right text-xs">
              <div>重症度: {disease.severity}</div>
              <div className="text-red-600 mt-1">
                毎年 -{disease.healthDrain}HC
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}