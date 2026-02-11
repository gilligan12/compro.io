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
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'bg-primary': '#FAFBFC',
        'bg-secondary': '#FFFFFF',
        'deep-green': '#1B4332',
        'deep-green-dark': '#0F2819',
        'deep-green-light': '#2D5A3D',
        'accent': '#F0F4F8',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'fade-in': 'fade-in 1s ease-out',
        'fade-in-delay': 'fade-in 1s ease-out 0.5s both',
        'slide-up': 'slide-up 0.8s ease-out',
        'slide-up-delay': 'slide-up 0.8s ease-out 0.2s both',
        'slide-up-delay-2': 'slide-up 0.8s ease-out 0.4s both',
        'slide-up-delay-3': 'slide-up 0.8s ease-out 0.6s both',
        'gradient': 'gradient 3s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-20px) translateX(10px)' },
          '66%': { transform: 'translateY(20px) translateX(-10px)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
}
