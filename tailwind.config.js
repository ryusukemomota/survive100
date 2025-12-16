/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        health: '#22c55e',
        immunity: '#3b82f6',
        strength: '#f59e0b',
        mental: '#8b5cf6',
        danger: '#ef4444',
      },
    },
  },
  plugins: [],
}