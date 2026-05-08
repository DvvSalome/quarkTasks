import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle2,
  Circle,
  Clock,
  Flag,
  ChevronDown,
  Zap,
  Lightbulb,
  Target
} from 'lucide-react'
import { cn } from '../lib/utils'

const columns = [
  { id: 'backlog', label: 'Backlog', color: 'bg-white/20' },
  { id: 'todo', label: 'Por hacer', color: 'bg-quantum-400' },
  { id: 'inprogress', label: 'En progreso', color: 'bg-neon-cyan' },
  { id: 'done', label: 'Completado', color: 'bg-green-400' },
]

const tasks = [
  { 
    id: 1, 
    title: 'Diseñar nueva interfaz de usuario', 
    column: 'inprogress',
    priority: 'high',
    tags: ['Design', 'UI/UX'],
    assignee: 'U',
    due: 'Hoy',
    aiSuggestion: true
  },
  { 
    id: 2, 
    title: 'Implementar autenticación con OAuth', 
    column: 'todo',
    priority: 'high',
    tags: ['Backend', 'Security'],
    assignee: 'U',
    due: 'Mañana',
    aiSuggestion: false
  },
  { 
    id: 3, 
    title: 'Review de código del módulo de pagos', 
    column: 'todo',
    priority: 'medium',
    tags: ['Code Review'],
    assignee: 'U',
    due: 'Jue 15',
    aiSuggestion: true
  },
  { 
    id: 4, 
    title: 'Documentar API endpoints', 
    column: 'backlog',
    priority: 'low',
    tags: ['Docs'],
    assignee: 'U',
    due: 'Vie 16',
    aiSuggestion: false
  },
  { 
    id: 5, 
    title: 'Optimizar queries de base de datos', 
    column: 'inprogress',
    priority: 'high',
    tags: ['Performance', 'DB'],
    assignee: 'U',
    due: 'Hoy',
    aiSuggestion: false
  },
  { 
    id: 6, 
    title: 'Configurar CI/CD pipeline', 
    column: 'done',
    priority: 'medium',
    tags: ['DevOps'],
    assignee: 'U',
    due: 'Lun 12',
    aiSuggestion: false
  },
]

const priorityColors = {
  high: 'text-neon-pink',
  medium: 'text-amber-400',
  low: 'text-neon-cyan'
}

export default function Tasks() {
  const [activeColumn, setActiveColumn] = useState('inprogress')
  const [searchTerm, setSearchTerm] = useState('')
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-1">
            Tareas <span className="text-gradient">Inteligentes</span>
          </h2>
          <p className="text-sm text-white/50">Gestión de tareas con IA integrada</p>
        </div>
        <motion.button
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-quantum-500 to-quantum-400 text-white font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          Nueva tarea
        </motion.button>
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-quantum-500 focus:outline-none transition-colors"
          />
        </div>
        <motion.button
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          whileHover={{ scale: 1.02 }}
        >
          <Filter className="w-4 h-4" />
          Filtros
        </motion.button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-4 gap-4 h-full">
          {columns.map((column) => {
            const columnTasks = tasks.filter(t => t.column === column.id)
            const isActive = activeColumn === column.id
            
            return (
              <motion.div
                key={column.id}
                className={cn(
                  'flex flex-col rounded-xl border transition-all duration-300',
                  isActive 
                    ? 'bg-white/5 border-quantum-500/30' 
                    : 'bg-white/0 border-white/5'
                )}
                onMouseEnter={() => setActiveColumn(column.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 p-4 border-b border-white/5">
                  <div className={cn('w-3 h-3 rounded-full', column.color)} />
                  <span className="text-sm font-medium text-white">{column.label}</span>
                  <span className="ml-auto text-xs font-mono text-white/40">{columnTasks.length}</span>
                </div>
                
                <div className="flex-1 p-3 space-y-3 overflow-auto">
                  {columnTasks.map((task, i) => (
                    <motion.div
                      key={task.id}
                      className="group p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-quantum-500/30 cursor-pointer transition-all"
                      whileHover={{ scale: 1.02, y: -2 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {task.aiSuggestion && (
                            <motion.div
                              className="p-1 rounded bg-amber-500/20"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Lightbulb className="w-3 h-3 text-amber-400" />
                            </motion.div>
                          )}
                          <Flag className={cn('w-3.5 h-3.5', priorityColors[task.priority])} />
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-opacity">
                          <MoreVertical className="w-4 h-4 text-white/40" />
                        </button>
                      </div>
                      
                      <h4 className="text-sm text-white mb-3">{task.title}</h4>
                      
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        {task.tags.map((tag, j) => (
                          <span key={j} className="px-2 py-0.5 rounded text-xs bg-white/10 text-white/60">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-quantum-500 to-neon-cyan flex items-center justify-center text-xs text-white">
                            {task.assignee}
                          </div>
                          <Clock className="w-3.5 h-3.5 text-white/40" />
                          <span className="text-xs text-white/40 font-mono">{task.due}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  <motion.button
                    className="w-full p-3 rounded-lg border border-dashed border-white/10 text-white/40 text-sm hover:text-white/70 hover:border-white/20 transition-colors flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.01 }}
                  >
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