import { useState, useEffect } from 'react'
import { RAFFLE_INTERVAL } from '../lib/constants'

export function useCountdown(lastTimestamp: bigint) {
  const [secondsLeft, setSecondsLeft] = useState(0)

  useEffect(() => {
    if (lastTimestamp === 0n) return

    function tick() {
      const deadline = Number(lastTimestamp) + RAFFLE_INTERVAL
      const now = Math.floor(Date.now() / 1000)
      setSecondsLeft(Math.max(0, deadline - now))
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [lastTimestamp])

  const isExpired = secondsLeft === 0 && lastTimestamp > 0n
  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, '0')
  const seconds = (secondsLeft % 60).toString().padStart(2, '0')

  return { minutes, seconds, isExpired, secondsLeft }
}
