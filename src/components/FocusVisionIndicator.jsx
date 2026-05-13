import { motion } from 'framer-motion'
import { Camera, EyeOff, AlertTriangle } from 'lucide-react'
import { cn } from '../lib/utils'

const focusLabels = {
  focused: { text: 'Enfoque activo', color: 'text-green-400', dot: 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' },
  distracted: { text: 'Distracción detectada', color: 'text-amber-400', dot: 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]' },
  absent: { text: 'Ausencia prolongada', color: 'text-red-400', dot: 'bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.6)]' },
  unknown: { text: 'Inicializando...', color: 'text-white/40', dot: 'bg-white/20' },
}

export default function FocusVisionIndicator({
  state, focus, confidence, sensitivity, error,
  onActivate, onDeactivate, onSensitivityChange,
}) {
  const fl = focusLabels[focus] || focusLabels.unknown

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={state === 'active' ? { opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {state === 'active' ? (
              <Camera className="w-4 h-4 text-[rgb(var(--quantum-400))]" />
            ) : state === 'denied' ? (
              <AlertTriangle className="w-4 h-4 text-red-400" />
            ) : (
              <Camera className="w-4 h-4 text-white/30" />
            )}
          </motion.div>
          <span className="text-sm font-medium text-white">Focus Vision IA</span>
        </div>
        <span className={cn(
          'text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border transition-colors',
          state === 'active'
            ? 'text-green-400 bg-green-500/10 border-green-500/20'
            : 'text-white/20 bg-white/5 border-white/10'
        )}>
          {state === 'active' ? 'Local' : 'Inactivo'}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <motion.div
          className={cn('w-2.5 h-2.5 rounded-full transition-colors duration-500', fl.dot)}
          animate={state === 'active' ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className={cn('text-xs transition-colors duration-500', state === 'active' ? fl.color : 'text-white/40')}>
          {state === 'active' && fl.text}
          {state === 'requesting' && 'Iniciando cámara...'}
          {state === 'denied' && 'Cámara bloqueada — revisa permisos'}
          {state === 'error' && 'Error de cámara'}
          {state === 'idle' && 'Monitoreo desactivado'}
        </span>
      </div>

      {state === 'active' && (
        <>
          <div className="space-y-2 mb-4">
            <label className="text-[11px] text-white/30 font-mono uppercase tracking-wider">Sensibilidad</label>
            <div className="flex gap-1">
              {['relaxed', 'normal', 'strict'].map((s) => (
                <button
                  key={s}
                  onClick={() => onSensitivityChange(s)}
                  className={cn(
                    'flex-1 py-1.5 rounded-lg text-xs font-medium transition-all',
                    sensitivity === s
                      ? 'bg-[rgb(var(--quantum-500)/.2)] text-[rgb(var(--quantum-300))] border border-[rgb(var(--quantum-500)/.3)]'
                      : 'text-white/40 hover:text-white/60 bg-white/5 border border-transparent'
                  )}
                >
                  {s === 'relaxed' ? 'Relax' : s === 'normal' ? 'Normal' : 'Strict'}
                </button>
              ))}
            </div>
          </div>

          {focus === 'focused' && confidence > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-[10px] text-white/30 mb-1 font-mono">
                <span>Confianza</span>
                <span>{Math.round(confidence * 100)}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[rgb(var(--quantum-500))] to-[rgb(var(--neon-cyan))]"
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {focus === 'distracted' && (
            <motion.div
              className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <EyeOff className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="text-[11px] text-amber-300">Mirada fuera de pantalla detectada</span>
            </motion.div>
          )}

          {focus === 'absent' && (
            <motion.div
              className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              <span className="text-[11px] text-red-300">No se detecta presencia física</span>
            </motion.div>
          )}

          <button
            onClick={onDeactivate}
            className="w-full py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
          >
            <EyeOff className="w-3.5 h-3.5" />
            Desactivar cámara
          </button>
        </>
      )}

      {(state === 'denied' || state === 'error') && (
        <>
          {error && (
            <div className="mb-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-[11px] text-red-300 leading-relaxed">{error}</p>
            </div>
          )}
          <button
            onClick={onActivate}
            className="w-full py-2 rounded-lg bg-[rgb(var(--quantum-500)/.1)] border border-[rgb(var(--quantum-500)/.2)] text-[rgb(var(--quantum-300))] text-xs font-medium hover:bg-[rgb(var(--quantum-500)/.2)] transition-all flex items-center justify-center gap-2"
          >
            <Camera className="w-3.5 h-3.5" />
            Reintentar
          </button>
        </>
      )}

      {state === 'idle' && (
        <button
          onClick={onActivate}
          className="w-full py-2 rounded-lg bg-[rgb(var(--quantum-500)/.15)] border border-[rgb(var(--quantum-500)/.25)] text-white text-xs font-medium hover:bg-[rgb(var(--quantum-500)/.25)] transition-all flex items-center justify-center gap-2"
        >
          <Camera className="w-3.5 h-3.5" />
          Activar Focus Vision IA
        </button>
      )}
    </div>
  )
}
