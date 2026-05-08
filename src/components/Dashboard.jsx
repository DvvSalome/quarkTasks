import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Zap,
  Brain,
  ChevronRight,
  Activity,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { cn } from '../lib/utils'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const metrics = [
  { label: 'Tareas completadas', value: '24', change: '+12%', up: true, icon: Target },
  { label: 'Horas enfocadas', value: '6.5', change: '+2.3h', up: true, icon: Clock },
  { label: 'Rendimiento', value: '94%', change: '-3%', up: false, icon: TrendingUp },
  { label: 'Streak', value: '12', change: '+5', up: true, icon: Zap },
]

const aiInsights = [
  {
    type: 'insight',
    title: 'Tu pico de productividad es a las 10am',
    desc: 'Considera schedulear tareas complejas en la mañana.',
    icon: Brain,
    time: 'Hace 2h'
  },
  {
    type: 'warning',
    title: 'Riesgo de burnout detectado',
    desc: 'Has trabajado 8 días sin descanso. Recomiendo un break.',
    icon: Zap,
    time: 'Ahora'
  },
  {
    type: 'success',
    title: 'Routine optimizada',
    desc: 'Tu rutina matutina ahora es 15% más eficiente.',
    icon: Activity,
    time: 'Ayer'
  }
]

const upcomingTasks = [
  { title: 'Revisar propuesta Q2', project: 'Marketing', priority: 'urgent', time: '10:30' },
  { title: 'Actualizar documentación API', project: 'Engineering', priority: 'normal', time: '14:00' },
  { title: 'Call con cliente Enterprise', project: 'Sales', priority: 'normal', time: '16:00' },
]

const energyLevels = [
  { hour: '9AM', level: 85 },
  { hour: '10AM', level: 95 },
  { hour: '11AM', level: 88 },
  { hour: '12PM', level: 70 },
  { hour: '1PM', level: 60 },
  { hour: '2PM', level: 75 },
  { hour: '3PM', level: 65 },
  { hour: '4PM', level: 80 },
]

export default function Dashboard() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-1">
            Dashboard <span className="text-gradient">Cognitivo</span>
          </h2>
          <p className="text-white/50 text-sm">Tu sistema operativo de productividad</p>
        </div>
        <motion.button 
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-quantum-500/20 border border-quantum-500/30 text-quantum-200 text-sm hover:bg-quantum-500/30 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Sparkles className="w-4 h-4" />
          <span>Nueva tarea con IA</span>
        </motion.button>
      </motion.div>
      
      <motion.div variants={itemVariants} className="grid grid-cols-4 gap-4">
        {metrics.map((metric, i) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={i}
              className="glass-card p-5 group cursor-pointer"
              whileHover={{ y: -5, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              style={{ '--card-glow': 'rgba(123,46,255,0.15)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-quantum-500/10">
                  <Icon className="w-4 h-4 text-quantum-400" />
                </div>
                <div className={cn(
                  'flex items-center gap-1 text-xs font-mono',
                  metric.up ? 'text-green-400' : 'text-red-400'
                )}>
                  {metric.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {metric.change}
                </div>
              </div>
              <div className="text-3xl font-semibold text-white mb-1">{metric.value}</div>
              <div className="text-xs text-white/40 font-mono">{metric.label}</div>
            </motion.div>
          )
        })}
      </motion.div>
      
      <div className="grid grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="col-span-2 space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">Nivel de Energía</h3>
              <span className="text-xs font-mono text-white/40">HOY</span>
            </div>
            <div className="flex items-end gap-2 h-32 mb-8">
              {energyLevels.map((level, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end h-full relative group cursor-pointer">
                  <motion.div
                    className="w-full rounded-t-sm"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: `${level.level}%`, opacity: 1 }}
                    transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      background: `linear-gradient(180deg, ${level.level > 80 ? 'rgb(var(--neon-cyan))' : level.level > 60 ? 'rgb(var(--quantum-500))' : 'rgb(var(--neon-pink))'} 0%, transparent 100%)`,
                      boxShadow: `0 -4px 12px ${level.level > 80 ? 'rgb(var(--neon-cyan) / 0.4)' : level.level > 60 ? 'rgb(var(--quantum-500) / 0.4)' : 'rgb(var(--neon-pink) / 0.4)'}`,
                      opacity: 0.85,
                    }}
                    whileHover={{ opacity: 1, scaleX: 1.05 }}
                  />
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/35 font-mono whitespace-nowrap">
                    {level.hour}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Próximas Tareas</h3>
              <button className="text-xs text-quantum-300 hover:text-quantum-200 flex items-center gap-1">
                Ver todas <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {upcomingTasks.map((task, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  whileHover={{ x: 4 }}
                >
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    task.priority === 'urgent' ? 'bg-neon-pink' : 'bg-quantum-400'
                  )} />
                  <div className="flex-1">
                    <div className="text-sm text-white">{task.title}</div>
                    <div className="text-xs text-white/40">{task.project}</div>
                  </div>
                  <div className="text-xs font-mono text-white/50">{task.time}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="glass-card-glow p-5 border border-quantum-500/20">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-quantum-500 to-neon-cyan">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-white">Insights IA</span>
            </div>
            <div className="space-y-3">
              {aiInsights.map((insight, i) => {
                const Icon = insight.icon
                return (
                  <motion.div
                    key={i}
                    className={cn(
                      'p-3 rounded-lg border text-sm',
                      insight.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                      insight.type === 'success' ? 'bg-green-500/10 border-green-500/30' :
                      'bg-quantum-500/10 border-quantum-500/30'
                    )}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className={cn(
                        'w-4 h-4 mt-0.5',
                        insight.type === 'warning' ? 'text-amber-400' :
                        insight.type === 'success' ? 'text-green-400' :
                        'text-quantum-300'
                      )} />
                      <div>
                        <div className="text-white text-xs font-medium mb-1">{insight.title}</div>
                        <div className="text-white/50 text-xs">{insight.desc}</div>
                        <div className="text-white/30 text-xs mt-2 font-mono">{insight.time}</div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
          
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm font-medium text-white">Calendario</span>
            </div>
            <div className="space-y-2">
              {[
                { time: '10:30', event: 'Revisión de sprint', color: 'bg-quantum-500' },
                { time: '14:00', event: 'Standup equipo', color: 'bg-neon-cyan' },
                { time: '16:00', event: 'Client call', color: 'bg-neon-pink' },
              ].map((event, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="font-mono text-white/40 w-12">{event.time}</span>
                  <div className={cn('w-2 h-2 rounded-full', event.color)} />
                  <span className="text-white/70">{event.event}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}