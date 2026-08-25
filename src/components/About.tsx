import { motion } from 'framer-motion'
import { useSite } from '../data/SiteProvider'
import { SectionHeading } from './SectionHeading'

export function About() {
  const { profile, spokenLanguages, experience } = useSite()
  const current = experience[0]
  return (
    <section id="about" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="01 / Profile" title="About">
          Automotive software first. AI tooling now. Same obsession with verification.
        </SectionHeading>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr]"
        >
          <p className="max-w-3xl text-base leading-relaxed text-paper/85 sm:text-lg">
            {profile.summary}
          </p>
          <div className="border border-line bg-steel/60 p-6">
            <p className="font-display text-[0.7rem] tracking-[0.22em] text-teal uppercase">
              Spoken languages
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">{spokenLanguages.join(' · ')}</p>
            <p className="mt-6 font-display text-[0.7rem] tracking-[0.22em] text-amber uppercase">
              Currently
            </p>
            <p className="mt-3 text-sm text-paper">
              {current
                ? `${current.role} at ${current.company}${current.client ? `, client ${current.client}` : ''}.`
                : profile.title}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
