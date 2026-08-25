import { motion, useReducedMotion } from 'framer-motion'
import { easeOutExpo } from '../../motion'

type Props = {
  text: string
  className?: string
  delay?: number
}

/**
 * Masked slide-up for a single element.
 * Used instead of SplitText when the text carries a background-clip gradient,
 * which only paints when the glyphs live on the element that owns the background.
 */
export function WordReveal({ text, className, delay = 0 }: Props) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <span className={className}>{text}</span>
  }

  return (
    <span
      style={{
        display: 'block',
        overflow: 'hidden',
        paddingBottom: '0.12em',
        marginBottom: '-0.12em',
      }}
    >
      <motion.span
        initial={{ y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease: easeOutExpo }}
        className={className}
        style={{ display: 'block', willChange: 'transform' }}
      >
        {text}
      </motion.span>
    </span>
  )
}
