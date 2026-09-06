import { useRef } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'

type Props = {
  children: ReactNode
  className?: string
  /** Max tilt in degrees. */
  max?: number
}

/**
 * Pointer-follow 3D tilt with a soft glare that tracks the cursor.
 * Use on panels that are currently flat to give them physical depth on hover.
 */
export function Tilt({ children, className, max = 9 }: Props) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), { stiffness: 200, damping: 18 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), { stiffness: 200, damping: 18 })
  const glareX = useTransform(x, [-0.5, 0.5], ['30%', '70%'])
  const glareY = useTransform(y, [-0.5, 0.5], ['30%', '70%'])
  const glare = useTransform([glareX, glareY], ([gx, gy]) => `radial-gradient(240px circle at ${gx} ${gy}, rgba(46,230,199,0.14), transparent 60%)`)

  function onMove(event: MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((event.clientX - rect.left) / rect.width - 0.5)
    y.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  function onLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1000, transformStyle: 'preserve-3d' }}
      className={`group relative ${className ?? ''}`}
    >
      {children}
      {!reduce ? (
        <motion.div
          aria-hidden="true"
          style={{ background: glare }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      ) : null}
    </motion.div>
  )
}
