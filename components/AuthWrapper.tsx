'use client'

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useEffect, useState } from 'react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [isConfigured, setIsConfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Amplify設定の確認
    try {
      import('aws-amplify').then(({ Amplify }) => {
        const config = Amplify.getConfig();
        console.log('Current Amplify config:', config);
        
        if (config.Auth?.Cognito?.userPoolId) {
          setIsConfigured(true);
          console.log('Amplify is properly configured');
        } else {
          setError('Amplify Auth configuration is missing');
        }
      });
    } catch (err) {
      console.error('Failed to check Amplify configuration:', err);
      setError('Failed to load Amplify configuration');
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-lg font-bold text-red-800 mb-2">設定エラー</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <p className="text-sm text-red-600">
            開発環境でテストする場合は、ページをリロードしてモック認証を使用してください。
          </p>
        </div>
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">認証システムを初期化中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* ゲーム風背景エフェクト */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <Authenticator
          signUpAttributes={['email', 'nickname']}
          components={{
            Header() {
              return (
                <div className="text-center py-8">
                  <div className="mb-6">
                    <div className="text-6xl mb-4">⚕️</div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                      SURVIVE 100
                    </h1>
                    <p className="text-xl text-blue-200 mb-1">Battle Against Decay</p>
                    <p className="text-sm text-gray-300">
                      100歳まで生き残る健康シミュレーションゲーム
                    </p>
                  </div>
                  
                  <div className="bg-black bg-opacity-30 rounded-lg p-4 mb-6 max-w-md mx-auto">
                    <h3 className="text-lg font-semibold text-white mb-3">🎮 ゲームの特徴</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-blue-500 bg-opacity-20 rounded p-2">
                        <div className="text-blue-200">⏱️ 高速プレイ</div>
                        <div className="text-xs text-gray-300">10-15分で一生を体験</div>
                      </div>
                      <div className="bg-green-500 bg-opacity-20 rounded p-2">
                        <div className="text-green-200">🏥 リアル健康管理</div>
                        <div className="text-xs text-gray-300">4つの病気システム</div>
                      </div>
                      <div className="bg-purple-500 bg-opacity-20 rounded p-2">
                        <div className="text-purple-200">📊 ランキング</div>
                        <div className="text-xs text-gray-300">他プレイヤーと競争</div>
                      </div>
                      <div className="bg-yellow-500 bg-opacity-20 rounded p-2">
                        <div className="text-yellow-200">🎓 教育効果</div>
                        <div className="text-xs text-gray-300">予防医学を学習</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            },
          }}
          formFields={{
            signUp: {
              email: {
                label: 'メールアドレス',
                placeholder: 'your-email@example.com',
                required: true,
              },
              password: {
                label: 'パスワード',
                placeholder: '8文字以上で入力してください',
                required: true,
              },
              confirm_password: {
                label: 'パスワード確認',
                placeholder: 'パスワードを再入力してください',
                required: true,
              },
              nickname: {
                label: 'プレイヤー名',
                placeholder: 'ゲーム内で表示される名前',
                required: false,
              },
            },
            signIn: {
              username: {
                label: 'メールアドレス',
                placeholder: 'your-email@example.com',
              },
              password: {
                label: 'パスワード',
                placeholder: 'パスワードを入力してください',
              },
            },
          }}
        >
        {({ signOut, user }) => (
          <div>
            <header className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg border-b border-gray-700 p-4">
              <div className="max-w-md mx-auto flex justify-between items-center">
                <div className="flex items-center">
                  <div className="text-2xl mr-2">⚕️</div>
                  <div>
                    <div className="text-sm text-gray-300">ようこそ、</div>
                    <div className="font-medium text-white">{user?.signInDetails?.loginId}</div>
                  </div>
                </div>
                <button
                  onClick={signOut}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  ログアウト
                </button>
              </div>
            </header>
            {children}
          </div>
        )}
        </Authenticator>
      </div>
    </div>
  );
}