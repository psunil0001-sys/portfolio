import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

/** Slow drifting colour fields behind the whole page. */
export function Aurora() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const driftY = useTransform(scrollYProgress, [0, 1], [0, -160])
  const driftY2 = useTransform(scrollYProgress, [0, 1], [0, 220])

  const base = 'pointer-events-none absolute rounded-full blur-[90px] will-change-transform'

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        style={reduce ? undefined : { y: driftY }}
        animate={reduce ? undefined : { x: [0, 60, -30, 0], scale: [1, 1.12, 0.96, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        className={`${base} -top-40 -left-24 h-[520px] w-[520px] bg-teal/16`}
      />
      <motion.div
        style={reduce ? undefined : { y: driftY2 }}
        animate={reduce ? undefined : { x: [0, -70, 40, 0], scale: [1, 0.92, 1.1, 1] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className={`${base} top-[35%] -right-32 h-[560px] w-[560px] bg-amber/12`}
      />
      <motion.div
        animate={reduce ? undefined : { x: [0, 40, -50, 0], y: [0, -40, 30, 0] }}
        transition={{ duration: 38, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className={`${base} bottom-[-10%] left-[30%] h-[480px] w-[480px] bg-teal/10`}
      />
      <div className="noise-layer absolute inset-0" />
    </div>
  )
}
