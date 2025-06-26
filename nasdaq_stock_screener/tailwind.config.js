/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#2563EB', // Deep blue (primary) - blue-600
        'secondary': '#64748B', // Sophisticated slate gray (secondary) - slate-500
        'accent': '#0EA5E9', // Lighter blue (accent) - sky-500
        
        // Background Colors
        'background': '#FAFAFA', // Warm off-white (background) - gray-50
        'surface': '#FFFFFF', // Pure white (surface) - white
        
        // Text Colors
        'text-primary': '#1E293B', // Near-black (text primary) - slate-800
        'text-secondary': '#64748B', // Medium gray (text secondary) - slate-500
        
        // Status Colors
        'success': '#059669', // Forest green (success) - emerald-600
        'warning': '#D97706', // Amber orange (warning) - amber-600
        'error': '#DC2626', // Clear red (error) - red-600
        
        // Border Colors
        'border': '#E2E8F0', // Light gray (border) - slate-200
      },
      fontFamily: {
        'heading': ['Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'caption': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      fontWeight: {
        'heading-normal': '400',
        'heading-medium': '500',
        'heading-semibold': '600',
        'body-normal': '400',
        'body-medium': '500',
        'caption-normal': '400',
        'data-normal': '400',
      },
      boxShadow: {
        'light': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      transitionDuration: {
        '150': '150ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
      },
      spacing: {
        '15': '3.75rem', // 60px for header height
        '70': '17.5rem', // 280px for sidebar width
      },
      zIndex: {
        '999': '999',
        '1000': '1000',
        '1001': '1001',
        '1100': '1100',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}