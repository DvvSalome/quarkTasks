import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Bell, Palette, Shield, Zap, Database, HelpCircle, Brain,
  Sparkles, Check, Layers, Eye, Wand2, Cpu, Pencil, X,
  LogOut, Trash2, Camera, Key, Phone, Mail, AtSign,
  ShieldCheck, Lock, Fingerprint, Download, AlertTriangle,
  ChevronRight, Monitor, Smartphone, Globe, RefreshCw,
  ToggleLeft, ToggleRight, Settings as SettingsIcon,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useTheme } from '../contexts/ThemeContext'
import SettingsIntegrations from './SettingsIntegrations'
import SettingsData from './SettingsData'
import SettingsHelp from './SettingsHelp'

/* ── Constants ──────────────────────────────────────────────────────── */

const settingsSections = [
  { id: 'appearance',    label: 'Apariencia',         icon: Palette },
  { id: 'profile',       label: 'Perfil',             icon: User },
  { id: 'ai',            label: 'Configuración IA',   icon: Brain },
  { id: 'notifications', label: 'Notificaciones',     icon: Bell },
  { id: 'security',      label: 'Seguridad',          icon: Shield },
  { id: 'integrations',  label: 'Integraciones',      icon: Zap },
  { id: 'data',          label: 'Datos',              icon: Database },
  { id: 'help',          label: 'Ayuda',              icon: HelpCircle },
]

const EFFECTS_LIST = [
  { key: 'particles',     label: 'Partículas animadas', desc: 'Campo de partículas en el fondo',      icon: Sparkles },
  { key: 'glassmorphism', label: 'Glassmorphism',       desc: 'Efecto de cristal en paneles',         icon: Layers },
  { key: 'glow',          label: 'Glow effects',        desc: 'Brillos en elementos activos',         icon: Eye },
  { key: 'animations',    label: 'Animaciones',         desc: 'Transiciones y micro-interacciones',   icon: Wand2 },
]

const AI_PROVIDERS = [
  { id: 'openai',    name: 'OpenAI',          baseUrl: 'https://api.openai.com/v1',
    models: [{ id: 'gpt-4o', name: 'GPT-4o' }, { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' }, { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }] },
  { id: 'anthropic', name: 'Anthropic',       baseUrl: 'https://api.anthropic.com/v1',
    models: [{ id: 'claude-opus-4-7', name: 'Claude Opus 4.7' }, { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6' }, { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5' }] },
  { id: 'google',    name: 'Google AI',       baseUrl: 'https://generativelanguage.googleapis.com',
    models: [{ id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' }, { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' }] },
  { id: 'mistral',   name: 'Mistral AI',      baseUrl: 'https://api.mistral.ai/v1',
    models: [{ id: 'mistral-large-latest', name: 'Mistral Large' }, { id: 'open-mixtral-8x22b', name: 'Mixtral 8x22B' }] },
  { id: 'custom',    name: 'Personalizado',   baseUrl: '',
    models: [] },
]

const DEFAULT_AI_SETTINGS = [
  { id: 'auto-plan',        label: 'Planificación automática', desc: 'La IA reorganiza tareas según tu energía', enabled: true },
  { id: 'smart-suggest',    label: 'Sugerencias inteligentes', desc: 'Recomendaciones contextuales en tiempo real', enabled: true },
  { id: 'pattern-analysis', label: 'Análisis de patrones',    desc: 'Detecta hábitos y optimiza rutinas',          enabled: true },
  { id: 'predictive',       label: 'Predicción de burnout',   desc: 'Alerta antes de que te sobrecargues',         enabled: false },
]

const DEFAULT_AI_CONFIG = { provider: 'openai', apiKey: '', model: 'gpt-4o', customBaseUrl: '', customModel: '' }

const MOCK_SESSIONS = [
  { id: '1', device: 'Chrome · macOS',    location: 'Madrid, ES',   time: 'Ahora mismo', current: true },
  { id: '2', device: 'Safari · iPhone 15', location: 'Madrid, ES',  time: 'Hace 2 horas' },
  { id: '3', device: 'Firefox · Windows', location: 'Desconocido',  time: 'Hace 3 días' },
]

const NOTIF_GROUPS = [
  {
    key: 'productivity', label: 'Productividad', icon: Brain,
    items: [
      { key: 'taskReminders', label: 'Recordatorios de tareas',   default: true },
      { key: 'focusAlerts',   label: 'Alertas de sesión enfoque', default: true },
      { key: 'dailyGoals',    label: 'Objetivos diarios',         default: true },
      { key: 'streakAlerts',  label: 'Racha de actividad',        default: false },
    ],
  },
  {
    key: 'ai', label: 'Inteligencia Artificial', icon: Sparkles,
    items: [
      { key: 'insights',        label: 'Insights del Copiloto',   default: true },
      { key: 'recommendations', label: 'Recomendaciones',         default: true },
      { key: 'weeklyReport',    label: 'Resumen semanal',         default: false },
    ],
  },
  {
    key: 'system', label: 'Sistema', icon: SettingsIcon,
    items: [
      { key: 'updates',      label: 'Actualizaciones de la app', default: true },
      { key: 'maintenance',  label: 'Mantenimiento programado',  default: false },
      { key: 'securityAlert',label: 'Alertas de seguridad',      default: true },
    ],
  },
]

function buildDefaultNotifs() {
  const out = { push: true, email: false, inApp: true, frequency: 'instant' }
  NOTIF_GROUPS.forEach(g => {
    out[g.key] = {}
    g.items.forEach(i => { out[g.key][i.key] = i.default })
  })
  return out
}

/* ── Sub-components ──────────────────────────────────────────────────── */

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0',
        enabled ? 'bg-[rgb(var(--quantum-500))]' : 'bg-white/10'
      )}
    >
      <motion.div
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
        animate={{ left: enabled ? '26px' : '4px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      />
    </button>
  )
}

function EditableField({ icon: Icon, label, value, type = 'text', placeholder, onSave }) {
  const [editing, setEditing] = useState(false)
  const [temp, setTemp] = useState(value)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onSave(temp)
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleCancel = () => {
    setTemp(value)
    setEditing(false)
  }

  return (
    <div className={cn(
      'flex items-center gap-4 p-4 rounded-xl border transition-colors',
      editing ? 'border-[rgb(var(--quantum-500)/.4)] bg-[rgb(var(--quantum-500)/.06)]' : 'border-white/8 bg-white/3 hover:bg-white/5'
    )}>
      {Icon && <Icon className="w-4 h-4 text-white/30 flex-shrink-0" />}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-mono text-white/30 uppercase tracking-wider mb-0.5">{label}</div>
        {editing ? (
          <input
            type={type}
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel() }}
            className="bg-transparent text-white text-sm outline-none w-full placeholder:text-white/25"
            placeholder={placeholder}
          />
        ) : (
          <div className="text-sm text-white truncate">
            {value || <span className="text-white/25 italic">No configurado</span>}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.div key="saved" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-green-400" />
            </motion.div>
          ) : editing ? (
            <motion.div key="editing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1.5">
              <button onClick={handleCancel}
                className="px-2.5 py-1 rounded-lg text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors">
                Cancelar
              </button>
              <button onClick={handleSave}
                className="px-2.5 py-1 rounded-lg text-xs text-white bg-[rgb(var(--quantum-500))] hover:bg-[rgb(var(--quantum-400))] transition-colors">
                Guardar
              </button>
            </motion.div>
          ) : (
            <motion.button key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={() => { setTemp(value); setEditing(true) }}
              className="p-1.5 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/8 transition-colors">
              <Pencil className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function ThemePreview({ theme, isActive, onClick }) {
  const [r, g, b] = theme.swatches[0].slice(1).match(/.{2}/g).map(h => parseInt(h, 16))
  return (
    <motion.button onClick={onClick}
      className={cn(
        'relative p-4 rounded-xl border text-left transition-colors overflow-hidden',
        isActive
          ? 'border-[rgb(var(--quantum-500))] bg-[rgb(var(--quantum-500)/.1)]'
          : 'border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5'
      )}
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="w-full h-12 rounded-lg mb-3 overflow-hidden relative"
        style={{ background: `rgb(${r} ${g} ${b})` }}>
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          <div className="w-5 h-5 rounded-full" style={{ background: theme.swatches[1] }} />
          <div className="w-3.5 h-3.5 rounded-full" style={{ background: theme.swatches[2] }} />
          <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-white">{theme.name}</div>
          <div className="text-xs text-white/35 mt-0.5">{theme.desc}</div>
        </div>
        {isActive && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="w-5 h-5 rounded-full bg-[rgb(var(--quantum-500))] flex items-center justify-center flex-shrink-0">
            <Check className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </div>
    </motion.button>
  )
}

/* ── Main Settings component ─────────────────────────────────────────── */

export default function Settings() {
  const [activeSection, setActiveSection] = useState('appearance')

  // Theme
  const { themeId, changeTheme, effects, setEffect, themes } = useTheme()

  // Profile
  const avatarInputRef = useRef(null)
  const [profile, setProfile] = useState({
    displayName: 'Usuario', username: 'usuario',
    email: 'usuario@quarktasking.com', phone: '',
    avatarUrl: null, bio: '',
  })
  const [deleteConfirm, setDeleteConfirm] = useState(null) // 'data' | 'account'
  const [deleteInput, setDeleteInput] = useState('')
  const [showPassChange, setShowPassChange] = useState(false)
  const [passData, setPassData] = useState({ current: '', new: '', confirm: '' })
  const [showPassFields, setShowPassFields] = useState({ current: false, new: false, confirm: false })

  const updateProfile = (key, val) => setProfile(p => ({ ...p, [key]: val }))

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setProfile(p => ({ ...p, avatarUrl: ev.target.result }))
    reader.readAsDataURL(file)
  }

  const handleLogout = () => {
    localStorage.removeItem('quark_session')
    localStorage.removeItem('quark_onboarded')
    window.location.reload()
  }

  // AI
  const [aiConfig, setAiConfig] = useState(() => {
    try { return JSON.parse(localStorage.getItem('quark_ai_config')) || DEFAULT_AI_CONFIG }
    catch { return DEFAULT_AI_CONFIG }
  })
  const [showApiKey, setShowApiKey] = useState(false)
  const [connStatus, setConnStatus] = useState(null) // null | 'testing' | 'ok' | 'error'
  const [aiSettings, setAiSettings] = useState(DEFAULT_AI_SETTINGS)
  const [aiLevel, setAiLevel] = useState(1)

  const saveAiConfig = (patch) => {
    const next = { ...aiConfig, ...patch }
    setAiConfig(next)
    localStorage.setItem('quark_ai_config', JSON.stringify(next))
  }

  const testConnection = async () => {
    setConnStatus('testing')
    await new Promise(r => setTimeout(r, 1800))
    setConnStatus(aiConfig.apiKey.length > 8 ? 'ok' : 'error')
    setTimeout(() => setConnStatus(null), 4000)
  }

  const currentProvider = AI_PROVIDERS.find(p => p.id === aiConfig.provider) || AI_PROVIDERS[0]

  // Notifications
  const [notifs, setNotifs] = useState(buildDefaultNotifs)

  const toggleNotif = (group, key) => {
    setNotifs(p => ({ ...p, [group]: { ...p[group], [key]: !p[group][key] } }))
  }

  const toggleChannel = (ch) => setNotifs(p => ({ ...p, [ch]: !p[ch] }))

  // Security
  const [sec, setSec] = useState({
    twoFa: false, twoFaMethod: 'app',
    telemetry: false, aiLearning: true, syncEnabled: true,
  })
  const [sessions, setSessions] = useState(MOCK_SESSIONS)
  const revokeSession = (id) => setSessions(s => s.filter(x => x.id === '1' || x.id !== id))

  const toggleSec = (key) => setSec(p => ({ ...p, [key]: !p[key] }))

  /* ── Render ── */
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex gap-6">

      {/* Sidebar */}
      <div className="w-60 flex-shrink-0 space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Configuración</h2>
          <p className="text-sm text-white/40">Personaliza tu experiencia</p>
        </div>
        <nav className="space-y-0.5">
          {settingsSections.map(({ id, label, icon: Icon }) => {
            const active = activeSection === id
            return (
              <motion.button key={id} onClick={() => setActiveSection(id)}
                className={cn(
                  'relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150',
                  active ? 'bg-[rgb(var(--quantum-500)/.15)] text-white' : 'text-white/45 hover:text-white/80 hover:bg-white/5'
                )}
                whileHover={{ x: active ? 0 : 3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                {active && (
                  <motion.div layoutId="settingsAccent"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-[rgb(var(--quantum-400))]"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }} />
                )}
                <Icon className={cn('w-4 h-4', active && 'text-[rgb(var(--quantum-300))]')} />
                <span className="text-sm">{label}</span>
              </motion.button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pr-1">
        <AnimatePresence mode="wait">

          {/* ── APPEARANCE ── */}
          {activeSection === 'appearance' && (
            <motion.div key="appearance" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-5">

              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 rounded-lg bg-[rgb(var(--quantum-500)/.15)]">
                    <Palette className="w-4 h-4 text-[rgb(var(--quantum-300))]" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-white">Tema de color</h3>
                    <p className="text-xs text-white/40">Cambios instantáneos y persistentes</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(themes).map(t => (
                    <ThemePreview key={t.id} theme={t} isActive={themeId === t.id} onClick={() => changeTheme(t.id)} />
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 rounded-lg bg-[rgb(var(--quantum-500)/.15)]">
                    <Cpu className="w-4 h-4 text-[rgb(var(--quantum-300))]" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-white">Efectos visuales</h3>
                    <p className="text-xs text-white/40">Desactiva para mejorar rendimiento</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {EFFECTS_LIST.map(({ key, label, desc, icon: Icon }) => {
                    const on = effects[key]
                    return (
                      <motion.div key={key}
                        className={cn('flex items-center justify-between p-3.5 rounded-xl border transition-colors',
                          on ? 'bg-[rgb(var(--quantum-500)/.07)] border-[rgb(var(--quantum-500)/.2)]' : 'bg-white/3 border-white/8 hover:bg-white/5')}
                        whileHover={{ x: 2 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn('p-1.5 rounded-lg transition-colors', on ? 'bg-[rgb(var(--quantum-500)/.2)]' : 'bg-white/5')}>
                            <Icon className={cn('w-3.5 h-3.5 transition-colors', on ? 'text-[rgb(var(--quantum-300))]' : 'text-white/40')} />
                          </div>
                          <div>
                            <div className="text-sm text-white font-medium">{label}</div>
                            <div className="text-xs text-white/40">{desc}</div>
                          </div>
                        </div>
                        <Toggle enabled={on} onChange={(v) => setEffect(key, v)} />
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── PROFILE ── */}
          {activeSection === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-5">

              {/* Avatar + basic info */}
              <div className="glass-card p-6">
                <h3 className="text-base font-medium text-white mb-5">Foto de perfil</h3>
                <div className="flex items-center gap-5">
                  <div className="relative group cursor-pointer flex-shrink-0"
                    onClick={() => avatarInputRef.current?.click()}>
                    <div className="w-20 h-20 rounded-2xl overflow-hidden">
                      {profile.avatarUrl ? (
                        <img src={profile.avatarUrl} className="w-full h-full object-cover" alt="avatar" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[rgb(var(--quantum-500))] to-[rgb(var(--neon-cyan))] flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">
                            {profile.displayName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{profile.displayName}</p>
                    <p className="text-sm text-white/40">@{profile.username}</p>
                    <button onClick={() => avatarInputRef.current?.click()}
                      className="mt-2 text-xs text-[rgb(var(--quantum-300))] hover:text-[rgb(var(--quantum-200))] transition-colors">
                      Cambiar foto →
                    </button>
                  </div>
                </div>
              </div>

              {/* Editable fields */}
              <div className="glass-card p-6">
                <h3 className="text-base font-medium text-white mb-4">Información personal</h3>
                <div className="space-y-2">
                  <EditableField icon={User}   label="Nombre de interacción" value={profile.displayName}
                    placeholder="Tu nombre" onSave={(v) => updateProfile('displayName', v)} />
                  <EditableField icon={AtSign}  label="@Username"             value={profile.username}
                    placeholder="tu_usuario" onSave={(v) => updateProfile('username', v.replace(/[^a-z0-9_]/gi, '').toLowerCase())} />
                  <EditableField icon={Mail}    label="Correo electrónico"    value={profile.email}
                    type="email" placeholder="tu@email.com" onSave={(v) => updateProfile('email', v)} />
                  <EditableField icon={Phone}   label="Número de teléfono"    value={profile.phone}
                    type="tel" placeholder="+34 600 000 000" onSave={(v) => updateProfile('phone', v)} />
                </div>
              </div>

              {/* Change password */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium text-white">Contraseña</h3>
                  <button onClick={() => setShowPassChange(p => !p)}
                    className="text-xs text-[rgb(var(--quantum-300))] hover:text-[rgb(var(--quantum-200))] transition-colors flex items-center gap-1">
                    {showPassChange ? 'Cancelar' : 'Cambiar contraseña'} <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <AnimatePresence>
                  {showPassChange && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden">
                      {[
                        { key: 'current', label: 'Contraseña actual' },
                        { key: 'new',     label: 'Nueva contraseña' },
                        { key: 'confirm', label: 'Confirmar nueva contraseña' },
                      ].map(({ key, label }) => (
                        <div key={key} className="relative">
                          <label className="block text-xs font-mono text-white/30 uppercase tracking-wider mb-1.5">{label}</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                            <input
                              type={showPassFields[key] ? 'text' : 'password'}
                              value={passData[key]}
                              onChange={(e) => setPassData(p => ({ ...p, [key]: e.target.value }))}
                              className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[rgb(var(--quantum-500))] focus:ring-2 focus:ring-[rgb(var(--quantum-500)/.15)] focus:outline-none transition-all"
                              placeholder="••••••••"
                            />
                            <button type="button"
                              onClick={() => setShowPassFields(p => ({ ...p, [key]: !p[key] }))}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                              {showPassFields[key] ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4 opacity-40" />}
                            </button>
                          </div>
                        </div>
                      ))}
                      <motion.button
                        className="w-full py-3 rounded-xl bg-[rgb(var(--quantum-500))] text-white text-sm font-medium hover:bg-[rgb(var(--quantum-400))] transition-colors"
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                      >
                        Actualizar contraseña
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!showPassChange && (
                  <p className="text-sm text-white/30">Última actualización: nunca</p>
                )}
              </div>

              {/* Session actions */}
              <div className="glass-card p-6">
                <h3 className="text-base font-medium text-white mb-4">Sesión</h3>
                <div className="space-y-2">
                  <motion.button
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-white/8 bg-white/3 hover:bg-white/6 text-white/70 hover:text-white transition-colors text-sm"
                    whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 text-white/40" />
                    <span>Cerrar sesión</span>
                    <ChevronRight className="w-4 h-4 ml-auto text-white/20" />
                  </motion.button>
                  <motion.button
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-white/8 bg-white/3 hover:bg-white/6 text-white/70 hover:text-white transition-colors text-sm"
                    whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}
                    onClick={() => { localStorage.clear(); window.location.reload() }}
                  >
                    <RefreshCw className="w-4 h-4 text-white/40" />
                    <span>Cambiar de cuenta</span>
                    <ChevronRight className="w-4 h-4 ml-auto text-white/20" />
                  </motion.button>
                </div>
              </div>

              {/* Danger zone */}
              <div className="glass-card p-6 border border-red-500/15">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <h3 className="text-base font-medium text-red-400">Zona de peligro</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { key: 'data',    label: 'Borrar todos mis datos',  desc: 'Elimina tareas, rutinas y configuración. La cuenta permanece.', confirm: 'BORRAR DATOS' },
                    { key: 'account', label: 'Eliminar cuenta',         desc: 'Borra permanentemente tu cuenta y todos tus datos. Irreversible.', confirm: 'ELIMINAR CUENTA' },
                  ].map(({ key, label, desc, confirm: confirmText }) => (
                    <div key={key}>
                      <div className="flex items-start justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/15">
                        <div>
                          <div className="text-sm font-medium text-red-300">{label}</div>
                          <div className="text-xs text-white/40 mt-0.5 max-w-xs">{desc}</div>
                        </div>
                        <motion.button
                          onClick={() => setDeleteConfirm(deleteConfirm === key ? null : key)}
                          className="flex-shrink-0 ml-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-xs hover:bg-red-500/25 transition-colors"
                          whileTap={{ scale: 0.96 }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {deleteConfirm === key ? 'Cancelar' : 'Eliminar'}
                        </motion.button>
                      </div>
                      <AnimatePresence>
                        {deleteConfirm === key && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="mt-2 p-4 rounded-xl bg-red-500/8 border border-red-500/20">
                              <p className="text-xs text-white/60 mb-3">
                                Escribe <span className="font-mono text-red-300 font-medium">"{confirmText}"</span> para confirmar:
                              </p>
                              <input
                                value={deleteInput}
                                onChange={(e) => setDeleteInput(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-mono focus:border-red-500/50 focus:outline-none transition-colors mb-3"
                                placeholder={confirmText}
                              />
                              <button
                                disabled={deleteInput !== confirmText}
                                onClick={() => { setDeleteConfirm(null); setDeleteInput(''); handleLogout() }}
                                className="w-full py-2.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-500/30 transition-colors"
                              >
                                Confirmar — {label}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── AI CONFIG ── */}
          {activeSection === 'ai' && (
            <motion.div key="ai" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-5">

              {/* Provider & API key */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[rgb(var(--quantum-500))] to-[rgb(var(--neon-cyan))]">
                    <Key className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-white">Proveedor de IA</h3>
                    <p className="text-xs text-white/40">Tu API key — nunca sale de tu dispositivo</p>
                  </div>
                </div>

                {/* Provider selector */}
                <div className="mb-4">
                  <label className="block text-xs font-mono text-white/30 uppercase tracking-wider mb-2">Proveedor</label>
                  <div className="grid grid-cols-3 gap-2">
                    {AI_PROVIDERS.map(prov => (
                      <motion.button key={prov.id}
                        onClick={() => saveAiConfig({ provider: prov.id, model: prov.models[0]?.id || '', customBaseUrl: '' })}
                        className={cn(
                          'px-3 py-2.5 rounded-xl border text-sm transition-colors',
                          aiConfig.provider === prov.id
                            ? 'border-[rgb(var(--quantum-500))] bg-[rgb(var(--quantum-500)/.15)] text-white'
                            : 'border-white/10 bg-white/3 text-white/50 hover:text-white hover:bg-white/6'
                        )}
                        whileTap={{ scale: 0.97 }}
                      >
                        {prov.name}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* API Key */}
                <div className="mb-4">
                  <label className="block text-xs font-mono text-white/30 uppercase tracking-wider mb-2">API Key</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={aiConfig.apiKey}
                      onChange={(e) => saveAiConfig({ apiKey: e.target.value })}
                      className="w-full pl-10 pr-24 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono focus:border-[rgb(var(--quantum-500))] focus:ring-2 focus:ring-[rgb(var(--quantum-500)/.15)] focus:outline-none transition-all"
                      placeholder={`${currentProvider.name.toLowerCase()}-key-...`}
                    />
                    <button onClick={() => setShowApiKey(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/30 hover:text-white/60 transition-colors px-2 py-1">
                      {showApiKey ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                  <p className="text-xs text-white/25 mt-1.5">
                    La clave se guarda localmente en tu navegador. Nunca la enviamos a nuestros servidores.
                  </p>
                </div>

                {/* Custom base URL */}
                {aiConfig.provider === 'custom' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4 overflow-hidden">
                    <label className="block text-xs font-mono text-white/30 uppercase tracking-wider mb-2">URL base (OpenAI-compatible)</label>
                    <input
                      type="url"
                      value={aiConfig.customBaseUrl}
                      onChange={(e) => saveAiConfig({ customBaseUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[rgb(var(--quantum-500))] focus:outline-none transition-all"
                      placeholder="https://tu-servidor.com/v1"
                    />
                  </motion.div>
                )}

                {/* Model selector */}
                <div className="mb-5">
                  <label className="block text-xs font-mono text-white/30 uppercase tracking-wider mb-2">Modelo</label>
                  {aiConfig.provider === 'custom' ? (
                    <input
                      value={aiConfig.customModel}
                      onChange={(e) => saveAiConfig({ customModel: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[rgb(var(--quantum-500))] focus:outline-none transition-all"
                      placeholder="nombre-del-modelo"
                    />
                  ) : (
                    <div className="grid grid-cols-1 gap-1.5">
                      {currentProvider.models.map(m => (
                        <motion.button key={m.id}
                          onClick={() => saveAiConfig({ model: m.id })}
                          className={cn(
                            'flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm transition-colors text-left',
                            aiConfig.model === m.id
                              ? 'border-[rgb(var(--quantum-500)/.4)] bg-[rgb(var(--quantum-500)/.1)] text-white'
                              : 'border-white/8 bg-white/3 text-white/50 hover:text-white hover:bg-white/5'
                          )}
                          whileTap={{ scale: 0.98 }}
                        >
                          {aiConfig.model === m.id && <Check className="w-3.5 h-3.5 text-[rgb(var(--quantum-400))] flex-shrink-0" />}
                          <span>{m.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Test connection */}
                <motion.button
                  onClick={testConnection}
                  disabled={connStatus === 'testing' || !aiConfig.apiKey}
                  className={cn(
                    'w-full py-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all',
                    connStatus === 'ok'    ? 'border-green-500/40 bg-green-500/10 text-green-400' :
                    connStatus === 'error' ? 'border-red-500/40 bg-red-500/10 text-red-400' :
                    'border-[rgb(var(--quantum-500)/.3)] bg-[rgb(var(--quantum-500)/.1)] text-[rgb(var(--quantum-300))] hover:bg-[rgb(var(--quantum-500)/.2)] disabled:opacity-30 disabled:cursor-not-allowed'
                  )}
                  whileHover={{ scale: connStatus ? 1 : 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {connStatus === 'testing' ? (
                    <><motion.div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full"
                      animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                    Verificando...</>
                  ) : connStatus === 'ok' ? (
                    <><Check className="w-4 h-4" />Conexión exitosa</>
                  ) : connStatus === 'error' ? (
                    <><X className="w-4 h-4" />API key inválida</>
                  ) : (
                    <><Zap className="w-4 h-4" />Verificar conexión</>
                  )}
                </motion.button>
              </div>

              {/* Neural Core toggles */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 rounded-lg bg-[rgb(var(--quantum-500)/.15)]">
                    <Sparkles className="w-4 h-4 text-[rgb(var(--quantum-300))]" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-white">Neural Core</h3>
                    <p className="text-xs text-white/40">Comportamiento del copiloto cognitivo</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {aiSettings.map((s) => (
                    <motion.div key={s.id}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/3 hover:bg-white/5 transition-colors"
                      whileHover={{ x: 2 }}
                    >
                      <div>
                        <div className="text-sm font-medium text-white">{s.label}</div>
                        <div className="text-xs text-white/40 mt-0.5">{s.desc}</div>
                      </div>
                      <Toggle enabled={s.enabled}
                        onChange={() => setAiSettings(prev => prev.map(x => x.id === s.id ? { ...x, enabled: !x.enabled } : x))} />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* AI Level */}
              <div className="glass-card p-6">
                <h4 className="text-sm font-medium text-white mb-4">Nivel de autonomía IA</h4>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Básico',        desc: 'Sugerencias simples' },
                    { label: 'Avanzado',       desc: 'Análisis completo' },
                    { label: 'Experimental',   desc: 'Predicciones + Auto' },
                  ].map((lv, i) => (
                    <motion.button key={lv.label} onClick={() => setAiLevel(i)}
                      className={cn('p-4 rounded-xl border text-center transition-colors',
                        aiLevel === i
                          ? 'bg-[rgb(var(--quantum-500)/.2)] border-[rgb(var(--quantum-500)/.5)] text-white'
                          : 'bg-white/3 border-white/10 text-white/50 hover:text-white hover:bg-white/5'
                      )}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    >
                      <div className="text-sm font-medium">{lv.label}</div>
                      <div className="text-xs text-white/40 mt-1">{lv.desc}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeSection === 'notifications' && (
            <motion.div key="notifications" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-5">

              {/* Channels */}
              <div className="glass-card p-6">
                <h3 className="text-base font-medium text-white mb-4">Canales</h3>
                <div className="space-y-2">
                  {[
                    { key: 'push',  label: 'Notificaciones push',    desc: 'En el navegador o dispositivo', icon: Smartphone },
                    { key: 'email', label: 'Email',                   desc: profile.email,                   icon: Mail },
                    { key: 'inApp', label: 'En la aplicación',        desc: 'Dentro de Quark Tasking',       icon: Monitor },
                  ].map(({ key, label, desc, icon: Icon }) => (
                    <div key={key} className="flex items-center justify-between p-3.5 rounded-xl border border-white/8 bg-white/3">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-white/5">
                          <Icon className="w-3.5 h-3.5 text-white/40" />
                        </div>
                        <div>
                          <div className="text-sm text-white">{label}</div>
                          <div className="text-xs text-white/35">{desc}</div>
                        </div>
                      </div>
                      <Toggle enabled={notifs[key]} onChange={() => toggleChannel(key)} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div className="glass-card p-6">
                <h3 className="text-base font-medium text-white mb-4">Frecuencia</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'instant', label: 'Inmediato',       desc: 'En tiempo real' },
                    { key: 'daily',   label: 'Resumen diario',  desc: 'Una vez al día' },
                    { key: 'weekly',  label: 'Resumen semanal', desc: 'Una vez a la semana' },
                  ].map(({ key, label, desc }) => (
                    <motion.button key={key}
                      onClick={() => setNotifs(p => ({ ...p, frequency: key }))}
                      className={cn('p-3 rounded-xl border text-center transition-colors',
                        notifs.frequency === key
                          ? 'border-[rgb(var(--quantum-500)/.5)] bg-[rgb(var(--quantum-500)/.15)] text-white'
                          : 'border-white/10 bg-white/3 text-white/50 hover:text-white hover:bg-white/5'
                      )}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className="text-sm font-medium">{label}</div>
                      <div className="text-xs text-white/35 mt-0.5">{desc}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              {NOTIF_GROUPS.map(({ key: gKey, label: gLabel, icon: GIcon, items }) => (
                <div key={gKey} className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <GIcon className="w-4 h-4 text-[rgb(var(--quantum-400))]" />
                    <h3 className="text-base font-medium text-white">{gLabel}</h3>
                  </div>
                  <div className="space-y-2">
                    {items.map(({ key: iKey, label: iLabel }) => (
                      <div key={iKey} className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/6 bg-white/2 hover:bg-white/4 transition-colors">
                        <span className="text-sm text-white/70">{iLabel}</span>
                        <Toggle enabled={notifs[gKey]?.[iKey] ?? false} onChange={() => toggleNotif(gKey, iKey)} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* ── SECURITY ── */}
          {activeSection === 'security' && (
            <motion.div key="security" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-5">

              {/* Zero-Knowledge statement */}
              <div className="relative p-6 rounded-2xl overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgb(var(--quantum-500)/.1) 0%, rgb(var(--neon-cyan)/.05) 100%)', border: '1px solid rgb(var(--quantum-500)/.25)' }}>
                <motion.div className="absolute inset-0 rounded-2xl"
                  animate={{ boxShadow: ['inset 0 0 30px rgb(var(--quantum-500)/.05)', 'inset 0 0 60px rgb(var(--quantum-500)/.1)', 'inset 0 0 30px rgb(var(--quantum-500)/.05)'] }}
                  transition={{ duration: 4, repeat: Infinity }} />
                <div className="relative flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[rgb(var(--quantum-500)/.2)] flex-shrink-0">
                    <ShieldCheck className="w-6 h-6 text-[rgb(var(--quantum-300))]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1.5">Tus datos son tuyos</h3>
                    <p className="text-sm text-white/60 leading-relaxed mb-3">
                      Quark Tasking opera bajo filosofía Zero-Knowledge. Tus datos se cifran en tu dispositivo antes de llegar a nuestros servidores. Ni nosotros podemos leerlos. Nunca los vendemos, nunca los compartimos.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { label: 'Cifrado E2E activo', ok: true },
                        { label: 'GDPR compliant',     ok: true },
                        { label: 'Sin venta de datos', ok: true },
                        { label: 'Código auditado',    ok: true },
                      ].map(({ label, ok }) => (
                        <div key={label} className="flex items-center gap-1.5 text-xs text-green-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2FA */}
              <div className="glass-card p-6">
                <h3 className="text-base font-medium text-white mb-4">Autenticación de dos factores</h3>
                <div className="flex items-start justify-between p-4 rounded-xl border border-white/8 bg-white/3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-white/5">
                      <Fingerprint className="w-4 h-4 text-white/50" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Autenticación 2FA</div>
                      <div className="text-xs text-white/40">Capa adicional de seguridad en el login</div>
                    </div>
                  </div>
                  <Toggle enabled={sec.twoFa} onChange={() => toggleSec('twoFa')} />
                </div>
                <AnimatePresence>
                  {sec.twoFa && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { key: 'app', label: 'App autenticadora', desc: 'Google Auth, Authy...' },
                          { key: 'sms', label: 'SMS',               desc: profile.phone || 'Configura tu teléfono primero' },
                        ].map(m => (
                          <motion.button key={m.key}
                            onClick={() => setSec(p => ({ ...p, twoFaMethod: m.key }))}
                            disabled={m.key === 'sms' && !profile.phone}
                            className={cn('p-3 rounded-xl border text-left transition-colors disabled:opacity-30 disabled:cursor-not-allowed',
                              sec.twoFaMethod === m.key
                                ? 'border-[rgb(var(--quantum-500)/.5)] bg-[rgb(var(--quantum-500)/.1)] text-white'
                                : 'border-white/10 bg-white/3 text-white/50 hover:text-white hover:bg-white/5'
                            )}
                          >
                            <div className="text-sm font-medium">{m.label}</div>
                            <div className="text-xs text-white/40 mt-0.5">{m.desc}</div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Active sessions */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium text-white">Sesiones activas</h3>
                  <button onClick={() => setSessions([MOCK_SESSIONS[0]])}
                    className="text-xs text-[rgb(var(--quantum-300))] hover:text-[rgb(var(--quantum-200))] transition-colors">
                    Revocar todas
                  </button>
                </div>
                <div className="space-y-2">
                  {sessions.map(session => (
                    <div key={session.id} className="flex items-center gap-3 p-3.5 rounded-xl border border-white/8 bg-white/3">
                      <div className="p-1.5 rounded-lg bg-white/5 flex-shrink-0">
                        {session.device.includes('iPhone') ? <Smartphone className="w-4 h-4 text-white/40" /> : <Monitor className="w-4 h-4 text-white/40" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white truncate">{session.device}</span>
                          {session.current && (
                            <span className="text-xs text-green-400 font-mono bg-green-400/10 px-1.5 py-0.5 rounded-md flex-shrink-0">ACTUAL</span>
                          )}
                        </div>
                        <div className="text-xs text-white/35">{session.location} · {session.time}</div>
                      </div>
                      {!session.current && (
                        <button onClick={() => revokeSession(session.id)}
                          className="flex-shrink-0 p-1.5 rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy controls */}
              <div className="glass-card p-6">
                <h3 className="text-base font-medium text-white mb-4">Controles de privacidad</h3>
                <div className="space-y-2">
                  {[
                    { key: 'telemetry',   label: 'Telemetría anónima',       desc: 'Métricas de uso sin identificadores personales (opt-in)' },
                    { key: 'aiLearning',  label: 'IA aprende de mis datos',   desc: 'Mejora las sugerencias usando tu historial local' },
                    { key: 'syncEnabled', label: 'Sincronización en la nube', desc: 'Datos cifrados E2E antes de subir' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-start justify-between p-4 rounded-xl border border-white/8 bg-white/3">
                      <div className="flex-1 mr-4">
                        <div className="text-sm font-medium text-white">{label}</div>
                        <div className="text-xs text-white/40 mt-0.5 leading-relaxed">{desc}</div>
                      </div>
                      <Toggle enabled={sec[key]} onChange={() => toggleSec(key)} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Data rights */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-4 h-4 text-[rgb(var(--quantum-400))]" />
                  <h3 className="text-base font-medium text-white">Mis derechos (GDPR)</h3>
                </div>
                <div className="space-y-2">
                  <motion.button
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-white/8 bg-white/3 hover:bg-white/6 text-white/70 hover:text-white transition-colors text-sm"
                    whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}
                  >
                    <Download className="w-4 h-4 text-white/40" />
                    <div className="text-left">
                      <div className="text-sm text-white">Exportar todos mis datos</div>
                      <div className="text-xs text-white/35">JSON completo: tareas, rutinas, configuración</div>
                    </div>
                    <ChevronRight className="w-4 h-4 ml-auto text-white/20" />
                  </motion.button>
                  <motion.button
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-white/8 bg-white/3 hover:bg-red-500/8 hover:border-red-500/20 text-white/70 hover:text-red-300 transition-colors text-sm"
                    whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}
                    onClick={() => { setActiveSection('profile'); setTimeout(() => setDeleteConfirm('account'), 300) }}
                  >
                    <Trash2 className="w-4 h-4 text-white/40" />
                    <div className="text-left">
                      <div className="text-sm">Derecho al olvido</div>
                      <div className="text-xs text-white/35">Solicitar borrado completo e irreversible</div>
                    </div>
                    <ChevronRight className="w-4 h-4 ml-auto text-white/20" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── INTEGRATIONS ── */}
          {activeSection === 'integrations' && (
            <motion.div key="integrations" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <SettingsIntegrations />
            </motion.div>
          )}

          {/* ── DATA ── */}
          {activeSection === 'data' && (
            <motion.div key="data" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <SettingsData />
            </motion.div>
          )}

          {/* ── HELP ── */}
          {activeSection === 'help' && (
            <motion.div key="help" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <SettingsHelp />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  )
}
