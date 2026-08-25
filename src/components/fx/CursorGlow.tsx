import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

/** Soft light that trails the pointer, plus a small ring that grows over links. */
export function CursorGlow() {
  const reduce = useReducedMotion()
  const [fine] = useState(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  const [hot, setHot] = useState(false)
  const enabled = fine && !reduce
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const glowX = useSpring(x, { stiffness: 120, damping: 22, mass: 0.6 })
  const glowY = useSpring(y, { stiffness: 120, damping: 22, mass: 0.6 })
  const ringX = useSpring(x, { stiffness: 380, damping: 30 })
  const ringY = useSpring(y, { stiffness: 380, damping: 30 })

  useEffect(() => {
    if (!enabled) return

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      const target = event.target as HTMLElement | null
      setHot(Boolean(target?.closest('a, button, [data-cursor="hot"]')))
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ x: glowX, y: glowY }}
        className="pointer-events-none fixed top-0 left-0 z-[60] hidden -translate-x-1/2 -translate-y-1/2 md:block"
      >
        <div className="h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(46,230,199,0.13),transparent_62%)] blur-2xl" />
      </motion.div>
      <motion.div
        aria-hidden="true"
        style={{ x: ringX, y: ringY }}
        animate={{ scale: hot ? 1.9 : 1, opacity: hot ? 0.9 : 0.5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className="pointer-events-none fixed top-0 left-0 z-[61] hidden -translate-x-1/2 -translate-y-1/2 md:block"
      >
        <div className="h-6 w-6 rounded-full border border-teal/70" />
      </motion.div>
    </>
  )
}
