'use client'

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
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