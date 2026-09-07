import { useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * ScrollTrigger section reveals for main content blocks.
 * Skipped when the user prefers reduced motion. Hero (#top) is left to Framer.
 */
export function GsapScroll() {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    let cancelled = false
    let tweens: { kill: () => void }[] = []
    let cleanupProps: (() => void) | undefined

    void import('../../lib/gsap').then(({ registerGsap }) => {
      if (cancelled) return
      const { gsap } = registerGsap()
      const sections = Array.from(document.querySelectorAll<HTMLElement>('main section')).filter(
        (section) => section.id !== 'top',
      )
      tweens = sections.map((section) =>
        gsap.fromTo(
          section,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 84%',
              once: true,
            },
          },
        ),
      )
      cleanupProps = () => gsap.set(sections, { clearProps: 'transform,opacity,visibility' })
    })

    return () => {
      cancelled = true
      tweens.forEach((tween) => tween.kill())
      cleanupProps?.()
    }
  }, [reduce])

  return null
}
