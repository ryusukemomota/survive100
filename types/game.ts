export interface PlayerStats {
  age: number
  health: number // ヘルス通貨（HC）
  immunity: number
  strength: number
  mental: number
  maxHealth: number
  maxImmunity: number
  maxStrength: number
  maxMental: number
  // リスクパラメータ（隠しステータス）
  glycationLevel: number // 糖化レベル
  inflammationLevel: number // 炎症レベル
  mutationLevel: number // 変異蓄積
  actionPoints: number // 年間アクションポイント
}

export interface Disease {
  id: string
  name: string
  type: 'diabetes' | 'cancer' | 'autoimmune' | 'infection'
  severity: number
  healthDrain: number
  immunityDrain: number
  strengthDrain: number
  mentalDrain: number
  description: string
  treatmentCost: number // 治療費用
  treatmentSuccess: number // 治療成功率（0-100）
  chronicManagement?: boolean // 慢性疾患管理が可能か
}

export interface Action {
  id: string
  name: string
  type: 'work' | 'food' | 'exercise' | 'rest' | 'medical' | 'treatment'
  apCost: number // アクションポイントコスト
  hcCost: number // ヘルス通貨コスト
  healthEffect: number
  immunityEffect: number
  strengthEffect: number
  mentalEffect: number
  glycationEffect: number
  inflammationEffect: number
  mutationEffect: number
  description: string
  riskWarning?: string
  icon: string
  targetDiseaseType?: 'diabetes' | 'cancer' | 'autoimmune' | 'infection' // 治療対象の病気
  treatmentType?: 'cure' | 'manage' // 完治 or 症状管理
}

export interface GameState {
  player: PlayerStats
  diseases: Disease[]
  year: number
  gameOver: boolean
  gameWon: boolean
  deathCause?: string
  lastAction?: string
  yearlyEvents: string[]
}

export interface GameResult {
  reachedAge: number
  causeOfDeath: string
  finalStats: PlayerStats
  totalScore: number
  playedAt: Date
}