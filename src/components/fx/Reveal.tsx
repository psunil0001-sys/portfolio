import type { ElementType, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { easeOutExpo, viewportOnce } from '../../motion'

type Props = {
  children: ReactNode
  as?: ElementType
  className?: string
  delay?: number
  y?: number
  blur?: boolean
  once?: boolean
  amount?: number
}

export function Reveal({
  children,
  as = 'div',
  className,
  delay = 0,
  y = 26,
  blur = true,
  once = viewportOnce.once,
  amount = viewportOnce.amount,
}: Props) {
  const reduce = useReducedMotion()
  const Component = motion[as as 'div'] ?? motion.div

  if (reduce) {
    return <Component className={className}>{children}</Component>
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y, filter: blur ? 'blur(10px)' : 'blur(0px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, amount }}
      transition={{ duration: 0.75, delay, ease: easeOutExpo }}
    >
      {children}
    </Component>
  )
}
