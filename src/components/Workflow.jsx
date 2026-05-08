import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  GitBranch, 
  Plus, 
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Play,
  Pause,
  RefreshCw,
  ChevronRight,
  Circle,
  ArrowRight
} from 'lucide-react'
import { cn } from '../lib/utils'

const nodes = [
  { id: 1, label: 'Planning', x: 100, y: 200, status: 'completed', type: 'start' },
  { id: 2, label: 'Design', x: 300, y: 150, status: 'active', type: 'process' },
  { id: 3, label: 'Development', x: 500, y: 200, status: 'active', type: 'process' },
  { id: 4, label: 'Testing', x: 700, y: 150, status: 'pending', type: 'process' },
  { id: 5, label: 'Deployment', x: 900, y: 200, status: 'pending', type: 'end' },
]

const connections = [
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 3, to: 4 },
  { from: 4, to: 5 },
]

const projectTasks = [
  { id: 1, name: 'Q2 Marketing Campaign', progress: 75, nodes: 4, status: 'active' },
  { id: 2, name: 'Mobile App Redesign', progress: 45, nodes: 6, status: 'active' },
  { id: 3, name: 'API Integration', progress: 100, nodes: 3, status: 'completed' },
  { id: 4, name: 'User Research', progress: 30, nodes: 5, status: 'active' },
]

export default function Workflow() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [activePulse, setActivePulse] = useState(0)
  const [zoom, setZoom] = useState(1)
  
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setActivePulse(prev => (prev + 1) % 5)
      }, 1500)
      return () => clearInterval(interval)
    }
  }, [isPlaying])
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex gap-6"
    >
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-1">
              Workflow <span className="text-gradient">Visual</span>
            </h2>
            <p className="text-sm text-white/50">Visualización neuronal de tus proyectos</p>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
              whileHover={{ scale: 1.05 }}
            >
              <ZoomOut className="w-4 h-4" />
            </motion.button>
            <span className="text-sm text-white/40 font-mono w-16 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <motion.button
              onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
              whileHover={{ scale: 1.05 }}
            >
              <ZoomIn className="w-4 h-4" />
            </motion.button>
            <motion.button
              className={cn(
                'p-2 rounded-lg border transition-colors ml-2',
                isPlaying 
                  ? 'bg-quantum-500/20 border-quantum-500/50 text-quantum-300' 
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
              )}
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>
        
        <div className="flex-1 glass-card p-6 relative overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7B2EFF" />
                <stop offset="100%" stopColor="#00F5FF" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {connections.map((conn, i) => {
              const fromNode = nodes.find(n => n.id === conn.from)
              const toNode = nodes.find(n => n.id === conn.to)
              if (!fromNode || !toNode) return null
              
              return (
                <g key={i}>
                  <line
                    x1={fromNode.x + 30}
                    y1={fromNode.y}
                    x2={toNode.x - 30}
                    y2={toNode.y}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  {isPlaying && activePulse === conn.from && (
                    <motion.circle
                      cx={fromNode.x + 30}
                      cy={fromNode.y}
                      r="6"
                      fill="url(#lineGradient)"
                      filter="url(#glow)"
                      initial={{ cx: fromNode.x + 30 }}
                      animate={{ cx: toNode.x - 30 }}
                      transition={{ duration: 1.5, ease: 'linear' }}
                    />
                  )}
                </g>
              )
            })}
          </svg>
          
          {nodes.map((node) => {
            const isActive = node.status === 'active'
            const isCompleted = node.status === 'completed'
            
            return (
              <motion.div
                key={node.id}
                className="absolute"
                style={{ left: node.x, top: node.y }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: node.id * 0.1 }}
              >
                <motion.div
                  className={cn(
                    'w-16 h-16 rounded-xl flex items-center justify-center border-2 transition-all',
                    isCompleted && 'bg-green-500/20 border-green-500/50',
                    isActive && 'bg-quantum-500/20 border-quantum-500/50',
                    !isCompleted && !isActive && 'bg-white/5 border-white/20'
                  )}
                  animate={isActive ? { 
                    boxShadow: ['0 0 20px rgba(123,46,255,0.3)', '0 0 40px rgba(0,245,255,0.4)', '0 0 20px rgba(123,46,255,0.3)']
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Circle className={cn(
                    'w-4 h-4',
                    isCompleted && 'text-green-400 fill-green-400',
                    isActive && 'text-quantum-400',
                    !isCompleted && !isActive && 'text-white/30'
                  )} />
                </motion.div>
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-white/70 whitespace-nowrap">
                  {node.label}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
      
      <div className="w-80 space-y-6">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <GitBranch className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-medium text-white">Proyectos Activos</span>
          </div>
          
          <div className="space-y-3">
            {projectTasks.map((project, i) => (
              <motion.div
                key={project.id}
                className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">{project.name}</span>
                  <span className="text-xs text-white/40">{project.nodes} nodos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className={cn(
                        'h-full rounded-full',
                        project.status === 'completed' ? 'bg-green-500' : 'bg-gradient-to-r from-quantum-500 to-neon-cyan'
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  </div>
                  <span className="text-xs text-white/50 font-mono">{project.progress}%</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.button
            className="w-full mt-4 p-3 rounded-lg border border-dashed border-white/10 text-white/40 text-sm hover:text-white/70 hover:border-white/20 transition-colors flex items-center justify-center gap-2"
            whileHover={{ scale: 1.01 }}
          >
            <Plus className="w-4 h-4" />
            Nuevo proyecto
          </motion.button>
        </div>
        
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-4 h-4 text-quantum-400" />
            <span className="text-sm font-medium text-white">Flujos Recientes</span>
          </div>
          
          <div className="space-y-2">
            {[
              { name: 'Deploy → Test → Prod', time: '2h ago', status: 'completed' },
              { name: 'Code → Review → Merge', time: '4h ago', status: 'completed' },
              { name: 'Plan → Design → Build', time: '1d ago', status: 'active' },
            ].map((flow, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                <ArrowRight className="w-4 h-4 text-white/40" />
                <div className="flex-1">
                  <div className="text-sm text-white/70">{flow.name}</div>
                  <div className="text-xs text-white/30">{flow.time}</div>
                </div>
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  flow.status === 'completed' ? 'bg-green-400' : 'bg-quantum-400'
                )} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}