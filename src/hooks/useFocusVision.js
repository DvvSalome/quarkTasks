import { useState } from 'react'

export default function useFocusVision() {
  const [state, setState] = useState('idle')
  const [focus, setFocus] = useState('unknown')
  const [error, setError] = useState(null)

  const activate = async () => {
    setState('requesting')
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(t => t.stop())
      setState('active')
      setFocus('focused')
    } catch (err) {
      setState('error')
      setError(err.message || 'Error desconocido')
    }
  }

  const deactivate = () => {
    setState('idle')
    setFocus('unknown')
    setError(null)
  }

  return {
    state, focus, error, sensitivity: 'normal', confidence: 0,
    activate, deactivate,
    setSensitivity: () => {},
  }
}
