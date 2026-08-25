import { motion, useReducedMotion } from 'framer-motion'

type Props = {
  items: string[]
  speed?: number
  reverse?: boolean
  className?: string
}

/** Infinite horizontal ticker. Items are duplicated so the loop is seamless. */
export function Marquee({ items, speed = 28, reverse = false, className }: Props) {
  const reduce = useReducedMotion()
  const loop = [...items, ...items]

  const row = (
    <div className="flex shrink-0 items-center gap-8 pr-8">
      {loop.map((item, index) => (
        <span key={`${item}-${index}`} className="flex items-center gap-8 whitespace-nowrap">
          <span className="font-display text-sm tracking-[0.22em] text-muted uppercase">{item}</span>
          <span className="h-1 w-1 rounded-full bg-teal/60" aria-hidden="true" />
        </span>
      ))}
    </div>
  )

  if (reduce) {
    return (
      <div className={`overflow-hidden ${className ?? ''}`} aria-hidden="true">
        {row}
      </div>
    )
  }

  return (
    <div className={`marquee-mask overflow-hidden ${className ?? ''}`} aria-hidden="true">
      <motion.div
        className="flex w-max"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        {row}
        {row}
      </motion.div>
    </div>
  )
}
