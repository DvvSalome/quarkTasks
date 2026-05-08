import { createContext, useContext, useState, useEffect } from 'react'

// Colors stored as "R G B" channel triplets for Tailwind alpha-value support
export const THEMES = {
  'quantum-dark': {
    id: 'quantum-dark',
    name: 'Quantum Dark',
    desc: 'El tema oficial. Púrpura cuántico profundo.',
    swatches: ['#07040F', '#7B3DFF', '#FF4DDB'],
    vars: {
      '--quantum-950': '7 4 15',
      '--quantum-900': '12 8 24',
      '--quantum-800': '30 27 58',
      '--quantum-700': '37 32 71',
      '--quantum-600': '44 39 84',
      '--quantum-500': '123 61 255',
      '--quantum-400': '167 139 250',
      '--quantum-300': '196 168 255',
      '--quantum-200': '221 208 255',
      '--quantum-100': '240 235 255',
      '--neon-cyan':   '61 90 254',
      '--neon-pink':   '255 77 219',
      '--neon-violet': '167 139 250',
      '--neon-blue':   '61 90 254',
    },
  },
  'midnight': {
    id: 'midnight',
    name: 'Midnight',
    desc: 'Azul eléctrico oscuro.',
    swatches: ['#060612', '#3D5AFE', '#A78BFA'],
    vars: {
      '--quantum-950': '6 6 18',
      '--quantum-900': '10 10 30',
      '--quantum-800': '16 16 46',
      '--quantum-700': '22 22 62',
      '--quantum-600': '28 28 78',
      '--quantum-500': '61 90 254',
      '--quantum-400': '107 127 255',
      '--quantum-300': '139 159 255',
      '--quantum-200': '176 189 255',
      '--quantum-100': '216 222 255',
      '--neon-cyan':   '167 139 250',
      '--neon-pink':   '255 77 219',
      '--neon-violet': '61 90 254',
      '--neon-blue':   '61 90 254',
    },
  },
  'aurora': {
    id: 'aurora',
    name: 'Aurora',
    desc: 'Rosa energético, alta vibración.',
    swatches: ['#0A040F', '#FF4DDB', '#7B3DFF'],
    vars: {
      '--quantum-950': '10 4 15',
      '--quantum-900': '18 8 25',
      '--quantum-800': '31 15 46',
      '--quantum-700': '42 19 64',
      '--quantum-600': '54 23 82',
      '--quantum-500': '255 77 219',
      '--quantum-400': '255 125 232',
      '--quantum-300': '255 160 239',
      '--quantum-200': '255 202 246',
      '--quantum-100': '255 232 252',
      '--neon-cyan':   '167 139 250',
      '--neon-pink':   '255 77 219',
      '--neon-violet': '123 61 255',
      '--neon-blue':   '61 90 254',
    },
  },
  'nebula': {
    id: 'nebula',
    name: 'Nebula',
    desc: 'Violeta suave y etéreo.',
    swatches: ['#07090F', '#A78BFA', '#3D5AFE'],
    vars: {
      '--quantum-950': '7 9 16',
      '--quantum-900': '13 16 32',
      '--quantum-800': '19 24 40',
      '--quantum-700': '27 33 54',
      '--quantum-600': '34 42 68',
      '--quantum-500': '167 139 250',
      '--quantum-400': '191 163 252',
      '--quantum-300': '208 187 253',
      '--quantum-200': '227 213 254',
      '--quantum-100': '244 238 255',
      '--neon-cyan':   '61 90 254',
      '--neon-pink':   '255 77 219',
      '--neon-violet': '167 139 250',
      '--neon-blue':   '61 90 254',
    },
  },
}

export const DEFAULT_EFFECTS = {
  particles: true,
  glassmorphism: true,
  glow: true,
  animations: true,
}

const ThemeContext = createContext(null)

function applyTheme(themeId) {
  const theme = THEMES[themeId]
  if (!theme) return
  const root = document.documentElement
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v))
  root.setAttribute('data-theme', themeId)
}

function applyEffects(effects) {
  const root = document.documentElement
  root.classList.toggle('fx-no-particles', !effects.particles)
  root.classList.toggle('fx-no-glass', !effects.glassmorphism)
  root.classList.toggle('fx-no-glow', !effects.glow)
  root.classList.toggle('fx-no-anim', !effects.animations)
}

function loadSavedTheme() {
  return localStorage.getItem('quark_theme') || 'quantum-dark'
}

function loadSavedEffects() {
  try {
    return JSON.parse(localStorage.getItem('quark_effects')) || DEFAULT_EFFECTS
  } catch {
    return DEFAULT_EFFECTS
  }
}

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => {
    const saved = loadSavedTheme()
    applyTheme(saved)
    return saved
  })

  const [effects, setEffectsState] = useState(() => {
    const saved = loadSavedEffects()
    applyEffects(saved)
    return saved
  })

  useEffect(() => {
    applyTheme(themeId)
  }, [themeId])

  useEffect(() => {
    applyEffects(effects)
  }, [effects])

  const changeTheme = (id) => {
    setThemeId(id)
    localStorage.setItem('quark_theme', id)
  }

  const setEffect = (key, value) => {
    setEffectsState(prev => {
      const next = { ...prev, [key]: value }
      localStorage.setItem('quark_effects', JSON.stringify(next))
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ themeId, changeTheme, effects, setEffect, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
