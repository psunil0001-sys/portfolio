import type { Transition, Variants } from 'framer-motion'

export const ease = [0.22, 1, 0.36, 1] as const
export const easeOutExpo = [0.16, 1, 0.3, 1] as const

export const sectionIds = ['about', 'skills', 'projects', 'experience', 'education', 'contact'] as const

export const spring: Transition = { type: 'spring', stiffness: 220, damping: 26, mass: 0.9 }
export const softSpring: Transition = { type: 'spring', stiffness: 120, damping: 20 }

export const viewportOnce = { once: true, amount: 0.25 } as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: easeOutExpo },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94, filter: 'blur(8px)' },
  show: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.6, ease: easeOutExpo } },
}

export function staggerParent(stagger = 0.07, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  }
}
