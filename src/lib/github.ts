import type { Project } from '../data/projects'

const GITHUB_USER = 'psunil0001-sys'

type GithubRepo = {
  name: string
  html_url: string
  description: string | null
  language: string | null
  fork: boolean
  private?: boolean
  topics?: string[]
}

function titleFromRepo(name: string) {
  if (name.includes('-') && /[A-Z]/.test(name)) return name.replaceAll('-', ' ')
  return name
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function cleanDescription(value: string | null | undefined, fallback: string) {
  const text = (value || '').replace(/\s+/g, ' ').trim()
  if (!text || /^welcome to\b/i.test(text)) return fallback
  return text.slice(0, 360)
}

/** Single list call, no README fetches — safe as a live.json fallback. */
export async function fetchGithubProjects(): Promise<Project[]> {
  const response = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?type=owner&sort=pushed&per_page=100`,
  )
  if (!response.ok) throw new Error(`GitHub ${response.status}`)
  const repos = (await response.json()) as GithubRepo[]
  return repos
    .filter((repo) => !repo.fork && !repo.private)
    .map((repo) => {
      const title = titleFromRepo(repo.name)
      const tags = [...(repo.topics ?? [])]
      if (repo.language && !tags.includes(repo.language)) tags.unshift(repo.language)
      return {
        slug: repo.name,
        title,
        featured: false,
        freelance: false,
        blurb: cleanDescription(repo.description, `${title} source repository.`),
        tags: tags.slice(0, 8),
        url: repo.html_url,
        stack: repo.language || 'Project',
      } satisfies Project
    })
}
