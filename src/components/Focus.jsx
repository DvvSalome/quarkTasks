import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Target, Play, Pause, RotateCcw, Volume2, Wind, Zap, Brain, Clock, ChevronRight, Check, Music,
} from 'lucide-react'
import { cn } from '../lib/utils'

const focusTasks = [
  { id: 1, title: 'Implementar autenticación OAuth', time: '25 min', completed: false },
  { id: 2, title: 'Review de código - módulo payments', time: '15 min', completed: false },
  { id: 3, title: 'Documentar nuevos endpoints', time: '20 min', completed: false },
]

const sounds = [
  { id: 'rain', label: 'Lluvia', icon: Volume2 }, { id: 'ocean', label: 'Océano', icon: Wind },
  { id: 'forest', label: 'Bosque', icon: Music }, { id: 'cafe', label: 'Café', icon: Volume2 },
  { id: 'silence', label: 'Silencio', icon: Wind }, { id: 'jazz', label: 'Jazz', icon: Music },
]

export default function Focus() {
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [mode, setMode] = useState('focus')
  const [breathPhase, setBreathPhase] = useState('inhale')
  const [tasks, setTasks] = useState(focusTasks)
  const [activeSound, setActiveSound] = useState(null)
  const [completedSessions, setCompletedSessions] = useState(0)

  const modeDurations = { focus: 25 * 60, deep: 90 * 60, break: 5 * 60 }

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
      return () => clearInterval(timer)
    }
    if (isActive && timeLeft === 0) {
      setIsActive(false)
      setCompletedSessions(prev => prev + 1)
    }
  }, [isActive, timeLeft])

  useEffect(() => {
    const interval = setInterval(() => setBreathPhase(prev => prev === 'inhale' ? 'exhale' : 'inhale'), 4000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((modeDurations[mode] - timeLeft) / modeDurations[mode]) * 100

  const handleModeChange = (m) => {
    setMode(m)
    setTimeLeft(modeDurations[m])
    setIsActive(false)
  }

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex gap-8">
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div className="relative" animate={{ scale: isActive ? 1.02 : 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}>
          <div className="focus-ring w-72 h-72 flex items-center justify-center">
            <motion.svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7B2EFF" />
                  <stop offset="100%" stopColor="#00F5FF" />
                </linearGradient>
              </defs>
              <motion.circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
              <motion.circle cx="100" cy="100" r="90" fill="none" stroke="url(#focusGradient)" strokeWidth="2"
                strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                transform="rotate(-90 100 100)"
                initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 90 * (1 - progress / 100) }}
                transition={{ duration: 1 }} />
            </motion.svg>
            <div className="relative z-10 text-center">
              <motion.div className="text-6xl font-light text-white mb-2 font-mono tracking-wider"
                animate={{ opacity: isActive ? 1 : 0.5 }}>
                {formatTime(timeLeft)}
              </motion.div>
              <div className="text-sm text-white/40 font-mono">
                {isActive ? 'ENFOQUE ACTIVO' : timeLeft === 0 ? '¡SESIÓN COMPLETADA!' : 'PRESIONA PLAY'}
              </div>
            </div>
            <motion.div className="absolute inset-0 rounded-full"
              animate={{ boxShadow: isActive ? ['0 0 60px rgba(123,46,255,0.3)', '0 0 100px rgba(0,245,255,0.4)', '0 0 60px rgba(123,46,255,0.3)'] : '0 0 30px rgba(123,46,255,0.2)' }}
              transition={{ duration: 2, repeat: Infinity }} />
          </div>

          <div className="flex items-center justify-center gap-4 mt-12">
            <motion.button onClick={() => setIsActive(!isActive)}
              className={cn('w-16 h-16 rounded-full flex items-center justify-center transition-all',
                isActive ? 'bg-red-500/20 border border-red-500/50 text-red-400' : 'bg-[rgb(var(--quantum-500)/.2)] border border-[rgb(var(--quantum-500)/.5)] text-[rgb(var(--quantum-300))]'
              )} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </motion.button>
            <motion.button onClick={() => { setTimeLeft(modeDurations[mode]); setIsActive(false) }}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.1 }}>
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        <div className="mt-12 flex items-center gap-4">
          {['focus', 'break', 'deep'].map((m) => (
            <motion.button key={m} onClick={() => handleModeChange(m)}
              className={cn('px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
                mode === m ? 'bg-[rgb(var(--quantum-500)/.2)] text-[rgb(var(--quantum-300))] border border-[rgb(var(--quantum-500)/.3)]' : 'text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent'
              )} whileTap={{ scale: 0.97 }}>
              {m === 'focus' && 'Focus 25m'}
              {m === 'break' && 'Break 5m'}
              {m === 'deep' && 'Deep 90m'}
            </motion.button>
          ))}
        </div>

        {timeLeft === 0 && !isActive && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-3 px-5 py-3 rounded-full bg-green-500/10 border border-green-500/30">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">Sesión completada — {completedSessions} hoy</span>
          </motion.div>
        )}
      </div>

      <div className="w-96 space-y-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-[rgb(var(--quantum-400))]" />
            <span className="text-sm font-medium text-white">Respiración</span>
          </div>
          <div className="flex items-center justify-center py-8">
            <motion.div className="w-32 h-32 rounded-full bg-gradient-to-br from-[rgb(var(--quantum-500)/.2)] to-[rgb(var(--neon-cyan)/.2)] flex items-center justify-center"
              animate={{ scale: breathPhase === 'inhale' ? 1.3 : 1 }} transition={{ duration: 4, ease: 'easeInOut' }}>
              <motion.div className="w-24 h-24 rounded-full bg-gradient-to-br from-[rgb(var(--quantum-500))] to-[rgb(var(--neon-cyan))]"
                animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }} />
            </motion.div>
          </div>
          <div className="text-center">
            <motion.p className="text-lg text-white/80" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 4, repeat: Infinity }}>
              {breathPhase === 'inhale' ? 'Inhala...' : 'Exhala...'}
            </motion.p>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-white">Tarea Actual</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="space-y-2">
            {tasks.map((task) => (
              <motion.div key={task.id} onClick={() => toggleTask(task.id)}
                className={cn('flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
                  task.completed ? 'bg-green-500/5' : 'bg-white/5 hover:bg-white/10'
                )} whileHover={{ x: 4 }}>
                <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                  task.completed ? 'border-green-400 bg-green-400/20' : 'border-white/20'
                )}>
                  {task.completed && <Check className="w-3 h-3 text-green-400" />}
                </div>
                <div className="flex-1">
                  <div className={cn('text-sm transition-colors', task.completed ? 'text-white/30 line-through' : 'text-white')}>{task.title}</div>
                  <div className="flex items-center gap-1 text-xs text-white/40 mt-1">
                    <Clock className="w-3 h-3" />
                    {task.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wind className="w-4 h-4 text-[rgb(var(--neon-cyan))]" />
            <span className="text-sm font-medium text-white">Ambiente</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {sounds.map((sound) => (
              <motion.button key={sound.id} onClick={() => setActiveSound(activeSound === sound.id ? null : sound.id)}
                className={cn('p-2.5 rounded-lg text-xs transition-all',
                  activeSound === sound.id ? 'bg-[rgb(var(--quantum-500)/.2)] border border-[rgb(var(--quantum-500)/.3)] text-white' : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
                )} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {sound.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
