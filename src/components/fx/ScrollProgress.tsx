import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

export function ScrollProgress() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduce) return
    const el = ref.current
    if (!el) return
    let cancelled = false
    let tween: { kill: () => void } | undefined

    void import('../../lib/gsap').then(({ registerGsap }) => {
      if (cancelled) return
      const { gsap } = registerGsap()
      tween = gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          transformOrigin: 'left center',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.25,
          },
        },
      )
    })

    return () => {
      cancelled = true
      tween?.kill()
    }
  }, [reduce])

  if (reduce) return null

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-teal via-amber to-teal"
      style={{ transform: 'scaleX(0)' }}
    />
  )
}
