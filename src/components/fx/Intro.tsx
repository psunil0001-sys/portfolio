import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { easeOutExpo } from '../../motion'

/** Brief curtain over the page on first paint. */
export function Intro({ name }: { name: string }) {
  const reduce = useReducedMotion()
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (reduce) return
    const timer = window.setTimeout(() => setDone(true), 1150)
    return () => window.clearTimeout(timer)
  }, [reduce])

  useEffect(() => {
    if (reduce || done) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [reduce, done])

  if (reduce) return null

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink"
          exit={{ y: '-100%', transition: { duration: 0.8, ease: easeOutExpo } }}
        >
          <div className="overflow-hidden px-6">
            <motion.p
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: easeOutExpo }}
              className="font-display text-2xl font-extrabold tracking-[0.2em] text-paper uppercase sm:text-4xl"
            >
              {name}
            </motion.p>
          </div>
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: easeOutExpo }}
            className="absolute bottom-0 left-0 h-[3px] w-full origin-left bg-teal"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
