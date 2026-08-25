import { motion } from 'framer-motion'
import { useSite } from '../data/SiteProvider'
import { ease } from '../motion'
import { SectionHeading } from './SectionHeading'

export function Experience() {
  const { experience } = useSite()
  return (
    <section id="experience" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="04 / Timeline" title="Experience">
          Bosch years across Bengaluru and Reutlingen, now leading AI test tooling for Polestar.
        </SectionHeading>
        <ol className="relative pl-6 sm:pl-10">
          <span className="absolute top-1 bottom-1 left-0 w-px bg-teal/15 sm:left-px" />
          <motion.span
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 1.15, ease }}
            className="absolute top-1 bottom-1 left-0 w-px origin-top bg-teal sm:left-px"
          />
          {experience.map((role, index) => (
            <motion.li
              key={`${role.company}-${role.role}-${role.period}`}
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.05, ease }}
              className="relative mb-12 last:mb-0"
            >
              <span className="timeline-dot absolute top-1.5 -left-[1.55rem] h-2.5 w-2.5 rounded-full bg-teal sm:-left-[2.32rem]" />
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-display text-xl font-bold text-paper">{role.role}</h3>
                <p className="text-sm tracking-wide text-amber">{role.period}</p>
              </div>
              <p className="mt-1 text-sm text-teal">{role.company}</p>
              <p className="mt-1 text-sm text-muted">{role.location}</p>
              {role.client ? (
                <p className="mt-2 inline-block border border-amber/30 bg-amber-dim px-2 py-0.5 text-[0.7rem] tracking-[0.14em] text-amber uppercase">
                  Client · {role.client}
                </p>
              ) : null}
              <ul className="mt-4 space-y-2">
                {role.bullets.map((bullet) => (
                  <li key={bullet} className="text-sm leading-relaxed text-paper/80">
                    {bullet}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
