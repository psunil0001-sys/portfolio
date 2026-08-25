import { useEffect, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useSite } from '../data/SiteProvider'
import { sectionIds } from '../motion'
import { IconClose, IconMenu } from './Icons'

const links = [
  { href: '#about', id: 'about', label: 'About' },
  { href: '#skills', id: 'skills', label: 'Skills' },
  { href: '#projects', id: 'projects', label: 'Projects' },
  { href: '#experience', id: 'experience', label: 'Experience' },
  { href: '#education', id: 'education', label: 'Education' },
  { href: '#contact', id: 'contact', label: 'Contact' },
]

export function Nav() {
  const { profile, loading, source } = useSite()
  const resumeHref = `${import.meta.env.BASE_URL}${profile.resumeFile}`
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('about')

  useEffect(() => {
    const nodes = sectionIds
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) {
          setActive(visible.target.id)
        }
      },
      { rootMargin: '-28% 0px -55% 0px', threshold: [0.1, 0.25, 0.5] },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#top" className="font-display text-sm font-bold tracking-[0.18em] text-paper uppercase">
          SP
          <span className="ml-3 hidden font-sans text-[0.6rem] font-medium tracking-[0.14em] text-muted normal-case md:inline">
            {loading ? 'syncing…' : source}
          </span>
        </a>
        <LayoutGroup>
        <ul className="hidden items-center gap-7 md:flex">
          {links.map((link) => {
            const isActive = active === link.id
            return (
              <li key={link.href} className="relative">
                <a
                  href={link.href}
                  className={`text-[0.78rem] font-medium tracking-[0.16em] uppercase transition-colors duration-200 ${
                    isActive ? 'text-teal' : 'text-muted hover:text-teal'
                  }`}
                >
                  {link.label}
                </a>
                {isActive ? (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 h-px w-full bg-teal"
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  />
                ) : null}
              </li>
            )
          })}
        </ul>
        </LayoutGroup>
        <a
          href={resumeHref}
          download
          className="hidden border border-teal/40 px-3 py-1.5 text-[0.72rem] font-semibold tracking-[0.16em] text-teal uppercase transition-colors duration-200 hover:bg-teal hover:text-ink md:inline-flex"
        >
          Resume
        </a>
        <button
          type="button"
          className="text-paper md:hidden"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
        </button>
      </nav>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line md:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 py-4">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`block py-2 text-sm tracking-[0.14em] uppercase ${
                      active === link.id ? 'text-teal' : 'text-paper'
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={resumeHref}
                  download
                  className="block py-2 text-sm tracking-[0.14em] text-teal uppercase"
                  onClick={() => setOpen(false)}
                >
                  Download resume
                </a>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
