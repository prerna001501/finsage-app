import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'et-navy':   '#F2F3AE',
        'et-card':   '#FFFFFF',
        'et-blue':   '#F4442E',
        'et-orange': '#FC9E4F',
        'et-gold':   '#EDD382',
        'et-dark':   '#020122',
        'et-green':  '#16A34A',
        'et-red':    '#F4442E',
        'et-text':   '#020122',
        'et-muted':  '#6B6C8A',
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [],
}
export default config
