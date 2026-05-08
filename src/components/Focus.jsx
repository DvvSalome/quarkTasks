import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Target, 
  Play, 
  Pause, 
  RotateCcw,
  Volume2,
  Wind,
  Zap,
  Brain,
  Clock,
  ChevronRight
} from 'lucide-react'
import { cn } from '../lib/utils'

const focusTasks = [
  { id: 1, title: 'Implementar autenticación OAuth', time: '25 min', completed: false },
  { id: 2, title: 'Review de código - módulo payments', time: '15 min', completed: false },
  { id: 3, title: 'Documentar nuevos endpoints', time: '20 min', completed: false },
]

export default function Focus() {
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [mode, setMode] = useState('deep')
  const [breathPhase, setBreathPhase] = useState('inhale')
  
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isActive, timeLeft])
  
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase(prev => prev === 'inhale' ? 'exhale' : 'inhale')
    }, 4000)
    return () => clearInterval(interval)
  }, [])
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex gap-8"
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div 
          className="relative"
          animate={{ scale: isActive ? 1.02 : 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        >
          <div className="focus-ring w-72 h-72 flex items-center justify-center">
            <motion.svg 
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 200 200"
            >
              <defs>
                <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7B2EFF" />
                  <stop offset="100%" stopColor="#00F5FF" />
                </linearGradient>
              </defs>
              <motion.circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
              />
              <motion.circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="url(#focusGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                transform="rotate(-90 100 100)"
                initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 90 * (1 - progress / 100) }}
                transition={{ duration: 1 }}
              />
            </motion.svg>
            
            <div className="relative z-10 text-center">
              <motion.div
                className="text-6xl font-light text-white mb-2 font-mono tracking-wider"
                animate={{ opacity: isActive ? 1 : 0.5 }}
              >
                {formatTime(timeLeft)}
              </motion.div>
              <div className="text-sm text-white/40 font-mono">
                {isActive ? 'ENFOQUE ACTIVO' : 'PRESIONA PLAY'}
              </div>
            </div>
            
            <motion.div 
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: isActive 
                  ? ['0 0 60px rgba(123,46,255,0.3)', '0 0 100px rgba(0,245,255,0.4)', '0 0 60px rgba(123,46,255,0.3)']
                  : '0 0 30px rgba(123,46,255,0.2)'
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-12">
            <motion.button
              onClick={() => setIsActive(!isActive)}
              className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center transition-all',
                isActive 
                  ? 'bg-red-500/20 border border-red-500/50 text-red-400' 
                  : 'bg-quantum-500/20 border border-quantum-500/50 text-quantum-300'
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isActive ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </motion.button>
            
            <motion.button
              onClick={() => { setTimeLeft(25 * 60); setIsActive(false) }}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
        
        <div className="mt-12 flex items-center gap-4">
          {['focus', 'break', 'deep'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                mode === m 
                  ? 'bg-quantum-500/20 text-quantum-300 border border-quantum-500/30' 
                  : 'text-white/40 hover:text-white/70'
              )}
            >
              {m === 'focus' && 'Focus'}
              {m === 'break' && 'Break'}
              {m === 'deep' && 'Deep'}
            </button>
          ))}
        </div>
      </div>
      
      <div className="w-96 space-y-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-quantum-400" />
            <span className="text-sm font-medium text-white">Respiración</span>
          </div>
          
          <div className="flex items-center justify-center py-8">
            <motion.div
              className="w-32 h-32 rounded-full bg-gradient-to-br from-quantum-500/20 to-neon-cyan/20 flex items-center justify-center"
              animate={{
                scale: breathPhase === 'inhale' ? 1.3 : 1,
              }}
              transition={{ duration: 4, ease: 'easeInOut' }}
            >
              <motion.div
                className="w-24 h-24 rounded-full bg-gradient-to-br from-quantum-500 to-neon-cyan"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </motion.div>
          </div>
          
          <div className="text-center">
            <motion.p 
              className="text-lg text-white/80"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {breathPhase === 'inhale' ? 'Inhala...' : 'Exhala...'}
            </motion.p>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-white">Tarea Actual</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          
          <div className="space-y-3">
            {focusTasks.map((task) => (
              <motion.div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                whileHover={{ x: 4 }}
              >
                <div className="w-5 h-5 rounded-full border-2 border-white/20" />
                <div className="flex-1">
                  <div className="text-sm text-white">{task.title}</div>
                  <div className="flex items-center gap-1 text-xs text-white/40 mt-1">
                    <Clock className="w-3 h-3" />
                    {task.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.button
            className="w-full mt-4 p-3 rounded-lg bg-quantum-500/10 border border-quantum-500/20 text-quantum-300 text-sm hover:bg-quantum-500/20 transition-colors flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            Cambiar tarea
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wind className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-medium text-white">Ambiente</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['Lluvia', 'Océano', 'Bosque', 'Café', 'Silencio', 'Jazz'].map((sound) => (
              <motion.button
                key={sound}
                className="p-2 rounded-lg bg-white/5 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                {sound}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}