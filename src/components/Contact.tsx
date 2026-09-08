import { motion, useReducedMotion } from 'framer-motion'
import { useSite } from '../data/SiteProvider'
import { easeOutExpo } from '../motion'
import { IconGitHub, IconLinkedIn, IconMail, IconPhone } from './Icons'
import { Magnetic } from './fx/Magnetic'
import { ScrollReveal } from './fx/ScrollReveal'
import { SectionHeading } from './SectionHeading'
import { Tilt } from './fx/Tilt'

export function Contact() {
  const { profile } = useSite()
  const reduce = useReducedMotion()
  const resumeHref = `${import.meta.env.BASE_URL}${profile.resumeFile}`

  const contacts = [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, icon: IconMail },
    { label: 'Phone', value: profile.phone, href: profile.phoneHref, icon: IconPhone },
    { label: 'LinkedIn', value: 'sunilkumar-pathipati', href: profile.linkedin, icon: IconLinkedIn },
    { label: 'GitHub', value: 'psunil0001-sys', href: profile.github, icon: IconGitHub },
  ]

  return (
    <section id="contact" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="06 / Signal" title="Let's talk" once>
          Open to roles in Python, AI tooling, automotive software, and test framework leadership.
        </SectionHeading>

        <ScrollReveal y={40} offset={['start 95%', 'start 80%']}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            className="frame frame-inner glow-border grid gap-4 p-6 sm:grid-cols-2 sm:p-8"
          >
          {contacts.map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
              variants={{
                hidden: reduce ? {} : { opacity: 0, y: 22 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: easeOutExpo },
                },
              }}
              whileHover={reduce ? undefined : { y: -5 }}
              className="h-full"
            >
              <Tilt max={7} className="spotlight flex h-full items-start gap-4 border border-line bg-mist/70 p-5 transition-colors duration-300 hover:border-teal/50">
                <motion.span
                  whileHover={reduce ? undefined : { rotate: -8, scale: 1.15 }}
                  transition={{ type: 'spring', stiffness: 340, damping: 16 }}
                  className="mt-0.5 shrink-0 text-teal"
                >
                  <item.icon className="h-5 w-5" />
                </motion.span>
                <span>
                  <span className="block font-display text-[0.68rem] tracking-[0.22em] text-muted uppercase">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-paper transition-colors duration-300 group-hover:text-teal">
                    {item.value}
                  </span>
                </span>
              </Tilt>
            </motion.a>
          ))}
          </motion.div>
        </ScrollReveal>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <Magnetic>
            <a
              href={resumeHref}
              download={profile.resumeFile}
              className="group relative inline-flex items-center overflow-hidden border border-amber/40 px-5 py-3 text-[0.75rem] font-semibold tracking-[0.16em] text-amber uppercase"
            >
              <span className="absolute inset-0 -translate-x-full bg-amber transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
              <span className="relative transition-colors duration-300 group-hover:text-ink">
                Download resume PDF
              </span>
            </a>
          </Magnetic>
          <p className="text-xs tracking-[0.16em] text-muted uppercase">
            © {new Date().getFullYear()} {profile.name}
          </p>
        </div>
      </div>
    </section>
  )
}
