import { motion, useReducedMotion } from 'framer-motion'
import { useSite } from '../data/SiteProvider'
import { ease } from '../motion'
import { IconArrow, IconGitHub, IconLinkedIn } from './Icons'

const signals = [
  { n: '01', text: 'Polestar infotainment AI tooling' },
  { n: '02', text: 'ISO 26262 ABS software' },
  { n: '03', text: 'India + Germany delivery' },
]

export function Hero() {
  const { profile } = useSite()
  const resumeHref = `${import.meta.env.BASE_URL}${profile.resumeFile}`
  const reduce = useReducedMotion()

  return (
    <section id="top" className="relative px-5 pt-12 pb-16 sm:px-8 sm:pt-16 sm:pb-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
        <div className="frame frame-inner frame-draw p-5 sm:p-8">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="mb-5 font-display text-[0.72rem] font-semibold tracking-[0.32em] text-teal uppercase"
          >
            {profile.location}
          </motion.p>
          <h1 className="font-display text-[clamp(2.4rem,7vw,5.1rem)] leading-[0.92] font-extrabold tracking-tight">
            <span className="block overflow-hidden">
              <motion.span
                initial={reduce ? false : { y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.06, ease }}
                className="block text-paper"
              >
                {profile.firstName}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={reduce ? false : { y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.16, ease }}
                className="block text-teal"
              >
                {profile.lastName}
              </motion.span>
            </span>
          </h1>
          <motion.span
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.32, ease }}
            className="mt-4 block h-[2px] w-40 origin-left bg-teal sm:w-52"
          />
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28, ease }}
            className="mt-5 max-w-xl font-display text-xl font-semibold text-paper sm:text-2xl"
          >
            {profile.title}
          </motion.p>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34, ease }}
            className="mt-2 max-w-xl text-muted"
          >
            {profile.headline}
          </motion.p>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease }}
            className="mt-5 max-w-2xl text-sm leading-relaxed text-paper/80 sm:text-base"
          >
            Nine years building safety-critical automotive software and, more recently, on-prem AI
            tooling that makes test, log, and release work faster.
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.46, ease }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-teal px-5 py-3 text-[0.78rem] font-semibold tracking-[0.14em] text-ink uppercase transition-transform duration-200 hover:-translate-y-0.5"
            >
              Contact
              <IconArrow className="h-3.5 w-3.5" />
            </a>
            <a
              href={resumeHref}
              download
              className="inline-flex items-center gap-2 border border-paper/25 px-5 py-3 text-[0.78rem] font-semibold tracking-[0.14em] text-paper uppercase transition-colors duration-200 hover:border-amber hover:text-amber"
            >
              Download PDF
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center border border-paper/20 text-paper transition-colors duration-200 hover:border-teal hover:text-teal"
              aria-label="LinkedIn"
            >
              <IconLinkedIn className="h-4 w-4" />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center border border-paper/20 text-paper transition-colors duration-200 hover:border-teal hover:text-teal"
              aria-label="GitHub"
            >
              <IconGitHub className="h-5 w-5" />
            </a>
          </motion.div>
        </div>
        <aside className="hidden border-l border-teal/30 pl-6 lg:block">
          <p className="font-display text-[0.68rem] tracking-[0.28em] text-muted uppercase">Signal</p>
          <ul className="mt-5 space-y-5 text-sm">
            {signals.map((item, index) => (
              <motion.li
                key={item.n}
                initial={reduce ? false : { opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.35 + index * 0.1, ease }}
              >
                <p className="text-amber">{item.n}</p>
                <p className="text-paper">{item.text}</p>
              </motion.li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  )
}
