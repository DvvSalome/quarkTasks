let ctx = null

function getCtx() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)()
    } catch {
      return null
    }
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function playChime(type = 'distracted', volume = 0.5) {
  const ac = getCtx()
  if (!ac) return

  const gain = ac.createGain()
  gain.connect(ac.destination)
  const baseGain = Math.max(0, Math.min(1, volume))

  const now = ac.currentTime
  const osc = ac.createOscillator()
  osc.type = 'sine'
  osc.connect(gain)

  if (type === 'distracted') {
    osc.frequency.setValueAtTime(523.25, now)
    osc.frequency.linearRampToValueAtTime(659.25, now + 0.15)
    gain.gain.setValueAtTime(baseGain * 0.35, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
    osc.start(now)
    osc.stop(now + 0.5)
  } else if (type === 'absent') {
    const osc2 = ac.createOscillator()
    osc2.type = 'sine'
    osc2.connect(gain)
    osc.frequency.setValueAtTime(392, now)
    osc.frequency.linearRampToValueAtTime(349.23, now + 0.3)
    osc2.frequency.setValueAtTime(523.25, now + 0.15)
    osc2.frequency.linearRampToValueAtTime(440, now + 0.3)
    gain.gain.setValueAtTime(baseGain * 0.45, now)
    gain.gain.linearRampToValueAtTime(baseGain * 0.5, now + 0.2)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)
    osc.start(now)
    osc.stop(now + 0.8)
    osc2.start(now + 0.15)
    osc2.stop(now + 0.5)
  } else if (type === 'focus') {
    osc.frequency.setValueAtTime(659.25, now)
    osc.frequency.linearRampToValueAtTime(783.99, now + 0.1)
    gain.gain.setValueAtTime(baseGain * 0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
    osc.start(now)
    osc.stop(now + 0.3)
  }
}
