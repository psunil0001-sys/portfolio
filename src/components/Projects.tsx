import { motion, useReducedMotion } from 'framer-motion'
import { useSite } from '../data/SiteProvider'
import { ProjectCard } from './ProjectCard'
import { SectionHeading } from './SectionHeading'

export function Projects() {
  const { projects, profile, loading } = useSite()
  const reduce = useReducedMotion()

  return (
    <section id="projects" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="03 / Build log" title="Projects">
          Freelance and independent work on{' '}
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="underline-sweep text-teal"
          >
            github.com/psunil0001-sys
          </a>
          {loading ? (
            <motion.span
              animate={reduce ? undefined : { opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="ml-1 inline-block text-teal"
            >
              · refreshing from GitHub…
            </motion.span>
          ) : (
            ' · live from GitHub'
          )}
        </SectionHeading>

        <div className="grid gap-4 md:grid-cols-2" style={{ perspective: 1400 }}>
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
