import { client } from './amplify';
import { GameResult, PlayerStats } from '@/types/game';
import { getCurrentUser } from 'aws-amplify/auth';

export interface GameResultData {
  reachedAge: number;
  causeOfDeath: string;
  totalScore: number;
  finalStats: PlayerStats;
  playDuration: number;
}

export async function saveGameResult(gameData: GameResultData): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    
    await client.models.GameResult.create({
      userId: user.userId,
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
    const user = await getCurrentUser();
    
    // 既存のプロフィールを取得
    const { data: existingProfile } = await client.models.PlayerProfile.get({
      userId: user.userId,
    });

    const profileData = {
      userId: user.userId,
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
        userId: user.userId,
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
    const { data } = await client.models.GameResult.list({
      limit,
      // 最高スコア順でソート
      sortDirection: 'DESC',
    });
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return [];
  }
}

export async function getPlayerStats() {
  try {
    const user = await getCurrentUser();
    const { data } = await client.models.PlayerProfile.get({
      userId: user.userId,
    });
    
    return data;
  } catch (error) {
    console.error('Failed to fetch player stats:', error);
    return null;
  }
}

export async function getPlayerGameHistory(limit: number = 20) {
  try {
    const user = await getCurrentUser();
    const { data } = await client.models.GameResult.list({
      filter: {
        userId: {
          eq: user.userId,
        },
      },
      limit,
    });
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch game history:', error);
    return [];
  }
}