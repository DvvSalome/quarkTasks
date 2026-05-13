import { useState, useRef, useCallback, useEffect } from 'react'

const CONFIGS = {
  relaxed: { interval: 4000, distractedAfter: 12, absentAfter: 25 },
  normal:  { interval: 2500, distractedAfter: 6,  absentAfter: 15 },
  strict:  { interval: 1500, distractedAfter: 3,  absentAfter: 8 },
}

function detectFace(video) {
  return new Promise((resolve) => {
    if (!window.FaceDetector) return resolve(null)
    try {
      const det = new window.FaceDetector({ maxDetectedFaces: 1 })
      det.detect(video).then(faces => {
        if (faces.length === 0) return resolve(null)
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
        resolve({ present: true, looking, conf: looking ? 0.92 : 0.65 })
      }).catch(() => resolve(null))
    } catch {
      resolve(null)
    }
  })
}

function motionFallback(video, lastData) {
  try {
    const c = document.createElement('canvas')
    c.width = 48; c.height = 36
    const ctx = c.getContext('2d')
    ctx.drawImage(video, 0, 0, 48, 36)
    const data = ctx.getImageData(0, 0, 48, 36).data

    if (!lastData.current) {
      lastData.current = data
      return { present: true, looking: true, conf: 0.3 }
    }

    let diff = 0; const total = data.length / 4
    for (let i = 0; i < data.length; i += 4) {
      diff += Math.abs(data[i] - lastData.current[i])
    }
    lastData.current = data

    const avg = diff / total
    const present = avg > 0.5
    const looking = avg > 1.0 && avg < 25
    return { present, looking, conf: Math.min(1, avg / 15) }
  } catch {
    return { present: false, looking: false, conf: 0 }
  }
}

export default function useFocusVision() {
  const [state, setState] = useState('idle')
  const [focus, setFocus] = useState('unknown')
  const [sensitivity, setSensitivity] = useState('normal')
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState(null)

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const lastFrameRef = useRef(null)
  const distractedElapsed = useRef(0)
  const absentElapsed = useRef(0)
  const configRef = useRef(CONFIGS.normal)
  const intervalRef = useRef(null)

  const changeSensitivity = useCallback((key) => {
    setSensitivity(key)
    configRef.current = CONFIGS[key]
  }, [])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
      videoRef.current = null
    }
    lastFrameRef.current = null
    setState('idle')
    setFocus('unknown')
    setConfidence(0)
    setError(null)
  }, [])

  useEffect(() => {
    return stop
  }, [stop])

  const tick = useCallback(async () => {
    const cfg = configRef.current
    const video = videoRef.current
    if (!video || video.readyState < 2 || video.paused || video.ended) return

    let result
    const faceResult = await detectFace(video)
    if (faceResult) {
      result = faceResult
    } else {
      result = motionFallback(video, lastFrameRef)
    }

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
    stop()
    setState('requesting')
    setError(null)
    distractedElapsed.current = 0
    absentElapsed.current = 0
    lastFrameRef.current = null

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 320 }, height: { ideal: 240 }, facingMode: 'user' },
      })
      const video = document.createElement('video')
      video.srcObject = stream
      video.setAttribute('playsinline', '')
      video.muted = true
      await video.play()

      videoRef.current = video
      streamRef.current = stream
      setState('active')
      setFocus('unknown')
      setConfidence(0)

      intervalRef.current = setInterval(tick, configRef.current.interval)
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Permiso de cámara denegado — revisa la configuración del navegador')
        setState('denied')
      } else if (err.name === 'NotFoundError') {
        setError('No se detectó ninguna cámara en este dispositivo')
        setState('error')
      } else {
        setError(err.message || 'Error al acceder a la cámara')
        setState('error')
      }
    }
  }, [tick, stop])

  useEffect(() => {
    if (state !== 'active') return
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(tick, configRef.current.interval)
    return () => clearInterval(intervalRef.current)
  }, [tick, state])

  return {
    state, focus, sensitivity, confidence, error,
    activate: start, deactivate: stop,
    setSensitivity: changeSensitivity,
  }
}
