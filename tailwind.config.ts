import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#fdf8f0',
          100: '#f9edd8',
          200: '#f2d9b0',
          300: '#e8bf80',
          400: '#dc9f50',
          500: '#c8832e',
          600: '#a66820',
          700: '#855018',
          800: '#6b3f16',
          900: '#573315'
        },
        blood: {
          500: '#8b1a1a',
          600: '#6d1414',
          700: '#4f0f0f'
        },
        magic: {
          400: '#a78bfa',
          500: '#7c3aed',
          600: '#5b21b6'
        },
        gold: {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706'
        },
        stone: {
          800: '#1c1917',
          900: '#0c0a09',
          950: '#050404'
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace']
      }
    }
  },
  plugins: []
};

export default config;
