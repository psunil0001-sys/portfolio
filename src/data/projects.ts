export type Project = {
  slug: string
  title: string
  featured?: boolean
  freelance: boolean
  blurb: string
  tags: string[]
  url: string
  stack: string
}

export const projects: Project[] = [
  {
    slug: 'llm-junit4',
    title: 'LLM JUnit4 Test Generator',
    featured: true,
    freelance: true,
    stack: 'Python',
    blurb:
      'Local LLM pipeline that drafts and repairs Kotlin/JUnit4 unit tests for Android Gradle modules. A Google ADK planner, coder, and fixer loop runs Gradle and Kover (optional JaCoCo) and edits only generated tests until selected tasks pass, using llama.cpp on-prem or a remote OpenAI-compatible vLLM endpoint.',
    tags: ['Python', 'Kotlin', 'JUnit4', 'Gradle', 'Kover', 'llama.cpp', 'vLLM', 'ADK'],
    url: 'https://github.com/psunil0001-sys/LLM-Junit4-Unittest-Generator',
  },
  {
    slug: 'revops',
    title: 'RevOps Research Desk',
    freelance: true,
    stack: 'Python',
    blurb:
      'Streamlit workspace for mutual funds, ULIPs, and NPS holdings from mfapi.in and local CSVs. A manager coordinates five analysts (fundamentals, sentiment, news, technical, policy), stores notes in ChromaDB, and produces 60-day NAV scenarios with bootstrap resampling and a local LLM.',
    tags: ['Python', 'Streamlit', 'Multi-agent', 'ChromaDB', 'llama.cpp'],
    url: 'https://github.com/psunil0001-sys/revops',
  },
  {
    slug: 'calorietrack',
    title: 'CalorieTrack',
    freelance: true,
    stack: 'Dart',
    blurb:
      'Cross-platform Flutter calorie tracker with a layered structure (core, presentation, routes, theme, widgets), typed navigation, and a light/dark theme system for a consistent mobile UI.',
    tags: ['Flutter', 'Dart', 'Mobile'],
    url: 'https://github.com/psunil0001-sys/calorietrack',
  },
  {
    slug: 'dag-example',
    title: 'Airflow TaskFlow ETL',
    freelance: true,
    stack: 'Python',
    blurb:
      'Astronomer / Apache Airflow example of TaskFlow ETL: pull live astronaut data, then process each result with dynamic task mapping for local orchestration.',
    tags: ['Python', 'Airflow', 'Astronomer', 'ETL'],
    url: 'https://github.com/psunil0001-sys/DAG-example',
  },
  {
    slug: 'portfolio',
    title: 'Recruiter Portfolio',
    freelance: false,
    stack: 'TypeScript',
    blurb:
      'Recruiter-facing site and ATS resume pipeline: React and Vite on GitHub Pages, with a Python helper that rebuilds live project cards and a single-column resume from LinkedIn PDF exports and public GitHub repositories.',
    tags: ['TypeScript', 'React', 'Vite', 'GitHub Pages', 'Python'],
    url: 'https://github.com/psunil0001-sys/portfolio',
  },
]

function normalizeKey(value: string) {
  return value.trim().toLowerCase().replace(/\.git$/i, '').replace(/[-_]/g, '')
}

export function projectMatchKeys(project: Pick<Project, 'slug' | 'url'>): Set<string> {
  const keys = new Set<string>()
  if (project.slug) {
    keys.add(project.slug.toLowerCase())
    keys.add(normalizeKey(project.slug))
  }
  const match = project.url.match(/github\.com\/[^/]+\/([^/#?]+)/i)
  if (match) {
    keys.add(match[1].toLowerCase().replace(/\.git$/i, ''))
    keys.add(normalizeKey(match[1]))
  }
  return keys
}

function keysOverlap(left: Set<string>, right: Set<string>) {
  for (const key of left) {
    if (right.has(key)) return true
  }
  return false
}

/** Remote GitHub/live.json catalog, with curated title/blurb/tags/featured/freelance/stack winning on match. */
export function mergeProjects(remote: Project[], curated: Project[] = projects): Project[] {
  const unused = [...curated]
  const merged: Project[] = []

  for (const repo of remote) {
    const repoKeys = projectMatchKeys(repo)
    const index = unused.findIndex((item) => keysOverlap(repoKeys, projectMatchKeys(item)))
    const match = index >= 0 ? unused.splice(index, 1)[0] : undefined
    if (match) {
      merged.push({
        ...repo,
        slug: match.slug || repo.slug,
        url: match.url || repo.url,
        title: match.title,
        blurb: match.blurb,
        tags: match.tags,
        featured: match.featured === true,
        freelance: match.freelance,
        stack: match.stack,
      })
    } else {
      merged.push({ ...repo, featured: false })
    }
  }

  for (const leftover of unused) {
    merged.push({ ...leftover, featured: leftover.featured === true })
  }

  return merged.sort((a, b) => {
    const featuredDelta = Number(Boolean(b.featured)) - Number(Boolean(a.featured))
    if (featuredDelta) return featuredDelta
    const indexOf = (project: Project) => {
      const keys = projectMatchKeys(project)
      const idx = curated.findIndex((item) => keysOverlap(keys, projectMatchKeys(item)))
      return idx >= 0 ? idx : curated.length
    }
    const orderDelta = indexOf(a) - indexOf(b)
    if (orderDelta) return orderDelta
    return a.title.localeCompare(b.title)
  })
}
