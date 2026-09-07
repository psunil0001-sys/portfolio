import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useSite } from '../data/SiteProvider'
import { easeOutExpo } from '../motion'
import { IconArrow, IconGitHub, IconLinkedIn } from './Icons'
import { Counter } from './fx/Counter'
import { Float } from './fx/Float'
import { Magnetic } from './fx/Magnetic'
import { Marquee } from './fx/Marquee'
import { SplitText } from './fx/SplitText'
import { WordReveal } from './fx/WordReveal'

const signals = [
  { n: '01', text: 'On-prem LLM tooling for Polestar infotainment test' },
  { n: '02', text: 'ISO 26262 ABS software for eBike and two-wheeler programs' },
  { n: '03', text: 'Automotive delivery across India and Germany' },
]

const INTRO_DELAY = 1.15

export function Hero() {
  const { profile, skillGroups } = useSite()
  const resumeHref = `${import.meta.env.BASE_URL}${profile.resumeFile}`
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0])
  const lift = useSpring(useTransform(scrollYProgress, [0, 1], [0, -90]), {
    stiffness: 90,
    damping: 24,
  })
  const asideLift = useSpring(useTransform(scrollYProgress, [0, 1], [0, -190]), {
    stiffness: 80,
    damping: 22,
  })

  const delay = reduce ? 0 : INTRO_DELAY
  const tickerItems = skillGroups.flatMap((group) => group.items).slice(0, 14)

  const rise = (offset: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 18, filter: 'blur(8px)' } as const),
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' } as const,
    transition: { duration: 0.7, delay: delay + offset, ease: easeOutExpo },
  })

  return (
    <section ref={ref} id="top" className="relative overflow-hidden px-5 pt-12 pb-16 sm:px-8 sm:pt-16 sm:pb-20">
      {/* Ambient floating accents — thin rings + a couple of glowing motes drifting on their own. */}
      <div className="pointer-events-none absolute inset-0 -z-0 hidden sm:block" aria-hidden="true">
        <Float className="top-[14%] left-[4%] h-16 w-16" parallax={56} bob={16} duration={8}>
          <span className="block h-full w-full rounded-full border border-teal/25" />
        </Float>
        <Float className="top-[62%] left-[13%] h-8 w-8" parallax={92} bob={12} duration={6} delay={1}>
          <span className="block h-full w-full rounded-full bg-teal/70 blur-[2px] shadow-[0_0_16px_rgba(46,230,199,0.7)]" />
        </Float>
        <Float className="top-[22%] right-[6%] h-24 w-24" parallax={36} bob={18} duration={9} delay={0.6}>
          <span className="block h-full w-full rounded-full border border-amber/30" />
        </Float>
        <Float className="top-[58%] right-[12%] h-5 w-5" parallax={120} bob={10} duration={5} delay={2}>
          <span className="block h-full w-full rounded-full bg-amber/70 blur-[1px] shadow-[0_0_14px_rgba(240,180,41,0.7)]" />
        </Float>
        <Float className="top-[80%] left-[48%] h-11 w-11" parallax={70} bob={14} duration={7.5} delay={1.4}>
          <span className="block h-full w-full rounded-full border border-paper/15" />
        </Float>
      </div>

      <motion.div
        style={reduce ? undefined : { opacity: fade }}
        className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_230px] lg:items-end"
      >
        <motion.div
          style={reduce ? undefined : { y: lift }}
          className="frame frame-inner frame-draw glow-border p-5 sm:p-8"
        >
          <motion.p
            {...rise(0)}
            className="mb-5 flex items-center gap-3 font-display text-[0.72rem] font-semibold tracking-[0.32em] text-teal uppercase"
          >
            <motion.span
              aria-hidden="true"
              animate={reduce ? undefined : { opacity: [1, 0.25, 1], scale: [1, 0.7, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block h-2 w-2 rounded-full bg-teal shadow-[0_0_12px_rgba(46,230,199,0.9)]"
            />
            {profile.location}
          </motion.p>

          <h1 className="font-display text-[clamp(2.4rem,7vw,5.1rem)] leading-[0.92] font-extrabold tracking-tight">
            <span className="block text-paper">
              <SplitText text={profile.firstName} delay={delay + 0.05} stagger={0.035} />
            </span>
            <WordReveal text={profile.lastName} delay={delay + 0.28} className="text-gradient" />
          </h1>

          <motion.span
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: delay + 0.45, ease: easeOutExpo }}
            className="mt-4 block h-[2px] w-40 origin-left bg-gradient-to-r from-teal to-amber sm:w-52"
          />

          <motion.p {...rise(0.5)} className="mt-5 max-w-xl font-display text-xl font-semibold text-paper sm:text-2xl">
            {profile.title}
          </motion.p>
          <motion.p {...rise(0.56)} className="mt-2 max-w-xl text-muted">
            {profile.headline}
          </motion.p>
          <motion.p {...rise(0.62)} className="mt-5 max-w-2xl text-sm leading-relaxed text-paper/80 sm:text-base">
            Nine years building safety-critical automotive software and, more recently, on-prem AI
            tooling that makes test, log, and release work faster.
          </motion.p>

          <motion.div {...rise(0.7)} className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#contact"
                className="group relative inline-flex items-center gap-2 overflow-hidden bg-teal px-5 py-3 text-[0.78rem] font-semibold tracking-[0.14em] text-ink uppercase"
              >
                <span className="absolute inset-0 -translate-x-full bg-amber transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
                <span className="relative">Contact</span>
                <IconArrow className="relative h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={resumeHref}
                download={profile.resumeFile}
                className="inline-flex items-center gap-2 border border-paper/25 px-5 py-3 text-[0.78rem] font-semibold tracking-[0.14em] text-paper uppercase transition-colors duration-300 hover:border-amber hover:text-amber"
              >
                Download PDF
              </a>
            </Magnetic>
            <Magnetic strength={0.5}>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center border border-paper/20 text-paper transition-colors duration-300 hover:border-teal hover:text-teal"
                aria-label="LinkedIn"
              >
                <IconLinkedIn className="h-4 w-4" />
              </a>
            </Magnetic>
            <Magnetic strength={0.5}>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center border border-paper/20 text-paper transition-colors duration-300 hover:border-teal hover:text-teal"
                aria-label="GitHub"
              >
                <IconGitHub className="h-5 w-5" />
              </a>
            </Magnetic>
          </motion.div>

          <motion.dl {...rise(0.8)} className="mt-9 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
            <div>
              <dt className="text-[0.65rem] tracking-[0.2em] text-muted uppercase">Years</dt>
              <dd className="font-display text-2xl font-bold text-teal">
                <Counter to={9} suffix="+" />
              </dd>
            </div>
            <div>
              <dt className="text-[0.65rem] tracking-[0.2em] text-muted uppercase">Projects</dt>
              <dd className="font-display text-2xl font-bold text-teal">
                <Counter to={profile.projectCount} />
              </dd>
            </div>
            <div>
              <dt className="text-[0.65rem] tracking-[0.2em] text-muted uppercase">Countries</dt>
              <dd className="font-display text-2xl font-bold text-teal">
                <Counter to={2} />
              </dd>
            </div>
          </motion.dl>
        </motion.div>

        <motion.aside
          style={reduce ? undefined : { y: asideLift }}
          className="hidden border-l border-teal/30 pl-6 lg:block"
        >
          <p className="font-display text-[0.68rem] tracking-[0.28em] text-muted uppercase">Highlights</p>
          <ul className="mt-5 space-y-5 text-sm">
            {signals.map((item, index) => (
              <motion.li
                key={item.n}
                initial={reduce ? false : { opacity: 0, x: 18, filter: 'blur(6px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, delay: delay + 0.6 + index * 0.12, ease: easeOutExpo }}
                whileHover={reduce ? undefined : { x: 6 }}
              >
                <p className="text-amber">{item.n}</p>
                <p className="text-paper">{item.text}</p>
              </motion.li>
            ))}
          </ul>
        </motion.aside>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.9 }}
        className="mx-auto mt-14 max-w-6xl border-y border-line py-4"
      >
        <Marquee items={tickerItems} speed={30} />
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll to about"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 1 }}
        className="mx-auto mt-10 flex w-fit flex-col items-center gap-2 text-[0.62rem] tracking-[0.28em] text-muted uppercase hover:text-teal"
      >
        Scroll
        <motion.span
          aria-hidden="true"
          animate={reduce ? undefined : { y: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="block h-8 w-px bg-teal"
        />
      </motion.a>
    </section>
  )
}
