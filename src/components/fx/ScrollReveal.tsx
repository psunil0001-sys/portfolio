import { useRef } from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

type ScrollOptions = NonNullable<Parameters<typeof useScroll>[0]>
type Props = {
  children: ReactNode
  className?: string
  /** Vertical travel in px as the element comes in. */
  y?: number
  /** Scroll window (framer-motion offsets) over which the reveal scrubs. */
  offset?: ScrollOptions['offset']
}

/**
 * A reveal that scrubs with the scroll position rather than firing once.
 *
 * Unlike `Reveal` (a one-shot whileInView animation), this maps an element's
 * `scrollYProgress` onto opacity / translate, so it fills in gradually as you
 * scroll it into view and eases back out if you scroll away. Filter blur is
 * omitted so a last-section scrub that never reaches 1 stays readable.
 * Pairs well with Lenis smooth scrolling, whose inertia keeps the scrub fluid.
 */
export function ScrollReveal({ children, className, y = 32, offset = ['start 88%', 'start 42%'] }: Props) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: ref, offset })
  // Finish opacity/y before the offset end so last-on-page blocks still land
  // fully visible when there is not enough room to scroll past them.
  const opacity = useTransform(scrollYProgress, [0, 0.55, 1], [0, 1, 1])
  const translateY = useTransform(scrollYProgress, [0, 0.55, 1], [y, 0, 0])

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y: translateY }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
