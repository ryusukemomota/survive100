import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

// Amplify設定は環境変数から自動的に読み込まれます
// 本番環境では amplify/outputs.json から設定が読み込まれます

export const client = generateClient<Schema>();

// 開発環境用の設定（実際のデプロイ後は不要）
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // 開発環境では手動設定が必要な場合があります
  console.log('Amplify client initialized for development');
}