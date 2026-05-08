import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Brain,
  CheckSquare,
  Target,
  Calendar,
  BarChart3,
  GitBranch,
  Settings,
  Sparkles,
} from 'lucide-react'
import { cn } from '../lib/utils'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'copilot', label: 'AI Copilot', icon: Brain },
  { id: 'tasks', label: 'Tareas', icon: CheckSquare },
  { id: 'focus', label: 'Enfoque', icon: Target },
  { id: 'routines', label: 'Rutinas', icon: Calendar },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'workflow', label: 'Workflow', icon: GitBranch },
  { id: 'settings', label: 'Ajustes', icon: Settings },
]

export default function Sidebar({ currentPage, onNavigate }) {
  return (
    <motion.aside
      initial={{ x: -24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="w-64 h-full glass-panel border-r border-white/5 p-4 flex flex-col"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 pb-6 border-b border-white/5 mb-6">
        <motion.div
          className="relative flex items-center justify-center"
          whileHover={{ scale: 1.08 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <motion.img
            src="/quark-logo.png"
            className="w-11 h-auto object-contain relative z-10"
            style={{ filter: 'drop-shadow(0 0 8px rgba(123,46,255,0.6)) drop-shadow(0 0 16px rgba(0,245,255,0.2))' }}
            animate={{
              filter: [
                'drop-shadow(0 0 6px rgba(123,46,255,0.5)) drop-shadow(0 0 12px rgba(0,245,255,0.15))',
                'drop-shadow(0 0 12px rgba(123,46,255,0.8)) drop-shadow(0 0 20px rgba(0,245,255,0.35))',
                'drop-shadow(0 0 6px rgba(123,46,255,0.5)) drop-shadow(0 0 12px rgba(0,245,255,0.15))',
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
        <div>
          <h1 className="text-lg font-semibold text-white leading-tight">Quark</h1>
          <p className="text-xs text-white/35 font-mono tracking-widest">TASKING</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5">
        <div className="text-xs font-mono text-white/25 uppercase tracking-wider px-3 mb-3">
          Principal
        </div>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id

          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 overflow-hidden',
                isActive
                  ? 'bg-quantum-500/15 text-white'
                  : 'text-white/45 hover:text-white/80 hover:bg-white/5'
              )}
              whileHover={{ x: isActive ? 0 : 3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {isActive && (
                <>
                  {/* Left accent bar */}
                  <motion.div
                    layoutId="activeAccent"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-gradient-to-b from-quantum-400 to-neon-cyan"
                    style={{ boxShadow: '0 0 8px rgba(123,46,255,0.6)' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                  {/* Active background shimmer */}
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    style={{ background: 'linear-gradient(90deg, rgba(123,46,255,0.08) 0%, rgba(0,245,255,0.03) 100%)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </>
              )}
              <Icon className={cn('w-4 h-4 relative z-10 transition-colors', isActive ? 'text-quantum-300' : '')} />
              <span className="text-sm relative z-10">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeDot"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-quantum-400 relative z-10"
                  style={{ boxShadow: '0 0 6px rgba(123,46,255,0.8)' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* AI Status Card */}
      <div className="pt-4 border-t border-white/5">
        <motion.div
          className="glass-card-glow p-3 rounded-xl border border-quantum-500/15"
          whileHover={{ scale: 1.02, borderColor: 'rgba(123,46,255,0.3)' }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="relative w-2 h-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <motion.div
                className="absolute inset-0 rounded-full bg-green-400"
                animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              />
            </div>
            <span className="text-xs font-mono text-green-400 tracking-wider">IA ACTIVA</span>
          </div>
          <p className="text-xs text-white/50 leading-relaxed">
            Analizando patrones de productividad...
          </p>
        </motion.div>
      </div>
    </motion.aside>
  )
}
