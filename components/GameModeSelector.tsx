'use client'

import { useState } from 'react';

interface GameModeSelectorProps {
  onModeSelect: (mode: 'guest' | 'account') => void;
}

export default function GameModeSelector({ onModeSelect }: GameModeSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* 背景エフェクト */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-2xl w-full">
          {/* ゲームタイトル */}
          <div className="text-center mb-12">
            <div className="text-8xl mb-6">⚕️</div>
            <h1 className="text-6xl font-bold text-white mb-4">
              SURVIVE 100
            </h1>
            <p className="text-2xl text-blue-200 mb-2">Battle Against Decay</p>
            <p className="text-lg text-gray-300">
              100歳まで生き残る健康シミュレーションゲーム
            </p>
          </div>

          {/* モード選択 */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* ゲストモード */}
            <div 
              onClick={() => onModeSelect('guest')}
              className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-opacity-20 group"
            >
              <div className="text-center">
                <div className="text-5xl mb-4 group-hover:animate-bounce">🎮</div>
                <h2 className="text-2xl font-bold text-white mb-4">ゲストプレイ</h2>
                <div className="text-green-200 text-lg font-semibold mb-4">すぐに遊ぶ！</div>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center text-white">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>ログイン不要</span>
                  </div>
                  <div className="flex items-center text-white">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>即座にゲーム開始</span>
                  </div>
                  <div className="flex items-center text-white">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>気軽に何度でも挑戦</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="text-gray-500 mr-2">×</span>
                    <span>記録保存なし</span>
                  </div>
                </div>

                <button className="w-full mt-6 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all">
                  今すぐプレイ
                </button>
              </div>
            </div>

            {/* アカウントモード */}
            <div 
              onClick={() => onModeSelect('account')}
              className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-opacity-20 group"
            >
              <div className="text-center">
                <div className="text-5xl mb-4 group-hover:animate-bounce">👤</div>
                <h2 className="text-2xl font-bold text-white mb-4">アカウント作成</h2>
                <div className="text-purple-200 text-lg font-semibold mb-4">本格プレイ</div>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center text-white">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>記録保存・統計</span>
                  </div>
                  <div className="flex items-center text-white">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>ランキング参加</span>
                  </div>
                  <div className="flex items-center text-white">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>プレイ履歴管理</span>
                  </div>
                  <div className="flex items-center text-white">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>実績システム</span>
                  </div>
                </div>

                <button className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all">
                  アカウント作成
                </button>
              </div>
            </div>
          </div>

          {/* 追加情報 */}
          <div className="text-center mt-8">
            <p className="text-gray-300 text-sm">
              ゲストモードでも全ての機能を体験できます。<br/>
              後からアカウントを作成して記録を保存することも可能です。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}