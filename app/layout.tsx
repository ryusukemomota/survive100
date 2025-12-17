import type { Metadata } from 'next'
import './globals.css'
import AppWrapper from '@/components/AppWrapper'

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
  return (
    <html lang="ja">
      <body>
        <div className="game-container">
          <AppWrapper>
            {children}
          </AppWrapper>
        </div>
      </body>
    </html>
  )
}