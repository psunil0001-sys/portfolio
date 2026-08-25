import { motion, useReducedMotion } from 'framer-motion'
import { useSite } from '../data/SiteProvider'
import { easeOutExpo } from '../motion'
import { SectionHeading } from './SectionHeading'

export function Skills() {
  const { skillGroups } = useSite()
  const reduce = useReducedMotion()

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
              initial={reduce ? false : { opacity: 0, y: 26, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: groupIndex * 0.06, ease: easeOutExpo }}
            >
              <h3 className="mb-4 flex items-center gap-3 font-display text-sm font-semibold tracking-[0.18em] text-teal uppercase">
                {group.label}
                <motion.span
                  aria-hidden="true"
                  initial={reduce ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.9, delay: 0.15, ease: easeOutExpo }}
                  className="block h-px flex-1 origin-left bg-gradient-to-r from-teal/60 to-transparent"
                />
              </h3>

              <motion.ul
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045 } } }}
                className="flex flex-wrap gap-2"
              >
                {group.items.map((item) => (
                  <motion.li
                    key={item}
                    variants={{
                      hidden: reduce ? {} : { opacity: 0, y: 14, scale: 0.88 },
                      show: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { type: 'spring', stiffness: 380, damping: 24 },
                      },
                    }}
                    className="skill-chip px-3 py-1.5 text-sm text-paper"
                  >
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
