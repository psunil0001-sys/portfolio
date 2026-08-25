import { motion } from 'framer-motion'
import { useSite } from '../data/SiteProvider'
import { ease } from '../motion'
import { SectionHeading } from './SectionHeading'

export function Skills() {
  const { skillGroups } = useSite()
  return (
    <section id="skills" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="02 / Stack" title="Skills">
          What I ship with — from embedded C to local LLMs.
        </SectionHeading>
        <div className="grid gap-10 md:grid-cols-2">
          {skillGroups.map((group, groupIndex) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: groupIndex * 0.05, ease }}
            >
              <h3 className="mb-4 font-display text-sm font-semibold tracking-[0.18em] text-teal uppercase">
                {group.label}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item, itemIndex) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.35, delay: itemIndex * 0.04, ease }}
                    className="skill-chip px-3 py-1.5 text-sm text-paper"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
