import { useState, useEffect, useRef, useCallback } from 'react'

const INACTIVITY_UNSTABLE   = 20_000
const INACTIVITY_DISTRACTED = 50_000
const CHECK_INTERVAL        = 3_000

export default function useFocusVision() {
  const [state,      setState]      = useState('idle')
  const [focusState, setFocusState] = useState('focused')
  const [focusScore, setFocusScore] = useState(100)
  const [error,      setError]      = useState(null)
  const [stream,     setStream]     = useState(null)

  const lastActivityRef = useRef(Date.now())
  const hiddenAtRef     = useRef(null)
  const streamRef       = useRef(null)
  const intervalRef     = useRef(null)

  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now()
  }, [])

  useEffect(() => {
    if (state !== 'active') return
    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart']
    events.forEach(e => window.addEventListener(e, updateActivity, { passive: true }))
    return () => events.forEach(e => window.removeEventListener(e, updateActivity))
  }, [state, updateActivity])

  useEffect(() => {
    if (state !== 'active') return
    const handler = () => {
      if (document.hidden) {
        hiddenAtRef.current = Date.now()
      } else {
        hiddenAtRef.current = null
        updateActivity()
      }
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [state, updateActivity])

  useEffect(() => {
    if (state !== 'active') return
    lastActivityRef.current = Date.now()

    intervalRef.current = setInterval(() => {
      const now      = Date.now()
      const inactive = now - lastActivityRef.current
      const tabGone  = document.hidden || (hiddenAtRef.current != null && now - hiddenAtRef.current > 4_000)

      let next  = 'focused'
      let score = 100

      if (tabGone) {
        next  = 'distracted'
        score = 10
      } else if (inactive > INACTIVITY_DISTRACTED) {
        next  = 'distracted'
        score = Math.max(5, 25 - Math.floor((inactive - INACTIVITY_DISTRACTED) / 5_000) * 3)
      } else if (inactive > INACTIVITY_UNSTABLE) {
        next  = 'unstable'
        const r = (inactive - INACTIVITY_UNSTABLE) / (INACTIVITY_DISTRACTED - INACTIVITY_UNSTABLE)
        score = Math.round(72 - r * 42)
      } else {
        const r = inactive / INACTIVITY_UNSTABLE
        score = Math.round(100 - r * 28)
      }

      setFocusState(next)
      setFocusScore(Math.max(0, Math.min(100, score)))
    }, CHECK_INTERVAL)

    return () => clearInterval(intervalRef.current)
  }, [state])

  const activate = useCallback(async () => {
    setState('requesting')
    setError(null)
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 320 }, height: { ideal: 240 }, facingMode: 'user' },
        audio: false,
      })
      streamRef.current = s
      setStream(s)
      setState('active')
      setFocusState('focused')
      setFocusScore(100)
      lastActivityRef.current = Date.now()
      hiddenAtRef.current = null
    } catch (err) {
      setError(err.message || 'Acceso a cámara denegado')
      setState('error')
    }
  }, [])

  const deactivate = useCallback(() => {
    clearInterval(intervalRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setStream(null)
    setState('idle')
    setFocusState('focused')
    setFocusScore(100)
    setError(null)
    hiddenAtRef.current = null
  }, [])

  useEffect(() => () => { deactivate() }, [])

  return { state, focusState, focusScore, error, stream, activate, deactivate }
}
