import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Shield, Eye, Server, Cpu, Lock, X, ArrowRight } from 'lucide-react'

const bullet = 'w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5'

export default function FocusVisionModal({ open, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden"
          >
            <div className="relative rounded-2xl bg-[rgb(var(--quantum-900))] border border-white/[0.08] p-6 sm:p-8 shadow-2xl">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[rgb(var(--quantum-500)/.1)] via-transparent to-[rgb(var(--neon-cyan)/.05)] pointer-events-none" />

              <button
                onClick={onCancel}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[rgb(var(--quantum-500)/.15)] border border-[rgb(var(--quantum-500)/.25)] flex items-center justify-center">
                    <Camera className="w-6 h-6 text-[rgb(var(--quantum-300))]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Focus Vision IA</h2>
                    <p className="text-sm text-white/40">Monitoreo inteligente de concentración</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-white/30">Qué hace</h3>
                  <ul className="space-y-2">
                    {[
                      { icon: Eye, text: 'Analiza señales básicas de concentración en tiempo real' },
                      { icon: Eye, text: 'Detecta si abandonas el escritorio' },
                      { icon: Eye, text: 'Detecta distracciones prolongadas durante sesiones de Deep Work' },
                    ].map((item, i) => {
                      const Icon = item.icon
                      return (
                        <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                          <div className={bullet + ' bg-[rgb(var(--quantum-400))]'} />
                          <span>{item.text}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-white/30">Qué NO hace</h3>
                  <ul className="space-y-2">
                    {[
                      { icon: Shield, text: 'No graba video en ningún momento' },
                      { icon: Server, text: 'No almacena imágenes ni metadatos' },
                      { icon: Server, text: 'No envía datos a servidores externos' },
                      { icon: Eye, text: 'No realiza reconocimiento facial ni biometría' },
                      { icon: Lock, text: 'No comparte información con terceros' },
                    ].map((item, i) => {
                      const Icon = item.icon
                      return (
                        <li key={i} className="flex items-start gap-3 text-sm text-white/50">
                          <div className={bullet + ' bg-red-400/60'} />
                          <span>{item.text}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-[rgb(var(--quantum-500)/.08)] to-[rgb(var(--neon-cyan)/.04)] border border-[rgb(var(--quantum-500)/.15)] p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[rgb(var(--quantum-300))]" />
                    <span className="text-sm font-medium text-white">Zero Trust Privacy by Design</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { label: 'Procesamiento', value: 'Local', icon: Cpu },
                      { label: 'Inferencia', value: 'On-device', icon: Cpu },
                      { label: 'Datos', value: 'Efímeros', icon: Server },
                      { label: 'Persistencia', value: 'Cero', icon: Lock },
                      { label: 'Cloud', value: 'No aplica', icon: Server },
                      { label: 'Control', value: 'Total del usuario', icon: Lock },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-black/20 rounded-lg p-2">
                        <item.icon className="w-3 h-3 text-[rgb(var(--neon-cyan))] flex-shrink-0" />
                        <div>
                          <div className="text-white/30">{item.label}</div>
                          <div className="text-white/80 font-medium">{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    onClick={onCancel}
                    className="flex-1 py-3 rounded-xl border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    onClick={onConfirm}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[rgb(var(--quantum-500))] to-[rgb(var(--quantum-400))] text-white text-sm font-medium flex items-center justify-center gap-2 group"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Camera className="w-4 h-4" />
                    <span>Activar cámara inteligente</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </motion.button>
                </div>

                <p className="text-[10px] text-white/20 text-center leading-relaxed">
                  Al activar, el procesamiento ocurre 100% en tu navegador.
                  Puedes desactivar la cámara en cualquier momento con un clic.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
