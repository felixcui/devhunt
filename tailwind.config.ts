import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Professional color palette with enhanced accessibility
        primary: {
          // Professional Blue - Primary brand color
          50: '#e6f2ff',
          100: '#cce5ff',
          200: '#99ccff',
          300: '#66b3ff',
          400: '#3399ff',
          500: '#0052cc',  // Main brand color
          600: '#0041a3',
          700: '#003080',
          800: '#002066',
          900: '#001a52',
          950: '#00103d',
        },
        secondary: {
          // Slate - Modern & Elegant
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        accent: {
          // Success Green - Accent and positive actions
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',  // Main accent color
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // 功能区域专用颜色 - 统一各功能模块颜色
        'tool-icon': {
          // 工具图标专用颜色 (Primary Blue)
          DEFAULT: '#0052cc',
          hover: '#003d99',
          light: '#e6f2ff',
        },
        'category-tag': {
          // 分类标签专用颜色 (Secondary Slate)
          DEFAULT: '#64748b',
          bg: '#f1f5f9',
          border: '#e2e8f0',
          hover: '#475569',
        },
        'news-accent': {
          // 资讯内容专用颜色 (Accent Green)
          DEFAULT: '#10b981',
          bg: '#ecfdf5',
          border: '#d1fae5',
          hover: '#059669',
        },
        category: {
          ui: {
            start: '#0052cc', // Primary blue
            end: '#64748b',   // Secondary slate
          },
          saas: {
            start: '#10b981', // Accent green
            end: '#0052cc',   // Primary blue
          },
          plugin: {
            start: '#64748b', // Secondary slate
            end: '#10b981',   // Accent green
          },
          // All other categories use the same 3-color combinations
          agent: {
            start: '#0052cc',
            end: '#10b981',
          },
          review: {
            start: '#64748b',
            end: '#0052cc',
          },
          test: {
            start: '#10b981',
            end: '#64748b',
          },
          chat: {
            start: '#0052cc',
            end: '#64748b',
          },
        },
        // Semantic colors for better accessibility
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        info: {
          50: '#e6f2ff',
          100: '#cce5ff',
          500: '#0052cc',
          600: '#0041a3',
          700: '#003080',
        },
        // Legacy support - map to new system
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
} satisfies Config;
