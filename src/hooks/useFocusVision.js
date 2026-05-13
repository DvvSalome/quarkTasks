import { useState, useRef, useCallback, useEffect } from 'react'

const CONFIGS = {
  relaxed: { interval: 4000, distractedAfter: 12, absentAfter: 25 },
  normal:  { interval: 2500, distractedAfter: 6,  absentAfter: 15 },
  strict:  { interval: 1500, distractedAfter: 3,  absentAfter: 8 },
}

export default function useFocusVision() {
  const [state, setState] = useState('idle')
  const [focus, setFocus] = useState('unknown')
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState(null)
  const [sensitivity, setSensitivity] = useState('normal')

  const stateRef = useRef('idle')
  const streamRef = useRef(null)
  const videoRef = useRef(null)
  const detectorRef = useRef(null)
  const canvasRef = useRef(null)
  const lastFrameRef = useRef(null)
  const distractedElapsed = useRef(0)
  const absentElapsed = useRef(0)
  const intervalRef = useRef(null)
  const configRef = useRef(CONFIGS.normal)

  const changeSensitivity = useCallback((key) => {
    if (!CONFIGS[key]) return
    setSensitivity(key)
    configRef.current = CONFIGS[key]
  }, [])

  const stop = useCallback(() => {
    stateRef.current = 'idle'
    clearInterval(intervalRef.current)
    intervalRef.current = null

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.pause()
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

  const runDetection = useCallback(async () => {
    const video = videoRef.current
    if (!video || video.readyState < 2) return

    let result

    if (window.FaceDetector) {
      try {
        let det = detectorRef.current
        if (!det) {
          det = new window.FaceDetector({ maxDetectedFaces: 1 })
          detectorRef.current = det
        }
        const faces = await det.detect(video)
        if (faces.length > 0) {
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
          result = { present: true, looking, conf: looking ? 0.92 : 0.65 }
        }
      } catch {}
    }

    if (!result) {
      try {
        let c = canvasRef.current
        if (!c) {
          c = document.createElement('canvas')
          c.width = 48
          c.height = 36
          canvasRef.current = c
        }
        const ctx = c.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, 48, 36)
          const data = ctx.getImageData(0, 0, 48, 36).data

          const prev = lastFrameRef.current
          lastFrameRef.current = data

          if (prev) {
            let diff = 0
            const total = data.length / 4
            for (let i = 0; i < data.length; i += 4) {
              diff += Math.abs(data[i] - prev[i]) +
                      Math.abs(data[i + 1] - prev[i + 1]) +
                      Math.abs(data[i + 2] - prev[i + 2])
            }
            const avg = diff / total / 3
            result = {
              present: avg > 0.8,
              looking: avg > 1.5 && avg < 20,
              conf: Math.min(1, avg / 12),
            }
          } else {
            result = { present: true, looking: true, conf: 0.3 }
          }
        }
      } catch {}
    }

    if (!result) result = { present: false, looking: false, conf: 0 }

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
  }, [])

  const start = useCallback(async () => {
    if (stateRef.current === 'active' || stateRef.current === 'requesting') return
    stateRef.current = 'requesting'

    setState('requesting')
    setError(null)
    setFocus('unknown')
    setConfidence(0)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 320 }, height: { ideal: 240 }, facingMode: 'user' },
      })

      if (stateRef.current !== 'requesting') {
        stream.getTracks().forEach(t => t.stop())
        return
      }

      const video = document.createElement('video')
      video.srcObject = stream
      video.muted = true
      video.playsInline = true
      video.style.display = 'none'
      document.body.appendChild(video)
      await video.play()

      if (stateRef.current !== 'requesting') {
        video.srcObject = null
        video.remove()
        stream.getTracks().forEach(t => t.stop())
        return
      }

      streamRef.current = stream
      videoRef.current = video
      stateRef.current = 'active'
      setState('active')
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        stateRef.current = 'denied'
        setState('denied')
        setError('Permiso de cámara denegado — revisa la configuración del navegador')
        return
      }
      stateRef.current = 'error'
      setState('error')
      if (err.name === 'NotFoundError') {
        setError('No se detectó cámara en este dispositivo')
      } else if (err.name === 'NotReadableError') {
        setError('La cámara está siendo usada por otra aplicación')
      } else if (err.name === 'SecurityError') {
        setError('Cámara no disponible — requiere HTTPS o localhost')
      } else {
        setError(err.message || 'Error al acceder a la cámara')
      }
    }
  }, [runDetection])

  useEffect(() => {
    if (state !== 'active') return
    clearInterval(intervalRef.current)
    const cfg = configRef.current
    intervalRef.current = setInterval(() => {
      runDetection()
    }, cfg.interval)
    return () => clearInterval(intervalRef.current)
  }, [sensitivity, state, runDetection])

  return {
    state, focus, confidence, error, sensitivity,
    activate: start,
    deactivate: stop,
    setSensitivity: changeSensitivity,
  }
}
