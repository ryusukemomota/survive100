import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // ゲーム結果（1回のプレイ記録）
  GameResult: a
    .model({
      userId: a.id().required(),
      playerName: a.string(),
      reachedAge: a.integer().required(),
      causeOfDeath: a.string().required(),
      totalScore: a.integer().required(),
      finalStats: a.json().required(), // PlayerStatsのJSON
      playDuration: a.integer(), // プレイ時間（秒）
      playedAt: a.datetime().required(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']), // 他のユーザーのスコアも閲覧可能
    ]),

  // プレイヤープロフィール
  PlayerProfile: a
    .model({
      userId: a.id().required(),
      nickname: a.string(),
      totalGames: a.integer().default(0),
      bestAge: a.integer().default(0),
      bestScore: a.integer().default(0),
      totalPlayTime: a.integer().default(0), // 累計プレイ時間
      achievements: a.string().array(), // 達成した実績
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']), // プロフィールは他のユーザーも閲覧可能
    ]),

  // 実績システム
  Achievement: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
      description: a.string().required(),
      condition: a.string().required(), // 達成条件の説明
      icon: a.string(),
      rarity: a.enum(['common', 'rare', 'epic', 'legendary']),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read']),
      allow.group('admin').to(['create', 'update', 'delete']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});