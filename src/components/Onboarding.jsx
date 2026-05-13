import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import {
  Brain, Zap, Target, Clock, Moon, Sun, Coffee, Sparkles,
  ChevronRight, ChevronLeft, Check, BarChart3, GitBranch, Repeat,
  Heart,
} from 'lucide-react'
import { cn } from '../lib/utils'

const easeOut = [0.16, 1, 0.3, 1]
const easeInOut = [0.76, 0, 0.24, 1]

function Orb({ size, color, blur, initialX, initialY, ampX, ampY, periodX, periodY, phaseX, phaseY }) {
  const t = useMotionValue(0)
  useEffect(() => {
    let start = Date.now()
    let raf
    const tick = () => { t.set((Date.now() - start) / 1000); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [t])
  const x = useTransform(t, (v) => `${initialX + ampX * Math.sin(v * 2 * Math.PI / periodX + phaseX)}%`)
  const y = useTransform(t, (v) => `${initialY + ampY * Math.sin(v * 2 * Math.PI / periodY + phaseY)}%`)
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
        x, y, translateX: '-50%', translateY: '-50%',
      }}
    />
  )
}

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: easeOut } },
}

const steps = [
  {
    id: 'welcome', title: 'Bienvenido a Quark', subtitle: 'Tu sistema operativo cognitivo',
    description: 'Una plataforma que aprende de ti, se adapta a ti y te ayuda a alcanzar tu máximo potencial.',
    icon: Brain, color: 'from-[rgb(var(--quantum-500))] to-[rgb(var(--neon-cyan))]',
  },
  {
    id: 'profile', title: '¿Cómo te llamas?', subtitle: 'Conozcámonos',
    description: 'Para personalizar tu experiencia, necesito saber un poco sobre ti.', type: 'input',
    placeholder: 'Tu nombre o apodo',
  },
  {
    id: 'work-style', title: '¿Cómo trabajas mejor?', subtitle: 'Optimiza tu ritmo',
    description: 'Cada persona tiene su propio ritmo. Configura tu entorno ideal.', type: 'options',
    options: [
      { id: 'morning', label: 'Matutino', desc: 'Mi mejor energía está en las mañanas', icon: Sun },
      { id: 'night', label: 'Nocturno', desc: 'Rindo más por la noche', icon: Moon },
      { id: 'afternoon', label: 'Vespertino', desc: 'Mi pico es por la tarde', icon: Coffee },
      { id: 'flexible', label: 'Flexible', desc: 'Varía según el día', icon: Zap },
    ],
  },
  {
    id: 'focus-time', title: '¿Cuánto tiempo?', subtitle: 'Tu duración ideal',
    description: '¿Cuánto tiempo puedes mantener enfoque profundo en una sesión?', type: 'options',
    options: [
      { id: '25', label: '25 min', desc: 'Pomodoro clásico', icon: Clock },
      { id: '45', label: '45 min', desc: 'Sesión media', icon: Target },
      { id: '90', label: '90 min', desc: 'Bloque profundo', icon: Brain },
      { id: '120', label: '120 min', desc: 'Deep work máximo', icon: Zap },
    ],
  },
  {
    id: 'goals', title: '¿Cuál es tu objetivo?', subtitle: 'Define tu dirección',
    description: '¿Qué quieres lograr con Quark? Esto ayudará a la IA a guiarte.', type: 'multi-select',
    options: [
      { id: 'productivity', label: 'Ser más productivo', icon: BarChart3 },
      { id: 'focus', label: 'Mejorar enfoque', icon: Target },
      { id: 'routine', label: 'Crear rutinas', icon: Repeat },
      { id: 'balance', label: 'Balance vida-trabajo', icon: Heart },
      { id: 'goals', label: 'Cumplir metas', icon: GitBranch },
      { id: 'habits', label: 'Crear hábitos', icon: Sparkles },
    ],
  },
  {
    id: 'ready', title: '¡Listo para despegar!', subtitle: 'Tu asistente te espera',
    description: 'He configurado todo según tus preferencias. ¿Comenzamos?',
    icon: Sparkles, color: 'from-[rgb(var(--neon-pink))] to-amber-400', isFinal: true,
  },
]

const slideVariants = {
  enter: (dir) => ({ opacity: 0, y: dir > 0 ? 30 : -30, scale: 0.97, filter: 'blur(4px)' }),
  center: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  exit: (dir) => ({ opacity: 0, y: dir > 0 ? -30 : 30, scale: 0.97, filter: 'blur(4px)' }),
}

const slideTransition = { duration: 0.45, ease: easeOut }

function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,black_30%,transparent_100%)]" />
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div key={i} className="absolute w-px h-px bg-white/20 rounded-full"
          style={{ left: `${(i * 7 + 3) % 100}%`, top: `${(i * 13 + 7) % 100}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0], y: [-20, 20] }}
          transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }} />
      ))}
    </div>
  )
}

export default function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({ name: '', workStyle: '', focusTime: '', goals: [] })
  const [direction, setDirection] = useState(1)

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100
  const isLast = currentStep === steps.length - 1
  const canProceed = () => {
    if (currentStep === 1 && !formData.name.trim()) return false
    if (currentStep === 2 && !formData.workStyle) return false
    if (currentStep === 3 && !formData.focusTime) return false
    if (currentStep === 4 && formData.goals.length === 0) return false
    return true
  }

  const goNext = () => {
    if (!canProceed()) return
    if (isLast) { onComplete(); return }
    setDirection(1)
    setCurrentStep(prev => prev + 1)
  }

  const goPrev = () => {
    if (currentStep === 0) return
    setDirection(-1)
    setCurrentStep(prev => prev - 1)
  }

  const selectOption = (key, value) => setFormData(p => ({ ...p, [key]: value }))
  const toggleGoal = (id) => setFormData(p => ({
    ...p, goals: p.goals.includes(id) ? p.goals.filter(g => g !== id) : [...p.goals, id],
  }))

  return (
    <div className="min-h-screen relative overflow-hidden bg-[rgb(var(--quantum-950))]">
      <ParticleBackground />

      <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--quantum-900))] via-[rgb(var(--quantum-950))] to-black">
        <Orb size={520} color="rgba(123,46,255,0.11)" blur={90}
          initialX={20} initialY={25} ampX={22} ampY={18} periodX={25} periodY={33} phaseX={0} phaseY={1.5} />
        <Orb size={400} color="rgba(0,245,255,0.06)" blur={85}
          initialX={65} initialY={55} ampX={20} ampY={24} periodX={31} periodY={39} phaseX={2.3} phaseY={0.8} />
      </div>

      <motion.div className="fixed top-0 left-0 right-0 h-0.5 bg-white/5 z-50"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <motion.div className="h-full bg-gradient-to-r from-[rgb(var(--quantum-500))] via-[rgb(var(--neon-cyan))] to-[rgb(var(--quantum-400))]"
          initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: easeOut }} />
      </motion.div>

      <div className="fixed top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50">
        {steps.map((_, i) => (
          <motion.div key={i} className={cn('h-1.5 rounded-full transition-all duration-300',
            i === currentStep ? 'w-6 bg-[rgb(var(--neon-cyan))]' : i < currentStep ? 'w-2 bg-[rgb(var(--quantum-500))]' : 'w-2 bg-white/15'
          )} layout layoutId={`step-dot-${i}`} />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-lg mx-auto">
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div key={currentStep}
              custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={slideTransition} className="w-full"
            >
              {/* Icon */}
              {step.icon && !step.type && (
                <motion.div variants={item} initial="hidden" animate="visible" className="flex justify-center mb-8">
                  <motion.div
                    className={cn('w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br', step.color)}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 20 }}>
                    {step.icon === Brain ? <Brain className="w-10 h-10 text-white" /> :
                     <Sparkles className="w-10 h-10 text-white" />}
                  </motion.div>
                </motion.div>
              )}

              {/* Text */}
              <div className="text-center mb-10">
                <motion.h1 variants={item} initial="hidden" animate="visible"
                  className="text-4xl md:text-5xl font-light text-white mb-3 tracking-tight">
                  {step.title}
                </motion.h1>
                <motion.p variants={item} initial="hidden" animate="visible"
                  className="text-lg text-[rgb(var(--quantum-300))] font-medium mb-3">
                  {step.subtitle}
                </motion.p>
                <motion.p variants={item} initial="hidden" animate="visible"
                  className="text-white/40 max-w-md mx-auto leading-relaxed">
                  {step.description}
                </motion.p>
              </div>

              {/* Input */}
              {step.type === 'input' && (
                <motion.div variants={container} initial="hidden" animate="visible" className="max-w-xs mx-auto">
                  <motion.div variants={item}>
                    <input type="text" value={formData.name}
                      onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && goNext()}
                      placeholder={step.placeholder}
                      className="w-full px-6 py-4 text-xl text-center rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:border-[rgb(var(--quantum-500))] focus:ring-2 focus:ring-[rgb(var(--quantum-500)/.2)] focus:outline-none transition-all"
                      autoFocus />
                  </motion.div>
                </motion.div>
              )}

              {/* Options grid */}
              {step.type === 'options' && (
                <motion.div variants={container} initial="hidden" animate="visible"
                  className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  {step.options.map((option, i) => {
                    const Icon = option.icon
                    const isSelected = step.id === 'work-style' ? formData.workStyle === option.id : formData.focusTime === option.id
                    return (
                      <motion.button key={option.id} variants={item}
                        onClick={() => selectOption(step.id === 'work-style' ? 'workStyle' : 'focusTime', option.id)}
                        className={cn('p-5 rounded-xl border text-left transition-all group',
                          isSelected ? 'bg-[rgb(var(--quantum-500)/.15)] border-[rgb(var(--quantum-500)/.4)]' : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15]'
                        )} whileTap={{ scale: 0.97 }}>
                        <div className={cn('w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-all',
                          isSelected ? 'bg-[rgb(var(--quantum-500))]' : 'bg-white/10 group-hover:bg-white/15'
                        )}>
                          <Icon className={cn('w-5 h-5', isSelected ? 'text-white' : 'text-white/50')} />
                        </div>
                        <div className={cn('font-medium mb-0.5 text-sm', isSelected ? 'text-white' : 'text-white/70')}>{option.label}</div>
                        <div className="text-xs text-white/40">{option.desc}</div>
                      </motion.button>
                    )
                  })}
                </motion.div>
              )}

              {/* Multi-select */}
              {step.type === 'multi-select' && (
                <motion.div variants={container} initial="hidden" animate="visible"
                  className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                  {step.options.map((option, i) => {
                    const Icon = option.icon
                    const isSelected = formData.goals.includes(option.id)
                    return (
                      <motion.button key={option.id} variants={item}
                        onClick={() => toggleGoal(option.id)}
                        className={cn('p-4 rounded-xl border text-center transition-all relative overflow-hidden',
                          isSelected ? 'bg-[rgb(var(--quantum-500)/.15)] border-[rgb(var(--quantum-500)/.4)]' : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15]'
                        )} whileTap={{ scale: 0.97 }}>
                        {isSelected && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[rgb(var(--quantum-500))] flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                        <Icon className={cn('w-7 h-7 mx-auto mb-2', isSelected ? 'text-[rgb(var(--neon-cyan))]' : 'text-white/30')} />
                        <div className={cn('text-sm', isSelected ? 'text-white' : 'text-white/60')}>{option.label}</div>
                      </motion.button>
                    )
                  })}
                </motion.div>
              )}

              {/* Final step */}
              {step.isFinal && (
                <motion.div variants={container} initial="hidden" animate="visible" className="text-center">
                  <motion.div variants={scaleIn}
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-green-500/15 border border-green-500/30 mb-8">
                    <motion.div className="w-2.5 h-2.5 rounded-full bg-green-400"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }} />
                    <span className="text-green-400 font-mono text-sm tracking-wider">SISTEMA CONFIGURADO</span>
                  </motion.div>
                  <motion.div variants={item}
                    className="flex items-center justify-center gap-6 flex-wrap">
                    {[
                      { label: 'Nombre', value: formData.name || 'Usuario' },
                      { label: 'Ritmo', value: formData.workStyle === 'morning' ? 'Matutino' : formData.workStyle === 'night' ? 'Nocturno' : formData.workStyle === 'afternoon' ? 'Vespertino' : 'Flexible' },
                      { label: 'Enfoque', value: `${formData.focusTime} min` },
                      { label: 'Objetivos', value: `${formData.goals.length} seleccionados` },
                    ].map((item, i) => (
                      <motion.div key={i} variants={item}
                        className="px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center min-w-[100px]">
                        <div className="text-xs text-white/40 mb-1 font-mono tracking-wider uppercase">{item.label}</div>
                        <div className="text-white font-medium">{item.value}</div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
        {currentStep > 0 && (
          <motion.button onClick={goPrev} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.1] transition-all flex items-center justify-center"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}>
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
        )}

        <motion.button onClick={goNext} disabled={!canProceed()}
          className={cn('px-8 py-3.5 rounded-full font-medium flex items-center gap-2 transition-all duration-200',
            canProceed()
              ? 'bg-gradient-to-r from-[rgb(var(--quantum-500))] to-[rgb(var(--quantum-400))] text-white shadow-lg shadow-[rgb(var(--quantum-500)/.3)]'
              : 'bg-white/[0.05] text-white/30 cursor-not-allowed'
          )} whileHover={canProceed() ? { scale: 1.03 } : {}} whileTap={canProceed() ? { scale: 0.97 } : {}}>
          <span>{isLast ? 'Comenzar' : currentStep === steps.length - 2 ? 'Ver resumen' : 'Continuar'}</span>
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}
