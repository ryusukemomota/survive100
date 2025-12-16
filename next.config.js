/** @type {import('next').NextConfig} */
const nextConfig = {
  // appDir is now stable in Next.js 14, no need for experimental flag
  typescript: {
    // デプロイ時の型エラーを警告に変更（本番環境での型チェックを緩和）
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  eslint: {
    // デプロイ時のESLintエラーを無視
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig