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
    <Authenticator
      signUpAttributes={['email', 'nickname']}
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
            label: 'ニックネーム',
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
          <header className="bg-white shadow-sm border-b p-4">
            <div className="max-w-md mx-auto flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-600">ようこそ、</span>
                <span className="font-medium">{user?.signInDetails?.loginId}</span>
              </div>
              <button
                onClick={signOut}
                className="text-sm text-red-600 hover:text-red-800 transition-colors"
              >
                ログアウト
              </button>
            </div>
          </header>
          {children}
        </div>
      )}
    </Authenticator>
  );
}