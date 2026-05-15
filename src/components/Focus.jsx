import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Pause, RotateCcw, Camera, CameraOff,
  ShieldCheck, Cpu, Eye, Zap, Brain, AlertTriangle,
  X, Lock, Activity,
} from 'lucide-react'
import useFocusVision from '../hooks/useFocusVision'
import { playChime } from '../lib/audio'
import { cn } from '../lib/utils'

// ─── Constants ────────────────────────────────────────────────────────────────

const MODES = {
  work:      { label: 'Deep Work',    short: '25m', duration: 25 * 60 },
  break:     { label: 'Short Break',  short: '5m',  duration:  5 * 60 },
  longBreak: { label: 'Long Break',   short: '15m', duration: 15 * 60 },
}

const STATE_CFG = {
  focused: {
    label:     'Focused',
    stability: 'HIGH',
    color:     '#7B3DFF',
    colorRgb:  'var(--quantum-500)',
    text:      'text-[rgb(var(--quantum-300))]',
    bg:        'bg-[rgb(var(--quantum-500)/0.12)]',
    border:    'border-[rgb(var(--quantum-500)/0.25)]',
    icon:      Brain,
    messages:  ['Focus restored.', 'Flujo recuperado.', 'Deep work resumed.'],
  },
  unstable: {
    label:     'Unstable Attention',
    stability: 'LOW',
    color:     '#F59E0B',
    colorRgb:  '245 158 11',
    text:      'text-amber-300',
    bg:        'bg-amber-500/10',
    border:    'border-amber-500/30',
    icon:      AlertTriangle,
    messages:  ['Concentración inestable.', 'Vuelve al flujo.', 'Deep work interrupted.'],
  },
  distracted: {
    label:     'Distracted',
    stability: 'CRITICAL',
    color:     '#EF4444',
    colorRgb:  '239 68 68',
    text:      'text-red-300',
    bg:        'bg-red-500/10',
    border:    'border-red-500/30',
    icon:      AlertTriangle,
    messages:  ['Focus lost.', 'Regresando a modo enfoque...', 'Concentración crítica.'],
  },
}

const TRUST_BADGES = [
  { icon: Cpu,        label: 'Local Processing' },
  { icon: Lock,       label: 'No Cloud Recording' },
  { icon: ShieldCheck,label: 'Zero Trust' },
  { icon: Zap,        label: 'Ephemeral Analysis' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function TimerRing({ progress, focusState, size = 260 }) {
  const cfg  = STATE_CFG[focusState] ?? STATE_CFG.focused
  const r    = (size - 20) / 2
  const circ = 2 * Math.PI * r

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3"
      />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circ}
        animate={{
          strokeDashoffset: circ * (1 - progress),
          stroke: cfg.color,
          filter: `drop-shadow(0 0 8px ${cfg.color}88)`,
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </svg>
  )
}

function CameraFeed({ stream }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el || !stream) return
    el.srcObject = stream
    el.play().catch(() => {})
    return () => { el.srcObject = null }
  }, [stream])

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-black/40 border border-white/10" style={{ aspectRatio: '4/3' }}>
      <video
        ref={videoRef}
        muted playsInline autoPlay
        className="w-full h-full object-cover"
        style={{ transform: 'scaleX(-1)', filter: 'brightness(0.8) contrast(1.1)' }}
      />
      {/* Corner marks */}
      {['top-2 left-2 border-t border-l', 'top-2 right-2 border-t border-r',
        'bottom-2 left-2 border-b border-l', 'bottom-2 right-2 border-b border-r'].map((c, i) => (
        <div key={i} className={`absolute w-4 h-4 ${c} border-[rgb(var(--quantum-400))] opacity-50`} />
      ))}
      {/* Live dot */}
      <div className="absolute top-2 right-7 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[9px] font-mono text-white/35 tracking-widest">LIVE</span>
      </div>
      {/* Scan line */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)' }}
      />
    </div>
  )
}

function ZeroTrustModal({ onAccept, onReject }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onReject}
      />

      <motion.div
        className="relative w-full max-w-md glass-panel border border-white/10 rounded-2xl overflow-hidden"
        initial={{ scale: 0.88, opacity: 0, y: 24 }}
        animate={{ scale: 1,    opacity: 1, y: 0  }}
        exit={  { scale: 0.92, opacity: 0, y: 12  }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
      >
        {/* Top accent line */}
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgb(var(--quantum-500)), transparent)' }} />

        <div className="p-7">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-11 h-11 rounded-xl bg-[rgb(var(--quantum-500)/0.15)] border border-[rgb(var(--quantum-500)/0.2)] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-[rgb(var(--quantum-300))]" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white mb-0.5">Focus Tracking AI</h3>
              <p className="text-[10px] font-mono text-white/30 tracking-widest">PROTOCOLO ZERO TRUST · v2.1</p>
            </div>
            <button
              onClick={onReject}
              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-white/40" />
            </button>
          </div>

          {/* Text block */}
          <div className="mb-5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] space-y-2.5">
            <p className="text-white/70 text-sm leading-relaxed">
              Quark aplica una filosofía{' '}
              <span className="text-[rgb(var(--quantum-300))] font-medium">Zero Trust</span> sobre todos los
              datos sensoriales. El análisis ocurre{' '}
              <span className="text-[rgb(var(--quantum-300))] font-medium">localmente en tu dispositivo</span>.
            </p>
            <p className="text-white/45 text-sm leading-relaxed">
              No almacenamos imágenes, grabaciones ni biometría persistente. La cámara únicamente detecta
              presencia y patrones básicos de atención <span className="text-white/65">en tiempo real</span>.
            </p>
            <p className="text-white/30 text-xs">
              Puedes desactivar Focus Tracking AI en cualquier momento.
            </p>
          </div>

          {/* Badges */}
          <div className="grid grid-cols-2 gap-2 mb-7">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[rgb(var(--quantum-500)/0.07)] border border-[rgb(var(--quantum-500)/0.15)]"
              >
                <Icon className="w-3.5 h-3.5 text-[rgb(var(--quantum-400))]" />
                <span className="text-[10px] font-mono text-[rgb(var(--quantum-200)/0.8)] tracking-wide">{label}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onReject}
              className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm hover:bg-white/10 hover:text-white/70 transition-all"
            >
              Cancelar
            </button>
            <motion.button
              onClick={onAccept}
              className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, rgb(var(--quantum-500)), rgb(var(--quantum-600)))' }}
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgb(var(--quantum-500)/0.5)' }}
              whileTap={{ scale: 0.97 }}
            >
              Activar Focus Tracking
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Focus() {
  const [mode,      setMode]      = useState('work')
  const [running,   setRunning]   = useState(false)
  const [timeLeft,  setTimeLeft]  = useState(MODES.work.duration)
  const [sessions,  setSessions]  = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [alertMsg,  setAlertMsg]  = useState('')

  const vision             = useFocusVision()
  const prevFocusRef       = useRef('focused')
  const alertTimerRef      = useRef(null)

  // ── Timer countdown ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(id)
          setRunning(false)
          setSessions(s => s + 1)
          playChime('focus')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running])

  const switchMode = useCallback((m) => {
    setMode(m)
    setTimeLeft(MODES[m].duration)
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    setTimeLeft(MODES[mode].duration)
    setRunning(false)
  }, [mode])

  // ── Focus state transitions → sound + message ──────────────────────────────
  useEffect(() => {
    const prev = prevFocusRef.current
    const curr = vision.focusState
    if (prev === curr) return
    prevFocusRef.current = curr

    clearTimeout(alertTimerRef.current)

    const cfg = STATE_CFG[curr]
    const msg = cfg.messages[Math.floor(Math.random() * cfg.messages.length)]
    setAlertMsg(msg)

    if (curr === 'distracted') {
      playChime('absent')
    } else if (curr === 'unstable') {
      playChime('distracted')
    } else {
      playChime('focus')
      alertTimerRef.current = setTimeout(() => setAlertMsg(''), 3500)
    }
  }, [vision.focusState])

  // ── Derived ────────────────────────────────────────────────────────────────
  const active   = vision.state === 'active'
  const cfg      = STATE_CFG[vision.focusState] ?? STATE_CFG.focused
  const progress = timeLeft / MODES[mode].duration
  const mins     = Math.floor(timeLeft / 60).toString().padStart(2, '0')
  const secs     = (timeLeft % 60).toString().padStart(2, '0')

  const ambientGlow  = active ? `${cfg.color}30` : 'rgba(123,61,255,0.18)'
  const btnGlow      = active ? `${cfg.color}55` : 'rgba(123,61,255,0.4)'

  return (
    <motion.div
      className="h-full flex flex-col gap-5 relative"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      {/* Ambient radial glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-3xl"
        animate={{ background: `radial-gradient(ellipse 75% 55% at 50% 35%, ${ambientGlow} 0%, transparent 70%)` }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      />

      {/* Distracted border pulse */}
      <AnimatePresence>
        {active && vision.focusState === 'distracted' && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-red-500/35"
            style={{ boxShadow: 'inset 0 0 80px rgba(239,68,68,0.08), 0 0 50px rgba(239,68,68,0.12)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.85, 0.4] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-0.5">
            Enfoque <span className="text-gradient">Profundo</span>
          </h2>
          <p className="text-white/40 text-sm">Deep work · Flow state engine</p>
        </div>

        <div className="flex items-center gap-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              animate={{
                backgroundColor: i < (sessions % 4)
                  ? 'rgb(var(--quantum-400))'
                  : 'rgba(255,255,255,0.12)',
                boxShadow: i < (sessions % 4)
                  ? '0 0 8px rgb(var(--quantum-500))'
                  : 'none',
              }}
              transition={{ duration: 0.4 }}
            />
          ))}
          <span className="text-white/25 text-xs font-mono ml-1">
            {sessions} sesiones
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 relative z-10 min-h-0">

        {/* ─ Timer panel ─ */}
        <div className="glass-panel p-8 flex flex-col items-center justify-center gap-7">

          {/* Mode tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            {Object.entries(MODES).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => switchMode(key)}
                className={cn(
                  'px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                  mode === key
                    ? 'bg-[rgb(var(--quantum-500)/0.22)] text-[rgb(var(--quantum-200))] border border-[rgb(var(--quantum-500)/0.3)]'
                    : 'text-white/35 hover:text-white/55'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Ring + time */}
          <div className="relative flex-shrink-0">
            {/* Breathing glow behind ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ margin: '-24px' }}
              animate={{
                boxShadow: active && vision.focusState === 'focused'
                  ? [`0 0 40px ${cfg.color}22`, `0 0 70px ${cfg.color}44`, `0 0 40px ${cfg.color}22`]
                  : `0 0 40px ${cfg.color}22`,
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            <TimerRing
              progress={progress}
              focusState={active ? vision.focusState : 'focused'}
            />

            {/* Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <motion.span
                className="text-5xl font-mono font-light tracking-tight"
                animate={{ color: active ? cfg.color : '#ffffff' }}
                transition={{ duration: 0.9 }}
              >
                {mins}:{secs}
              </motion.span>
              <span className="text-white/25 text-[10px] font-mono tracking-[0.18em] uppercase">
                {MODES[mode].label}
              </span>
              <AnimatePresence>
                {active && (
                  <motion.div
                    className={cn('mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-mono tracking-widest border', cfg.bg, cfg.text, cfg.border)}
                    initial={{ opacity: 0, scale: 0.75 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.75 }}
                  >
                    {cfg.label.toUpperCase()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <motion.button
              onClick={reset}
              className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }}
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>

            <motion.button
              onClick={() => setRunning(r => !r)}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white"
              style={{
                background: `linear-gradient(135deg, ${active ? cfg.color : 'rgb(var(--quantum-500))'}, rgb(var(--quantum-700)))`,
                boxShadow: `0 0 ${running ? 40 : 20}px ${btnGlow}`,
              }}
              whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.93 }}
              animate={{ boxShadow: `0 0 ${running ? 40 : 20}px ${btnGlow}` }}
              transition={{ duration: 0.4 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={running ? 'pause' : 'play'}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.12 }}
                >
                  {running
                    ? <Pause className="w-6 h-6" />
                    : <Play  className="w-6 h-6 ml-0.5" />
                  }
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Spacer */}
            <div className="w-11 h-11" />
          </div>

          {/* Alert message */}
          <AnimatePresence>
            {alertMsg && active && (
              <motion.div
                className={cn(
                  'px-5 py-2 rounded-xl text-sm font-mono border',
                  vision.focusState === 'focused'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                    : vision.focusState === 'distracted'
                      ? 'bg-red-500/10 border-red-500/20 text-red-300'
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                )}
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                {alertMsg}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─ Vision AI panel ─ */}
        <div className="flex flex-col gap-4 min-h-0">

          <div className="glass-panel p-5 flex flex-col flex-1 min-h-0">
            {/* Panel header */}
            <div className="flex items-center gap-3 mb-4 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-[rgb(var(--quantum-500)/0.15)] border border-[rgb(var(--quantum-500)/0.2)] flex items-center justify-center">
                <Eye className="w-4 h-4 text-[rgb(var(--quantum-300))]" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white leading-none mb-0.5">Focus Tracking AI</div>
                <div className="text-[9px] font-mono text-white/25 tracking-widest">ZERO TRUST · LOCAL AI</div>
              </div>
              {active && (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-mono text-emerald-400/60 tracking-wide">ACTIVE</span>
                </div>
              )}
            </div>

            {/* Content states */}
            <AnimatePresence mode="wait">

              {/* Idle */}
              {vision.state === 'idle' && (
                <motion.div
                  key="idle"
                  className="flex-1 flex flex-col items-center justify-center gap-5"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <div className="relative">
                    <div className="w-18 h-18 w-[72px] h-[72px] rounded-full bg-[rgb(var(--quantum-500)/0.07)] border border-[rgb(var(--quantum-500)/0.15)] flex items-center justify-center">
                      <Camera className="w-7 h-7 text-[rgb(var(--quantum-400)/0.5)]" />
                    </div>
                    {[1, 1.5, 2].map((scale, i) => (
                      <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border border-[rgb(var(--quantum-500)/0.15)]"
                        animate={{ scale: [1, scale, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }}
                      />
                    ))}
                  </div>
                  <div className="text-center">
                    <p className="text-white/45 text-sm mb-1">Monitoreo cognitivo</p>
                    <p className="text-white/20 text-xs leading-relaxed text-center max-w-[180px]">
                      IA local detecta tu estado de atención en tiempo real
                    </p>
                  </div>
                  <motion.button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[rgb(var(--quantum-500)/0.15)] border border-[rgb(var(--quantum-500)/0.3)] text-[rgb(var(--quantum-200))] text-sm font-medium"
                    whileHover={{ scale: 1.03, backgroundColor: 'rgb(var(--quantum-500)/0.25)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Camera className="w-4 h-4" />
                    Activar Focus Tracking AI
                  </motion.button>
                </motion.div>
              )}

              {/* Requesting */}
              {vision.state === 'requesting' && (
                <motion.div
                  key="requesting"
                  className="flex-1 flex flex-col items-center justify-center gap-4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="w-10 h-10 rounded-full border-2 border-[rgb(var(--quantum-500)/0.3)] border-t-[rgb(var(--quantum-400))]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                  />
                  <p className="text-white/35 text-xs font-mono tracking-widest">SOLICITANDO ACCESO</p>
                </motion.div>
              )}

              {/* Error */}
              {vision.state === 'error' && (
                <motion.div
                  key="error"
                  className="flex-1 flex flex-col items-center justify-center gap-4 text-center"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <p className="text-red-300 text-sm">Acceso denegado</p>
                  <p className="text-white/25 text-xs max-w-[180px]">{vision.error}</p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/40 text-xs hover:bg-white/10 hover:text-white/60 transition-all"
                  >
                    Reintentar
                  </button>
                </motion.div>
              )}

              {/* Active */}
              {vision.state === 'active' && (
                <motion.div
                  key="active"
                  className="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  {/* Camera feed */}
                  <CameraFeed stream={vision.stream} />

                  {/* State badge */}
                  <motion.div
                    className={cn('flex items-center gap-2.5 px-3 py-2.5 rounded-xl border', cfg.bg, cfg.border)}
                    animate={{ borderColor: cfg.color + '44' }}
                    transition={{ duration: 0.8 }}
                  >
                    {(() => { const Icon = cfg.icon; return <Icon className={cn('w-4 h-4 flex-shrink-0', cfg.text)} /> })()}
                    <div className="flex-1 min-w-0">
                      <div className={cn('text-xs font-semibold leading-none mb-0.5', cfg.text)}>
                        {cfg.label}
                      </div>
                      <div className="text-[9px] text-white/25 font-mono tracking-wide">
                        Attention Stability: {cfg.stability}
                      </div>
                    </div>
                    <motion.div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cfg.color }}
                      animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.3, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>

                  {/* Focus score */}
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[9px] text-white/30 font-mono tracking-widest">FOCUS SCORE</span>
                      <motion.span
                        className="text-xl font-mono font-light"
                        animate={{ color: cfg.color }}
                        transition={{ duration: 0.8 }}
                      >
                        {vision.focusScore}%
                      </motion.span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: cfg.color }}
                        animate={{ width: `${vision.focusScore}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-[9px] text-white/15 font-mono">0</span>
                      <span className="text-[9px] text-white/15 font-mono">100</span>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: 'Modo',      value: 'Local AI',     icon: Cpu        },
                      { label: 'Latencia',  value: '< 3s',         icon: Activity   },
                      { label: 'Privacidad',value: 'Zero Trust',   icon: ShieldCheck },
                      { label: 'Datos',     value: 'Ephemeral',    icon: Lock       },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.025] border border-white/[0.045]">
                        <Icon className="w-3 h-3 text-white/20 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[8px] text-white/20 font-mono">{label}</div>
                          <div className="text-[10px] text-white/55 font-medium truncate">{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Deactivate */}
                  <button
                    onClick={vision.deactivate}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/[0.025] border border-white/[0.05] text-white/25 text-xs hover:bg-white/[0.05] hover:text-white/45 transition-all"
                  >
                    <CameraOff className="w-3 h-3" />
                    Desactivar cámara
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Trust badges strip (only when inactive) */}
          <AnimatePresence>
            {!active && (
              <motion.div
                className="glass-panel p-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
              >
                <p className="text-[9px] font-mono text-white/15 tracking-widest text-center mb-2.5">
                  GARANTÍAS DE PRIVACIDAD
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {TRUST_BADGES.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.025] border border-white/[0.04]">
                      <Icon className="w-3 h-3 text-[rgb(var(--quantum-500)/0.45)]" />
                      <span className="text-[9px] text-white/25 font-mono">{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Zero Trust Modal */}
      <AnimatePresence>
        {showModal && (
          <ZeroTrustModal
            onAccept={async () => { setShowModal(false); await vision.activate() }}
            onReject={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
