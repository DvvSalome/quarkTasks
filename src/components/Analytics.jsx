import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target, 
  Zap,
  Calendar,
  Brain,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react'
import { cn } from '../lib/utils'

const stats = [
  { label: 'Tareas completadas', value: '156', change: '+23%', icon: Target },
  { label: 'Horas.focus', value: '89', change: '+12%', icon: Clock },
  { label: 'Productividad', value: '94%', change: '+8%', icon: TrendingUp },
  { label: 'Streak actual', value: '12', change: '+3', icon: Zap },
]

const weeklyData = [
  { day: 'Lun', tasks: 8, hours: 6.5, energy: 85 },
  { day: 'Mar', tasks: 12, hours: 7.2, energy: 90 },
  { day: 'Mié', tasks: 6, hours: 5.8, energy: 70 },
  { day: 'Jue', tasks: 10, hours: 8.1, energy: 88 },
  { day: 'Vie', tasks: 14, hours: 7.5, energy: 92 },
  { day: 'Sáb', tasks: 4, hours: 3.2, energy: 60 },
  { day: 'Dom', tasks: 2, hours: 2.0, energy: 45 },
]

const categoryBreakdown = [
  { category: 'Desarrollo', percentage: 45, color: 'bg-quantum-500' },
  { category: 'Diseño', percentage: 25, color: 'bg-neon-cyan' },
  { category: 'Reuniones', percentage: 20, color: 'bg-neon-pink' },
  { category: 'Docs', percentage: 10, color: 'bg-amber-400' },
]

const insights = [
  { 
    title: 'Pico de productividad',
    desc: 'Tu mejor rendimiento es entre 9-11 AM',
    type: 'positive'
  },
  { 
    title: 'Área de mejora',
    desc: 'Los miércoles tienes menor output',
    type: 'neutral'
  },
  { 
    title: 'Recomendación',
    desc: 'Considera reuniones por la tarde',
    type: 'suggestion'
  },
]

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('week')
  
  const maxTasks = Math.max(...weeklyData.map(d => d.tasks))
  const maxHours = Math.max(...weeklyData.map(d => d.hours))
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-1">
            Analytics <span className="text-gradient">Cognitivo</span>
          </h2>
          <p className="text-sm text-white/50">Análisis profundo de tu productividad</p>
        </div>
        
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-lg">
          {['day', 'week', 'month'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all',
                timeRange === range 
                  ? 'bg-quantum-500/20 text-quantum-300 border border-quantum-500/30' 
                  : 'text-white/40 hover:text-white'
              )}
            >
              {range === 'day' ? 'Día' : range === 'week' ? 'Semana' : 'Mes'}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={i}
              className="glass-card p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-quantum-400" />
                <span className="text-xs text-green-400 font-mono">{stat.change}</span>
              </div>
              <div className="text-3xl font-semibold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-white/40">{stat.label}</div>
            </motion.div>
          )
        })}
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <LineChart className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm font-medium text-white">Rendimiento Semanal</span>
            </div>
          </div>
          
          <div className="flex items-end gap-4 h-64">
            {weeklyData.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <motion.div
                  className="w-full rounded-t-lg bg-gradient-to-t from-quantum-500 to-neon-cyan relative overflow-hidden"
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.tasks / maxTasks) * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  style={{ minHeight: '20px' }}
                >
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white/20 to-transparent"
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <div className="mt-3 text-xs font-mono text-white/40">{day.day}</div>
                <div className="text-xs text-white/60 mt-1">{day.tasks} tasks</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-4 h-4 text-neon-pink" />
              <span className="text-sm font-medium text-white">Categorías</span>
            </div>
            
            <div className="space-y-4">
              {categoryBreakdown.map((cat, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white/70">{cat.category}</span>
                    <span className="text-sm text-white/50">{cat.percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className={cn('h-full rounded-full', cat.color)}
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.percentage}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-quantum-400" />
              <span className="text-sm font-medium text-white">Insights IA</span>
            </div>
            
            <div className="space-y-3">
              {insights.map((insight, i) => (
                <motion.div
                  key={i}
                  className={cn(
                    'p-3 rounded-lg text-sm',
                    insight.type === 'positive' && 'bg-green-500/10 border border-green-500/20',
                    insight.type === 'neutral' && 'bg-amber-500/10 border border-amber-500/20',
                    insight.type === 'suggestion' && 'bg-quantum-500/10 border border-quantum-500/20'
                  )}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-white font-medium mb-1">{insight.title}</div>
                  <div className="text-white/60 text-xs">{insight.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-medium text-white">Análisis de Energía</span>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-4">
          {weeklyData.map((day, i) => (
            <div key={i} className="text-center">
              <div className="h-32 rounded-lg bg-white/5 relative overflow-hidden mb-2">
                <motion.div
                  className="absolute bottom-0 left-0 right-0 rounded-t-lg"
                  style={{
                    height: `${day.energy}%`,
                    background: `linear-gradient(180deg, ${
                      day.energy > 80 ? '#00F5FF' : 
                      day.energy > 60 ? '#9D4DFF' : '#FF2E97'
                    }, transparent)`,
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${day.energy}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                />
              </div>
              <div className="text-xs text-white/40">{day.day}</div>
              <div className="text-xs text-white/60">{day.energy}%</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}