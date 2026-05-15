import { useState, useRef, useEffect, useCallback } from 'react'

// ─── Tunables ────────────────────────────────────────────────────────────────
const DETECT_INTERVAL_MS        = 1200
const MISS_UNSTABLE             = 1
const MISS_DISTRACTED           = 3
const INACTIVITY_PENALTY_START  = 25_000
const EMA_ALPHA_DROP            = 0.65  // fast drop when face absent
const EMA_ALPHA_RISE            = 0.35  // slower recovery
const CAL_SAMPLES               = 10    // frames collected during calibration
const CAL_SAMPLE_INTERVAL_MS    = 350

// ─── Detect face once (shared by tick + calibration) ─────────────────────────
async function detectOnce(detector, video, canvas) {
  if (!video || !canvas || video.readyState < 2) return null

  if (detector) {
    try {
      const faces = await detector.detect(video)
      if (faces.length > 0) {
        const b  = faces[0].boundingBox
        const fw = video.videoWidth  || 320
        const fh = video.videoHeight || 240
        return {
          detected:   true,
          x:          (b.x + b.width  / 2) / fw,
          y:          (b.y + b.height / 2) / fh,
          area:       (b.width * b.height) / (fw * fh),
          confidence: 1,
        }
      }
      return { detected: false }
    } catch {
      return canvasAnalyze(video, canvas)
    }
  }
  return canvasAnalyze(video, canvas)
}

// ─── Canvas skin-tone fallback ────────────────────────────────────────────────
function canvasAnalyze(video, canvas) {
  if (!video || video.readyState < 2) return null
  const vw = video.videoWidth  || 320
  const vh = video.videoHeight || 240
  canvas.width  = vw
  canvas.height = vh

  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(video, 0, 0, vw, vh)

  // Three regions — center full, upper half, lower half
  const regions = [
    { x: 0.20, y: 0.10, w: 0.60, h: 0.80 },
    { x: 0.25, y: 0.10, w: 0.50, h: 0.45 },
    { x: 0.30, y: 0.45, w: 0.40, h: 0.45 },
  ]

  const results = regions.map(r => {
    const px = Math.round(r.x * vw), py = Math.round(r.y * vh)
    const pw = Math.round(r.w * vw), ph = Math.round(r.h * vh)
    if (pw <= 0 || ph <= 0) return { skinRatio: 0, darkRatio: 0 }
    const img = ctx.getImageData(px, py, pw, ph).data

    let skin = 0, dark = 0, total = pw * ph
    for (let i = 0; i < img.length; i += 4) {
      const R = img[i], G = img[i + 1], B = img[i + 2]
      const lum = 0.299 * R + 0.587 * G + 0.114 * B
      if (lum < 30) { dark++; continue }
      if (
        R > 60 && G > 30 && B > 15 &&
        R > G && R > B &&
        (R - Math.min(G, B)) > 15 &&
        Math.max(R,G,B) - Math.min(R,G,B) > 10 &&
        R < 255
      ) skin++
    }
    return { skinRatio: skin / total, darkRatio: dark / total }
  })

  if (results[0].darkRatio > 0.85) return { detected: false, reason: 'dark' }

  const hasFace = results[0].skinRatio > 0.06 &&
    (results[1].skinRatio > 0.05 || results[2].skinRatio > 0.05)

  if (!hasFace) return { detected: false, reason: 'no-skin' }

  // Estimate horizontal position via column sampling
  const colW = Math.round(vw / 3)
  const colSkins = [0, 1, 2].map(col => {
    const d = ctx.getImageData(col * colW, Math.round(vh * 0.1), colW, Math.round(vh * 0.8)).data
    let s = 0, t = colW * Math.round(vh * 0.8)
    for (let i = 0; i < d.length; i += 4) {
      const R = d[i], G = d[i+1], B = d[i+2]
      if (R > 60 && G > 30 && B > 15 && R > G && R > B && (R - Math.min(G,B)) > 15) s++
    }
    return t > 0 ? s / t : 0
  })
  const bestCol = colSkins.indexOf(Math.max(...colSkins))
  const faceX   = (bestCol + 0.5) / 3

  return {
    detected:   true,
    x:          faceX,
    y:          0.45,
    area:       Math.min(0.25, results[0].skinRatio * 0.4),
    confidence: Math.min(1, results[0].skinRatio / 0.20),
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export default function useFocusVision() {
  const [state,       setState]       = useState('idle')
  const [focusState,  setFocusState]  = useState('focused')
  const [focusScore,  setFocusScore]  = useState(100)
  const [error,       setError]       = useState(null)
  const [stream,      setStream]      = useState(null)
  const [detMethod,   setDetMethod]   = useState('none')
  const [calibration, setCalibration] = useState(null)   // null | { x, y, area, samples }
  const [calibrating, setCalibrating] = useState(false)

  const videoRef        = useRef(null)
  const canvasRef       = useRef(null)
  const streamRef       = useRef(null)
  const detectorRef     = useRef(null)
  const intervalRef     = useRef(null)
  const runningRef      = useRef(false)
  const missCountRef    = useRef(0)
  const smoothRef       = useRef(100)
  const lastActivityRef = useRef(Date.now())
  const calRef          = useRef(null)  // mirror of calibration state for tick()

  // Keep calRef in sync so tick() always has latest without stale closure
  const setCalibrationBoth = useCallback((cal) => {
    calRef.current = cal
    setCalibration(cal)
  }, [])

  // ── Activity tracking ──────────────────────────────────────────────────────
  const bumpActivity = useCallback(() => {
    lastActivityRef.current = Date.now()
  }, [])

  useEffect(() => {
    if (state !== 'active') return
    const evts = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart']
    evts.forEach(e => window.addEventListener(e, bumpActivity, { passive: true }))
    return () => evts.forEach(e => window.removeEventListener(e, bumpActivity))
  }, [state, bumpActivity])

  // ── Tab hidden → instant 0 ─────────────────────────────────────────────────
  useEffect(() => {
    if (state !== 'active') return
    const handler = () => {
      if (document.hidden) {
        smoothRef.current    = 0
        missCountRef.current = MISS_DISTRACTED
        setFocusScore(0)
        setFocusState('distracted')
      } else {
        bumpActivity()
      }
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [state, bumpActivity])

  // ── Detection tick ─────────────────────────────────────────────────────────
  const tick = useCallback(async () => {
    if (runningRef.current) return
    runningRef.current = true

    try {
      const face     = await detectOnce(detectorRef.current, videoRef.current, canvasRef.current)
      const inactive = Date.now() - lastActivityRef.current
      const cal      = calRef.current

      let rawScore = 0

      if (!face || !face.detected) {
        missCountRef.current++
        rawScore = missCountRef.current >= MISS_DISTRACTED ? 0 : 30
      } else {
        missCountRef.current = 0

        if (cal) {
          // ── Calibration-based deviation ──────────────────────────────────
          // Tolerance bands: ±0.20 in X, ±0.18 in Y before penalty kicks in
          const tolX = 0.20, tolY = 0.18
          const rawDx = Math.max(0, Math.abs(face.x - cal.x) - tolX) / tolX
          const rawDy = Math.max(0, Math.abs(face.y - cal.y) - tolY) / tolY
          const deviation = Math.sqrt(rawDx * rawDx + rawDy * rawDy)

          // Area change (user moved far back or camera shifted)
          const areaRatio   = cal.area > 0 ? face.area / cal.area : 1
          const areaPenalty = areaRatio < 0.35 ? 25 : areaRatio < 0.55 ? 12 : 0

          const devPenalty  = Math.min(55, deviation * 55)
          const inactPenalty = inactive > INACTIVITY_PENALTY_START
            ? Math.min(15, (inactive - INACTIVITY_PENALTY_START) / 3_000)
            : 0

          rawScore = Math.round(100 - devPenalty - areaPenalty - inactPenalty)
        } else {
          // ── No calibration: face present = focused, inactivity secondary ──
          const inactPenalty = inactive > INACTIVITY_PENALTY_START
            ? Math.min(20, (inactive - INACTIVITY_PENALTY_START) / 2_500)
            : 0
          rawScore = Math.round(92 - inactPenalty)
        }
      }

      rawScore = Math.max(0, Math.min(100, rawScore))

      // EMA — drop fast, rise slow
      const alpha       = rawScore < smoothRef.current ? EMA_ALPHA_DROP : EMA_ALPHA_RISE
      smoothRef.current = alpha * rawScore + (1 - alpha) * smoothRef.current
      const score       = Math.round(Math.max(0, Math.min(100, smoothRef.current)))
      const nextState   = score <= 15 ? 'distracted' : score <= 58 ? 'unstable' : 'focused'

      setFocusScore(score)
      setFocusState(nextState)
    } finally {
      runningRef.current = false
    }
  }, [])

  useEffect(() => {
    if (state !== 'active') return
    tick()
    intervalRef.current = setInterval(tick, DETECT_INTERVAL_MS)
    return () => clearInterval(intervalRef.current)
  }, [state, tick])

  // ── Calibration ────────────────────────────────────────────────────────────
  const startCalibration = useCallback(async () => {
    const video    = videoRef.current
    const canvas   = canvasRef.current
    const detector = detectorRef.current
    if (!video || !canvas) return

    setCalibrating(true)
    const samples = []

    for (let i = 0; i < CAL_SAMPLES; i++) {
      await new Promise(r => setTimeout(r, CAL_SAMPLE_INTERVAL_MS))
      const face = await detectOnce(detector, video, canvas)
      if (face?.detected) samples.push({ x: face.x, y: face.y, area: face.area })
    }

    setCalibrating(false)

    if (samples.length < 4) return  // not enough data, cancel silently

    const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length
    const cal = {
      x:       avg(samples.map(s => s.x)),
      y:       avg(samples.map(s => s.y)),
      area:    avg(samples.map(s => s.area)),
      samples: samples.length,
    }
    setCalibrationBoth(cal)
    // Reset smooth so the calibrated state starts clean
    smoothRef.current = 100
    missCountRef.current = 0
  }, [setCalibrationBoth])

  const clearCalibration = useCallback(() => {
    setCalibrationBoth(null)
  }, [setCalibrationBoth])

  // ── Activate ───────────────────────────────────────────────────────────────
  const activate = useCallback(async () => {
    setState('requesting')
    setError(null)
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      })
      streamRef.current = s
      setStream(s)

      const video = document.createElement('video')
      video.srcObject  = s
      video.muted      = true
      video.playsInline = true
      video.autoplay   = true
      await new Promise(resolve => {
        video.onloadedmetadata = resolve
        setTimeout(resolve, 3_000)
      })
      video.play().catch(() => {})
      videoRef.current  = video
      canvasRef.current = document.createElement('canvas')

      let detector = null
      if ('FaceDetector' in window) {
        try {
          detector = new window.FaceDetector({ maxDetectedFaces: 1, fastMode: true })
          if (video.readyState >= 2) await detector.detect(video).catch(() => {})
          setDetMethod('api')
        } catch {
          setDetMethod('canvas')
        }
      } else {
        setDetMethod('canvas')
      }
      detectorRef.current = detector

      missCountRef.current    = 0
      smoothRef.current       = 100
      lastActivityRef.current = Date.now()

      setState('active')
      setFocusState('focused')
      setFocusScore(100)
    } catch (err) {
      setError(err.message || 'Acceso a cámara denegado')
      setState('error')
    }
  }, [])

  // ── Deactivate ─────────────────────────────────────────────────────────────
  const deactivate = useCallback(() => {
    clearInterval(intervalRef.current)
    runningRef.current = false
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
      videoRef.current = null
    }
    canvasRef.current   = null
    detectorRef.current = null
    setStream(null)
    setState('idle')
    setFocusState('focused')
    setFocusScore(100)
    setError(null)
    setDetMethod('none')
    missCountRef.current  = 0
    smoothRef.current     = 100
  }, [])

  useEffect(() => () => { deactivate() }, [])

  return {
    state, focusState, focusScore, error, stream, detMethod,
    calibration, calibrating,
    activate, deactivate, startCalibration, clearCalibration,
  }
}
