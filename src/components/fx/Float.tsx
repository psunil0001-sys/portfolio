import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

type Props = {
  /** Tailwind classes controlling position + size, e.g. "top-10 left-8 h-14 w-14". */
  className?: string
  /** Visual element to float. Defaults to a thin ring. */
  children?: React.ReactNode
  /** How strongly it parallaxes with page scroll, in px. */
  parallax?: number
  /** Base vertical bob amplitude in px. */
  bob?: number
  /** Seconds per full drift cycle. */
  duration?: number
  delay?: number
}

/**
 * A small ambient element that bobs and drifts on its own while parallaxing against
 * page scroll. Scatter a few of these over the hero so it feels inhabited, not flat.
 */
export function Float({
  className,
  children,
  parallax = 40,
  bob = 14,
  duration = 7,
  delay = 0,
}: Props) {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const parallaxY = useTransform(scrollY, [0, 900], [0, -parallax])

  return (
    <motion.div
      style={reduce ? undefined : { y: parallaxY }}
      aria-hidden="true"
      className={`pointer-events-none absolute ${className ?? ''}`}
    >
      <motion.div
        animate={
          reduce
            ? undefined
            : { y: [0, -bob, 0, bob * 0.6, 0], x: [0, 6, -6, 3, 0], rotate: [0, 4, -4, 2, 0] }
        }
        transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
        className="h-full w-full"
      >
        {children ?? <span className="block h-full w-full rounded-full border border-teal/30" />}
      </motion.div>
    </motion.div>
  )
}
