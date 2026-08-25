import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

type Props = {
  index: string
  title: string
  children?: ReactNode
}

export function SectionHeading({ index, title, children }: Props) {
  return (
    <div className="mb-10 flex flex-col gap-3 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 font-display text-[0.72rem] font-semibold tracking-[0.28em] text-amber uppercase">
          {index}
        </p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-paper sm:text-4xl">
          {title}
        </h2>
      </div>
      {children ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md text-sm text-muted sm:text-right"
        >
          {children}
        </motion.div>
      ) : null}
    </div>
  )
}
