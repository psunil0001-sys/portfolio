import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

type Burst = {
  id: number
  x: number
  y: number
}

type Particle = {
  angle: number
  distance: number
  size: number
  hue: 'teal' | 'amber'
  duration: number
}

const PALETTE = [
  'rgba(46,230,199,0.95)',
  'rgba(46,230,199,0.7)',
  'rgba(240,180,41,0.9)',
  'rgba(232,238,244,0.85)',
]

function buildParticles(): Particle[] {
  const count = 10
  return Array.from({ length: count }, (_, i) => ({
    angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6,
    distance: 42 + Math.random() * 46,
    size: 3 + Math.random() * 4,
    hue: Math.random() > 0.4 ? 'teal' : 'amber',
    duration: 0.55 + Math.random() * 0.35,
  }))
}

let counter = 0

/** Spawns a small burst of particles wherever the pointer taps down. */
export function CursorRipple() {
  const reduce = useReducedMotion()
  const [bursts, setBursts] = useState<Burst[]>([])
  const timeouts = useRef<number[]>([])

  const clear = useCallback(() => {
    timeouts.current.forEach((id) => window.clearTimeout(id))
    timeouts.current = []
  }, [])

  useEffect(() => {
    if (reduce) return

    const onDown = (event: PointerEvent) => {
      const id = ++counter
      setBursts((current) => [...current, { id, x: event.clientX, y: event.clientY }])
      const timeout = window.setTimeout(() => {
        setBursts((current) => current.filter((burst) => burst.id !== id))
      }, 1000)
      timeouts.current.push(timeout)
    }

    window.addEventListener('pointerdown', onDown, { passive: true })
    return () => {
      window.removeEventListener('pointerdown', onDown)
      clear()
    }
  }, [reduce, clear])

  if (reduce) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[65] overflow-hidden">
      <AnimatePresence>
        {bursts.map((burst) => (
          <BurstView key={burst.id} x={burst.x} y={burst.y} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function BurstView({ x, y }: { x: number; y: number }) {
  const [particles] = useState(buildParticles)

  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <motion.span
        aria-hidden="true"
        initial={{ scale: 0, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="block h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal/60"
      />
      {particles.map((particle, i) => {
        const color = PALETTE[i % PALETTE.length]
        const dx = Math.cos(particle.angle) * particle.distance
        const dy = Math.sin(particle.angle) * particle.distance
        return (
          <motion.span
            key={i}
            aria-hidden="true"
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{ x: dx, y: dy, scale: 0, opacity: 0 }}
            transition={{ duration: particle.duration, ease: 'easeOut' }}
            className="absolute left-0 top-0 rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              background: color,
              boxShadow: particle.hue === 'teal' ? '0 0 8px rgba(46,230,199,0.8)' : '0 0 8px rgba(240,180,41,0.8)',
            }}
          />
        )
      })}
    </div>
  )
}
