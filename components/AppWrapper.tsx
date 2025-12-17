'use client'

import { useState } from 'react';
import AuthWrapper from '@/components/AuthWrapper'
import MockAuthWrapper from '@/components/MockAuthWrapper'
import AmplifyProvider from '@/components/AmplifyProvider'
import GameModeSelector from '@/components/GameModeSelector'
import GuestWrapper from '@/components/GuestWrapper'

// 開発環境ではモック認証を使用
const USE_MOCK_AUTH = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_USE_AMPLIFY

interface AppWrapperProps {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
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

  if (gameMode === 'selector') {
    return <GameModeSelector onModeSelect={handleModeSelect} />;
  }
  
  if (gameMode === 'guest') {
    return (
      <GuestWrapper onSwitchToAccount={handleSwitchToAccount}>
        {children}
      </GuestWrapper>
    );
  }
  
  if (gameMode === 'account') {
    return (
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
    );
  }

  return null;
}