import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Sparkles, Zap, Target, Lightbulb, MessageSquare,
  Activity, ChevronRight, Send, Bot, User, Clock, Check,
} from 'lucide-react'
import { cn } from '../lib/utils'

const quickActions = [
  { id: 'optimize', label: 'Optimizar mi día', icon: Zap, color: 'text-[rgb(var(--neon-cyan))]', prompt: 'Optimiza mi agenda del día basándote en mis niveles de energía y tareas pendientes.' },
  { id: 'analyze', label: 'Analizar productividad', icon: Activity, color: 'text-[rgb(var(--quantum-400))]', prompt: 'Analiza mi productividad reciente y dame insights detallados.' },
  { id: 'suggest', label: 'Sugerir tareas', icon: Target, color: 'text-[rgb(var(--neon-pink))]', prompt: 'Sugiere nuevas tareas basadas en mis proyectos actuales.' },
  { id: 'routine', label: 'Crear rutina', icon: Lightbulb, color: 'text-amber-400', prompt: 'Ayúdame a crear una nueva rutina diaria optimizada.' },
]

const reasoningSteps = [
  { label: 'Análisis de patrones', status: 'complete' },
  { label: 'Evaluando energía', status: 'complete' },
  { label: 'Calculando optimización', status: 'processing' },
  { label: 'Generando recomendación', status: 'pending' },
]

const insights = [
  { title: 'Optimización de schedule', desc: 'Tu mayor productividad es entre 9-11 AM. Mueve tareas complejas a este bloque.', type: 'optimization' },
  { title: 'Detección de fatiga', desc: 'Has completado 4 tareas consecutivamente. Considera un break de 5 min.', type: 'alert' },
  { title: 'Patrón detectado', desc: 'Tiendes a procrastinar tareas técnicas por la tarde. Prográmalas para mañana.', type: 'insight' },
]

export default function AICopilot() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: '¡Hola! Soy tu Copiloto Cognitivo. Puedo ayudarte a optimizar tu productividad, analizar patrones de trabajo y sugerir estrategias personalizadas. ¿Qué necesitas hoy?',
    timestamp: new Date(),
  }])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showReasoning, setShowReasoning] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => setCurrentStep(prev => (prev + 1) % 4), 1500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const simulateResponse = (userMessage) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const responses = {
        optimize: 'He analizado tu agenda. Tu pico de energía es a las 10 AM — he movido las tareas complejas a ese bloque. También programé un break de 15 min a las 3 PM para evitar fatiga. ¿Quieres que guarde esta optimización?',
        analyze: '📊 **Análisis de productividad:**\n• Tasa de completación: 87%\n• Horas enfocadas: 6.5h/día\n• Pico de rendimiento: 9-11 AM\n• Área de mejora: tareas administrativas por la tarde\n\n Recomendación: agrupa tareas similares para reducir cambio de contexto.',
        suggest: 'Basado en tus proyectos activos, te sugiero:\n\n1. **Revisar PR de autenticación** — pendiente desde hace 2 días\n2. **Actualizar documentación API** — afecta al equipo frontend\n3. **Planificar sprint Q3** — la fecha límite se acerca\n\n¿Quieres que cree alguna de estas tareas?',
        routine: 'Te propongo una rutina optimizada:\n\n🌅 **Mañana (8-10 AM):** Deep work + tareas creativas\n☕ **Media mañana (10:30-11:30):** Reuniones\n🍝 **Mediodía (12-1:30 PM):** Break + comida\n💻 **Tarde (2-4 PM):** Tareas operativas\n🌇 **Cierre (4-5 PM):** Planificación del día siguiente\n\n¿Te gusta esta estructura?',
      }
      const matchedKey = Object.keys(responses).find(k => userMessage.toLowerCase().includes(k))
      const response = matchedKey ? responses[matchedKey] : responses.optimize

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }])
    }, 2000)
  }

  const handleSend = (text) => {
    const msg = text || input
    if (!msg.trim()) return

    const newMessages = [...messages, { role: 'user', content: msg, timestamp: new Date() }]
    setMessages(newMessages)
    setInput('')
    simulateResponse(msg)
  }

  const handleQuickAction = (action) => {
    const newMessages = [...messages, { role: 'user', content: action.prompt, timestamp: new Date() }]
    setMessages(newMessages)
    simulateResponse(action.id)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex gap-6">
      <div className="flex-1 flex flex-col gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <motion.div className="relative" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgb(var(--quantum-500))] to-[rgb(var(--neon-cyan))] flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <motion.div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-[rgb(var(--quantum-900))]"
                animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
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
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <motion.button key={action.id} onClick={() => handleQuickAction(action)}
                  className="flex items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                >
                  <Icon className={cn('w-4 h-4', action.color)} />
                  <span className="text-sm text-white/70">{action.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 glass-card p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[rgb(var(--quantum-400))]" />
              <span className="text-sm font-medium text-white">Chat IA</span>
            </div>
            <button onClick={() => setShowReasoning(!showReasoning)}
              className="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1">
              <Brain className="w-3 h-3" />
              {showReasoning ? 'Ocultar' : 'Mostrar'} reasoning
            </button>
          </div>

          <div className="flex-1 overflow-auto space-y-4 mb-4 pr-1">
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}
              >
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                  msg.role === 'assistant' ? 'bg-gradient-to-br from-[rgb(var(--quantum-500))] to-[rgb(var(--neon-cyan))]' : 'bg-white/10'
                )}>
                  {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white/70" />}
                </div>
                <div className={cn('max-w-[75%] p-3.5 rounded-xl text-sm leading-relaxed whitespace-pre-line',
                  msg.role === 'assistant' ? 'bg-[rgb(var(--quantum-500)/.1)] border border-[rgb(var(--quantum-500)/.2)] text-white/90' : 'bg-white/10 text-white'
                )}>
                  {msg.content}
                  <div className="text-xs text-white/20 mt-2 font-mono">
                    {msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[rgb(var(--quantum-500))] to-[rgb(var(--neon-cyan))] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="typing-indicator bg-[rgb(var(--quantum-500)/.1)] border border-[rgb(var(--quantum-500)/.2)] rounded-lg p-3">
                  <span /><span /><span />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pregunta a la IA..." className="flex-1 quantum-input" />
            <motion.button onClick={() => handleSend()}
              className="p-3 rounded-lg bg-[rgb(var(--quantum-500))] hover:bg-[rgb(var(--quantum-400))] transition-colors disabled:opacity-40"
              disabled={!input.trim()} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Send className="w-4 h-4 text-white" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="w-80 space-y-6">
        {showReasoning && (
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-[rgb(var(--neon-cyan))]" />
              <span className="text-sm font-medium text-white">Reasoning</span>
            </div>
            <div className="space-y-3">
              {reasoningSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-xs',
                    step.status === 'complete' && 'bg-green-500/20 text-green-400',
                    step.status === 'processing' && 'bg-[rgb(var(--quantum-500)/.2)] text-[rgb(var(--quantum-400))] animate-pulse',
                    step.status === 'pending' && 'bg-white/5 text-white/30'
                  )}>
                    {step.status === 'complete' ? <Check className="w-3 h-3" /> : step.status === 'processing' ? '●' : '○'}
                  </div>
                  <span className={cn('text-sm', step.status === 'complete' && 'text-white/70', step.status === 'processing' && 'text-white', step.status === 'pending' && 'text-white/30')}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-white">Recomendaciones</span>
            <span className="text-xs text-white/40 font-mono">EN TIEMPO REAL</span>
          </div>
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <motion.div key={i} className={cn('p-3 rounded-lg border cursor-pointer',
                insight.type === 'alert' && 'bg-amber-500/5 border-amber-500/20',
                insight.type === 'optimization' && 'bg-[rgb(var(--neon-cyan)/.05)] border-[rgb(var(--neon-cyan)/.2)]',
                insight.type === 'insight' && 'bg-[rgb(var(--quantum-500)/.05)] border-[rgb(var(--quantum-500)/.2)]'
              )} whileHover={{ scale: 1.02 }}>
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
