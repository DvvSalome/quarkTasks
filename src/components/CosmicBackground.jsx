import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Brand palette (Quantum Dark) — static since CSS vars can't feed useMemo
const PARTICLE_COLORS = [
  'rgba(123,61,255,0.9)',   // Quantum Purple
  'rgba(61,90,254,0.8)',    // Electric Blue
  'rgba(255,77,219,0.6)',   // Energy Pink
  'rgba(167,139,250,0.75)', // Nebula Violet
  'rgba(196,168,255,0.7)',  // Light Purple
  'rgba(61,90,254,0.5)',    // Electric Blue soft
]

export default function CosmicBackground() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  useEffect(() => {
    const handler = (e) => setMousePos({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
    })
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  const particles = useMemo(() =>
    Array.from({ length: 55 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 18,
      duration: 10 + Math.random() * 20,
      size: 1 + Math.random() * 2.5,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      xDrift: (Math.random() - 0.5) * 300,
      peakOpacity: 0.4 + Math.random() * 0.6,
    })), []
  )

  return (
    <>
      <div className="cosmic-bg" />
      <div className="cosmic-grid" />

      {/* Mouse-follow glow */}
      <motion.div
        className="fixed w-[70vw] h-[70vw] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'radial-gradient(circle, rgba(123,46,255,0.055) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
        animate={{ top: `${mousePos.y}%`, left: `${mousePos.x}%` }}
        transition={{ type: 'spring', damping: 45, stiffness: 90 }}
      />

      {/* Ambient floating orbs */}
      <motion.div
        className="fixed top-1/4 left-1/5 w-[550px] h-[550px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(123,46,255,0.09) 0%, transparent 70%)', filter: 'blur(50px)' }}
        animate={{ x: [0, 45, 0], y: [0, -35, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="fixed bottom-1/4 right-1/5 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.07) 0%, transparent 70%)', filter: 'blur(55px)' }}
        animate={{ x: [0, -55, 0], y: [0, 45, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="fixed top-2/3 left-1/2 w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,46,151,0.045) 0%, transparent 70%)', filter: 'blur(65px)' }}
        animate={{ x: [0, 35, -25, 0], y: [0, -25, 30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Particle field */}
      <div className="particle-field">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: p.color,
              boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            }}
            animate={{
              y: ['102vh', '-8vh'],
              x: [0, p.xDrift],
              opacity: [0, p.peakOpacity, p.peakOpacity, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'linear',
              opacity: { times: [0, 0.08, 0.92, 1], ease: 'linear' },
            }}
          />
        ))}
      </div>
    </>
  )
}
