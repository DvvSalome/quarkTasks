import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, Command, X } from 'lucide-react'
import { getGreeting } from '../lib/utils'

const pageNames = {
  dashboard: 'Dashboard',
  copilot: 'AI Copilot',
  tasks: 'Tareas',
  focus: 'Enfoque Profundo',
  routines: 'Rutinas',
  analytics: 'Analytics',
  workflow: 'Workflow',
  settings: 'Configuración'
}

export default function TopBar({ searchQuery, onSearchChange, currentPage }) {
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="h-16 border-b border-white/5 flex items-center px-6 gap-4"
    >
      <div className="flex items-center gap-3">
        <span className="text-sm text-white/35 font-mono">
          {getGreeting()},&nbsp;<span className="text-white/60">Usuario</span>
        </span>
        <span className="text-white/15">/</span>
        <motion.span
          key={currentPage}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-sm text-quantum-200 font-medium"
        >
          {pageNames[currentPage]}
        </motion.span>
      </div>

      <div className="flex-1" />

      {/* Search */}
      <motion.div
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200"
        animate={{
          borderColor: searchFocused ? 'rgba(123,46,255,0.5)' : 'rgba(255,255,255,0.1)',
          background: searchFocused ? 'rgba(123,46,255,0.07)' : 'rgba(255,255,255,0.04)',
          boxShadow: searchFocused ? '0 0 0 3px rgba(123,46,255,0.12)' : 'none',
        }}
      >
        <Search className={`w-4 h-4 transition-colors duration-200 ${searchFocused ? 'text-quantum-300' : 'text-white/35'}`} />
        <input
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="bg-transparent border-none outline-none text-sm text-white/80 placeholder:text-white/25 w-48"
        />
        <AnimatePresence>
          {searchQuery ? (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={() => onSearchChange('')}
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 text-white/25 text-xs"
            >
              <Command className="w-3 h-3" />
              <span>K</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Notifications */}
      <motion.button
        className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        <Bell className="w-5 h-5 text-white/55" />
        <motion.span
          className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neon-pink"
          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ boxShadow: '0 0 6px rgba(255,46,151,0.7)' }}
        />
      </motion.button>

      {/* Avatar */}
      <motion.div
        className="flex items-center gap-3 pl-4 border-l border-white/8 cursor-pointer"
        whileHover={{ scale: 1.04 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-quantum-500 to-neon-cyan flex items-center justify-center overflow-hidden">
          <span className="text-sm font-semibold text-white">U</span>
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-lg"
            initial={{ x: '-100%', skewX: '-15deg' }}
            whileHover={{ x: '150%' }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </motion.div>
    </motion.header>
  )
}
