import type { Metadata } from 'next'
import './globals.css'
import AuthWrapper from '@/components/AuthWrapper'
import MockAuthWrapper from '@/components/MockAuthWrapper'
import AmplifyProvider from '@/components/AmplifyProvider'
import GameModeSelector from '@/components/GameModeSelector'
import GuestWrapper from '@/components/GuestWrapper'

// 開発環境ではモック認証を使用
const USE_MOCK_AUTH = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_USE_AMPLIFY

export const metadata: Metadata = {
  title: 'SURVIVE 100 - Battle Against Decay',
  description: '100歳まで生き残る健康シミュレーションゲーム',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

'use client'

import { useState } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [gameMode, setGameMode] = useState<'selector' | 'guest' | 'account'>('selector');
  
  const AuthComponent = USE_MOCK_AUTH ? MockAuthWrapper : AuthWrapper;
  
  const handleModeSelect = (mode: 'guest' | 'account') => {
    setGameMode(mode);
  };

  const handleSwitchToAccount = () => {
    setGameMode('account');
  };

  const handleBackToSelector = () => {
    setGameMode('selector');
  };
  
  return (
    <html lang="ja">
      <body>
        <div className="game-container">
          {gameMode === 'selector' && (
            <GameModeSelector onModeSelect={handleModeSelect} />
          )}
          
          {gameMode === 'guest' && (
            <GuestWrapper onSwitchToAccount={handleSwitchToAccount}>
              {children}
            </GuestWrapper>
          )}
          
          {gameMode === 'account' && (
            <>
              {USE_MOCK_AUTH ? (
                <AuthComponent>
                  {children}
                </AuthComponent>
              ) : (
                <AmplifyProvider>
                  <AuthComponent>
                    {children}
                  </AuthComponent>
                </AmplifyProvider>
              )}
            </>
          )}
        </div>
      </body>
    </html>
  )
}