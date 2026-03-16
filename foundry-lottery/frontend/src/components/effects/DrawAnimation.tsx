import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const fragments = [
  '0x7a69...f1c2',
  '0x3b8e...9d4a',
  '0xf2c1...0e8b',
  '0x9d4f...a7c3',
  '0x1e5b...d6f0',
  '0x6c8a...2b9e',
]

export function DrawAnimation() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % fragments.length)
    }, 150)
    return () => clearInterval(id)
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        className="draw-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div style={{ textAlign: 'center' }}>
          <div className="draw-label">{'>'} selecting winner...</div>
          <div className="draw-address">{fragments[current]}</div>
          <div className="draw-sub">
            // awaiting VRF response <span className="cursor-blink">_</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
