import { motion, useReducedMotion } from 'framer-motion'
import { useSite } from '../data/SiteProvider'
import { easeOutExpo } from '../motion'
import { ScrollReveal } from './fx/ScrollReveal'
import { SectionHeading } from './SectionHeading'

export function Education() {
  const { education, certifications } = useSite()
  const reduce = useReducedMotion()

  return (
    <section id="education" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="05 / Foundation" title="Education">
          ECE degree, then a decade in automotive software, data science certifications, and an in-progress PG certificate in Forward Deployed AI Engineering.
        </SectionHeading>

        <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <ScrollReveal y={30}>
            <motion.article
              whileHover={reduce ? undefined : { y: -6 }}
              className="h-full spotlight border border-line bg-steel/50 p-6 transition-colors duration-300 hover:border-teal/40 sm:p-8"
            >
              <p className="font-display text-[0.7rem] tracking-[0.22em] text-teal uppercase">Degree</p>
              <h3 className="mt-3 font-display text-2xl font-bold text-paper">{education.degree}</h3>
              <p className="mt-3 text-muted">{education.school}</p>
              <p className="mt-1 text-sm text-amber">
                {education.period} · {education.location}
              </p>
            </motion.article>
          </ScrollReveal>

          <ScrollReveal y={30} offset={['start 90%', 'start 48%']}>
            <motion.article
              whileHover={reduce ? undefined : { y: -6 }}
              className="h-full border border-line bg-mist p-6 transition-colors duration-300 hover:border-amber/40 sm:p-8"
            >
            <p className="font-display text-[0.7rem] tracking-[0.22em] text-amber uppercase">
              Certifications
            </p>
            <motion.ul
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.4 }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
              className="mt-4 space-y-3"
            >
              {certifications.map((item) => (
                <motion.li
                  key={item}
                  variants={{
                    hidden: reduce ? {} : { opacity: 0, x: -14 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easeOutExpo } },
                  }}
                  className="border-l-2 border-teal/50 pl-3 text-sm text-paper transition-[border-color,padding] duration-300 hover:border-teal hover:pl-4"
                >
                  {item}
                </motion.li>
              ))}
            </motion.ul>
            </motion.article>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
