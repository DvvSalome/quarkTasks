import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Play, Pause, RotateCcw, Volume2, Wind, Zap, Brain, Clock, Check, Music,
  EyeOff, AlertTriangle, VolumeX,
} from 'lucide-react'
import { cn } from '../lib/utils'
import useFocusVision from '../hooks/useFocusVision'
import { playChime } from '../lib/audio'
import FocusVisionModal from './FocusVisionModal'
import FocusVisionIndicator from './FocusVisionIndicator'

const focusTasks = [
  { id: 1, title: 'Implementar autenticación OAuth', time: '25 min', completed: false },
  { id: 2, title: 'Review de código - módulo payments', time: '15 min', completed: false },
  { id: 3, title: 'Documentar nuevos endpoints', time: '20 min', completed: false },
]

const sounds = [
  { id: 'rain', label: 'Lluvia', icon: Volume2 },
  { id: 'ocean', label: 'Océano', icon: Wind },
  { id: 'forest', label: 'Bosque', icon: Music },
  { id: 'cafe', label: 'Café', icon: Volume2 },
  { id: 'silence', label: 'Silencio', icon: Wind },
  { id: 'jazz', label: 'Jazz', icon: Music },
]

export default function Focus() {
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [mode, setMode] = useState('focus')
  const [breathPhase, setBreathPhase] = useState('inhale')
  const [tasks, setTasks] = useState(focusTasks)
  const [activeSound, setActiveSound] = useState(null)
  const [completedSessions, setCompletedSessions] = useState(0)
  const [audioVolume, setAudioVolume] = useState(0.5)
  const [muted, setMuted] = useState(false)

  const vision = useFocusVision()
  const [showVisionModal, setShowVisionModal] = useState(false)
  const prevFocusRef = useRef(null)
  const hasSeenModalRef = useRef(localStorage.getItem('quark_vision_modal_shown') === 'true')

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

  useEffect(() => {
    if (vision.state !== 'active' || muted) return
    const prev = prevFocusRef.current
    if (prev && prev !== vision.focus) {
      if (vision.focus === 'distracted') {
        playChime('distracted', audioVolume)
      } else if (vision.focus === 'absent') {
        playChime('absent', audioVolume)
      } else if (vision.focus === 'focused' && (prev === 'distracted' || prev === 'absent')) {
        playChime('focus', audioVolume)
      }
    }
    prevFocusRef.current = vision.focus
  }, [vision.focus, vision.state, muted, audioVolume])

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

  const handleVisionActivate = useCallback(() => {
    if (!hasSeenModalRef.current) {
      setShowVisionModal(true)
    } else {
      vision.activate()
    }
  }, [vision.activate])

  const handleVisionConfirm = useCallback(() => {
    setShowVisionModal(false)
    hasSeenModalRef.current = true
    localStorage.setItem('quark_vision_modal_shown', 'true')
    vision.activate()
  }, [vision.activate])

  const timerColors = useMemo(() => {
    if (vision.state !== 'active') {
      return { from: '#7B2EFF', to: '#00F5FF', shadow: 'rgba(123,46,255,0.3)' }
    }
    switch (vision.focus) {
      case 'distracted':
        return { from: '#F59E0B', to: '#F97316', shadow: 'rgba(245,158,11,0.4)' }
      case 'absent':
        return { from: '#EF4444', to: '#DC2626', shadow: 'rgba(239,68,68,0.5)' }
      default:
        return { from: '#7B2EFF', to: '#00F5FF', shadow: 'rgba(123,46,255,0.3)' }
    }
  }, [vision.state, vision.focus])

  const isVisionAlert = vision.state === 'active' && (vision.focus === 'distracted' || vision.focus === 'absent')
  const circleLength = 2 * Math.PI * 90

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex gap-8">
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          className="relative"
          animate={isVisionAlert ? { scale: [1, 1.01, 1] } : { scale: isActive ? 1.02 : 1 }}
          transition={{
            duration: isVisionAlert ? 0.6 : 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <div className="focus-ring w-72 h-72 flex items-center justify-center">
            <motion.svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={timerColors.from} />
                  <stop offset="100%" stopColor={timerColors.to} />
                </linearGradient>
              </defs>
              <motion.circle
                cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2"
              />
              <motion.circle
                cx="100" cy="100" r="90" fill="none" stroke="url(#focusGradient)" strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={circleLength}
                strokeDashoffset={circleLength * (1 - progress / 100)}
                transform="rotate(-90 100 100)"
                initial={{ strokeDashoffset: circleLength }}
                animate={{ strokeDashoffset: circleLength * (1 - progress / 100) }}
                transition={{ duration: 1 }}
              />
            </motion.svg>

            <div className="relative z-10 text-center">
              <motion.div
                className="text-6xl font-light mb-2 font-mono tracking-wider"
                animate={{
                  opacity: isActive ? 1 : 0.5,
                  color: isVisionAlert ? timerColors.from : '#ffffff',
                }}
                transition={{ duration: 0.5 }}
              >
                {formatTime(timeLeft)}
              </motion.div>
              <div className="text-sm text-white/40 font-mono">
                {isActive
                  ? vision.state === 'active' && vision.focus === 'absent'
                    ? 'SIN PRESENCIA'
                    : vision.state === 'active' && vision.focus === 'distracted'
                    ? 'DISTRAÍDO'
                    : 'ENFOQUE ACTIVO'
                  : timeLeft === 0
                  ? '¡SESIÓN COMPLETADA!'
                  : 'PRESIONA PLAY'}
              </div>
            </div>

            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: vision.state === 'active' && vision.focus === 'absent'
                  ? [
                      `0 0 50px ${timerColors.shadow}`,
                      `0 0 100px ${timerColors.shadow}`,
                      `0 0 50px ${timerColors.shadow}`,
                    ]
                  : vision.state === 'active' && vision.focus === 'distracted'
                  ? [
                      `0 0 40px ${timerColors.shadow}`,
                      `0 0 80px ${timerColors.shadow}`,
                      `0 0 40px ${timerColors.shadow}`,
                    ]
                  : isActive
                  ? [
                      '0 0 60px rgba(123,46,255,0.3)',
                      '0 0 100px rgba(0,245,255,0.4)',
                      '0 0 60px rgba(123,46,255,0.3)',
                    ]
                  : '0 0 30px rgba(123,46,255,0.2)',
              }}
              transition={{
                duration: vision.focus === 'absent' ? 1 : 2,
                repeat: Infinity,
              }}
            />
          </div>

          {isVisionAlert && (
            <motion.div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{
                background: vision.focus === 'absent'
                  ? 'rgba(239,68,68,0.15)'
                  : 'rgba(245,158,11,0.15)',
                border: vision.focus === 'absent'
                  ? '1px solid rgba(239,68,68,0.3)'
                  : '1px solid rgba(245,158,11,0.3)',
              }}
            >
              {vision.focus === 'absent' ? (
                <>
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  <span className="text-xs text-red-300 font-medium">Ausencia prolongada</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3 h-3 text-amber-400" />
                  <span className="text-xs text-amber-300 font-medium">Distracción detectada</span>
                </>
              )}
            </motion.div>
          )}

          <div className="flex items-center justify-center gap-4 mt-12">
            <motion.button
              onClick={() => setIsActive(!isActive)}
              className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center transition-all',
                isActive
                  ? 'bg-red-500/20 border border-red-500/50 text-red-400'
                  : 'bg-[rgb(var(--quantum-500)/.2)] border border-[rgb(var(--quantum-500)/.5)] text-[rgb(var(--quantum-300))]'
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </motion.button>
            <motion.button
              onClick={() => { setTimeLeft(modeDurations[mode]); setIsActive(false) }}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        <div className="mt-12 flex items-center gap-4">
          {['focus', 'break', 'deep'].map((m) => (
            <motion.button
              key={m}
              onClick={() => handleModeChange(m)}
              className={cn(
                'px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
                mode === m
                  ? 'bg-[rgb(var(--quantum-500)/.2)] text-[rgb(var(--quantum-300))] border border-[rgb(var(--quantum-500)/.3)]'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent'
              )}
              whileTap={{ scale: 0.97 }}
            >
              {m === 'focus' && 'Focus 25m'}
              {m === 'break' && 'Break 5m'}
              {m === 'deep' && 'Deep 90m'}
            </motion.button>
          ))}
        </div>

        {timeLeft === 0 && !isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-3 px-5 py-3 rounded-full bg-green-500/10 border border-green-500/30"
          >
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">Sesión completada — {completedSessions} hoy</span>
          </motion.div>
        )}
      </div>

      <div className="w-96 space-y-6 overflow-y-auto">
        <FocusVisionIndicator
          state={vision.state}
          focus={vision.focus}
          confidence={vision.confidence}
          sensitivity={vision.sensitivity}
          onActivate={handleVisionActivate}
          onDeactivate={vision.deactivate}
          onSensitivityChange={vision.setSensitivity}
        />

        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-[rgb(var(--quantum-400))]" />
            <span className="text-sm font-medium text-white">Respiración</span>
          </div>
          <div className="flex items-center justify-center py-8">
            <motion.div
              className="w-32 h-32 rounded-full bg-gradient-to-br from-[rgb(var(--quantum-500)/.2)] to-[rgb(var(--neon-cyan)/.2)] flex items-center justify-center"
              animate={{ scale: breathPhase === 'inhale' ? 1.3 : 1 }}
              transition={{ duration: 4, ease: 'easeInOut' }}
            >
              <motion.div
                className="w-24 h-24 rounded-full bg-gradient-to-br from-[rgb(var(--quantum-500))] to-[rgb(var(--neon-cyan))]"
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
          <div className="space-y-2">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
                  task.completed ? 'bg-green-500/5' : 'bg-white/5 hover:bg-white/10'
                )}
                whileHover={{ x: 4 }}
              >
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                  task.completed ? 'border-green-400 bg-green-400/20' : 'border-white/20'
                )}>
                  {task.completed && <Check className="w-3 h-3 text-green-400" />}
                </div>
                <div className="flex-1">
                  <div className={cn(
                    'text-sm transition-colors',
                    task.completed ? 'text-white/30 line-through' : 'text-white'
                  )}>
                    {task.title}
                  </div>
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-[rgb(var(--neon-cyan))]" />
              <span className="text-sm font-medium text-white">Ambiente</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMuted(!muted)}
                className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                  muted ? 'text-red-400 bg-red-500/10' : 'text-white/40 hover:text-white hover:bg-white/5'
                )}
              >
                {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {sounds.map((sound) => (
              <motion.button
                key={sound.id}
                onClick={() => setActiveSound(activeSound === sound.id ? null : sound.id)}
                className={cn(
                  'p-2.5 rounded-lg text-xs transition-all',
                  activeSound === sound.id
                    ? 'bg-[rgb(var(--quantum-500)/.2)] border border-[rgb(var(--quantum-500)/.3)] text-white'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {sound.label}
              </motion.button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Volume2 className="w-3 h-3 text-white/30" />
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(audioVolume * 100)}
              onChange={(e) => setAudioVolume(parseInt(e.target.value) / 100)}
              className="flex-1 h-1 appearance-none bg-white/10 rounded-full outline-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[rgb(var(--quantum-400))]
                [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgb(var(--quantum-500)/.5)]"
            />
            <span className="text-[11px] text-white/30 font-mono w-8 text-right">
              {Math.round(audioVolume * 100)}
            </span>
          </div>
        </div>
      </div>

      <FocusVisionModal
        open={showVisionModal}
        onConfirm={handleVisionConfirm}
        onCancel={() => setShowVisionModal(false)}
      />
    </motion.div>
  )
}
