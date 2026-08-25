import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { projects as fallbackProjects, type Project } from './projects'
import {
  certifications as fallbackCerts,
  education as fallbackEducation,
  experience as fallbackExperience,
  profile as fallbackProfile,
  skillGroups as fallbackSkills,
  spokenLanguages as fallbackSpoken,
  type Role,
} from './resume'
import { fetchGithubProjects } from '../lib/github'

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
  source: string
}

const SiteContext = createContext<SiteData | null>(null)

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

function splitName(name: string) {
  const parts = name.trim().split(/\s+/)
  return {
    firstName: parts[0] || fallbackProfile.firstName,
    lastName: parts.slice(1).join(' ') || fallbackProfile.lastName,
  }
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
      resumeFile: live.resumeFile || fallbackProfile.resumeFile,
    },
    skillGroups: live.skill_groups?.length
      ? live.skill_groups.map((group) => ({
          label: group.label,
          items: group.items ?? group.skills ?? [],
        }))
      : fallbackSkills,
    spokenLanguages: live.spoken_languages ?? fallbackSpoken,
    experience: live.experience?.length ? live.experience : fallbackExperience,
    education: live.education ?? fallbackEducation,
    certifications: live.certifications ?? fallbackCerts,
    projects: live.projects?.length ? live.projects : fallbackProjects,
  }
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Omit<SiteData, 'loading' | 'source'>>({
    profile: fallbackProfile,
    skillGroups: fallbackSkills,
    spokenLanguages: fallbackSpoken,
    experience: fallbackExperience,
    education: fallbackEducation,
    certifications: fallbackCerts,
    projects: fallbackProjects,
  })
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('resume seed')

  useEffect(() => {
    let cancelled = false
    async function load() {
      const liveUrl = `${import.meta.env.BASE_URL}live.json`
      const live = await fetch(liveUrl)
        .then((response) => (response.ok ? (response.json() as Promise<LiveFile>) : null))
        .catch(() => null)
      const githubProjects = await fetchGithubProjects().catch(() => [] as Project[])
      if (cancelled) return
      const mapped = live ? mapLive(live) : {}
      setData({
        profile: mapped.profile ?? fallbackProfile,
        skillGroups: mapped.skillGroups ?? fallbackSkills,
        spokenLanguages: mapped.spokenLanguages ?? fallbackSpoken,
        experience: mapped.experience ?? fallbackExperience,
        education: mapped.education ?? fallbackEducation,
        certifications: mapped.certifications ?? fallbackCerts,
        projects: githubProjects.length
          ? githubProjects
          : (mapped.projects ?? fallbackProjects),
      })
      const bits = []
      if (live) bits.push('LinkedIn/live.json')
      if (githubProjects.length) bits.push('GitHub')
      setSource(bits.join(' + ') || 'resume seed')
      setLoading(false)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(
    () => ({ ...data, loading, source }),
    [data, loading, source],
  )

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const value = useContext(SiteContext)
  if (!value) throw new Error('useSite must be used inside SiteProvider')
  return value
}
