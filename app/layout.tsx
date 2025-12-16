import type { Metadata } from 'next'
import './globals.css'
import AuthWrapper from '@/components/AuthWrapper'
import MockAuthWrapper from '@/components/MockAuthWrapper'
import { Amplify } from 'aws-amplify'

// 開発環境ではモック認証を使用
const USE_MOCK_AUTH = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_USE_AMPLIFY

// Amplify設定を読み込み（本番環境）
if (typeof window !== 'undefined' && !USE_MOCK_AUTH) {
  try {
    // 本番環境では amplify_outputs.json から設定を読み込み
    import('../amplify_outputs.json').then((config) => {
      Amplify.configure(config.default || config);
    }).catch(() => {
      console.log('Amplify outputs not found, using development mode');
    });
  } catch (error) {
    console.log('Amplify configuration not available');
  }
}

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
          <AuthComponent>
            {children}
          </AuthComponent>
        </div>
      </body>
    </html>
  )
}