import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { easeOutExpo } from '../motion'
import { SplitText } from './fx/SplitText'

type Props = {
  index: string
  title: string
  children?: ReactNode
}

export function SectionHeading({ index, title, children }: Props) {
  const reduce = useReducedMotion()

  return (
    <div className="mb-10 flex flex-col gap-3 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <motion.p
          initial={reduce ? false : { opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.55, ease: easeOutExpo }}
          className="mb-2 flex items-center gap-3 font-display text-[0.72rem] font-semibold tracking-[0.28em] text-amber uppercase"
        >
          <motion.span
            aria-hidden="true"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
            className="block h-px w-8 origin-left bg-amber"
          />
          {index}
        </motion.p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-paper sm:text-4xl">
          <SplitText text={title} inView stagger={0.028} />
        </h2>
      </div>
      {children ? (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
          className="max-w-md text-sm text-muted sm:text-right"
        >
          {children}
        </motion.div>
      ) : null}
    </div>
  )
}
