import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789/#*<>=+·'

type Props = {
  text: string
  className?: string
  /** Duration of the scramble in milliseconds. */
  duration?: number
}

/**
 * Decodes a string into place with a brief scramble, once it scrolls into view.
 * Good for short mono-style labels that should feel "computed" rather than static.
 */
export function ScrambleText({ text, className, duration = 900 }: Props) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(text)
  const [inView, setInView] = useState(false)
  const frame = useRef(0)

  useEffect(() => {
    if (reduce || !inView) return
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      // Reveal left-to-right: characters before the threshold lock in, the rest scramble.
      const locked = Math.floor(progress * text.length)
      let next = ''
      for (let i = 0; i < text.length; i += 1) {
        const original = text[i]
        if (original === ' ' || i < locked) {
          next += original
        } else {
          next += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        }
      }
      setDisplay(next)
      frame.current = window.requestAnimationFrame(tick)
    }

    frame.current = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame.current)
  }, [inView, reduce, text, duration])

  useEffect(() => {
    if (reduce) return
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        setInView(Boolean(entries[0]?.isIntersecting))
      },
      { threshold: 0.5 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [reduce])

  if (reduce) {
    return <span ref={ref} className={className}>{text}</span>
  }

  return (
    <span ref={ref} className={className} aria-label={text}>
      {display}
    </span>
  )
}
