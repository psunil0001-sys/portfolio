import { useSite } from '../data/SiteProvider'
import { ProjectCard } from './ProjectCard'
import { SectionHeading } from './SectionHeading'

export function Projects() {
  const { projects, profile } = useSite()

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
