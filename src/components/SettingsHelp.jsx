import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HelpCircle, Search, Book, MessageSquare, Bug, Keyboard,
  Lightbulb, ChevronDown, ChevronRight, ExternalLink, Mail,
  FileText, Youtube, Command, ArrowRight, Check, Star,
} from 'lucide-react'
import { cn } from '../lib/utils'

const faqItems = [
  {
    q: '¿Cómo conecto mi API key de IA?',
    a: 'Ve a Configuración → Configuración IA, selecciona tu proveedor (OpenAI, Anthropic, etc.), ingresa tu API key y haz clic en "Verificar conexión". Tu clave nunca sale de tu navegador.',
    category: 'IA',
  },
  {
    q: '¿Mis datos están seguros?',
    a: 'Absolutamente. Quark Tasking opera con arquitectura Zero-Knowledge. Tus datos se almacenan localmente en tu navegador y se cifran antes de cualquier transmisión. Nunca vendemos ni compartimos tu información.',
    category: 'Seguridad',
  },
  {
    q: '¿Cómo funcionan las sesiones de enfoque?',
    a: 'Las sesiones de enfoque usan la técnica Pomodoro. Puedes elegir entre Focus (25 min), Break (5 min) o Deep (90 min). El temporizador cuenta regresivamente y puedes pausar/reanudar en cualquier momento.',
    category: 'Productividad',
  },
  {
    q: '¿Puedo exportar mis datos?',
    a: 'Sí. Ve a Configuración → Datos → Exportar datos. Recibirás un archivo JSON completo con todas tus tareas, rutinas, configuración y estadísticas.',
    category: 'Datos',
  },
  {
    q: '¿Cómo cambio de tema?',
    a: 'En Configuración → Apariencia, puedes elegir entre 4 temas: Quantum Dark, Midnight, Aurora y Nebula. También puedes activar/desactivar efectos visuales como partículas, glassmorphism y brillos.',
    category: 'Personalización',
  },
  {
    q: '¿Qué significa cada nivel de autonomía IA?',
    a: 'Básico: solo sugerencias simples. Avanzado: análisis completo de patrones. Experimental: predicciones y acciones automáticas basadas en tu comportamiento.',
    category: 'IA',
  },
  {
    q: '¿Cómo restauro mis datos?',
    a: 'Ve a Configuración → Datos → Importar datos y selecciona un archivo JSON previamente exportado. La importación sobrescribirá tu configuración actual.',
    category: 'Datos',
  },
  {
    q: '¿Puedo usar Quark sin conexión?',
    a: 'Sí. Quark funciona completamente en el navegador. Tus datos se guardan en localStorage y están disponibles sin conexión. La sincronización en la nube es opcional.',
    category: 'General',
  },
]

const shortcuts = [
  { keys: ['Cmd', 'K'], desc: 'Buscar en la aplicación' },
  { keys: ['Cmd', '1'], desc: 'Ir a Dashboard' },
  { keys: ['Cmd', '2'], desc: 'Abrir Neural Core' },
  { keys: ['Cmd', '3'], desc: 'Ir a Tareas' },
  { keys: ['Cmd', '4'], desc: 'Iniciar sesión de enfoque' },
  { keys: ['Esc'], desc: 'Cerrar panel / Cancelar' },
]

export default function SettingsHelp() {
  const [search, setSearch] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [showShortcuts, setShowShortcuts] = useState(false)

  const categories = ['all', ...new Set(faqItems.map(f => f.category))]

  const filteredFaq = faqItems.filter(f => {
    const matchesSearch = !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'all' || f.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="glass-card p-6">
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-12 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[rgb(var(--quantum-500))] focus:ring-2 focus:ring-[rgb(var(--quantum-500)/.15)] focus:outline-none transition-all text-base"
            placeholder="Buscar ayuda, preguntas frecuentes, guías..."
            autoFocus
          />
          <kbd className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md bg-white/10 text-white/30 text-xs font-mono hidden sm:block">
            /
          </kbd>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Book, label: 'Guías rápidas', desc: 'Aprende los fundamentos', color: 'from-[rgb(var(--quantum-500))] to-[rgb(var(--neon-cyan))]' },
            { icon: FileText, label: 'Documentación', desc: 'Referencia completa', color: 'from-[rgb(var(--neon-cyan))] to-blue-500' },
            { icon: MessageSquare, label: 'Contactar soporte', desc: 'Te ayudamos', color: 'from-green-500 to-emerald-500' },
            { icon: Bug, label: 'Reportar bug', desc: 'Notifícanos errores', color: 'from-amber-500 to-orange-500' },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <motion.button
                key={i}
                className="relative p-5 rounded-xl border border-white/8 bg-white/3 hover:bg-white/5 text-left overflow-hidden group transition-colors"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className={cn('absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br', item.color)}
                />
                <div className="relative">
                  <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3', item.color)}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-sm font-medium text-white mb-0.5">{item.label}</div>
                  <div className="text-xs text-white/40">{item.desc}</div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* FAQ */}
        <div className="col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[rgb(var(--quantum-300))]" />
              <h3 className="text-base font-medium text-white">Preguntas frecuentes</h3>
            </div>
          </div>

          <div className="flex gap-2 mb-5 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  activeCategory === cat
                    ? 'bg-[rgb(var(--quantum-500)/.15)] text-[rgb(var(--quantum-300))] border border-[rgb(var(--quantum-500)/.3)]'
                    : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10'
                )}
              >
                {cat === 'all' ? 'Todas' : cat}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {filteredFaq.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                  <Search className="w-10 h-10 text-white/15 mx-auto mb-3" />
                  <p className="text-sm text-white/40">No se encontraron resultados para "{search}"</p>
                </motion.div>
              ) : (
                filteredFaq.map((item, i) => {
                  const isOpen = expandedFaq === i
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={cn(
                        'rounded-xl border transition-all cursor-pointer',
                        isOpen
                          ? 'border-[rgb(var(--quantum-500)/.3)] bg-[rgb(var(--quantum-500)/.06)]'
                          : 'border-white/8 bg-white/3 hover:bg-white/5'
                      )}
                    >
                      <button
                        onClick={() => setExpandedFaq(isOpen ? null : i)}
                        className="w-full flex items-center gap-3 p-4 text-left"
                      >
                        <ChevronDown className={cn(
                          'w-4 h-4 text-white/30 transition-transform flex-shrink-0',
                          isOpen && 'rotate-180'
                        )} />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-white">{item.q}</span>
                        </div>
                        <span className="text-xs text-white/30 font-mono px-2 py-0.5 rounded bg-white/5 flex-shrink-0">
                          {item.category}
                        </span>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-0">
                              <div className="pl-7 text-sm text-white/60 leading-relaxed">{item.a}</div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Shortcuts */}
          <div className="glass-card p-6">
            <button
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="flex items-center justify-between w-full mb-4"
            >
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-[rgb(var(--quantum-300))]" />
                <h3 className="text-base font-medium text-white">Atajos</h3>
              </div>
              <ChevronDown className={cn('w-4 h-4 text-white/30 transition-transform', showShortcuts && 'rotate-180')} />
            </button>
            <AnimatePresence>
              {showShortcuts && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-2">
                  {shortcuts.map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <span className="text-sm text-white/60">{s.desc}</span>
                      <div className="flex items-center gap-1">
                        {s.keys.map((key, j) => (
                          <kbd key={j} className="px-2 py-0.5 rounded-md bg-white/10 border border-white/10 text-white/60 text-xs font-mono">
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            {!showShortcuts && (
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-0.5 rounded-md bg-white/10 border border-white/10 text-white/60 text-xs font-mono">⌘K</kbd>
                <span className="text-xs text-white/30">Buscar</span>
              </div>
            )}
          </div>

          {/* Contact */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-green-400" />
              <h3 className="text-base font-medium text-white">Contacto</h3>
            </div>
            <div className="space-y-2">
              {[
                { icon: Mail, label: 'soporte@quarktasking.com', desc: 'Respuesta en 24h' },
                { icon: MessageSquare, label: 'Chat en vivo', desc: 'Disponible 9-18h' },
                { icon: Bug, label: 'Reportar bug', desc: 'GitHub Issues' },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.button
                    key={i}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/8 bg-white/3 hover:bg-white/5 transition-colors text-left"
                    whileHover={{ x: 2 }}
                  >
                    <Icon className="w-4 h-4 text-white/40" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white/80 truncate">{item.label}</div>
                      <div className="text-xs text-white/30">{item.desc}</div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-white/20" />
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Tips */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-medium text-white">Tips rápidos</h3>
            </div>
            <div className="space-y-3">
              {[
                'Usa el Neural Core para optimizar tu día automáticamente',
                'Las sesiones Deep de 90 min maximizan tu productividad',
                'Activa la predicción de burnout para evitar sobrecarga',
              ].map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <Star className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-white/60">{tip}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
