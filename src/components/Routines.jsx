import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Plus, 
  Clock, 
  Repeat, 
  Zap,
  TrendingUp,
  Play,
  CheckCircle2,
  MoreVertical,
  GripVertical,
  BarChart3
} from 'lucide-react'
import { cn } from '../lib/utils'

const routineDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const routines = [
  {
    id: 1,
    name: 'Morning Flow',
    time: '08:00 - 09:30',
    color: 'from-amber-400 to-orange-500',
    days: [true, true, true, true, true, false, false],
    tasks: [
      { name: 'Meditación', duration: '10 min', done: true },
      { name: 'Ejercicio', duration: '30 min', done: true },
      { name: 'Review diario', duration: '15 min', done: false },
      { name: 'Planificación', duration: '20 min', done: false },
    ],
    streak: 12,
    completion: 94
  },
  {
    id: 2,
    name: 'Deep Work Block',
    time: '09:30 - 12:00',
    color: 'from-quantum-500 to-neon-cyan',
    days: [true, true, true, true, true, false, false],
    tasks: [
      { name: 'Bloque de trabajo profundo', duration: '2.5h', done: false },
    ],
    streak: 8,
    completion: 87
  },
  {
    id: 3,
    name: 'Evening Review',
    time: '18:00 - 18:30',
    color: 'from-neon-pink to-purple-500',
    days: [true, true, true, true, true, false, false],
    tasks: [
      { name: 'Review de logros', duration: '10 min', done: false },
      { name: 'Planificación siguiente día', duration: '15 min', done: false },
    ],
    streak: 15,
    completion: 96
  }
]

const weeklyProgress = [
  { day: 'Lun', completed: 85, target: 80 },
  { day: 'Mar', completed: 92, target: 80 },
  { day: 'Mié', completed: 78, target: 80 },
  { day: 'Jue', completed: 95, target: 80 },
  { day: 'Vie', completed: 88, target: 80 },
]

export default function Routines() {
  const [activeDay, setActiveDay] = useState(0)
  const [showNewRoutine, setShowNewRoutine] = useState(false)
  const [newRoutine, setNewRoutine] = useState({ name: '', time: '', tasks: '' })
  const [routinesList, setRoutinesList] = useState(routines)

  const handleAddRoutine = () => {
    if (!newRoutine.name.trim()) return
    const routine = {
      id: Date.now(),
      name: newRoutine.name,
      time: newRoutine.time || '09:00 - 10:00',
      color: 'from-[rgb(var(--quantum-500))] to-[rgb(var(--neon-cyan))]',
      days: [true, true, true, true, true, false, false],
      tasks: newRoutine.tasks.split(',').filter(Boolean).map((t, i) => ({
        name: t.trim(),
        duration: '15 min',
        done: false,
      })),
      streak: 0,
      completion: 0,
    }
    setRoutinesList(prev => [...prev, routine])
    setNewRoutine({ name: '', time: '', tasks: '' })
    setShowNewRoutine(false)
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex gap-6"
    >
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-1">
              Rutinas <span className="text-gradient">Inteligentes</span>
            </h2>
            <p className="text-sm text-white/50">Automatiza tus hábitos con IA</p>
          </div>
          <motion.button
            onClick={() => setShowNewRoutine(!showNewRoutine)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[rgb(var(--quantum-500)/.2)] border border-[rgb(var(--quantum-500)/.3)] text-[rgb(var(--quantum-200))] hover:bg-[rgb(var(--quantum-500)/.3)] transition-colors"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            Nueva rutina
          </motion.button>
        </div>
        
        <AnimatePresence>
          {showNewRoutine && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="glass-card p-5">
              <h3 className="text-base font-medium text-white mb-4">Crear nueva rutina</h3>
              <div className="space-y-3">
                <input value={newRoutine.name} onChange={(e) => setNewRoutine(p => ({ ...p, name: e.target.value }))}
                  placeholder="Nombre de la rutina" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[rgb(var(--quantum-500))] focus:outline-none transition-all text-sm" autoFocus />
                <input value={newRoutine.time} onChange={(e) => setNewRoutine(p => ({ ...p, time: e.target.value }))}
                  placeholder="Horario (ej: 09:00 - 10:00)" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[rgb(var(--quantum-500))] focus:outline-none transition-all text-sm" />
                <input value={newRoutine.tasks} onChange={(e) => setNewRoutine(p => ({ ...p, tasks: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddRoutine()}
                  placeholder="Tareas separadas por coma" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[rgb(var(--quantum-500))] focus:outline-none transition-all text-sm" />
                <div className="flex gap-2">
                  <button onClick={() => setShowNewRoutine(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm hover:bg-white/5 transition-colors">Cancelar</button>
                  <button onClick={handleAddRoutine} disabled={!newRoutine.name.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-[rgb(var(--quantum-500))] text-white text-sm font-medium disabled:opacity-40 hover:bg-[rgb(var(--quantum-400))] transition-colors">Crear rutina</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm font-medium text-white">Esta semana</span>
            </div>
            <div className="flex items-center gap-1">
              {routineDays.map((day, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDay(i)}
                  className={cn(
                    'w-10 h-10 rounded-lg text-xs font-medium transition-all',
                    activeDay === i 
                      ? 'bg-quantum-500 text-white' 
                      : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-5 gap-4">
            {weeklyProgress.map((day, i) => (
              <div key={i} className="text-center">
                <div className="relative h-24 rounded-lg bg-white/5 overflow-hidden mb-2">
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 rounded-t-lg bg-gradient-to-t from-quantum-500 to-neon-cyan"
                    initial={{ height: 0 }}
                    animate={{ height: `${day.completed}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <span className="text-lg font-semibold text-white">{day.completed}%</span>
                  </div>
                </div>
                <span className="text-xs text-white/40">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {routinesList.map((routine, i) => (
            <motion.div
              key={routine.id}
              className="glass-card p-5 cursor-pointer group"
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className={cn(
                    'w-10 h-10 rounded-lg bg-gradient-to-br mb-3',
                    routine.color
                  )} />
                  <h3 className="text-lg font-medium text-white">{routine.name}</h3>
                  <div className="flex items-center gap-1 mt-1 text-xs text-white/40">
                    <Clock className="w-3 h-3" />
                    {routine.time}
                  </div>
                </div>
                <button className="p-2 rounded-lg opacity-0 group-hover:opacity-100 bg-white/5 hover:bg-white/10 transition-all">
                  <MoreVertical className="w-4 h-4 text-white/40" />
                </button>
              </div>
              
              <div className="space-y-2 mb-4">
                {routine.tasks.map((task, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className={cn(
                      'w-4 h-4 rounded-full flex items-center justify-center',
                      task.done 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'border border-white/20'
                    )}>
                      {task.done && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    <span className={cn(
                      'text-sm',
                      task.done ? 'text-white/40 line-through' : 'text-white/70'
                    )}>{task.name}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-amber-400">{routine.streak} días</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-quantum-500 to-neon-cyan"
                      style={{ width: `${routine.completion}%` }}
                    />
                  </div>
                  <span className="text-xs text-white/40">{routine.completion}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="w-80 space-y-6">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-medium text-white">Estadísticas</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-white/5 text-center">
              <div className="text-2xl font-semibold text-white mb-1">35</div>
              <div className="text-xs text-white/40">Rutinas</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5 text-center">
              <div className="text-2xl font-semibold text-white mb-1">12</div>
              <div className="text-xs text-white/40">Días streak</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Consistencia</span>
              <span className="text-white">92%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Mejor racha</span>
              <span className="text-white">21 días</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Tiempo total</span>
              <span className="text-white">18.5h/sem</span>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-quantum-400" />
            <span className="text-sm font-medium text-white">Patrones</span>
          </div>
          
          <div className="space-y-4">
            {[
              { label: 'Mejor hora', value: '9:00 AM', icon: Clock },
              { label: 'Día óptimo', value: 'Martes', icon: Calendar },
              { label: 'Productividad', value: '+15%', icon: TrendingUp },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <Icon className="w-4 h-4 text-quantum-400" />
                  <div className="flex-1">
                    <div className="text-xs text-white/40">{item.label}</div>
                    <div className="text-sm text-white">{item.value}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}