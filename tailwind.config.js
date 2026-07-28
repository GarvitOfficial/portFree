/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0a0f',
          surface: '#12131c',
          surfaceHover: '#181a27',
          card: '#151724',
          border: '#25293d',
          borderGlow: '#383e5c',
          text: '#e2e8f0',
          muted: '#64748b',
          safe: '#00ff88',
          safeBg: 'rgba(0, 255, 136, 0.08)',
          caution: '#ffaa00',
          cautionBg: 'rgba(255, 170, 0, 0.08)',
          danger: '#ff3366',
          dangerBg: 'rgba(255, 51, 102, 0.08)',
          cyan: '#00e5ff',
          cyanBg: 'rgba(0, 229, 255, 0.08)',
          accent: '#8b5cf6'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-safe': '0 0 15px rgba(0, 255, 136, 0.25), inset 0 0 10px rgba(0, 255, 136, 0.1)',
        'glow-caution': '0 0 15px rgba(255, 170, 0, 0.25), inset 0 0 10px rgba(255, 170, 0, 0.1)',
        'glow-danger': '0 0 15px rgba(255, 51, 102, 0.25), inset 0 0 10px rgba(255, 51, 102, 0.1)',
        'glow-cyan': '0 0 15px rgba(0, 229, 255, 0.25), inset 0 0 10px rgba(0, 229, 255, 0.1)',
        'card-glow': '0 4px 20px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.1)',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: 0.6, filter: 'brightness(1.3)' },
        }
      },
      animation: {
        'radar-sweep': 'scan 3s linear infinite',
        'shimmer': 'shimmer 1.8s infinite',
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
      }
    },
  },
  plugins: [],
}
