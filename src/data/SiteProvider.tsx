import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { fetchGithubProjects } from '../lib/github'
import { mergeProjects, projects as fallbackProjects, type Project } from './projects'
import {
  certifications as fallbackCerts,
  education as fallbackEducation,
  experience as fallbackExperience,
  profile as fallbackProfile,
  skillGroups as fallbackSkills,
  spokenLanguages as fallbackSpoken,
  type Role,
} from './resume'

export type SiteProfile = typeof fallbackProfile

export type SiteData = {
  profile: SiteProfile
  skillGroups: typeof fallbackSkills
  spokenLanguages: string[]
  experience: Role[]
  education: typeof fallbackEducation
  certifications: string[]
  projects: Project[]
  loading: boolean
}

const SiteContext = createContext<SiteData | null>(null)

const STUB_RESUME_FILE = 'Sunilkumar_Pathipati_CV.pdf'

type LiveFile = {
  name?: string
  title?: string
  headline?: string
  location?: string
  email?: string
  phone?: string
  linkedin?: string
  github?: string
  summary?: string
  resumeFile?: string
  skill_groups?: { label: string; skills?: string[]; items?: string[] }[]
  spoken_languages?: string[]
  experience?: Role[]
  education?: typeof fallbackEducation
  certifications?: string[]
  projects?: Project[]
}

/** live.json comes from the LaTeX pipeline, which writes date ranges as `--`. */
function dash(value: string) {
  return value.replace(/\s--\s/g, ' – ')
}

function splitName(name: string) {
  const parts = name.trim().split(/\s+/)
  return {
    firstName: parts[0] || fallbackProfile.firstName,
    lastName: parts.slice(1).join(' ') || fallbackProfile.lastName,
  }
}

function recruiterResumeFile(value?: string) {
  if (!value || value === STUB_RESUME_FILE) return fallbackProfile.resumeFile
  return value
}

function isProject(value: unknown): value is Project {
  if (!value || typeof value !== 'object') return false
  const project = value as Project
  return Boolean(
    project.slug &&
      project.title &&
      project.blurb &&
      project.url &&
      Array.isArray(project.tags),
  )
}

function mapLive(live: LiveFile): Partial<SiteData> {
  const names = live.name ? splitName(live.name) : {}
  const linkedin = live.linkedin?.startsWith('http')
    ? live.linkedin
    : live.linkedin
      ? `https://${live.linkedin}`
      : fallbackProfile.linkedin
  const github = live.github?.startsWith('http')
    ? live.github
    : live.github
      ? `https://${live.github}`
      : fallbackProfile.github
  return {
    profile: {
      ...fallbackProfile,
      ...names,
      name: live.name || fallbackProfile.name,
      title: live.title || fallbackProfile.title,
      headline: live.headline || fallbackProfile.headline,
      location: live.location || fallbackProfile.location,
      email: live.email || fallbackProfile.email,
      phone: live.phone || fallbackProfile.phone,
      phoneHref: `tel:${(live.phone || fallbackProfile.phone).replace(/\s+/g, '')}`,
      linkedin,
      github,
      summary: live.summary || fallbackProfile.summary,
      resumeFile: recruiterResumeFile(live.resumeFile),
    },
    skillGroups: live.skill_groups?.length
      ? live.skill_groups.map((group) => ({
          label: group.label,
          items: group.items ?? group.skills ?? [],
        }))
      : fallbackSkills,
    spokenLanguages: live.spoken_languages ?? fallbackSpoken,
    experience: live.experience?.length
      ? live.experience.map((role) => ({ ...role, period: dash(role.period) }))
      : fallbackExperience,
    education: live.education
      ? { ...live.education, period: dash(live.education.period) }
      : fallbackEducation,
    certifications: live.certifications ?? fallbackCerts,
  }
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Omit<SiteData, 'loading'>>({
    profile: fallbackProfile,
    skillGroups: fallbackSkills,
    spokenLanguages: fallbackSpoken,
    experience: fallbackExperience,
    education: fallbackEducation,
    certifications: fallbackCerts,
    projects: fallbackProjects,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const liveUrl = `${import.meta.env.BASE_URL}live.json`
      const live = await fetch(liveUrl)
        .then((response) => (response.ok ? (response.json() as Promise<LiveFile>) : null))
        .catch(() => null)
      if (cancelled) return
      const mapped = live ? mapLive(live) : {}
      const liveProjects = Array.isArray(live?.projects) ? live.projects.filter(isProject) : []
      let remote = liveProjects
      if (!remote.length) {
        remote = await fetchGithubProjects().catch(() => [] as Project[])
        if (cancelled) return
      }
      setData({
        profile: mapped.profile ?? fallbackProfile,
        skillGroups: mapped.skillGroups ?? fallbackSkills,
        spokenLanguages: mapped.spokenLanguages ?? fallbackSpoken,
        experience: mapped.experience ?? fallbackExperience,
        education: mapped.education ?? fallbackEducation,
        certifications: mapped.certifications ?? fallbackCerts,
        projects: mergeProjects(remote, fallbackProjects),
      })
      setLoading(false)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(
    () => ({ ...data, loading }),
    [data, loading],
  )

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const value = useContext(SiteContext)
  if (!value) throw new Error('useSite must be used inside SiteProvider')
  return value
}
