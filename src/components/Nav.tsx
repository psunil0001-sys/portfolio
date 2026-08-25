import { useEffect, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { useSite } from '../data/SiteProvider'
import { easeOutExpo, sectionIds } from '../motion'
import { IconClose, IconMenu } from './Icons'
import { Magnetic } from './fx/Magnetic'

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
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('about')
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    setScrolled(latest > 24)
    setHidden(latest > 220 && latest > previous && !open)
  })

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
    <motion.header
      initial={reduce ? false : { y: -80, opacity: 0 }}
      animate={{ y: hidden ? -90 : 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: easeOutExpo }}
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled ? 'border-line bg-ink/70 backdrop-blur-xl' : 'border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#top" className="group font-display text-sm font-bold tracking-[0.18em] text-paper uppercase">
          <motion.span
            whileHover={reduce ? undefined : { scale: 1.12, rotate: -4 }}
            transition={{ type: 'spring', stiffness: 340, damping: 16 }}
            className="inline-block group-hover:text-teal"
          >
            SP
          </motion.span>
          <AnimatePresence mode="wait">
            <motion.span
              key={loading ? 'loading' : source}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="ml-3 hidden font-sans text-[0.6rem] font-medium tracking-[0.14em] text-muted normal-case md:inline"
            >
              {loading ? 'syncing…' : source}
            </motion.span>
          </AnimatePresence>
        </a>

        <LayoutGroup>
          <ul className="hidden items-center gap-7 md:flex">
            {links.map((link) => {
              const isActive = active === link.id
              return (
                <li key={link.href} className="relative">
                  <motion.a
                    href={link.href}
                    whileHover={reduce ? undefined : { y: -2 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                    className={`inline-block text-[0.78rem] font-medium tracking-[0.16em] uppercase transition-colors duration-200 ${
                      isActive ? 'text-teal' : 'text-muted hover:text-teal'
                    }`}
                  >
                    {link.label}
                  </motion.a>
                  {isActive ? (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-teal to-amber"
                      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                    />
                  ) : null}
                </li>
              )
            })}
          </ul>
        </LayoutGroup>

        <Magnetic>
          <a
            href={resumeHref}
            download
            className="group relative hidden overflow-hidden border border-teal/40 px-3 py-1.5 text-[0.72rem] font-semibold tracking-[0.16em] text-teal uppercase md:inline-flex"
          >
            <span className="absolute inset-0 -translate-y-full bg-teal transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
            <span className="relative transition-colors duration-300 group-hover:text-ink">Resume</span>
          </a>
        </Magnetic>

        <motion.button
          type="button"
          whileTap={reduce ? undefined : { scale: 0.88 }}
          className="text-paper md:hidden"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
        </motion.button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: easeOutExpo }}
            className="overflow-hidden border-t border-line bg-ink/90 backdrop-blur-xl md:hidden"
          >
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
              className="flex flex-col gap-1 px-5 py-4"
            >
              {links.map((link) => (
                <motion.li
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, x: -18 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: easeOutExpo } },
                  }}
                >
                  <a
                    href={link.href}
                    className={`block py-2 text-sm tracking-[0.14em] uppercase ${
                      active === link.id ? 'text-teal' : 'text-paper'
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                variants={{
                  hidden: { opacity: 0, x: -18 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: easeOutExpo } },
                }}
              >
                <a
                  href={resumeHref}
                  download
                  className="block py-2 text-sm tracking-[0.14em] text-teal uppercase"
                  onClick={() => setOpen(false)}
                >
                  Download resume
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  )
}
