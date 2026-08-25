import { useRef } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

type Props = {
  children: ReactNode
  className?: string
  /** How far the element follows the pointer, 0-1. */
  strength?: number
}

/** Wraps content so it drifts toward the cursor, then springs back. */
export function Magnetic({ children, className, strength = 0.35 }: Props) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.6 })
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.6 })

  function onMove(event: MouseEvent<HTMLSpanElement>) {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((event.clientX - rect.left - rect.width / 2) * strength)
    y.set((event.clientY - rect.top - rect.height / 2) * strength)
  }

  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={reduce ? undefined : { x: springX, y: springY, display: 'inline-flex' }}
    >
      {children}
    </motion.span>
  )
}
