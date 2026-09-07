import { useRef } from 'react'
import type { MouseEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import type { Project } from '../data/projects'
import { easeOutExpo } from '../motion'
import { IconArrow } from './Icons'

type Props = {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: Props) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-50, 50], [8, -8]), { stiffness: 180, damping: 18 })
  const rotateY = useSpring(useTransform(x, [-50, 50], [-8, 8]), { stiffness: 180, damping: 18 })

  function onMove(event: MouseEvent<HTMLAnchorElement>) {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const localX = event.clientX - rect.left
    const localY = event.clientY - rect.top
    x.set(localX - rect.width / 2)
    y.set(localY - rect.height / 2)
    ref.current.style.setProperty('--mx', `${localX}px`)
    ref.current.style.setProperty('--my', `${localY}px`)
  }

  function onLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={project.url}
      target="_blank"
      rel="noreferrer"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={reduce ? false : { opacity: 0, y: 46, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.8, delay: index * 0.09, ease: easeOutExpo }}
      whileHover={reduce ? undefined : { y: -8 }}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1000 }}
      className={`spotlight group relative flex flex-col overflow-hidden border border-line bg-steel/40 p-6 transition-[border-color,box-shadow] duration-300 hover:border-teal/50 hover:shadow-[0_28px_60px_-30px_rgba(46,230,199,0.6)] sm:p-8 ${
        project.featured ? 'md:col-span-2' : ''
      }`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-teal/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100 md:opacity-0"
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-[0.7rem] tracking-[0.24em] text-amber uppercase">
          {String(index + 1).padStart(2, '0')} / {project.stack}
          {project.featured ? ' · Featured' : ''}
        </p>
        {project.freelance ? (
          <motion.span
            whileHover={reduce ? undefined : { scale: 1.06 }}
            className="border border-teal/30 bg-teal-dim px-2 py-0.5 text-[0.65rem] tracking-[0.16em] text-teal uppercase"
          >
            Freelance
          </motion.span>
        ) : null}
      </div>

      <div className="mb-2 flex items-start justify-between gap-4">
        <h3 className="font-display text-2xl font-bold tracking-tight text-paper transition-colors duration-300 group-hover:text-teal sm:text-3xl">
          {project.title}
        </h3>
        <IconArrow className="mt-1 h-4 w-4 shrink-0 text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-teal" />
      </div>

      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">{project.blurb}</p>

      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.4 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}
        className="mt-6 flex flex-wrap gap-2"
      >
        {project.tags.map((tag) => (
          <motion.li
            key={tag}
            variants={{
              hidden: reduce ? {} : { opacity: 0, y: 10, scale: 0.9 },
              show: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: 'spring', stiffness: 340, damping: 22 },
              },
            }}
            className="border border-teal/20 bg-teal-dim px-2.5 py-1 text-[0.7rem] tracking-[0.08em] text-teal uppercase transition-colors duration-200 hover:border-teal/60"
          >
            {tag}
          </motion.li>
        ))}
      </motion.ul>
    </motion.a>
  )
}
