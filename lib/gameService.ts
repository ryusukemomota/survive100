import { GameResult, PlayerStats } from '@/types/game';

// 動的インポートでAmplifyクライアントを読み込み
let client: any = null;
let getCurrentUser: any = null;

async function initializeAmplify() {
  if (!client) {
    try {
      const amplifyModule = await import('./amplify');
      const authModule = await import('aws-amplify/auth');
      client = amplifyModule.client;
      getCurrentUser = authModule.getCurrentUser;
    } catch (error) {
      console.error('Failed to initialize Amplify:', error);
      throw error;
    }
  }
}

export interface GameResultData {
  reachedAge: number;
  causeOfDeath: string;
  totalScore: number;
  finalStats: PlayerStats;
  playDuration: number;
}

export async function saveGameResult(gameData: GameResultData): Promise<boolean> {
  try {
    await initializeAmplify();
    const user = await getCurrentUser();
    
    await client.models.GameResult.create({
      playerName: user.signInDetails?.loginId || 'Anonymous',
      reachedAge: gameData.reachedAge,
      causeOfDeath: gameData.causeOfDeath,
      totalScore: gameData.totalScore,
      finalStats: gameData.finalStats,
      playDuration: gameData.playDuration,
      playedAt: new Date().toISOString(),
    });

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
    await initializeAmplify();
    const user = await getCurrentUser();
    
    // 既存のプロフィールを取得（owner認証では自動的にユーザーIDでフィルタリング）
    const { data: profiles } = await client.models.PlayerProfile.list();
    const existingProfile = profiles?.[0]; // 自分のプロフィールのみ取得される

    const profileData = {
      nickname: user.signInDetails?.loginId || 'Player',
      totalGames: (existingProfile?.totalGames || 0) + 1,
      bestAge: Math.max(existingProfile?.bestAge || 0, gameData.reachedAge),
      bestScore: Math.max(existingProfile?.bestScore || 0, gameData.totalScore),
      totalPlayTime: (existingProfile?.totalPlayTime || 0) + gameData.playDuration,
      achievements: existingProfile?.achievements || [],
      updatedAt: new Date().toISOString(),
    };

    if (existingProfile) {
      await client.models.PlayerProfile.update({
        id: existingProfile.id,
        ...profileData,
      });
    } else {
      await client.models.PlayerProfile.create({
        ...profileData,
        createdAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Failed to update player profile:', error);
  }
}

export async function getLeaderboard(limit: number = 10) {
  try {
    await initializeAmplify();
    const { data } = await client.models.GameResult.list({
      limit,
    });
    
    // クライアントサイドでスコア順にソート
    const sortedData = (data || []).sort((a, b) => b.totalScore - a.totalScore);
    
    return sortedData;
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return [];
  }
}

export async function getPlayerStats() {
  try {
    await initializeAmplify();
    const { data: profiles } = await client.models.PlayerProfile.list();
    return profiles?.[0] || null; // 自分のプロフィールのみ取得される
  } catch (error) {
    console.error('Failed to fetch player stats:', error);
    return null;
  }
}

export async function getPlayerGameHistory(limit: number = 20) {
  try {
    await initializeAmplify();
    const { data } = await client.models.GameResult.list({
      limit,
    });
    
    return data || []; // owner認証により自分のデータのみ取得される
  } catch (error) {
    console.error('Failed to fetch game history:', error);
    return [];
  }
}