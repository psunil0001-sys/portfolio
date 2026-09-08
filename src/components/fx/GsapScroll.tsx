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
      tweens = sections.flatMap((section, index) => {
        const isLast = index === sections.length - 1
        // Do not start the last section from autoAlpha 0. Its trigger start is
        // often past max scroll, so the tween would never play and the block
        // (Contact) would stay faded at the bottom of the page.
        if (isLast) return []
        return [
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
                toggleActions: 'play reverse play reverse',
              },
            },
          ),
        ]
      })
      cleanupProps = () =>
        gsap.set(
          sections.filter((_, index) => index !== sections.length - 1),
          { clearProps: 'transform,opacity,visibility' },
        )
    })

    return () => {
      cancelled = true
      tweens.forEach((tween) => tween.kill())
      cleanupProps?.()
    }
  }, [reduce])

  return null
}
