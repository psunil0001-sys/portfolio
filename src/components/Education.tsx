import { motion } from 'framer-motion'
import { useSite } from '../data/SiteProvider'
import { SectionHeading } from './SectionHeading'

export function Education() {
  const { education, certifications } = useSite()
  return (
    <section id="education" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="05 / Foundation" title="Education">
          ECE degree, then a decade in automotive software and data science certifications.
        </SectionHeading>
        <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="border border-line bg-steel/50 p-6 sm:p-8"
          >
            <p className="font-display text-[0.7rem] tracking-[0.22em] text-teal uppercase">Degree</p>
            <h3 className="mt-3 font-display text-2xl font-bold text-paper">{education.degree}</h3>
            <p className="mt-3 text-muted">{education.school}</p>
            <p className="mt-1 text-sm text-amber">
              {education.period} · {education.location}
            </p>
          </motion.article>
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="border border-line bg-mist p-6 sm:p-8"
          >
            <p className="font-display text-[0.7rem] tracking-[0.22em] text-amber uppercase">
              Certifications
            </p>
            <ul className="mt-4 space-y-3">
              {certifications.map((item) => (
                <li key={item} className="border-l-2 border-teal/50 pl-3 text-sm text-paper">
                  {item}
                </li>
              ))}
            </ul>
          </motion.article>
        </div>
      </div>
    </section>
  )
}
