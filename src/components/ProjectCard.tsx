import { useRef } from 'react'
import type { MouseEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import type { Project } from '../data/projects'
import { IconArrow } from './Icons'

const ease = [0.22, 1, 0.36, 1] as const

type Props = {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: Props) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-40, 40], [5, -5]), { stiffness: 180, damping: 18 })
  const rotateY = useSpring(useTransform(x, [-40, 40], [-5, 5]), { stiffness: 180, damping: 18 })

  function onMove(event: MouseEvent<HTMLAnchorElement>) {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set(event.clientX - rect.left - rect.width / 2)
    y.set(event.clientY - rect.top - rect.height / 2)
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
      initial={{ opacity: 0, y: project.featured ? 32 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: project.featured ? 0.65 : 0.5, delay: index * 0.08, ease }}
      whileHover={reduce ? undefined : { y: -6 }}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      className={`group relative flex flex-col border border-line bg-steel/40 p-6 shadow-none transition-[border-color,box-shadow] duration-200 hover:border-teal/50 hover:shadow-[0_18px_40px_-24px_rgba(46,230,199,0.55)] sm:p-8 ${
        project.featured ? 'md:col-span-2' : ''
      }`}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-[0.7rem] tracking-[0.24em] text-amber uppercase">
          {String(index + 1).padStart(2, '0')} / {project.stack}
          {project.featured ? ' · Featured' : ''}
        </p>
        {project.freelance ? (
          <span className="border border-teal/30 bg-teal-dim px-2 py-0.5 text-[0.65rem] tracking-[0.16em] text-teal uppercase">
            Freelance
          </span>
        ) : null}
      </div>
      <div className="mb-2 flex items-start justify-between gap-4">
        <h3 className="font-display text-2xl font-bold tracking-tight text-paper sm:text-3xl">
          {project.title}
        </h3>
        <IconArrow className="mt-1 h-4 w-4 shrink-0 text-muted transition-colors duration-200 group-hover:text-teal" />
      </div>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">{project.blurb}</p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="border border-teal/20 bg-teal-dim px-2.5 py-1 text-[0.7rem] tracking-[0.08em] text-teal uppercase"
          >
            {tag}
          </li>
        ))}
      </ul>
    </motion.a>
  )
}
