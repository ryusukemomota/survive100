'use client'

import { useEffect } from 'react';

interface GuestWrapperProps {
  children: React.ReactNode;
  onSwitchToAccount: () => void;
}

export default function GuestWrapper({ children, onSwitchToAccount }: GuestWrapperProps) {
  useEffect(() => {
    // ゲストモードをlocalStorageに記録
    localStorage.setItem('gameMode', 'guest');
  }, []);
  return (
    <div>
      <header className="bg-gradient-to-r from-green-600 to-blue-600 shadow-lg border-b border-gray-700 p-4">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-2xl mr-2">🎮</div>
            <div>
              <div className="text-sm text-green-100">ゲストプレイ中</div>
              <div className="font-medium text-white">記録は保存されません</div>
            </div>
          </div>
          <button
            onClick={onSwitchToAccount}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1 rounded text-sm transition-colors border border-white border-opacity-30"
          >
            アカウント作成
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}