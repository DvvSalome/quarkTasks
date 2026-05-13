import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Dashboard from './components/Dashboard'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import AICopilot from './components/AICopilot'
import Tasks from './components/Tasks'
import Focus from './components/Focus'
import Routines from './components/Routines'
import Analytics from './components/Analytics'
import Workflow from './components/Workflow'
import Settings from './components/Settings'
import CosmicBackground from './components/CosmicBackground'
import Login from './components/Login'
import Onboarding from './components/Onboarding'

const pages = {
  dashboard: Dashboard,
  copilot: AICopilot,
  tasks: Tasks,
  focus: Focus,
  routines: Routines,
  analytics: Analytics,
  workflow: Workflow,
  settings: Settings
}

function App() {
  const [appState, setAppState] = useState('loading')
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const hasSession = localStorage.getItem('quark_session')
    const hasOnboarded = localStorage.getItem('quark_onboarded')

    setTimeout(() => {
      if (hasSession && hasOnboarded) {
        setAppState('app')
      } else if (hasSession && !hasOnboarded) {
        setAppState('onboarding')
      } else {
        setAppState('login')
      }
    }, 1800)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.detail && pages[e.detail]) setCurrentPage(e.detail)
    }
    window.addEventListener('navigate', handler)
    return () => window.removeEventListener('navigate', handler)
  }, [])

  const handleLoginComplete = () => {
    localStorage.setItem('quark_session', 'true')
    setAppState('onboarding')
  }

  const handleOnboardingComplete = () => {
    localStorage.setItem('quark_onboarded', 'true')
    setAppState('app')
  }

  const PageComponent = pages[currentPage] || Dashboard

  if (appState === 'loading') {
    return (
      <div className="min-h-screen bg-quantum-950 flex items-center justify-center overflow-hidden">
        {/* Background pulse orbs */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(123,46,255,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.07) 0%, transparent 70%)', filter: 'blur(40px)' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />

        <motion.div
          className="flex flex-col items-center gap-10 relative"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Orbital logo */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Outer orbit ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: '1px solid rgba(123,46,255,0.35)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <div
                className="absolute w-2.5 h-2.5 rounded-full bg-quantum-400"
                style={{ top: '-5px', left: '50%', transform: 'translateX(-50%)', boxShadow: '0 0 10px rgba(123,46,255,0.8)' }}
              />
            </motion.div>

            {/* Mid orbit ring */}
            <motion.div
              className="absolute inset-5 rounded-full"
              style={{ border: '1px solid rgba(0,245,255,0.25)' }}
              animate={{ rotate: -360 }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
            >
              <div
                className="absolute w-2 h-2 rounded-full bg-neon-cyan"
                style={{ top: '-4px', left: '50%', transform: 'translateX(-50%)', boxShadow: '0 0 8px rgba(0,245,255,0.9)' }}
              />
            </motion.div>

            {/* Inner glow */}
            <motion.div
              className="absolute inset-8 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(123,46,255,0.3) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Logo */}
            <motion.img
              src="/quark-logo.png"
              className="relative w-14 h-auto object-contain z-10"
              style={{ filter: 'drop-shadow(0 0 12px rgba(123,46,255,0.7)) drop-shadow(0 0 24px rgba(0,245,255,0.3))' }}
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <div className="flex flex-col items-center gap-3">
            <motion.p
              className="text-white/50 font-mono text-sm tracking-[0.2em]"
              animate={{ opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              INICIALIZANDO SISTEMA...
            </motion.p>
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-quantum-400"
                  animate={{ opacity: [0.15, 1, 0.15], scale: [0.7, 1.3, 0.7] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (appState === 'login') {
    return <Login onComplete={handleLoginComplete} />
  }

  if (appState === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <CosmicBackground />

      <div className="relative z-10 flex h-full">
        <Sidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            currentPage={currentPage}
          />

          <main className="flex-1 overflow-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                <PageComponent />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
