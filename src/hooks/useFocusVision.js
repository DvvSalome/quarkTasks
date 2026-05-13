import { useState, useRef, useCallback, useEffect } from 'react'

const CONFIGS = {
  relaxed: { interval: 4000, distractedAfter: 12, absentAfter: 25 },
  normal:  { interval: 2500, distractedAfter: 6,  absentAfter: 15 },
  strict:  { interval: 1500, distractedAfter: 3,  absentAfter: 8 },
}

const VALID_KEYS = Object.keys(CONFIGS)

function createDetector() {
  if (!window.FaceDetector) return null
  try {
    return new window.FaceDetector({ maxDetectedFaces: 1 })
  } catch {
    return null
  }
}

export default function useFocusVision() {
  const [state, setState] = useState('idle')
  const [focus, setFocus] = useState('unknown')
  const [sensitivity, setSensitivity] = useState('normal')
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState(null)

  const activeRef = useRef(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const detectorRef = useRef(null)
  const canvasRef = useRef(null)
  const lastFrameRef = useRef(null)
  const distractedElapsed = useRef(0)
  const absentElapsed = useRef(0)
  const configRef = useRef(CONFIGS.normal)
  const intervalRef = useRef(null)

  const changeSensitivity = useCallback((key) => {
    if (!VALID_KEYS.includes(key)) return
    setSensitivity(key)
    configRef.current = CONFIGS[key]
  }, [])

  const stop = useCallback(() => {
    activeRef.current = false
    clearInterval(intervalRef.current)
    intervalRef.current = null
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
      videoRef.current.parentNode?.removeChild(videoRef.current)
      videoRef.current = null
    }
    detectorRef.current = null
    canvasRef.current = null
    lastFrameRef.current = null
    distractedElapsed.current = 0
    absentElapsed.current = 0
    setState('idle')
    setFocus('unknown')
    setConfidence(0)
    setError(null)
  }, [])

  useEffect(() => {
    return stop
  }, [stop])

  const detectFrame = useCallback(async () => {
    const video = videoRef.current
    if (!video || video.readyState < 2 || video.paused || video.ended) {
      return { present: false, looking: false, conf: 0 }
    }

    const detector = detectorRef.current
    if (detector) {
      try {
        const faces = await detector.detect(video)
        if (faces.length === 0) return { present: false, looking: false, conf: 0 }

        const f = faces[0]
        const { x, y, width, height } = f.boundingBox
        const vw = video.videoWidth
        const vh = video.videoHeight
        const cx = x + width / 2
        const cy = y + height / 2
        const looking =
          Math.abs(cx - vw / 2) < vw * 0.3 &&
          Math.abs(cy - vh / 2) < vh * 0.3 &&
          width > vw * 0.08

        return { present: true, looking, conf: looking ? 0.92 : 0.65 }
      } catch {
        return { present: false, looking: false, conf: 0 }
      }
    }

    try {
      let c = canvasRef.current
      if (!c) {
        c = document.createElement('canvas')
        c.width = 48; c.height = 36
        canvasRef.current = c
      }
      const ctx = c.getContext('2d')
      if (!ctx) return { present: false, looking: false, conf: 0 }

      ctx.drawImage(video, 0, 0, 48, 36)
      const data = ctx.getImageData(0, 0, 48, 36).data

      const prev = lastFrameRef.current
      lastFrameRef.current = data

      if (!prev) return { present: true, looking: true, conf: 0.3 }

      let diff = 0
      const total = data.length / 4
      for (let i = 0; i < data.length; i += 4) {
        diff += Math.abs(data[i] - prev[i]) +
                Math.abs(data[i + 1] - prev[i + 1]) +
                Math.abs(data[i + 2] - prev[i + 2])
      }

      const avg = diff / total / 3
      const present = avg > 0.8
      const looking = avg > 1.5 && avg < 20
      return { present, looking, conf: Math.min(1, avg / 12) }
    } catch {
      return { present: false, looking: false, conf: 0 }
    }
  }, [])

  const tickRef = useRef(null)
  const tick = useCallback(async () => {
    if (!activeRef.current) return
    const result = await detectFrame()
    if (!activeRef.current) return

    const cfg = configRef.current

    if (!result.present) {
      absentElapsed.current += cfg.interval / 1000
      distractedElapsed.current = 0
    } else if (!result.looking) {
      distractedElapsed.current += cfg.interval / 1000
      absentElapsed.current = 0
    } else {
      distractedElapsed.current = 0
      absentElapsed.current = 0
    }

    setConfidence(result.conf)

    if (absentElapsed.current >= cfg.absentAfter) {
      setFocus('absent')
    } else if (distractedElapsed.current >= cfg.distractedAfter) {
      setFocus('distracted')
    } else if (result.present && result.looking) {
      setFocus('focused')
    } else {
      setFocus('unknown')
    }
  }, [detectFrame])

  tickRef.current = tick

  const startInterval = useCallback(() => {
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      tickRef.current()
    }, configRef.current.interval)
  }, [])

  const start = useCallback(async () => {
    if (activeRef.current) return
    activeRef.current = true

    setState('requesting')
    setError(null)
    distractedElapsed.current = 0
    absentElapsed.current = 0
    lastFrameRef.current = null

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      activeRef.current = false
      setError('La cámara requiere una conexión segura (HTTPS o localhost)')
      setState('error')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 320 }, height: { ideal: 240 }, facingMode: 'user' },
      })

      if (!activeRef.current) {
        stream.getTracks().forEach(t => t.stop())
        return
      }

      const video = document.createElement('video')
      video.srcObject = stream
      video.setAttribute('playsinline', '')
      video.muted = true
      video.style.display = 'none'
      document.body.appendChild(video)
      await video.play()

      if (!activeRef.current) {
        video.srcObject = null
        video.remove()
        stream.getTracks().forEach(t => t.stop())
        return
      }

      videoRef.current = video
      streamRef.current = stream
      detectorRef.current = createDetector()
      canvasRef.current = null

      setState('active')
      setFocus('unknown')
      setConfidence(0)

      startInterval()
    } catch (err) {
      activeRef.current = false
      setState('error')
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Permiso de cámara denegado — revisa la configuración del navegador')
        setState('denied')
      } else if (err.name === 'NotFoundError') {
        setError('No se detectó ninguna cámara en este dispositivo')
      } else if (err.name === 'OverconstrainedError') {
        setError('La cámara no soporta la configuración requerida')
      } else if (err.name === 'NotReadableError') {
        setError('La cámara está siendo usada por otra aplicación')
      } else {
        setError(err.message || 'Error al acceder a la cámara')
      }
    }
  }, [startInterval])

  useEffect(() => {
    if (state !== 'active') return
    startInterval()
    return () => clearInterval(intervalRef.current)
  }, [sensitivity, state, startInterval])

  return {
    state, focus, sensitivity, confidence, error,
    activate: start, deactivate: stop,
    setSensitivity: changeSensitivity,
  }
}
