import { motion, useReducedMotion } from 'framer-motion'
import { aboutParagraphs } from '../data/resume'
import { useSite } from '../data/SiteProvider'
import { easeOutExpo } from '../motion'
import { Reveal } from './fx/Reveal'
import { SectionHeading } from './SectionHeading'
import { Tilt } from './fx/Tilt'

export function About() {
  const { profile, spokenLanguages, experience } = useSite()
  const current = experience[0]
  const reduce = useReducedMotion()

  return (
    <section id="about" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="01 / Profile" title="About">
          Automotive software, functional safety, and on-prem AI for test.
        </SectionHeading>

        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
          <Reveal>
            <div className="max-w-3xl space-y-4 text-base leading-relaxed text-paper/85 sm:text-lg">
              {aboutParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.75, delay: 0.12, ease: easeOutExpo }}
            whileHover={reduce ? undefined : { y: -4 }}
          >
            <Tilt max={6} className="glow-border border border-line bg-steel/60 p-6">
              <p className="font-display text-[0.7rem] tracking-[0.22em] text-teal uppercase">
                Spoken languages
              </p>
            <motion.ul
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.5 }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}
              className="mt-4 flex flex-wrap gap-2"
            >
              {spokenLanguages.map((language) => (
                <motion.li
                  key={language}
                  variants={{
                    hidden: reduce ? {} : { opacity: 0, y: 8 },
                    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 340, damping: 24 } },
                  }}
                  className="text-sm text-muted"
                >
                  {language}
                  <span className="mx-2 text-teal/50">·</span>
                </motion.li>
              ))}
            </motion.ul>

            <p className="mt-6 font-display text-[0.7rem] tracking-[0.22em] text-amber uppercase">
              Currently
            </p>
            <p className="mt-3 text-sm text-paper">
              {current
                ? `${current.role} at ${current.company}${current.client ? `, client ${current.client}` : ''}.`
                : profile.title}
            </p>
            </Tilt>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
