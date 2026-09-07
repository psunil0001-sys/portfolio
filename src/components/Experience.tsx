import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { useSite } from '../data/SiteProvider'
import { easeOutExpo } from '../motion'
import { SectionHeading } from './SectionHeading'

export function Experience() {
  const { experience } = useSite()
  const reduce = useReducedMotion()
  const listRef = useRef<HTMLOListElement>(null)

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 75%', 'end 60%'],
  })
  const lineScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <section id="experience" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="04 / Timeline" title="Experience">
          Bosch programs in Bengaluru and Reutlingen; now Lead Engineer on Polestar infotainment AI test tooling.
        </SectionHeading>

        <ol ref={listRef} className="relative pl-6 sm:pl-10">
          <span className="absolute top-1 bottom-1 left-0 w-px bg-teal/12 sm:left-px" />
          <motion.span
            aria-hidden="true"
            style={reduce ? { scaleY: 1 } : { scaleY: lineScale }}
            className="absolute top-1 bottom-1 left-0 w-px origin-top bg-gradient-to-b from-teal via-teal to-amber sm:left-px"
          />

          {experience.map((role, index) => (
            <motion.li
              key={`${role.company}-${role.role}-${role.period}`}
              initial={reduce ? false : { opacity: 0, x: -28, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: index * 0.05, ease: easeOutExpo }}
              className="group relative mb-12 last:mb-0"
            >
              <motion.span
                initial={reduce ? false : { scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ type: 'spring', stiffness: 420, damping: 18, delay: 0.1 }}
                className="timeline-dot absolute top-1.5 -left-[1.55rem] h-2.5 w-2.5 rounded-full bg-teal sm:-left-[2.32rem]"
              />

              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-display text-xl font-bold text-paper transition-colors duration-300 group-hover:text-teal">
                  {role.role}
                </h3>
                <p className="text-sm tracking-wide text-amber">{role.period}</p>
              </div>
              <p className="mt-1 text-sm text-teal">{role.company}</p>
              <p className="mt-1 text-sm text-muted">{role.location}</p>

              {role.client ? (
                <motion.p
                  whileHover={reduce ? undefined : { scale: 1.04 }}
                  className="mt-2 inline-block border border-amber/30 bg-amber-dim px-2 py-0.5 text-[0.7rem] tracking-[0.14em] text-amber uppercase"
                >
                  Client · {role.client}
                </motion.p>
              ) : null}

              <motion.ul
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
                className="mt-4 space-y-2"
              >
                {role.bullets.map((bullet) => (
                  <motion.li
                    key={bullet}
                    variants={{
                      hidden: reduce ? {} : { opacity: 0, x: 14 },
                      show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easeOutExpo } },
                    }}
                    className="text-sm leading-relaxed text-paper/80"
                  >
                    {bullet}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
