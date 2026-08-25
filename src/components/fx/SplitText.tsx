import { motion, useReducedMotion } from 'framer-motion'
import { easeOutExpo } from '../../motion'

type Props = {
  text: string
  className?: string
  delay?: number
  stagger?: number
  /** Animate on scroll into view instead of on mount. */
  inView?: boolean
}

/** Word-by-word mask reveal with a per-character lift. */
export function SplitText({ text, className, delay = 0, stagger = 0.03, inView = false }: Props) {
  const reduce = useReducedMotion()
  const words = text.split(' ')

  if (reduce) {
    return <span className={className}>{text}</span>
  }

  const animateProps = inView
    ? { whileInView: 'show' as const, viewport: { once: true, amount: 0.6 } }
    : { animate: 'show' as const }

  let index = -1

  return (
    <motion.span
      className={className}
      initial="hidden"
      {...animateProps}
      aria-label={text}
      style={{ display: 'inline-block' }}
    >
      {words.map((word, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'top',
            // Room for descenders so the mask does not clip glyphs like g/j/p.
            paddingBottom: '0.12em',
            marginBottom: '-0.12em',
          }}
        >
          {[...word].map((char) => {
            index += 1
            return (
              <motion.span
                key={`${char}-${index}`}
                aria-hidden="true"
                style={{ display: 'inline-block', willChange: 'transform' }}
                variants={{
                  hidden: { y: '110%', opacity: 0, rotate: 6 },
                  show: {
                    y: 0,
                    opacity: 1,
                    rotate: 0,
                    transition: { duration: 0.75, delay: delay + index * stagger, ease: easeOutExpo },
                  },
                }}
              >
                {char}
              </motion.span>
            )
          })}
          {wordIndex < words.length - 1 ? <span>&nbsp;</span> : null}
        </span>
      ))}
    </motion.span>
  )
}
