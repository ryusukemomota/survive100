import { GameResult, PlayerStats } from '@/types/game';

export interface GameResultData {
  reachedAge: number;
  causeOfDeath: string;
  totalScore: number;
  finalStats: PlayerStats;
  playDuration: number;
}

// ローカルストレージを使用したモックサービス
const STORAGE_KEYS = {
  GAME_RESULTS: 'survive100_game_results',
  PLAYER_PROFILE: 'survive100_player_profile',
};

export async function saveGameResult(gameData: GameResultData): Promise<boolean> {
  try {
    // 既存の結果を取得
    const existingResults = getStoredResults();
    
    // 新しい結果を追加
    const newResult = {
      id: Date.now().toString(),
      userId: 'mock_user',
      playerName: 'Player',
      reachedAge: gameData.reachedAge,
      causeOfDeath: gameData.causeOfDeath,
      totalScore: gameData.totalScore,
      finalStats: gameData.finalStats,
      playDuration: gameData.playDuration,
      playedAt: new Date().toISOString(),
    };
    
    existingResults.push(newResult);
    localStorage.setItem(STORAGE_KEYS.GAME_RESULTS, JSON.stringify(existingResults));
    
    // プレイヤープロフィールを更新
    await updatePlayerProfile(gameData);
    
    return true;
  } catch (error) {
    console.error('Failed to save game result:', error);
    return false;
  }
}

async function updatePlayerProfile(gameData: GameResultData) {
  try {
    const existingProfile = getStoredProfile();
    
    const profileData = {
      userId: 'mock_user',
      nickname: 'Player',
      totalGames: (existingProfile?.totalGames || 0) + 1,
      bestAge: Math.max(existingProfile?.bestAge || 0, gameData.reachedAge),
      bestScore: Math.max(existingProfile?.bestScore || 0, gameData.totalScore),
      totalPlayTime: (existingProfile?.totalPlayTime || 0) + gameData.playDuration,
      achievements: existingProfile?.achievements || [],
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEYS.PLAYER_PROFILE, JSON.stringify(profileData));
  } catch (error) {
    console.error('Failed to update player profile:', error);
  }
}

export async function getLeaderboard(limit: number = 10) {
  try {
    const results = getStoredResults();
    
    // スコア順でソート
    const sorted = results
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit);
    
    return sorted;
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return getSampleData(); // エラー時もサンプルデータを返す
  }
}

function getSampleData() {
  return [
    {
      id: 'sample_1',
      userId: 'sample_user_1',
      playerName: 'HealthMaster',
      reachedAge: 95,
      causeOfDeath: '老衰',
      totalScore: 85000,
      finalStats: {},
      playDuration: 720,
      playedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'sample_2',
      userId: 'sample_user_2',
      playerName: 'FitnessGuru',
      reachedAge: 88,
      causeOfDeath: '心不全',
      totalScore: 72000,
      finalStats: {},
      playDuration: 650,
      playedAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: 'sample_3',
      userId: 'sample_user_3',
      playerName: 'WorkHolic',
      reachedAge: 65,
      causeOfDeath: '過労死',
      totalScore: 45000,
      finalStats: {},
      playDuration: 480,
      playedAt: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      id: 'sample_4',
      userId: 'sample_user_4',
      playerName: 'Centenarian',
      reachedAge: 100,
      causeOfDeath: '天寿全う',
      totalScore: 120000,
      finalStats: {},
      playDuration: 900,
      playedAt: new Date(Date.now() - 345600000).toISOString(),
    },
  ];
}

export async function getPlayerStats() {
  try {
    const profile = getStoredProfile();
    
    // プロフィールがない場合は初期データを返す
    if (!profile) {
      return {
        userId: 'mock_user',
        nickname: 'Player',
        totalGames: 0,
        bestAge: 0,
        bestScore: 0,
        totalPlayTime: 0,
        achievements: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    
    return profile;
  } catch (error) {
    console.error('Failed to fetch player stats:', error);
    return null;
  }
}

export async function getPlayerGameHistory(limit: number = 20) {
  try {
    const results = getStoredResults();
    
    // 日付順でソート（新しい順）
    const sorted = results
      .sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime())
      .slice(0, limit);
    
    return sorted;
  } catch (error) {
    console.error('Failed to fetch game history:', error);
    return [];
  }
}

function getStoredResults() {
  if (typeof window === 'undefined') return getSampleData();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GAME_RESULTS);
    const results = stored ? JSON.parse(stored) : [];
    
    // 常にサンプルデータと実際のデータを結合
    const sampleData = getSampleData();
    const userResults = results.filter((r: any) => !r.id.startsWith('sample_'));
    
    // サンプルデータを最初に追加し、その後にユーザーデータを追加
    const combinedResults = [...sampleData, ...userResults];
    
    return combinedResults;
  } catch {
    return getSampleData();
  }
}

function getStoredProfile() {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PLAYER_PROFILE);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}