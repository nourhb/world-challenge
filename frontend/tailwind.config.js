/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#070d14',
        panel: '#101a26',
        hull: '#162434',
        cyan: '#3ee0c5',
        magenta: '#ff2bd6',
        violet: '#8b5cff',
        gold: '#f2c14b',
        ember: '#ff6b6b',
        mist: '#8aa0b5',
        paper: '#e8f1f4',
      },
      fontFamily: {
        display: ['"Exo 2"', 'system-ui', 'sans-serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(62, 224, 197, 0.35), 0 0 28px rgba(62, 224, 197, 0.18)',
        play: '0 0 0 1px rgba(242, 193, 75, 0.45), 0 10px 30px rgba(242, 193, 75, 0.18)',
        uv: '0 0 0 1px rgba(255, 43, 214, 0.35), 0 0 32px rgba(139, 92, 255, 0.22)',
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(62, 224, 197, 0.12) 1px, transparent 0)',
      },
      backgroundSize: {
        grid: '28px 28px',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 1px rgba(242, 193, 75, 0.35), 0 8px 24px rgba(242, 193, 75, 0.12)' },
          '50%': { boxShadow: '0 0 0 1px rgba(242, 193, 75, 0.7), 0 12px 36px rgba(242, 193, 75, 0.28)' },
        },
      },
      animation: {
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
