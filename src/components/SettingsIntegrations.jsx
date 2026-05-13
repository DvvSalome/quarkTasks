import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, Key, Webhook, Globe, Link, Check, X, Copy, Eye, EyeOff,
  RefreshCw, Plus, Trash2, AlertTriangle, Plug, Wifi, WifiOff,
  ChevronRight, Cpu, Server, ExternalLink, Loader2,
} from 'lucide-react'
import { cn } from '../lib/utils'

function Toast({ message, type, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(
        'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-2xl backdrop-blur-xl',
        type === 'success' && 'bg-green-500/15 border-green-500/30 text-green-400',
        type === 'error' && 'bg-red-500/15 border-red-500/30 text-red-400',
        type === 'info' && 'bg-[rgb(var(--quantum-500)/.15)] border-[rgb(var(--quantum-500)/.3)] text-[rgb(var(--quantum-300))]'
      )}
    >
      {type === 'success' && <Check className="w-4 h-4" />}
      {type === 'error' && <AlertTriangle className="w-4 h-4" />}
      {type === 'info' && <Zap className="w-4 h-4" />}
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 p-0.5 rounded hover:bg-white/10 transition-colors">
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  )
}

function ApiKeyCard({ apiKey, index, onReveal, onCopy, onRegenerate, onDelete, revealed }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center gap-4 p-4 rounded-xl border border-white/8 bg-white/3 hover:bg-white/5 transition-all group"
    >
      <div className="p-2 rounded-lg bg-[rgb(var(--quantum-500)/.1)]">
        <Key className="w-4 h-4 text-[rgb(var(--quantum-300))]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-white">{apiKey.name}</span>
          {apiKey.status === 'active' ? (
            <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded-md">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Activa
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-white/30 bg-white/5 px-1.5 py-0.5 rounded-md">
              <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
              Inactiva
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <code className="text-xs font-mono text-white/40 truncate max-w-[200px]">
            {revealed ? apiKey.key : `${apiKey.key.slice(0, 8)}${'•'.repeat(24)}`}
          </code>
          <span className="text-xs text-white/25">Creada {apiKey.created}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onReveal(index)}
          className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors">
          {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
        <button onClick={() => onCopy(index)}
          className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors">
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onRegenerate(index)}
          className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(index)}
          className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  )
}

function IntegrationCard({ integration, connected, onToggle, onTest }) {
  const Icon = integration.icon
  return (
    <motion.div
      className={cn(
        'p-4 rounded-xl border transition-all',
        connected
          ? 'border-green-500/25 bg-green-500/5'
          : 'border-white/8 bg-white/3 hover:bg-white/5'
      )}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2 rounded-lg',
            connected ? 'bg-green-500/15' : 'bg-white/5'
          )}>
            <Icon className={cn('w-4 h-4', connected ? 'text-green-400' : 'text-white/40')} />
          </div>
          <div>
            <div className="text-sm font-medium text-white">{integration.name}</div>
            <div className="text-xs text-white/40">{integration.desc}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {connected && (
            <motion.button
              onClick={() => onTest(integration.id)}
              className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </motion.button>
          )}
          <button
            onClick={() => onToggle(integration.id)}
            className={cn(
              'relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0',
              connected ? 'bg-green-500' : 'bg-white/10'
            )}
          >
            <motion.div
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md"
              animate={{ left: connected ? '22px' : '2px' }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          </button>
        </div>
      </div>
      {connected && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/5 border border-green-500/10">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-xs text-green-400/80">Conectado</span>
        </div>
      )}
    </motion.div>
  )
}

function WebhookRow({ webhook, onCopy, onTest, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 p-4 rounded-xl border border-white/8 bg-white/3 hover:bg-white/5 transition-all group"
    >
      <div className="p-2 rounded-lg bg-[rgb(var(--neon-cyan)/.1)]">
        <Webhook className="w-4 h-4 text-[rgb(var(--neon-cyan))]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-medium text-white">{webhook.name}</span>
          <span className={cn(
            'text-xs font-mono px-1.5 py-0.5 rounded',
            webhook.status === 'active' ? 'bg-green-400/10 text-green-400' : 'bg-white/5 text-white/30'
          )}>
            {webhook.status}
          </span>
        </div>
        <code className="text-xs font-mono text-white/30 truncate block">{webhook.url}</code>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-white/25">Último envío: {webhook.lastCall}</span>
          <span className={cn(
            'text-xs font-mono',
            webhook.failCount > 0 ? 'text-red-400' : 'text-white/25'
          )}>
            {webhook.failCount > 0 ? `${webhook.failCount} fallos` : 'Sin errores'}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onCopy(webhook.id)}
          className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors">
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onTest(webhook.id)}
          className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors">
          <Zap className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(webhook.id)}
          className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  )
}

const INTEGRATIONS_LIST = [
  { id: 'slack', name: 'Slack', desc: 'Notificaciones y comandos', icon: Zap },
  { id: 'github', name: 'GitHub', desc: 'Sincronización de issues', icon: Cpu },
  { id: 'notion', name: 'Notion', desc: 'Base de conocimiento', icon: ExternalLink },
  { id: 'google-calendar', name: 'Google Calendar', desc: 'Eventos y reuniones', icon: Globe },
  { id: 'jira', name: 'Jira', desc: 'Seguimiento de proyectos', icon: Server },
  { id: 'asana', name: 'Asana', desc: 'Gestión de tareas', icon: Link },
]

const MOCK_WEBHOOKS = [
  { id: 'wh1', name: 'Task Created', url: 'https://hooks.quark.app/tasks/created', status: 'active', lastCall: 'Hace 5 min', failCount: 0 },
  { id: 'wh2', name: 'Focus Session', url: 'https://hooks.quark.app/focus/complete', status: 'active', lastCall: 'Hace 1h', failCount: 2 },
  { id: 'wh3', name: 'Daily Report', url: 'https://hooks.quark.app/reports/daily', status: 'inactive', lastCall: 'Ayer', failCount: 0 },
]

const MOCK_API_KEYS = [
  { id: 'ak1', name: 'Producción', key: 'qk_live_8xJ2mK4pR7vN9qL3', status: 'active', created: '12/01/2026' },
  { id: 'ak2', name: 'Desarrollo', key: 'qk_test_3fH6sD8gK1jW5mB9', status: 'active', created: '15/12/2025' },
  { id: 'ak3', name: 'Staging', key: 'qk_stag_7vN2cX5bL9pQ4rA8', status: 'inactive', created: '20/11/2025' },
]

function generateApiKey(name) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const prefix = name.toLowerCase().includes('prod') ? 'qk_live_' : name.toLowerCase().includes('test') ? 'qk_test_' : 'qk_dev_'
  let key = prefix
  for (let i = 0; i < 16; i++) key += chars[Math.floor(Math.random() * chars.length)]
  return key
}

export default function SettingsIntegrations() {
  const [activeTab, setActiveTab] = useState('api-keys')
  const [apiKeys, setApiKeys] = useState(MOCK_API_KEYS)
  const [revealedKeys, setRevealedKeys] = useState({})
  const [webhooks, setWebhooks] = useState(MOCK_WEBHOOKS)
  const [integrations, setIntegrations] = useState(INTEGRATIONS_LIST.map(i => ({ ...i, connected: false })))
  const [toasts, setToasts] = useState([])
  const [testingWebhook, setTestingWebhook] = useState(null)
  const [showNewKeyForm, setShowNewKeyForm] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [showNewWebhookForm, setShowNewWebhookForm] = useState(false)
  const [newWebhook, setNewWebhook] = useState({ name: '', url: '' })

  const addToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text)
    addToast('Copiado al portapapeles', 'success')
  }

  const handleRevealKey = (index) => {
    setRevealedKeys(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const handleCopyKey = (index) => {
    handleCopy(apiKeys[index].key)
  }

  const handleRegenerateKey = (index) => {
    const key = apiKeys[index]
    const newKey = { ...key, key: generateApiKey(key.name) }
    const newKeys = [...apiKeys]
    newKeys[index] = newKey
    setApiKeys(newKeys)
    addToast('API key regenerada', 'success')
  }

  const handleDeleteKey = (index) => {
    setApiKeys(prev => prev.filter((_, i) => i !== index))
    addToast('API key eliminada', 'info')
  }

  const handleAddKey = () => {
    if (!newKeyName.trim()) return
    const newKey = {
      id: `ak${Date.now()}`,
      name: newKeyName,
      key: generateApiKey(newKeyName),
      status: 'active',
      created: new Date().toLocaleDateString('es-ES'),
    }
    setApiKeys(prev => [...prev, newKey])
    setNewKeyName('')
    setShowNewKeyForm(false)
    addToast(`API key "${newKeyName}" creada`, 'success')
  }

  const handleToggleIntegration = (id) => {
    setIntegrations(prev => prev.map(i =>
      i.id === id ? { ...i, connected: !i.connected } : i
    ))
    const int = integrations.find(i => i.id === id)
    if (int) {
      addToast(
        int.connected ? `"${int.name}" desconectada` : `"${int.name}" conectada`,
        int.connected ? 'info' : 'success'
      )
    }
  }

  const handleTestIntegration = (id) => {
    addToast(`Probando conexión con ${integrations.find(i => i.id === id)?.name}...`, 'info')
    setTimeout(() => addToast('Conexión exitosa', 'success'), 1500)
  }

  const handleTestWebhook = async (id) => {
    setTestingWebhook(id)
    await new Promise(r => setTimeout(r, 1200))
    setTestingWebhook(null)
    addToast('Webhook enviado correctamente', 'success')
  }

  const handleCopyWebhook = (id) => {
    const wh = webhooks.find(w => w.id === id)
    if (wh) handleCopy(wh.url)
  }

  const handleDeleteWebhook = (id) => {
    setWebhooks(prev => prev.filter(w => w.id !== id))
    addToast('Webhook eliminado', 'info')
  }

  const handleAddWebhook = () => {
    if (!newWebhook.name.trim() || !newWebhook.url.trim()) return
    const wh = {
      id: `wh${Date.now()}`,
      name: newWebhook.name,
      url: newWebhook.url,
      status: 'active',
      lastCall: 'Nunca',
      failCount: 0,
    }
    setWebhooks(prev => [...prev, wh])
    setNewWebhook({ name: '', url: '' })
    setShowNewWebhookForm(false)
    addToast(`Webhook "${newWebhook.name}" creado`, 'success')
  }

  const tabs = [
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook },
    { id: 'integrations', label: 'Integraciones', icon: Plug },
    { id: 'connection', label: 'Estado', icon: Wifi },
  ]

  return (
    <div className="space-y-5">
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))} />
      ))}

      {/* Tab Navigation */}
      <div className="flex gap-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <motion.button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all',
              activeTab === id
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
        {/* ── API KEYS ── */}
        {activeTab === 'api-keys' && (
          <motion.div key="api-keys" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-medium text-white">API Keys</h3>
                  <p className="text-xs text-white/40 mt-0.5">Gestiona tus claves de API para acceder a Quark Tasking</p>
                </div>
                <motion.button
                  onClick={() => setShowNewKeyForm(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgb(var(--quantum-500))] text-white text-sm font-medium hover:bg-[rgb(var(--quantum-400))] transition-colors"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                >
                  <Plus className="w-4 h-4" />
                  Nueva key
                </motion.button>
              </div>

              <AnimatePresence>
                {showNewKeyForm && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4">
                    <div className="p-4 rounded-xl border border-[rgb(var(--quantum-500)/.3)] bg-[rgb(var(--quantum-500)/.07)] space-y-3">
                      <label className="block text-xs font-mono text-white/30 uppercase tracking-wider">Nombre de la key</label>
                      <input
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddKey()}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[rgb(var(--quantum-500))] focus:outline-none transition-all"
                        placeholder="Ej: Producción, Desarrollo..."
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button onClick={() => { setShowNewKeyForm(false); setNewKeyName('') }}
                          className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm hover:text-white hover:bg-white/5 transition-colors">
                          Cancelar
                        </button>
                        <button onClick={handleAddKey} disabled={!newKeyName.trim()}
                          className="flex-1 py-2.5 rounded-xl bg-[rgb(var(--quantum-500))] text-white text-sm font-medium disabled:opacity-40 hover:bg-[rgb(var(--quantum-400))] transition-colors">
                          Crear key
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <AnimatePresence>
                  {apiKeys.map((key, i) => (
                    <ApiKeyCard
                      key={key.id}
                      apiKey={key}
                      index={i}
                      revealed={revealedKeys[i]}
                      onReveal={handleRevealKey}
                      onCopy={handleCopyKey}
                      onRegenerate={handleRegenerateKey}
                      onDelete={handleDeleteKey}
                    />
                  ))}
                </AnimatePresence>
                {apiKeys.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                    <Key className="w-10 h-10 text-white/15 mx-auto mb-3" />
                    <p className="text-sm text-white/40">No hay API keys. Crea una para empezar.</p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── WEBHOOKS ── */}
        {activeTab === 'webhooks' && (
          <motion.div key="webhooks" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-medium text-white">Webhooks</h3>
                  <p className="text-xs text-white/40 mt-0.5">Recibe eventos en tiempo real de Quark Tasking</p>
                </div>
                <motion.button
                  onClick={() => setShowNewWebhookForm(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgb(var(--quantum-500))] text-white text-sm font-medium hover:bg-[rgb(var(--quantum-400))] transition-colors"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                >
                  <Plus className="w-4 h-4" />
                  Nuevo webhook
                </motion.button>
              </div>

              <AnimatePresence>
                {showNewWebhookForm && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4">
                    <div className="p-4 rounded-xl border border-[rgb(var(--quantum-500)/.3)] bg-[rgb(var(--quantum-500)/.07)] space-y-3">
                      <div>
                        <label className="block text-xs font-mono text-white/30 uppercase tracking-wider mb-1.5">Nombre</label>
                        <input value={newWebhook.name} onChange={(e) => setNewWebhook(p => ({ ...p, name: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[rgb(var(--quantum-500))] focus:outline-none transition-all"
                          placeholder="Ej: Task Created" autoFocus />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-white/30 uppercase tracking-wider mb-1.5">URL del endpoint</label>
                        <input value={newWebhook.url} onChange={(e) => setNewWebhook(p => ({ ...p, url: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[rgb(var(--quantum-500))] focus:outline-none transition-all"
                          placeholder="https://tu-servidor.com/webhook" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setShowNewWebhookForm(false); setNewWebhook({ name: '', url: '' }) }}
                          className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm hover:text-white hover:bg-white/5 transition-colors">
                          Cancelar
                        </button>
                        <button onClick={handleAddWebhook} disabled={!newWebhook.name.trim() || !newWebhook.url.trim()}
                          className="flex-1 py-2.5 rounded-xl bg-[rgb(var(--quantum-500))] text-white text-sm font-medium disabled:opacity-40 hover:bg-[rgb(var(--quantum-400))] transition-colors">
                          Crear webhook
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <AnimatePresence>
                  {webhooks.map(wh => (
                    <WebhookRow
                      key={wh.id}
                      webhook={wh}
                      onCopy={handleCopyWebhook}
                      onTest={handleTestWebhook}
                      onDelete={handleDeleteWebhook}
                    />
                  ))}
                </AnimatePresence>
                {webhooks.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                    <Webhook className="w-10 h-10 text-white/15 mx-auto mb-3" />
                    <p className="text-sm text-white/40">No hay webhooks configurados.</p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── INTEGRATIONS ── */}
        {activeTab === 'integrations' && (
          <motion.div key="integrations" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-[rgb(var(--quantum-500)/.15)]">
                  <Plug className="w-4 h-4 text-[rgb(var(--quantum-300))]" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-white">Integraciones externas</h3>
                  <p className="text-xs text-white/40">Conecta tus herramientas favoritas</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {integrations.map(int => (
                  <IntegrationCard
                    key={int.id}
                    integration={int}
                    connected={int.connected}
                    onToggle={handleToggleIntegration}
                    onTest={handleTestIntegration}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── CONNECTION STATUS ── */}
        {activeTab === 'connection' && (
          <motion.div key="connection" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-green-500/15">
                  <Wifi className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-white">Estado de conexión</h3>
                  <p className="text-xs text-white/40">Monitorea el estado de tus servicios conectados</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'API Quark Tasking', status: 'online', latency: '12ms', uptime: '99.9%' },
                  { name: 'Proveedor IA', status: apiKeys.some(k => k.status === 'active') ? 'online' : 'offline', latency: '45ms', uptime: '98.5%' },
                  { name: 'Webhooks activos', status: webhooks.filter(w => w.status === 'active').length > 0 ? 'online' : 'offline', latency: '—', uptime: '—' },
                ].map((svc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-white/8 bg-white/3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-2.5 h-2.5 rounded-full',
                        svc.status === 'online' ? 'bg-green-400' : 'bg-white/20'
                      )} />
                      <div>
                        <div className="text-sm text-white">{svc.name}</div>
                        {svc.status === 'online' && (
                          <div className="text-xs text-white/30 font-mono">{svc.latency} · {svc.uptime} uptime</div>
                        )}
                      </div>
                    </div>
                    <span className={cn(
                      'text-xs font-mono px-2 py-1 rounded',
                      svc.status === 'online' ? 'bg-green-400/10 text-green-400' : 'bg-white/5 text-white/30'
                    )}>
                      {svc.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
