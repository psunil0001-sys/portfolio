import { useSite } from '../data/SiteProvider'
import { ProjectCard } from './ProjectCard'
import { SectionHeading } from './SectionHeading'

export function Projects() {
  const { projects, profile, loading } = useSite()
  return (
    <section id="projects" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="03 / Build log" title="Projects">
          Freelance and independent work on{' '}
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="text-teal underline decoration-teal/40 underline-offset-4 hover:decoration-teal"
          >
            github.com/psunil0001-sys
          </a>
          {loading ? ' · refreshing from GitHub…' : ' · live from GitHub'}
        </SectionHeading>
        <div className="grid gap-4 md:grid-cols-2" style={{ perspective: 1200 }}>
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
