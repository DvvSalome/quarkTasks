import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Filter, MoreVertical, CheckCircle2, Circle, Clock,
  Flag, ChevronDown, Zap, Lightbulb, Target, X, Sparkles,
} from 'lucide-react'
import { cn } from '../lib/utils'

const columns = [
  { id: 'backlog', label: 'Backlog', color: 'bg-white/20' },
  { id: 'todo', label: 'Por hacer', color: 'bg-[rgb(var(--quantum-400))]' },
  { id: 'inprogress', label: 'En progreso', color: 'bg-[rgb(var(--neon-cyan))]' },
  { id: 'done', label: 'Completado', color: 'bg-green-400' },
]

const initialTasks = [
  { id: 1, title: 'Diseñar nueva interfaz de usuario', column: 'inprogress', priority: 'high', tags: ['Design', 'UI/UX'], assignee: 'U', due: 'Hoy', aiSuggestion: true },
  { id: 2, title: 'Implementar autenticación con OAuth', column: 'todo', priority: 'high', tags: ['Backend', 'Security'], assignee: 'U', due: 'Mañana', aiSuggestion: false },
  { id: 3, title: 'Review de código del módulo de pagos', column: 'todo', priority: 'medium', tags: ['Code Review'], assignee: 'U', due: 'Jue 15', aiSuggestion: true },
  { id: 4, title: 'Documentar API endpoints', column: 'backlog', priority: 'low', tags: ['Docs'], assignee: 'U', due: 'Vie 16', aiSuggestion: false },
  { id: 5, title: 'Optimizar queries de base de datos', column: 'inprogress', priority: 'high', tags: ['Performance', 'DB'], assignee: 'U', due: 'Hoy', aiSuggestion: false },
  { id: 6, title: 'Configurar CI/CD pipeline', column: 'done', priority: 'medium', tags: ['DevOps'], assignee: 'U', due: 'Lun 12', aiSuggestion: false },
]

const priorityColors = {
  high: 'text-[rgb(var(--neon-pink))]',
  medium: 'text-amber-400',
  low: 'text-[rgb(var(--neon-cyan))]',
}

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks)
  const [activeColumn, setActiveColumn] = useState('inprogress')
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewTask, setShowNewTask] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium' })
  const [draggedTask, setDraggedTask] = useState(null)

  const handleAddTask = () => {
    if (!newTask.title.trim()) return
    const task = {
      id: Date.now(),
      title: newTask.title,
      column: 'backlog',
      priority: newTask.priority,
      tags: [],
      assignee: 'U',
      due: new Date().toLocaleDateString('es-ES', { day: 'short', month: 'short' }),
      aiSuggestion: false,
    }
    setTasks(prev => [...prev, task])
    setNewTask({ title: '', priority: 'medium' })
    setShowNewTask(false)
  }

  const moveTask = (taskId, targetColumn) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, column: targetColumn } : t))
  }

  const filteredTasks = tasks.filter(t =>
    !searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-1">
            Tareas <span className="text-gradient">Inteligentes</span>
          </h2>
          <p className="text-sm text-white/50">Gestión de tareas con IA integrada</p>
        </div>
        <motion.button onClick={() => setShowNewTask(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[rgb(var(--quantum-500))] to-[rgb(var(--quantum-400))] text-white font-medium"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Plus className="w-4 h-4" />
          Nueva tarea
        </motion.button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input type="text" placeholder="Buscar tareas..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[rgb(var(--quantum-500))] focus:outline-none transition-colors" />
        </div>
        <motion.button onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          whileHover={{ scale: 1.02 }}>
          <Filter className="w-4 h-4" />
          Filtros
        </motion.button>
      </div>

      <AnimatePresence>
        {showNewTask && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="glass-card p-5 mb-4">
            <div className="flex gap-3 mb-3">
              <input value={newTask.title} onChange={(e) => setNewTask(p => ({ ...p, title: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                placeholder="¿Qué tarea necesitas crear?" className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[rgb(var(--quantum-500))] focus:outline-none transition-all text-sm" autoFocus />
              <select value={newTask.priority} onChange={(e) => setNewTask(p => ({ ...p, priority: e.target.value }))}
                className="px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[rgb(var(--quantum-500))] focus:outline-none transition-all">
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setShowNewTask(false); setNewTask({ title: '', priority: 'medium' }) }}
                className="px-4 py-2 rounded-lg border border-white/10 text-white/50 text-sm hover:bg-white/5 transition-colors">Cancelar</button>
              <button onClick={handleAddTask} disabled={!newTask.title.trim()}
                className="px-5 py-2 rounded-lg bg-[rgb(var(--quantum-500))] text-white text-sm font-medium disabled:opacity-40 hover:bg-[rgb(var(--quantum-400))] transition-colors">Crear tarea</button>
              <motion.button onClick={() => setNewTask(p => ({ ...p, title: `[IA] ${p.title}` }))}
                className="px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm hover:bg-amber-500/20 transition-colors flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />Con IA
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-4 gap-4 h-full">
          {columns.map((column) => {
            const columnTasks = filteredTasks.filter(t => t.column === column.id)
            const isActive = activeColumn === column.id

            return (
              <motion.div key={column.id} onMouseEnter={() => setActiveColumn(column.id)}
                onDragOver={(e) => { e.preventDefault(); setActiveColumn(column.id) }}
                onDrop={() => { if (draggedTask) { moveTask(draggedTask, column.id); setDraggedTask(null) } }}
                className={cn('flex flex-col rounded-xl border transition-all duration-300',
                  isActive ? 'bg-white/5 border-[rgb(var(--quantum-500)/.3)]' : 'bg-white/0 border-white/5'
                )} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center gap-3 p-4 border-b border-white/5">
                  <div className={cn('w-3 h-3 rounded-full', column.color)} />
                  <span className="text-sm font-medium text-white">{column.label}</span>
                  <span className="ml-auto text-xs font-mono text-white/40">{columnTasks.length}</span>
                </div>
                <div className="flex-1 p-3 space-y-3 overflow-auto">
                  <AnimatePresence>
                    {columnTasks.map((task, i) => (
                      <motion.div key={task.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}
                        draggable onDragStart={() => setDraggedTask(task.id)}
                        className="group p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[rgb(var(--quantum-500)/.3)] cursor-grab active:cursor-grabbing transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {task.aiSuggestion && (
                              <motion.div className="p-1 rounded bg-amber-500/20"
                                animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                                <Lightbulb className="w-3 h-3 text-amber-400" />
                              </motion.div>
                            )}
                            <Flag className={cn('w-3.5 h-3.5', priorityColors[task.priority])} />
                          </div>
                           <motion.button
                             className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-opacity"
                             whileHover={{ scale: 1.02 }}
                             whileTap={{ scale: 0.98 }}
                             onClick={() => {
                               window.dispatchEvent(new CustomEvent('toast', { detail: 'Más opciones para esta tarea' }))
                             }}
                           >
                             <MoreVertical className="w-4 h-4 text-white/40" />
                           </motion.button>
                        </div>
                        <h4 className="text-sm text-white mb-3">{task.title}</h4>
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          {task.tags.map((tag, j) => (
                            <span key={j} className="px-2 py-0.5 rounded text-xs bg-white/10 text-white/60">{tag}</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[rgb(var(--quantum-500))] to-[rgb(var(--neon-cyan))] flex items-center justify-center text-xs text-white">
                              {task.assignee}
                            </div>
                            <Clock className="w-3.5 h-3.5 text-white/40" />
                            <span className="text-xs text-white/40 font-mono">{task.due}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <motion.button onClick={() => { setShowNewTask(true); setNewTask(p => ({ ...p, title: '' })) }}
                    className="w-full p-3 rounded-lg border border-dashed border-white/10 text-white/40 text-sm hover:text-white/70 hover:border-white/20 transition-colors flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.01 }}>
                    <Plus className="w-4 h-4" />
                    Añadir tarea
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
