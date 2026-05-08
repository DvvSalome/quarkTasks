/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CSS-var-driven colors — all themes update these at runtime
        quantum: {
          950: 'rgb(var(--quantum-950) / <alpha-value>)',
          900: 'rgb(var(--quantum-900) / <alpha-value>)',
          800: 'rgb(var(--quantum-800) / <alpha-value>)',
          700: 'rgb(var(--quantum-700) / <alpha-value>)',
          600: 'rgb(var(--quantum-600) / <alpha-value>)',
          500: 'rgb(var(--quantum-500) / <alpha-value>)',
          400: 'rgb(var(--quantum-400) / <alpha-value>)',
          300: 'rgb(var(--quantum-300) / <alpha-value>)',
          200: 'rgb(var(--quantum-200) / <alpha-value>)',
          100: 'rgb(var(--quantum-100) / <alpha-value>)',
        },
        neon: {
          cyan:   'rgb(var(--neon-cyan)   / <alpha-value>)',
          pink:   'rgb(var(--neon-pink)   / <alpha-value>)',
          violet: 'rgb(var(--neon-violet) / <alpha-value>)',
          blue:   'rgb(var(--neon-blue)   / <alpha-value>)',
        },
        surface: {
          glass:       'rgba(255, 255, 255, 0.03)',
          glassStrong: 'rgba(255, 255, 255, 0.08)',
          border:      'rgba(255, 255, 255, 0.08)',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      animation: {
        'glow-pulse':      'glow-pulse 3s ease-in-out infinite',
        'float':           'float 6s ease-in-out infinite',
        'particle-drift':  'particle-drift 8s linear infinite',
        'neuron-pulse':    'neuron-pulse 2s ease-in-out infinite',
        'scan-line':       'scan-line 2s linear infinite',
        'gradient-shift':  'gradient-shift 8s ease infinite',
        'shimmer':         'shimmer 2s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%':      { opacity: '1',   transform: 'scale(1.05)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'particle-drift': {
          '0%':   { transform: 'translate(0, 0)', opacity: '0' },
          '10%':  { opacity: '0.8' },
          '90%':  { opacity: '0.8' },
          '100%': { transform: 'translate(100px, -100px)', opacity: '0' },
        },
        'neuron-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgb(var(--quantum-500) / 0.3)' },
          '50%':      { boxShadow: '0 0 40px rgb(var(--quantum-500) / 0.6), 0 0 60px rgb(var(--quantum-500) / 0.3)' },
        },
        'scan-line': {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'quantum-gradient': 'linear-gradient(135deg, rgb(var(--quantum-500)) 0%, rgb(var(--quantum-400)) 50%, rgb(var(--neon-cyan)) 100%)',
        'purple-glow':      'radial-gradient(ellipse at center, rgb(var(--quantum-500) / 0.15) 0%, transparent 70%)',
        'grid-pattern':     'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
      },
      backdropBlur: { 'xs': '2px' },
      boxShadow: {
        'glow':       '0 0 30px rgb(var(--quantum-500) / 0.3)',
        'glow-lg':    '0 0 60px rgb(var(--quantum-500) / 0.4)',
        'glow-cyan':  '0 0 30px rgb(var(--neon-cyan)   / 0.3)',
        'inner-glow': 'inset 0 0 30px rgb(var(--quantum-500) / 0.1)',
      },
    },
  },
  plugins: [],
}
