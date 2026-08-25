import type { Project } from '../data/projects'

const GITHUB_USER = 'psunil0001-sys'

type GithubRepo = {
  name: string
  html_url: string
  description: string | null
  language: string | null
  fork: boolean
  pushed_at: string
  default_branch: string
  topics?: string[]
}

function titleFromRepo(name: string) {
  if (name.includes('-') && /[A-Z]/.test(name)) return name.replaceAll('-', ' ')
  return name
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function blurbFromReadme(markdown: string, fallback: string) {
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, '')
  const lines = withoutCode.split('\n').map((line) => line.trim())
  const chunks: string[] = []
  for (const line of lines) {
    if (!line || line.startsWith('#') || line.startsWith('!') || line.startsWith('|') || line.startsWith('>')) {
      continue
    }
    const plain = line.replace(/[*_`[\]]/g, '').replace(/\(https?:\/\/[^)]+\)/g, '')
    if (plain.length > 40) chunks.push(plain)
    if (chunks.join(' ').length > 220) break
  }
  const text = chunks.join(' ').replace(/\s+/g, ' ').trim()
  return text.slice(0, 360) || fallback
}

async function readmeBlurb(repo: GithubRepo) {
  const names = ['README.md', 'Readme.md', 'readme.md']
  for (const file of names) {
    const url = `https://raw.githubusercontent.com/${GITHUB_USER}/${repo.name}/${repo.default_branch}/${file}`
    const response = await fetch(url)
    if (!response.ok) continue
    const markdown = await response.text()
    return blurbFromReadme(markdown, repo.description || `${titleFromRepo(repo.name)} freelance project.`)
  }
  return repo.description || `${titleFromRepo(repo.name)} freelance project.`
}

export async function fetchGithubProjects(): Promise<Project[]> {
  const response = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&per_page=30`,
  )
  if (!response.ok) throw new Error(`GitHub ${response.status}`)
  const repos = (await response.json()) as GithubRepo[]
  const own = repos.filter((repo) => !repo.fork)
  const mapped = await Promise.all(
    own.map(async (repo, index) => {
      const blurb = await readmeBlurb(repo)
      const tags = [...(repo.topics ?? [])]
      if (repo.language && !tags.includes(repo.language)) tags.unshift(repo.language)
      return {
        slug: repo.name,
        title: titleFromRepo(repo.name),
        featured: index === 0,
        freelance: true,
        blurb,
        tags: tags.slice(0, 8),
        url: repo.html_url,
        stack: repo.language || 'Project',
      } satisfies Project
    }),
  )
  return mapped
}
