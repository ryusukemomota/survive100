import type { Metadata } from 'next'
import './globals.css'
import AuthWrapper from '@/components/AuthWrapper'
import MockAuthWrapper from '@/components/MockAuthWrapper'
import AmplifyProvider from '@/components/AmplifyProvider'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const AuthComponent = USE_MOCK_AUTH ? MockAuthWrapper : AuthWrapper;
  
  return (
    <html lang="ja">
      <body>
        <div className="game-container">
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
        </div>
      </body>
    </html>
  )
}