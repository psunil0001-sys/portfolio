import type { ReactNode } from 'react'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import { easeOutExpo } from '../motion'
import { ScrambleText } from './fx/ScrambleText'
import { SplitText } from './fx/SplitText'

type Props = {
  index: string
  title: string
  children?: ReactNode
  /** Last-on-page headings should not reverse back into a hidden/blurred state. */
  once?: boolean
}

export function SectionHeading({ index, title, children, once = false }: Props) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLHeadingElement>(null)
  const viewport = { once, amount: 0.6 } as const

  const { scrollY } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rawVelocity = useVelocity(scrollY)
  // Smooth the raw velocity so the skew eases in and settles back rather than jittering.
  const velocity = useSpring(rawVelocity, { stiffness: 120, damping: 20, mass: 0.3 })
  // A subtle skew that leans with scroll velocity, then settles back — makes headings feel weighty.
  const skewX = useTransform(velocity, [-1800, 0, 1800], [3.5, 0, -3.5])

  return (
    <div className="mb-10 flex flex-col gap-3 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <motion.p
          initial={reduce || once ? false : { opacity: 0, x: -14 }}
          {...(once
            ? {}
            : { whileInView: { opacity: 1, x: 0 }, viewport })}
          transition={{ duration: 0.55, ease: easeOutExpo }}
          className="mb-2 flex items-center gap-3 font-display text-[0.72rem] font-semibold tracking-[0.28em] text-amber uppercase"
        >
          <motion.span
            aria-hidden="true"
            initial={reduce || once ? false : { scaleX: 0 }}
            {...(once
              ? {}
              : { whileInView: { scaleX: 1 }, viewport })}
            transition={{ duration: 0.7, ease: easeOutExpo }}
            className="block h-px w-8 origin-left bg-amber"
          />
          <ScrambleText text={index} />
        </motion.p>
        <motion.h2
          ref={ref}
          style={reduce ? undefined : { skewX }}
          className="font-display text-3xl font-bold tracking-tight text-paper will-change-transform sm:text-4xl"
        >
          {once ? title : <SplitText text={title} inView once={once} stagger={0.028} />}
        </motion.h2>
      </div>
      {children ? (
        <motion.div
          initial={reduce || once ? false : { opacity: 0, y: 12 }}
          {...(once
            ? {}
            : { whileInView: { opacity: 1, y: 0 }, viewport })}
          transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
          className="max-w-md text-sm text-muted sm:text-right"
        >
          {children}
        </motion.div>
      ) : null}
    </div>
  )
}
