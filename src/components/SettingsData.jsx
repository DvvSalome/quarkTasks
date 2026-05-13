import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Database, Download, Upload, Trash2, RefreshCw, AlertTriangle,
  Check, X, FileJson, Archive, HardDrive, Shield, Clock,
  ChevronRight, Info, Loader2,
} from 'lucide-react'
import { cn } from '../lib/utils'

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export default function SettingsData({ onNavigateToProfile, onDeleteConfirm }) {
  const [activeSection, setActiveSection] = useState('overview')
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [clearingCache, setClearingCache] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleteInput, setDeleteInput] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [retentionDays, setRetentionDays] = useState(90)
  const [storageUsed, setStorageUsed] = useState({ tasks: '2.4 MB', routines: '0.8 MB', analytics: '4.2 MB', total: '7.4 MB' })
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState('')

  const simulateProgress = (callback) => {
    setProgress(0)
    const intervals = [10, 25, 45, 60, 75, 90, 100]
    intervals.forEach((p, i) => {
      setTimeout(() => setProgress(p), (i + 1) * 300)
    })
    setTimeout(callback, intervals.length * 300 + 200)
  }

  const handleExport = () => {
    setExporting(true)
    setStatusMessage('Preparando datos...')
    simulateProgress(() => {
      const data = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        profile: { name: 'Usuario', email: 'usuario@quarktasking.com' },
        tasks: [],
        routines: [],
        settings: {},
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `quark-export-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      setExporting(false)
      setStatusMessage('')
      setProgress(0)
    })
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      setImporting(true)
      setStatusMessage('Importando datos...')
      simulateProgress(() => {
        setTimeout(() => {
          setImporting(false)
          setStatusMessage('')
          setProgress(0)
        }, 500)
      })
    }
    input.click()
  }

  const handleClearCache = () => {
    setClearingCache(true)
    setStatusMessage('Limpiando caché...')
    simulateProgress(() => {
      localStorage.removeItem('quark_ai_config')
      localStorage.removeItem('quark_effects')
      setClearingCache(false)
      setStatusMessage('')
      setProgress(0)
    })
  }

  const handleDeleteAccount = () => {
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    localStorage.clear()
    window.location.reload()
  }

  const sections = [
    { id: 'overview', label: 'Resumen', icon: Database },
    { id: 'export', label: 'Exportar datos', icon: Download },
    { id: 'import', label: 'Importar datos', icon: Upload },
    { id: 'storage', label: 'Almacenamiento', icon: HardDrive },
    { id: 'retention', label: 'Retención', icon: Clock },
    { id: 'danger', label: 'Zona de peligro', icon: AlertTriangle },
  ]

  return (
    <div className="space-y-5">
      {/* Navigation */}
      <div className="flex gap-2 flex-wrap">
        {sections.map(({ id, label, icon: Icon }) => (
          <motion.button
            key={id}
            onClick={() => setActiveSection(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all',
              activeSection === id
                ? 'border-[rgb(var(--quantum-500)/.4)] bg-[rgb(var(--quantum-500)/.1)] text-white'
                : 'border-white/10 bg-white/3 text-white/50 hover:text-white hover:bg-white/5'
            )}
            whileTap={{ scale: 0.97 }}
          >
            <Icon className="w-4 h-4" />
            {label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── OVERVIEW ── */}
        {activeSection === 'overview' && (
          <motion.div key="overview" {...fadeUp} className="space-y-4">
            <div className="glass-card p-6">
              <h3 className="text-base font-medium text-white mb-4">Resumen de datos</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Tareas', value: '156', icon: Database, color: 'text-[rgb(var(--quantum-300))]' },
                  { label: 'Rutinas', value: '12', icon: RefreshCw, color: 'text-[rgb(var(--neon-cyan))]' },
                  { label: 'Sesiones de enfoque', value: '89', icon: Clock, color: 'text-green-400' },
                ].map((stat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl border border-white/8 bg-white/3">
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon className={cn('w-4 h-4', stat.color)} />
                      <span className="text-xs text-white/40">{stat.label}</span>
                    </div>
                    <div className="text-2xl font-semibold text-white">{stat.value}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-4 h-4 text-green-400" />
                <div>
                  <h3 className="text-base font-medium text-white">Política de datos</h3>
                  <p className="text-xs text-white/40">Tus datos están cifrados y seguros</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  'Cifrado de extremo a extremo en todos los datos',
                  'Tus API keys nunca salen de tu dispositivo',
                  'Puedes exportar tus datos en cualquier momento',
                  'Derecho a la eliminación completa (GDPR)',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-white/60">
                    <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── EXPORT ── */}
        {activeSection === 'export' && (
          <motion.div key="export" {...fadeUp} className="space-y-4">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-[rgb(var(--quantum-500)/.15)]">
                  <Download className="w-4 h-4 text-[rgb(var(--quantum-300))]" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-white">Exportar datos</h3>
                  <p className="text-xs text-white/40">Descarga todos tus datos en formato JSON</p>
                </div>
              </div>
              <p className="text-sm text-white/50 mb-5 leading-relaxed">
                Obtén una copia completa de tus datos: tareas, rutinas, configuración, estadísticas y más. 
                Los datos se exportan en formato JSON estándar compatible con cualquier herramienta.
              </p>
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={handleExport}
                  disabled={exporting}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[rgb(var(--quantum-500))] text-white text-sm font-medium hover:bg-[rgb(var(--quantum-400))] disabled:opacity-50 transition-colors"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                >
                  {exporting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Exportando...</>
                  ) : (
                    <><FileJson className="w-4 h-4" /> Exportar todo</>
                  )}
                </motion.button>
                {exporting && (
                  <div className="flex-1 max-w-xs">
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[rgb(var(--quantum-500))] to-[rgb(var(--neon-cyan))]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-xs text-white/30 mt-1">{statusMessage}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── IMPORT ── */}
        {activeSection === 'import' && (
          <motion.div key="import" {...fadeUp} className="space-y-4">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-amber-500/15">
                  <Upload className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-white">Importar datos</h3>
                  <p className="text-xs text-white/40">Restaura datos desde un archivo JSON</p>
                </div>
              </div>
              <p className="text-sm text-white/50 mb-5 leading-relaxed">
                Importa datos previamente exportados. Esto sobrescribirá tu configuración actual.
                Asegúrate de haber hecho una copia de seguridad antes de continuar.
              </p>
              <div
                onClick={handleImport}
                className={cn(
                  'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
                  importing ? 'border-[rgb(var(--quantum-500)/.4)] bg-[rgb(var(--quantum-500)/.07)]' : 'border-white/10 hover:border-[rgb(var(--quantum-500)/.3)] hover:bg-white/3'
                )}
              >
                <Upload className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <p className="text-sm text-white/50 mb-1">
                  {importing ? 'Importando datos...' : 'Arrastra un archivo o haz clic para seleccionar'}
                </p>
                <p className="text-xs text-white/30">Solo archivos .json</p>
                {importing && (
                  <div className="max-w-xs mx-auto mt-4">
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-[rgb(var(--quantum-500))]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STORAGE ── */}
        {activeSection === 'storage' && (
          <motion.div key="storage" {...fadeUp} className="space-y-4">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-[rgb(var(--quantum-500)/.15)]">
                  <HardDrive className="w-4 h-4 text-[rgb(var(--quantum-300))]" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-white">Almacenamiento</h3>
                  <p className="text-xs text-white/40">Uso de almacenamiento local</p>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/60">{storageUsed.total} usado</span>
                  <span className="text-xs text-white/30">de 50 MB disponibles</span>
                </div>
                <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[rgb(var(--quantum-500))] via-[rgb(var(--neon-cyan))] to-green-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${(7.4 / 50) * 100}%` }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Tareas', value: storageUsed.tasks, pct: 32 },
                  { label: 'Rutinas', value: storageUsed.routines, pct: 11 },
                  { label: 'Analíticas', value: storageUsed.analytics, pct: 57 },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl border border-white/8 bg-white/3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/40">{item.label}</span>
                      <span className="text-xs font-mono text-white/30">{item.value}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-[rgb(var(--quantum-500))]"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.pct}%` }}
                        transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-white mb-1">Limpiar caché</h3>
                  <p className="text-xs text-white/40">Elimina datos temporales y configuración en caché</p>
                </div>
                <motion.button
                  onClick={handleClearCache}
                  disabled={clearingCache}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white/70 text-sm hover:bg-white/5 hover:text-white disabled:opacity-40 transition-colors"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                >
                  {clearingCache ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Limpiando...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4" /> Limpiar caché</>
                  )}
                </motion.button>
              </div>
              {clearingCache && (
                <div className="mt-4">
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-green-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── RETENTION ── */}
        {activeSection === 'retention' && (
          <motion.div key="retention" {...fadeUp} className="space-y-4">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-[rgb(var(--quantum-500)/.15)]">
                  <Clock className="w-4 h-4 text-[rgb(var(--quantum-300))]" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-white">Políticas de retención</h3>
                  <p className="text-xs text-white/40">Controla cuánto tiempo conservamos tus datos</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Retención de datos de actividad</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={30}
                      max={365}
                      step={30}
                      value={retentionDays}
                      onChange={(e) => setRetentionDays(Number(e.target.value))}
                      className="flex-1 accent-[rgb(var(--quantum-500))]"
                    />
                    <span className="text-sm font-mono text-white min-w-[80px] text-right">
                      {retentionDays < 90 ? `${retentionDays} días` : retentionDays >= 365 ? '1 año' : `${retentionDays} días`}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Tareas completadas', value: 'Siempre' },
                    { label: 'Historial de enfoque', value: `${retentionDays} días` },
                    { label: 'Analíticas', value: `${retentionDays} días` },
                    { label: 'Configuración', value: 'Siempre' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-white/8 bg-white/3">
                      <span className="text-sm text-white/60">{item.label}</span>
                      <span className="text-xs font-mono text-white/40">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── DANGER ZONE ── */}
        {activeSection === 'danger' && (
          <motion.div key="danger" {...fadeUp} className="space-y-4">
            <div className="glass-card p-6 border border-red-500/15">
              <div className="flex items-center gap-2 mb-5">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="text-lg font-medium text-red-400">Zona de peligro</h3>
              </div>
              <div className="space-y-3">
                <div className="p-5 rounded-xl bg-red-500/5 border border-red-500/15">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-medium text-red-300 mb-1">Borrar todos los datos locales</div>
                      <p className="text-xs text-white/40">Elimina tareas, rutinas, configuración y preferencias. La sesión permanece.</p>
                    </div>
                    <button
                      onClick={() => setDeleteConfirm(deleteConfirm === 'data' ? null : 'data')}
                      className="flex-shrink-0 ml-4 px-4 py-2 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/25 transition-colors"
                    >
                      {deleteConfirm === 'data' ? 'Cancelar' : 'Borrar datos'}
                    </button>
                  </div>
                  <AnimatePresence>
                    {deleteConfirm === 'data' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="mt-4 p-4 rounded-xl bg-red-500/8 border border-red-500/20">
                          <p className="text-xs text-white/60 mb-3">
                            Escribe <span className="font-mono text-red-300 font-medium">"BORRAR DATOS"</span> para confirmar:
                          </p>
                          <input
                            value={deleteInput}
                            onChange={(e) => setDeleteInput(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-mono focus:border-red-500/50 focus:outline-none transition-colors mb-3"
                            placeholder="BORRAR DATOS"
                          />
                          <button
                            disabled={deleteInput !== 'BORRAR DATOS'}
                            onClick={() => { localStorage.clear(); window.location.reload() }}
                            className="w-full py-2.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-500/30 transition-colors"
                          >
                            Confirmar borrado
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="p-5 rounded-xl bg-red-500/5 border border-red-500/15">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-medium text-red-300 mb-1">Eliminar cuenta</div>
                      <p className="text-xs text-white/40">Borra permanentemente tu cuenta y todos tus datos. Esta acción es irreversible.</p>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      className="flex-shrink-0 ml-4 px-4 py-2 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/25 transition-colors"
                    >
                      Eliminar cuenta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowDeleteModal(false) }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-2xl border border-red-500/30 bg-[rgb(var(--quantum-900))] p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-xl bg-red-500/15">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Eliminar cuenta</h3>
                  <p className="text-sm text-white/40">Esta acción no se puede deshacer</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
                  <p className="text-sm text-white/70 leading-relaxed">
                    Al eliminar tu cuenta:
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {[
                      'Se borrarán todas tus tareas y rutinas',
                      'Se eliminará tu configuración y preferencias',
                      'Perderás acceso permanente a tu cuenta',
                      'No podrás recuperar tus datos después',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-white/50">
                        <X className="w-3 h-3 text-red-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-2">
                    Escribe <span className="font-mono text-red-300">"ELIMINAR CUENTA"</span> para confirmar:
                  </p>
                  <input
                    value={deleteInput}
                    onChange={(e) => setDeleteInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono focus:border-red-500/50 focus:outline-none transition-colors"
                    placeholder="ELIMINAR CUENTA"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowDeleteModal(false); setDeleteInput('') }}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    disabled={deleteInput !== 'ELIMINAR CUENTA'}
                    onClick={confirmDelete}
                    className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-400 transition-colors"
                  >
                    Eliminar cuenta
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
