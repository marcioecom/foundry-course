import { useEffect } from 'react'
import confetti from 'canvas-confetti'

export function Confetti() {
  useEffect(() => {
    const duration = 3000
    const end = Date.now() + duration

    function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#8b5cf6', '#a78bfa', '#c4b5fd'],
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#8b5cf6', '#a78bfa', '#c4b5fd'],
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()
  }, [])

  return null
}
