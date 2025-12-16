import { PlayerStats, Disease, Action, GameState } from '@/types/game'

export const INITIAL_STATS: PlayerStats = {
  age: 20,
  health: 5000, // 初期ヘルス通貨
  immunity: 100,
  strength: 100,
  mental: 100,
  maxHealth: 10000,
  maxImmunity: 100,
  maxStrength: 100,
  maxMental: 100,
  glycationLevel: 0,
  inflammationLevel: 0,
  mutationLevel: 0,
  actionPoints: 4, // 年間4アクション
}

export const DISEASES: Disease[] = [
  {
    id: 'diabetes',
    name: '糖尿病',
    type: 'diabetes',
    severity: 2,
    healthDrain: 1,
    immunityDrain: 0.5,
    strengthDrain: 0.5,
    mentalDrain: 0.3,
    description: '血糖値の管理が必要です',
    treatmentCost: 2000,
    treatmentSuccess: 0, // 完治不可
    chronicManagement: true
  },
  {
    id: 'cancer',
    name: 'がん',
    type: 'cancer',
    severity: 4,
    healthDrain: 2,
    immunityDrain: 1.5,
    strengthDrain: 1,
    mentalDrain: 1,
    description: '早期治療が重要です',
    treatmentCost: 8000,
    treatmentSuccess: 70, // 70%の治癒率
    chronicManagement: false
  },
  {
    id: 'autoimmune',
    name: '自己免疫疾患',
    type: 'autoimmune',
    severity: 3,
    healthDrain: 1.5,
    immunityDrain: 2,
    strengthDrain: 0.8,
    mentalDrain: 0.7,
    description: '免疫システムの異常です',
    treatmentCost: 4000,
    treatmentSuccess: 30, // 30%の寛解率
    chronicManagement: true
  },
  {
    id: 'infection',
    name: '感染症',
    type: 'infection',
    severity: 2,
    healthDrain: 1.2,
    immunityDrain: 1,
    strengthDrain: 0.5,
    mentalDrain: 0.3,
    description: '休息と治療が必要です',
    treatmentCost: 1500,
    treatmentSuccess: 90, // 90%の治癒率
    chronicManagement: false
  }
]

export const ACTIONS: Action[] = [
  // 仕事系（収入源）
  {
    id: 'regular_work',
    name: '通常勤務',
    type: 'work',
    apCost: 2,
    hcCost: 0,
    healthEffect: 1500, // 給与
    immunityEffect: 0,
    strengthEffect: -1,
    mentalEffect: -2,
    glycationEffect: 1,
    inflammationEffect: 1,
    mutationEffect: 0,
    description: '安定した収入を得る',
    icon: '💼'
  },
  {
    id: 'overtime_work',
    name: '残業・副業',
    type: 'work',
    apCost: 3,
    hcCost: 0,
    healthEffect: 2500,
    immunityEffect: -2,
    strengthEffect: -2,
    mentalEffect: -4,
    glycationEffect: 2,
    inflammationEffect: 3,
    mutationEffect: 1,
    description: '高収入だが体への負担大',
    riskWarning: '慢性疲労・ストレス蓄積',
    icon: '💰'
  },
  
  // 食事系
  {
    id: 'fast_food',
    name: 'ファストフード',
    type: 'food',
    apCost: 1,
    hcCost: 300,
    healthEffect: 0,
    immunityEffect: -1,
    strengthEffect: 0,
    mentalEffect: 2,
    glycationEffect: 3,
    inflammationEffect: 1,
    mutationEffect: 0,
    description: '安くて美味しいが不健康',
    riskWarning: '糖化リスク大',
    icon: '🍔'
  },
  {
    id: 'balanced_meal',
    name: 'バランス食',
    type: 'food',
    apCost: 1,
    hcCost: 800,
    healthEffect: 0,
    immunityEffect: 1,
    strengthEffect: 1,
    mentalEffect: 1,
    glycationEffect: 0,
    inflammationEffect: 0,
    mutationEffect: 0,
    description: '普通の健康的な食事',
    icon: '🍱'
  },
  {
    id: 'organic_food',
    name: 'オーガニック自炊',
    type: 'food',
    apCost: 2,
    hcCost: 1500,
    healthEffect: 0,
    immunityEffect: 3,
    strengthEffect: 2,
    mentalEffect: 1,
    glycationEffect: -2,
    inflammationEffect: -2,
    mutationEffect: -1,
    description: '最高品質の食事で体質改善',
    icon: '🥗'
  },
  
  // 運動系
  {
    id: 'light_exercise',
    name: '軽い運動',
    type: 'exercise',
    apCost: 1,
    hcCost: 200,
    healthEffect: 0,
    immunityEffect: 2,
    strengthEffect: 3,
    mentalEffect: 2,
    glycationEffect: -1,
    inflammationEffect: -1,
    mutationEffect: 0,
    description: 'ウォーキングやストレッチ',
    icon: '🚶‍♂️'
  },
  {
    id: 'gym_training',
    name: 'ジム通い',
    type: 'exercise',
    apCost: 2,
    hcCost: 800,
    healthEffect: 0,
    immunityEffect: 4,
    strengthEffect: 6,
    mentalEffect: 3,
    glycationEffect: -3,
    inflammationEffect: -2,
    mutationEffect: -1,
    description: '本格的な筋力トレーニング',
    icon: '🏋️‍♂️'
  },
  
  // 休養系
  {
    id: 'adequate_sleep',
    name: '十分な睡眠',
    type: 'rest',
    apCost: 1,
    hcCost: 0,
    healthEffect: 0,
    immunityEffect: 3,
    strengthEffect: 1,
    mentalEffect: 4,
    glycationEffect: -1,
    inflammationEffect: -2,
    mutationEffect: -1,
    description: '7-8時間の質の良い睡眠',
    icon: '😴'
  },
  {
    id: 'vacation',
    name: 'バケーション',
    type: 'rest',
    apCost: 2,
    hcCost: 2000,
    healthEffect: 0,
    immunityEffect: 2,
    strengthEffect: 0,
    mentalEffect: 8,
    glycationEffect: -1,
    inflammationEffect: -3,
    mutationEffect: 0,
    description: 'ストレス解消と心の回復',
    icon: '🏖️'
  },
  
  // 医療系
  {
    id: 'health_checkup',
    name: '健康診断',
    type: 'medical',
    apCost: 1,
    hcCost: 1200,
    healthEffect: 0,
    immunityEffect: 0,
    strengthEffect: 0,
    mentalEffect: -1,
    glycationEffect: 0,
    inflammationEffect: 0,
    mutationEffect: -5, // 早期発見効果
    description: '病気の早期発見',
    icon: '🏥'
  },
  {
    id: 'supplements',
    name: 'サプリメント',
    type: 'medical',
    apCost: 1,
    hcCost: 600,
    healthEffect: 0,
    immunityEffect: 2,
    strengthEffect: 1,
    mentalEffect: 0,
    glycationEffect: -1,
    inflammationEffect: -1,
    mutationEffect: 0,
    description: '栄養補助で健康維持',
    icon: '💊'
  },
  
  // 治療系
  {
    id: 'treat_infection',
    name: '感染症治療',
    type: 'treatment',
    apCost: 2,
    hcCost: 1500,
    healthEffect: 0,
    immunityEffect: -2, // 治療による一時的な免疫低下
    strengthEffect: -1,
    mentalEffect: -2,
    glycationEffect: 0,
    inflammationEffect: -3,
    mutationEffect: 0,
    description: '抗生物質による感染症治療',
    targetDiseaseType: 'infection',
    treatmentType: 'cure',
    icon: '💉'
  },
  {
    id: 'cancer_treatment',
    name: 'がん治療',
    type: 'treatment',
    apCost: 3,
    hcCost: 8000,
    healthEffect: 0,
    immunityEffect: -8, // 抗がん剤の副作用
    strengthEffect: -6,
    mentalEffect: -5,
    glycationEffect: 0,
    inflammationEffect: 2, // 治療による炎症
    mutationEffect: 0,
    description: '手術・抗がん剤治療',
    riskWarning: '重篤な副作用あり',
    targetDiseaseType: 'cancer',
    treatmentType: 'cure',
    icon: '🏥'
  },
  {
    id: 'diabetes_management',
    name: '糖尿病管理',
    type: 'treatment',
    apCost: 1,
    hcCost: 2000,
    healthEffect: 0,
    immunityEffect: 1,
    strengthEffect: 0,
    mentalEffect: -1,
    glycationEffect: -5, // 血糖コントロール
    inflammationEffect: -2,
    mutationEffect: 0,
    description: 'インスリン・食事療法',
    targetDiseaseType: 'diabetes',
    treatmentType: 'manage',
    icon: '💊'
  },
  {
    id: 'autoimmune_treatment',
    name: '免疫抑制療法',
    type: 'treatment',
    apCost: 2,
    hcCost: 4000,
    healthEffect: 0,
    immunityEffect: -3, // 免疫抑制の副作用
    strengthEffect: -2,
    mentalEffect: -3,
    glycationEffect: 0,
    inflammationEffect: -4,
    mutationEffect: 1, // 免疫抑制による変異リスク
    description: 'ステロイド・免疫抑制剤',
    riskWarning: '感染症リスク増加',
    targetDiseaseType: 'autoimmune',
    treatmentType: 'cure',
    icon: '💊'
  }
]

export function calculateAging(age: number): Partial<PlayerStats> {
  const agingFactor = Math.max(0, (age - 20) / 80)
  
  // 年収（ヘルス通貨の自然回復）も年齢で変化
  const baseIncome = age < 65 ? 3000 : 1500 // 定年後は年金
  
  return {
    maxImmunity: Math.max(40, 100 - agingFactor * 40),
    maxStrength: Math.max(30, 100 - agingFactor * 50),
    maxMental: Math.max(60, 100 - agingFactor * 20),
    maxHealth: Math.max(5000, 15000 - agingFactor * 5000), // 最大貯蓄額
  }
}

export function calculateYearlyDecay(player: PlayerStats): Partial<PlayerStats> {
  const age = player.age
  let decay = {
    immunity: 0,
    strength: 0,
    mental: 0,
    mutationLevel: 1, // 老化による変異蓄積
  }
  
  // 年齢による自然減少
  if (age >= 30) decay.strength += 0.5
  if (age >= 40) decay.immunity += 1
  if (age >= 50) {
    decay.strength += 1
    decay.immunity += 1
  }
  if (age >= 60) {
    decay.strength += 1.5
    decay.immunity += 2
    decay.mental += 1
  }
  
  return decay
}

export function checkDiseaseRisk(player: PlayerStats): Disease | null {
  const { age, immunity, glycationLevel, inflammationLevel, mutationLevel } = player
  
  // 各病気の発症リスク計算
  const diabetesRisk = (glycationLevel * 2) + Math.max(0, age - 40) * 0.5 + (100 - immunity) * 0.3
  const cancerRisk = (mutationLevel * 1.5) + (inflammationLevel * 1) + Math.max(0, age - 50) * 0.8
  const autoImmuneRisk = (inflammationLevel * 2) + Math.max(0, age - 30) * 0.3
  const infectionRisk = Math.max(0, 100 - immunity) * 2 + (age > 70 ? 20 : 0)
  
  // 最もリスクの高い病気をチェック
  const risks = [
    { disease: DISEASES[0], risk: diabetesRisk, threshold: 80 },
    { disease: DISEASES[1], risk: cancerRisk, threshold: 100 },
    { disease: DISEASES[2], risk: autoImmuneRisk, threshold: 70 },
    { disease: DISEASES[3], risk: infectionRisk, threshold: 60 }
  ]
  
  for (const { disease, risk, threshold } of risks) {
    if (Math.random() * 100 < Math.min(risk, 25)) { // 最大25%の発症率
      return disease
    }
  }
  
  return null
}

export function applyDiseaseEffects(player: PlayerStats, diseases: Disease[]): PlayerStats {
  let newStats = { ...player }
  
  diseases.forEach(disease => {
    newStats.health = Math.max(0, newStats.health - disease.healthDrain)
    newStats.immunity = Math.max(0, newStats.immunity - disease.immunityDrain)
    newStats.strength = Math.max(0, newStats.strength - disease.strengthDrain)
    newStats.mental = Math.max(0, newStats.mental - disease.mentalDrain)
  })
  
  return newStats
}

export function checkGameOver(player: PlayerStats): { isGameOver: boolean; cause?: string } {
  if (player.immunity <= 0) return { isGameOver: true, cause: '免疫不全による多臓器不全' }
  if (player.strength <= 0) return { isGameOver: true, cause: '筋力低下による転倒事故' }
  if (player.mental <= 0) return { isGameOver: true, cause: '精神的限界による自殺' }
  if (player.health < 0) return { isGameOver: true, cause: '生活破綻・貧困による餓死' }
  
  return { isGameOver: false }
}

export function isGameWon(player: PlayerStats): boolean {
  return player.age >= 100
}

export function calculateScore(player: PlayerStats): number {
  const ageBonus = player.age * 100
  const healthBonus = Math.max(0, player.health) * 0.1
  const statBonus = (player.immunity + player.strength + player.mental) * 10
  return Math.round(ageBonus + healthBonus + statBonus)
}

export function attemptTreatment(disease: Disease, player: PlayerStats): { success: boolean; message: string } {
  const successRate = disease.treatmentSuccess
  const isSuccess = Math.random() * 100 < successRate
  
  if (successRate === 0) {
    // 慢性疾患の管理
    return {
      success: false,
      message: `${disease.name}は慢性疾患のため完治できませんが、症状を軽減しました`
    }
  }
  
  if (isSuccess) {
    return {
      success: true,
      message: `${disease.name}の治療に成功しました！`
    }
  } else {
    return {
      success: false,
      message: `${disease.name}の治療は効果がありませんでした...`
    }
  }
}

export function getAvailableTreatments(diseases: Disease[]): Action[] {
  const treatmentActions = ACTIONS.filter(action => action.type === 'treatment')
  return treatmentActions.filter(treatment => 
    diseases.some(disease => disease.type === treatment.targetDiseaseType)
  )
}

export function processYearEnd(player: PlayerStats): PlayerStats {
  let newPlayer = { ...player }
  
  // 年収（基本収入）
  const baseIncome = newPlayer.age < 65 ? 3000 : 1500
  newPlayer.health += baseIncome
  
  // 老化による自然減少
  const decay = calculateYearlyDecay(newPlayer)
  newPlayer.immunity = Math.max(0, newPlayer.immunity - (decay.immunity || 0))
  newPlayer.strength = Math.max(0, newPlayer.strength - (decay.strength || 0))
  newPlayer.mental = Math.max(0, newPlayer.mental - (decay.mental || 0))
  newPlayer.mutationLevel += decay.mutationLevel || 0
  
  // 年齢上昇と最大値調整
  newPlayer.age += 1
  const agingEffects = calculateAging(newPlayer.age)
  newPlayer = { ...newPlayer, ...agingEffects }
  
  // 最大値を超えている場合は調整
  newPlayer.immunity = Math.min(newPlayer.immunity, newPlayer.maxImmunity)
  newPlayer.strength = Math.min(newPlayer.strength, newPlayer.maxStrength)
  newPlayer.mental = Math.min(newPlayer.mental, newPlayer.maxMental)
  newPlayer.health = Math.min(newPlayer.health, newPlayer.maxHealth)
  
  // アクションポイントリセット
  newPlayer.actionPoints = 4
  
  return newPlayer
}