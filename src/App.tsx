import { About } from './components/About'
import { Contact } from './components/Contact'
import { Education } from './components/Education'
import { Experience } from './components/Experience'
import { HashScroll } from './components/HashScroll'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { Aurora } from './components/fx/Aurora'
import { CursorGlow } from './components/fx/CursorGlow'
import { CursorRipple } from './components/fx/CursorRipple'
import { Intro } from './components/fx/Intro'
import { ScrollProgress } from './components/fx/ScrollProgress'
import { SmoothScroll } from './components/fx/SmoothScroll'
import { SiteProvider, useSite } from './data/SiteProvider'

function Shell() {
  const { profile } = useSite()

  return (
    <div className="blueprint relative min-h-svh">
      <Intro name={profile.name} />
      <Aurora />
      <CursorGlow />
      <CursorRipple />
      <ScrollProgress />
      <SmoothScroll />
      <HashScroll />
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Contact />
      </main>
    </div>
  )
}

function App() {
  return (
    <SiteProvider>
      <Shell />
    </SiteProvider>
  )
}

export default App
