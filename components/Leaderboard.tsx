'use client'

import { useState, useEffect } from 'react';
// 開発環境ではモックサービスを使用
const USE_MOCK_AUTH = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_USE_AMPLIFY
const gameService = USE_MOCK_AUTH 
  ? import('@/lib/mockGameService')
  : import('@/lib/gameService')

interface LeaderboardProps {
  onClose: () => void;
}

export default function Leaderboard({ onClose }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'ranking' | 'profile' | 'history'>('ranking');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [playerProfile, setPlayerProfile] = useState<any>(null);
  const [gameHistory, setGameHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const service = await gameService;
      
      if (activeTab === 'ranking') {
        const data = await service.getLeaderboard(20);
        setLeaderboard(data);
      } else if (activeTab === 'profile') {
        const profile = await service.getPlayerStats();
        setPlayerProfile(profile);
      } else if (activeTab === 'history') {
        const history = await service.getPlayerGameHistory(20);
        setGameHistory(history);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}位`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">統計・ランキング</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* タブ */}
        <div className="flex border-b">
          {[
            { key: 'ranking', label: '🏆 ランキング' },
            { key: 'profile', label: '👤 プロフィール' },
            { key: 'history', label: '📊 履歴' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === tab.key
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4 overflow-y-auto max-h-96">

          
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">読み込み中...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-500">エラー: {error}</div>
            </div>
          ) : (
            <>
              {/* ランキングタブ */}
              {activeTab === 'ranking' && (
                <div className="space-y-3">

                  
                  {leaderboard.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      まだランキングデータがありません
                    </div>
                  ) : (
                    leaderboard.map((result, index) => (
                      <div
                        key={result.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <span className="text-lg mr-3">{getRankIcon(index + 1)}</span>
                          <div>
                            <div className="font-medium text-gray-900">{result.playerName}</div>
                            <div className="text-sm text-gray-600">
                              {result.reachedAge}歳まで生存
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-600">
                            {result.totalScore.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(result.playedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* プロフィールタブ */}
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  {playerProfile ? (
                    <>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-bold text-blue-800 mb-2">総合成績</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-600">総プレイ回数</div>
                            <div className="font-bold text-gray-900">{playerProfile.totalGames}回</div>
                          </div>
                          <div>
                            <div className="text-gray-600">最高年齢</div>
                            <div className="font-bold text-gray-900">{playerProfile.bestAge}歳</div>
                          </div>
                          <div>
                            <div className="text-gray-600">最高スコア</div>
                            <div className="font-bold text-gray-900">{playerProfile.bestScore.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">総プレイ時間</div>
                            <div className="font-bold text-gray-900">{Math.round(playerProfile.totalPlayTime / 60)}分</div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      プロフィールデータがありません
                    </div>
                  )}
                </div>
              )}

              {/* 履歴タブ */}
              {activeTab === 'history' && (
                <div className="space-y-3">
                  {gameHistory.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      ゲーム履歴がありません
                    </div>
                  ) : (
                    gameHistory.map((result) => (
                      <div
                        key={result.id}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium text-gray-900">{result.reachedAge}歳で死亡</div>
                            <div className="text-sm text-red-600">{result.causeOfDeath}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">{result.totalScore.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(result.playedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}