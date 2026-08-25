import { motion } from 'framer-motion'
import { useSite } from '../data/SiteProvider'
import { IconGitHub, IconLinkedIn, IconMail, IconPhone } from './Icons'
import { SectionHeading } from './SectionHeading'

export function Contact() {
  const { profile } = useSite()
  const resumeHref = `${import.meta.env.BASE_URL}${profile.resumeFile}`
  const contacts = [
    {
      label: 'Email',
      value: profile.email,
      href: `mailto:${profile.email}`,
      icon: IconMail,
    },
    {
      label: 'Phone',
      value: profile.phone,
      href: profile.phoneHref,
      icon: IconPhone,
    },
    {
      label: 'LinkedIn',
      value: 'sunilkumar-pathipati',
      href: profile.linkedin,
      icon: IconLinkedIn,
    },
    {
      label: 'GitHub',
      value: 'psunil0001-sys',
      href: profile.github,
      icon: IconGitHub,
    },
  ]
  return (
    <section id="contact" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="06 / Signal" title="Let’s talk">
          Open to roles in Python, AI tooling, automotive software, and test framework leadership.
        </SectionHeading>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="frame frame-inner grid gap-4 p-6 sm:grid-cols-2 sm:p-8"
        >
          {contacts.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
              className="group flex items-start gap-4 border border-line bg-mist/70 p-5 transition-colors duration-200 hover:border-teal/50"
            >
              <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
              <span>
                <span className="block font-display text-[0.68rem] tracking-[0.22em] text-muted uppercase">
                  {item.label}
                </span>
                <span className="mt-1 block text-paper group-hover:text-teal">{item.value}</span>
              </span>
            </a>
          ))}
        </motion.div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <a
            href={resumeHref}
            download
            className="inline-flex items-center border border-amber/40 px-5 py-3 text-[0.75rem] font-semibold tracking-[0.16em] text-amber uppercase hover:bg-amber hover:text-ink"
          >
            Download resume PDF
          </a>
          <p className="text-xs tracking-[0.16em] text-muted uppercase">
            © {new Date().getFullYear()} {profile.name}
          </p>
        </div>
      </div>
    </section>
  )
}
