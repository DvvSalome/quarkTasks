import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Sparkles, 
  Zap, 
  Target, 
  Lightbulb, 
  MessageSquare,
  Activity,
  ChevronRight,
  Send,
  Bot,
  User,
  Clock
} from 'lucide-react'
import { cn } from '../lib/utils'

const quickActions = [
  { label: 'Optimizar mi día', icon: Zap, color: 'text-neon-cyan' },
  { label: 'Analizar productividad', icon: Activity, color: 'text-quantum-400' },
  { label: 'Sugerir tareas', icon: Target, color: 'text-neon-pink' },
  { label: 'Crear rutina', icon: Lightbulb, color: 'text-amber-400' },
]

const reasoningSteps = [
  { label: 'Análisis de patrones', status: 'complete' },
  { label: 'Evaluando energía', status: 'complete' },
  { label: 'Calculando optimizar', status: 'processing' },
  { label: 'Generando recomendación', status: 'pending' },
]

const insights = [
  {
    title: 'Optimización de schedule',
    desc: 'Tu mayor productividad es entre 9-11 AM. Mueve tareas complejas a este bloque.',
    type: 'optimization'
  },
  {
    title: 'Detección de fatiga',
    desc: 'Has completado 4 tareas consecutivamente. Considera un break de 5 min.',
    type: 'alert'
  },
  {
    title: 'Patrón detectado',
    desc: 'Tiendes a procrastinar tareas técnicas por la tarde. Schedulea para mañana.',
    type: 'insight'
  }
]

export default function AICopilot() {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: '¡Hola! Soy tu Copiloto Cognitivo. Puedo ayudarte a optimizar tu productividad, analizar patrones de trabajo y sugerir estrategias personalizadas. ¿Qué necesitas hoy?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % 4)
    }, 1500)
    return () => clearInterval(interval)
  }, [])
  
  const handleSend = () => {
    if (!input.trim()) return
    
    const newMessages = [
      ...messages,
      { role: 'user', content: input, timestamp: new Date() }
    ]
    setMessages(newMessages)
    setInput('')
    setIsTyping(true)
    
    setTimeout(() => {
      setIsTyping(false)
      setMessages([
        ...newMessages,
        { 
          role: 'assistant', 
          content: 'He analizado tu solicitud. Puedo reorganizar tus tareas actuales para maximizar tu energía. ¿Quieres que lo haga automáticamente?',
          timestamp: new Date()
        }
      ])
    }, 2000)
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex gap-6"
    >
      <div className="flex-1 flex flex-col gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <motion.div 
              className="relative"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-quantum-500 to-neon-cyan flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <motion.div 
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-quantum-900"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div>
              <h2 className="text-xl font-semibold text-white">Neural Core</h2>
              <p className="text-sm text-white/40">Copiloto cognitivo en tiempo real</p>
            </div>
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-mono text-green-400">ONLINE</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action, i) => {
              const Icon = action.icon
              return (
                <motion.button
                  key={i}
                  className="flex items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={cn('w-4 h-4', action.color)} />
                  <span className="text-sm text-white/70">{action.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
        
        <div className="flex-1 glass-card p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
            <MessageSquare className="w-4 h-4 text-quantum-400" />
            <span className="text-sm font-medium text-white">Chat IA</span>
          </div>
          
          <div className="flex-1 overflow-auto space-y-4 mb-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'flex gap-3',
                  msg.role === 'user' && 'flex-row-reverse'
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                  msg.role === 'assistant' 
                    ? 'bg-gradient-to-br from-quantum-500 to-neon-cyan' 
                    : 'bg-white/10'
                )}>
                  {msg.role === 'assistant' 
                    ? <Bot className="w-4 h-4 text-white" />
                    : <User className="w-4 h-4 text-white/70" />
                  }
                </div>
                <div className={cn(
                  'max-w-[70%] p-3 rounded-lg text-sm',
                  msg.role === 'assistant' 
                    ? 'bg-quantum-500/10 border border-quantum-500/20 text-white/90'
                    : 'bg-white/10 text-white'
                )}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-quantum-500 to-neon-cyan flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="typing-indicator bg-quantum-500/10 border border-quantum-500/20 rounded-lg p-3">
                  <span />
                  <span />
                  <span />
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pregunta a la IA..."
              className="flex-1 quantum-input"
            />
            <motion.button
              onClick={handleSend}
              className="p-3 rounded-lg bg-quantum-500 hover:bg-quantum-400 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-4 h-4 text-white" />
            </motion.button>
          </div>
        </div>
      </div>
      
      <div className="w-80 space-y-6">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-medium text-white">Reasoning</span>
          </div>
          <div className="space-y-3">
            {reasoningSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                  step.status === 'complete' && 'bg-green-500/20 text-green-400',
                  step.status === 'processing' && 'bg-quantum-500/20 text-quantum-400 animate-pulse',
                  step.status === 'pending' && 'bg-white/5 text-white/30'
                )}>
                  {step.status === 'complete' ? '✓' : step.status === 'processing' ? '●' : '○'}
                </div>
                <span className={cn(
                  'text-sm',
                  step.status === 'complete' && 'text-white/70',
                  step.status === 'processing' && 'text-white',
                  step.status === 'pending' && 'text-white/30'
                )}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-white">Recomendaciones</span>
            <span className="text-xs text-white/40 font-mono">EN TIEMPO REAL</span>
          </div>
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <motion.div
                key={i}
                className={cn(
                  'p-3 rounded-lg border cursor-pointer',
                  insight.type === 'alert' && 'bg-amber-500/5 border-amber-500/20',
                  insight.type === 'optimization' && 'bg-neon-cyan/5 border-neon-cyan/20',
                  insight.type === 'insight' && 'bg-quantum-500/5 border-quantum-500/20'
                )}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{insight.title}</span>
                  <ChevronRight className="w-4 h-4 text-white/30" />
                </div>
                <p className="text-xs text-white/50">{insight.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}