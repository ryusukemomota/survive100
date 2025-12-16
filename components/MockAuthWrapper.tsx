'use client'

import { useState } from 'react';

interface MockAuthWrapperProps {
  children: React.ReactNode;
}

export default function MockAuthWrapper({ children }: MockAuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      // サインアップ処理（モック）
      if (email && password) {
        setIsAuthenticated(true);
        console.log('Mock sign up successful:', { email, nickname });
      }
    } else {
      // サインイン処理（モック）
      if (email && password) {
        setIsAuthenticated(true);
        console.log('Mock sign in successful:', email);
      }
    }
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setNickname('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">SURVIVE 100</h1>
            <p className="text-gray-600">
              {isSignUp ? 'アカウントを作成' : 'ログイン'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8文字以上で入力してください"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={8}
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ニックネーム（任意）
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="ゲーム内で表示される名前"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              {isSignUp ? 'アカウント作成' : 'ログイン'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              {isSignUp 
                ? 'すでにアカウントをお持ちですか？ログイン' 
                : 'アカウントをお持ちでない方はこちら'
              }
            </button>
          </div>

          <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>開発モード:</strong> 任意のメールアドレスとパスワードでログインできます
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className="bg-white shadow-sm border-b p-4">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-600">ようこそ、</span>
            <span className="font-medium">{nickname || email}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-red-600 hover:text-red-800 transition-colors"
          >
            ログアウト
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}