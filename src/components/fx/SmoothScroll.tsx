import { useEffect } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from 'framer-motion'

/**
 * Butter-smooth inertia scrolling powered by Lenis.
 *
 * - Takes over wheel/touch scrolling with a spring-like easing so the whole page feels fluid.
 * - Intercepts in-page anchor links (nav, "Contact", "Scroll" cue) and glides to them via
 *   lenis.scrollTo instead of a native jump.
 * - Syncs Lenis to GSAP ScrollTrigger so section reveals stay aligned with smooth scroll.
 * - Fully disabled when the user prefers reduced motion, falling back to native scrolling.
 */
export function SmoothScroll() {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return

    // Lenis owns the easing; native CSS smooth-scroll would double it up.
    const previous = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = 'auto'

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    })

    let cancelled = false
    let detachScroll: (() => void) | undefined
    void import('../../lib/gsap').then(({ registerGsap }) => {
      if (cancelled) return
      const { ScrollTrigger } = registerGsap()
      detachScroll = lenis.on('scroll', () => ScrollTrigger.update())
    })

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Glide to any in-page hash target (e.g. #contact, #about) rather than a hard jump.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return
      const id = anchor.getAttribute('href')
      if (!id || id === '#') return
      const target = document.querySelector(id)
      if (!target) return
      event.preventDefault()
      lenis.scrollTo(target as HTMLElement, { offset: -80 })
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      document.removeEventListener('click', onClick)
      detachScroll?.()
      lenis.destroy()
      document.documentElement.style.scrollBehavior = previous
    }
  }, [reduce])

  return null
}
