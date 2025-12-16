'use client'

import { useState, useEffect } from 'react'
import { GameState, Action, GameResult } from '@/types/game'
import { 
  INITIAL_STATS, 
  ACTIONS, 
  checkDiseaseRisk, 
  applyDiseaseEffects,
  checkGameOver,
  isGameWon,
  calculateScore,
  processYearEnd,
  attemptTreatment,
  getAvailableTreatments
} from '@/lib/gameLogic'
// 開発環境ではモックサービスを使用
const USE_MOCK_AUTH = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_USE_AMPLIFY
const gameService = USE_MOCK_AUTH 
  ? import('@/lib/mockGameService')
  : import('@/lib/gameService')
import StatusBar from '@/components/StatusBar'
import ActionPanel from '@/components/ActionPanel'
import DiseasePanel from '@/components/DiseasePanel'
import Leaderboard from '@/components/Leaderboard'

export default function Game() {
  const [gameState, setGameState] = useState<GameState>({
    player: INITIAL_STATS,
    diseases: [],
    year: 1,
    gameOver: false,
    gameWon: false,
    yearlyEvents: [],
  })

  const [message, setMessage] = useState<string>('')
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [gameStartTime, setGameStartTime] = useState<number>(Date.now())
  const [saving, setSaving] = useState(false)

  // 年末処理（APが0になったら実行）
  const processYear = () => {
    setGameState(prev => {
      let newPlayer = processYearEnd(prev.player)
      let newDiseases = [...prev.diseases]
      let events: string[] = []
      
      // 病気の発生チェック
      const newDisease = checkDiseaseRisk(newPlayer)
      if (newDisease && !newDiseases.find(d => d.id === newDisease.id)) {
        newDiseases.push(newDisease)
        events.push(`${newDisease.name}を発症しました`)
      }

      // 病気の効果を適用
      newPlayer = applyDiseaseEffects(newPlayer, newDiseases)

      // ゲーム終了チェック
      const gameOverCheck = checkGameOver(newPlayer)
      const won = isGameWon(newPlayer)

      return {
        ...prev,
        player: newPlayer,
        diseases: newDiseases,
        year: prev.year + 1,
        gameOver: gameOverCheck.isGameOver,
        gameWon: won,
        deathCause: gameOverCheck.cause,
        yearlyEvents: events,
      }
    })
  }

  // アクション実行
  const handleAction = (action: Action) => {
    setGameState(prev => {
      let newPlayer = { ...prev.player }
      let newDiseases = [...prev.diseases]
      let actionMessage = `${action.name}を実行しました`
      
      // APとHCコスト消費
      newPlayer.actionPoints -= action.apCost
      newPlayer.health -= action.hcCost
      
      // 治療アクションの場合
      if (action.type === 'treatment' && action.targetDiseaseType) {
        const targetDisease = newDiseases.find(d => d.type === action.targetDiseaseType)
        if (targetDisease) {
          const treatmentResult = attemptTreatment(targetDisease, newPlayer)
          actionMessage = treatmentResult.message
          
          if (treatmentResult.success) {
            // 病気を除去
            newDiseases = newDiseases.filter(d => d.id !== targetDisease.id)
          } else if (action.treatmentType === 'manage') {
            // 慢性疾患管理：症状を軽減（ダメージを半減）
            const diseaseIndex = newDiseases.findIndex(d => d.id === targetDisease.id)
            if (diseaseIndex !== -1) {
              newDiseases[diseaseIndex] = {
                ...targetDisease,
                healthDrain: targetDisease.healthDrain * 0.5,
                immunityDrain: targetDisease.immunityDrain * 0.5,
                strengthDrain: targetDisease.strengthDrain * 0.5,
                mentalDrain: targetDisease.mentalDrain * 0.5,
              }
            }
          }
        }
      }
      
      // 効果適用
      newPlayer.health += action.healthEffect
      newPlayer.immunity = Math.min(newPlayer.maxImmunity, Math.max(0, newPlayer.immunity + action.immunityEffect))
      newPlayer.strength = Math.min(newPlayer.maxStrength, Math.max(0, newPlayer.strength + action.strengthEffect))
      newPlayer.mental = Math.min(newPlayer.maxMental, Math.max(0, newPlayer.mental + action.mentalEffect))
      
      // リスクパラメータ更新
      newPlayer.glycationLevel = Math.max(0, newPlayer.glycationLevel + action.glycationEffect)
      newPlayer.inflammationLevel = Math.max(0, newPlayer.inflammationLevel + action.inflammationEffect)
      newPlayer.mutationLevel = Math.max(0, newPlayer.mutationLevel + action.mutationEffect)

      setMessage(actionMessage)
      
      const newState = {
        ...prev,
        player: newPlayer,
        diseases: newDiseases,
        lastAction: action.name,
      }
      
      // APが0になったら年末処理
      if (newPlayer.actionPoints === 0) {
        setTimeout(() => processYear(), 1500)
      }
      
      return newState
    })
  }

  // ゲーム結果を保存
  const saveResult = async (gameState: GameState) => {
    if (saving) return;
    
    setSaving(true);
    try {
      const service = await gameService;
      const playDuration = Math.round((Date.now() - gameStartTime) / 1000);
      const success = await service.saveGameResult({
        reachedAge: gameState.player.age,
        causeOfDeath: gameState.deathCause || '不明',
        totalScore: calculateScore(gameState.player),
        finalStats: gameState.player,
        playDuration,
      });
      
      if (success) {
        setMessage('結果を保存しました！');
      } else {
        setMessage('結果の保存に失敗しました');
      }
    } catch (error) {
      console.error('Save error:', error);
      setMessage('結果の保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  // ゲームリセット
  const resetGame = () => {
    setGameState({
      player: INITIAL_STATS,
      diseases: [],
      year: 1,
      gameOver: false,
      gameWon: false,
      yearlyEvents: [],
    })
    setGameStartTime(Date.now())
    setMessage('新しい人生を開始しました')
  }

  // メッセージ自動消去
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  if (gameState.gameWon) {
    const finalScore = calculateScore(gameState.player)
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 text-center shadow-lg max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            SURVIVE 100 達成！
          </h1>
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <div className="text-lg font-bold">最終スコア: {finalScore.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-2">
              残存HC: {Math.round(gameState.player.health).toLocaleString()}<br/>
              最終ステータス: 免疫{Math.round(gameState.player.immunity)} / 筋力{Math.round(gameState.player.strength)} / 精神{Math.round(gameState.player.mental)}
            </div>
          </div>
          <p className="text-gray-700 mb-6">
            100歳まで健康に生きることができました！<br/>
            素晴らしいライフマネジメントでした。
          </p>
          <div className="space-y-3">
            <button
              onClick={() => saveResult(gameState)}
              disabled={saving}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {saving ? '保存中...' : '結果を保存'}
            </button>
            <button
              onClick={resetGame}
              className="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              新しい人生に挑戦
            </button>
            <button
              onClick={() => setShowLeaderboard(true)}
              className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              ランキングを見る
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (gameState.gameOver) {
    const finalScore = calculateScore(gameState.player)
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 text-center shadow-lg max-w-md">
          <div className="text-6xl mb-4">💀</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            人生終了
          </h1>
          <div className="bg-red-50 p-4 rounded-lg mb-4 text-left">
            <div className="font-bold text-red-800 mb-2">検死報告書</div>
            <div className="text-sm space-y-1">
              <div><strong>死亡年齢:</strong> {gameState.player.age}歳</div>
              <div><strong>死因:</strong> {gameState.deathCause}</div>
              <div><strong>最終スコア:</strong> {finalScore.toLocaleString()}</div>
              <div><strong>残存資産:</strong> {Math.round(gameState.player.health).toLocaleString()}HC</div>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm text-left">
            <div className="font-medium text-blue-800 mb-1">ドクターからのアドバイス:</div>
            <div className="text-blue-700">
              {gameState.player.age < 50 
                ? "若い頃からの不摂生が原因です。予防への投資を怠らないようにしましょう。"
                : gameState.player.age < 70
                ? "中年期の健康管理が不十分でした。定期検診と適度な運動が重要です。"
                : "高齢期まで頑張りました。もう少し早めの対策があれば100歳も夢ではありませんでした。"
              }
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => saveResult(gameState)}
              disabled={saving}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {saving ? '保存中...' : '結果を保存'}
            </button>
            <button
              onClick={resetGame}
              className="w-full bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              人生をやり直す
            </button>
            <button
              onClick={() => setShowLeaderboard(true)}
              className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              ランキングを見る
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          SURVIVE 100
        </h1>
        <div className="text-xs text-gray-500 mb-2">Battle Against Decay</div>
        <div className="text-sm text-gray-600">
          {gameState.player.age}歳 | 目標: 100歳まで生存
        </div>
      </header>

      {message && (
        <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-2 rounded-lg mb-4 text-center">
          {message}
        </div>
      )}

      <StatusBar player={gameState.player} />
      
      <DiseasePanel diseases={gameState.diseases} />
      
      {gameState.player.actionPoints > 0 ? (
        <ActionPanel 
          actions={ACTIONS}
          player={gameState.player}
          diseases={gameState.diseases}
          onActionSelect={handleAction}
        />
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-center">
          <div className="text-yellow-800 font-medium">年末処理中...</div>
          <div className="text-sm text-yellow-600 mt-1">来年の計画を立てましょう</div>
        </div>
      )}

      {gameState.yearlyEvents.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-red-800 mb-2">今年の出来事</h4>
          {gameState.yearlyEvents.map((event, index) => (
            <div key={index} className="text-sm text-red-700">• {event}</div>
          ))}
        </div>
      )}

      <div className="text-center space-x-4">
        <button
          onClick={resetGame}
          className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
        >
          人生をリセット
        </button>
        <button
          onClick={() => setShowLeaderboard(true)}
          className="text-blue-500 text-sm hover:text-blue-700 transition-colors"
        >
          📊 ランキング
        </button>
      </div>



      {/* ランキングモーダル */}
      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}
    </div>
  )
}