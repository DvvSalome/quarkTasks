import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Zap, 
  Target, 
  Clock, 
  Calendar,
  Moon,
  Sun,
  Coffee,
  Briefcase,
  Heart,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  BarChart3,
  GitBranch,
  Repeat,
  MessageSquare
} from 'lucide-react'
import { cn } from '../lib/utils'

const steps = [
  {
    id: 'welcome',
    title: 'Bienvenido a Quark',
    subtitle: 'Tu sistema operativo cognitivo',
    description: 'La plataforma que learns de ti, se adapta a ti y te ayuda a alcanzar tu máximo potencial.',
    icon: Brain,
    color: 'from-quantum-500 to-neon-cyan'
  },
  {
    id: 'profile',
    title: '¿Cómo te llamas?',
    subtitle: 'Conozcámonos',
    description: 'Para personalizar tu experiencia, necesito saber un poco sobre ti.',
    type: 'input',
    placeholder: 'Tu nombre o apodo'
  },
  {
    id: 'work-style',
    title: '¿Cómo trabajas mejor?',
    subtitle: 'Optimiza tu ritmo',
    description: 'Cada persona tiene su propio ritmo. Configura tu entorno ideal.',
    type: 'options',
    options: [
      { id: 'morning', label: 'Matutino', desc: 'Mi mejor energía está en las mañanas', icon: Sun },
      { id: 'night', label: 'Nocturno', desc: 'Rindo más por la noche', icon: Moon },
      { id: 'afternoon', label: 'Vespertino', desc: 'Mi pico es por la tarde', icon: Coffee },
      { id: 'flexible', label: 'Flexible', desc: 'varía según el día', icon: Zap }
    ]
  },
  {
    id: 'focus-time',
    title: '¿Cuánto tiempo?',
    subtitle: 'Tu duración ideal',
    description: '¿Cuánto tiempo puedes mantener enfoque profundo en una sesión?',
    type: 'options',
    options: [
      { id: '25', label: '25 min', desc: 'Pomodoro clásico', icon: Clock },
      { id: '45', label: '45 min', desc: 'Sesión media', icon: Target },
      { id: '90', label: '90 min', desc: 'Bloque profundo', icon: Brain },
      { id: '120', label: '120 min', desc: 'Deep work máximo', icon: Zap }
    ]
  },
  {
    id: 'goals',
    title: '¿Cuál es tu objetivo?',
    subtitle: 'Define tu dirección',
    description: '¿Qué quieres lograr con Quark? Esto ayudará a la IA a guiarte.',
    type: 'multi-select',
    options: [
      { id: 'productivity', label: 'Ser más productivo', icon: BarChart3 },
      { id: 'focus', label: 'Mejorar enfoque', icon: Target },
      { id: 'routine', label: 'Crear rutinas', icon: Repeat },
      { id: 'balance', label: 'Balance vida-trabajo', icon: Heart },
      { id: 'goals', label: 'Cumplir metas', icon: GitBranch },
      { id: 'habits', label: 'Crear hábitos', icon: Sparkles }
    ]
  },
  {
    id: 'ready',
    title: '¡Listo para despegar!',
    subtitle: 'Tu asistente te espera',
    description: 'He configurado todo según tus preferencias. ¿Comenzamos?',
    icon: Sparkles,
    color: 'from-neon-pink to-amber-400',
    isFinal: true
  }
]

export default function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    workStyle: '',
    focusTime: '',
    goals: []
  })
  const [direction, setDirection] = useState(1)

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1)
      setCurrentStep(prev => prev + 1)
    } else {
      onComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep(prev => prev - 1)
    }
  }

  const selectOption = (key, value) => {
    setFormData({ ...formData, [key]: value })
  }

  const toggleGoal = (goalId) => {
    const goals = formData.goals.includes(goalId)
      ? formData.goals.filter(g => g !== goalId)
      : [...formData.goals, goalId]
    setFormData({ ...formData, goals })
  }

  const canProceed = () => {
    if (currentStep === 1 && !formData.name.trim()) return false
    if (currentStep === 2 && !formData.workStyle) return false
    if (currentStep === 3 && !formData.focusTime) return false
    if (currentStep === 4 && formData.goals.length === 0) return false
    return true
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-quantum-950">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-quantum-900 via-quantum-950 to-black"
          animate={{ 
            background: [
              'radial-gradient(ellipse 60% 40% at 30% 20%, rgba(123,46,255,0.15) 0%, transparent 50%)',
              'radial-gradient(ellipse 60% 40% at 70% 80%, rgba(0,245,255,0.1) 0%, transparent 50%)',
              'radial-gradient(ellipse 60% 40% at 30% 80%, rgba(255,46,151,0.1) 0%, transparent 50%)',
              'radial-gradient(ellipse 60% 40% at 30% 20%, rgba(123,46,255,0.15) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-quantum-400 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: window.innerHeight + 10 
            }}
            animate={{ 
              y: -10,
              x: Math.random() * window.innerWidth + (Math.random() - 0.5) * 200
            }}
            transition={{ 
              duration: 10 + Math.random() * 10, 
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            style={{ opacity: 0.3 }}
          />
        ))}
        
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,black_30%,transparent_100%)]" />
      </div>

      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div 
          className="h-full bg-gradient-to-r from-quantum-500 via-neon-cyan to-quantum-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>

      {/* Step Indicator */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50">
        {steps.map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              i === currentStep ? 'bg-neon-cyan' : 
              i < currentStep ? 'bg-quantum-500' : 'bg-white/20'
            )}
            animate={i === currentStep ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: direction * 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -direction * 100, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-2xl"
          >
            {/* Icon */}
            {step.icon && !step.type && (
              <motion.div 
                className={cn(
                  'w-24 h-24 rounded-3xl mx-auto mb-8 flex items-center justify-center',
                  step.color ? `bg-gradient-to-br ${step.color}` : 'bg-quantum-500/20'
                )}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                {step.icon === Brain ? (
                  <Brain className="w-12 h-12 text-white" />
                ) : step.icon === Sparkles ? (
                  <Sparkles className="w-12 h-12 text-white" />
                ) : null}
              </motion.div>
            )}

            {/* Title */}
            <motion.h1 
              className="text-4xl md:text-5xl font-light text-white text-center mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {step.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-xl text-quantum-300 text-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {step.subtitle}
            </motion.p>

            {/* Description */}
            <motion.p 
              className="text-white/50 text-center mb-10 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {step.description}
            </motion.p>

            {/* Input Type */}
            {step.type === 'input' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-sm mx-auto"
              >
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={step.placeholder}
                  className="w-full px-6 py-4 text-xl text-center rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-quantum-500 focus:ring-2 focus:ring-quantum-500/20 focus:outline-none transition-all"
                  autoFocus
                />
              </motion.div>
            )}

            {/* Options Type */}
            {step.type === 'options' && (
              <motion.div 
                className="grid grid-cols-2 gap-4 max-w-xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {step.options.map((option, i) => {
                  const Icon = option.icon
                  const isSelected = step.id === 'work-style' 
                    ? formData.workStyle === option.id
                    : formData.focusTime === option.id
                  
                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => selectOption(
                        step.id === 'work-style' ? 'workStyle' : 'focusTime',
                        option.id
                      )}
                      className={cn(
                        'p-6 rounded-2xl border text-left transition-all group',
                        isSelected 
                          ? 'bg-quantum-500/20 border-quantum-500/50' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <div className={cn(
                        'w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-colors',
                        isSelected 
                          ? 'bg-quantum-500' 
                          : 'bg-white/10 group-hover:bg-white/20'
                      )}>
                        <Icon className={cn(
                          'w-6 h-6',
                          isSelected ? 'text-white' : 'text-white/60'
                        )} />
                      </div>
                      <div className={cn(
                        'font-medium mb-1',
                        isSelected ? 'text-white' : 'text-white/80'
                      )}>
                        {option.label}
                      </div>
                      <div className="text-sm text-white/40">{option.desc}</div>
                    </motion.button>
                  )
                })}
              </motion.div>
            )}

            {/* Multi-select Type */}
            {step.type === 'multi-select' && (
              <motion.div 
                className="grid grid-cols-3 gap-4 max-w-xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {step.options.map((option, i) => {
                  const Icon = option.icon
                  const isSelected = formData.goals.includes(option.id)
                  
                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => toggleGoal(option.id)}
                      className={cn(
                        'p-4 rounded-2xl border text-center transition-all relative overflow-hidden',
                        isSelected 
                          ? 'bg-quantum-500/20 border-quantum-500/50' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      {isSelected && (
                        <motion.div 
                          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-quantum-500 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                      <Icon className={cn(
                        'w-8 h-8 mx-auto mb-2',
                        isSelected ? 'text-neon-cyan' : 'text-white/40'
                      )} />
                      <div className={cn(
                        'text-sm',
                        isSelected ? 'text-white' : 'text-white/60'
                      )}>
                        {option.label}
                      </div>
                    </motion.button>
                  )
                })}
              </motion.div>
            )}

            {/* Final Step */}
            {step.isFinal && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <motion.div 
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-green-500/20 border border-green-500/30 mb-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                >
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 font-mono text-sm">SISTEMA CONFIGURADO</span>
                </motion.div>

                <div className="flex items-center justify-center gap-8 text-left">
                  {[
                    { label: 'Nombre', value: formData.name || 'Usuario' },
                    { label: 'Ritmo', value: formData.workStyle === 'morning' ? 'Matutino' : formData.workStyle === 'night' ? 'Nocturno' : formData.workStyle === 'afternoon' ? 'Vespertino' : 'Flexible' },
                    { label: 'Enfoque', value: `${formData.focusTime} min` },
                    { label: 'Objetivos', value: `${formData.goals.length} seleccionados` }
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <div className="text-xs text-white/40 mb-1">{item.label}</div>
                      <div className="text-white font-medium">{item.value}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
        {currentStep > 0 && (
          <motion.button
            onClick={handlePrev}
            className="p-4 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
        )}
        
        <motion.button
          onClick={handleNext}
          disabled={!canProceed()}
          className={cn(
            'px-8 py-4 rounded-full font-medium flex items-center gap-2 transition-all',
            canProceed() 
              ? 'bg-gradient-to-r from-quantum-500 to-quantum-400 text-white' 
              : 'bg-white/10 text-white/30 cursor-not-allowed'
          )}
          whileHover={canProceed() ? { scale: 1.05 } : {}}
          whileTap={canProceed() ? { scale: 0.95 } : {}}
        >
          <span>{currentStep === steps.length - 1 ? 'Comenzar' : 'Continuar'}</span>
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  )
}