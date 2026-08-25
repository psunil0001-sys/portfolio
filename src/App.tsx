import { About } from './components/About'
import { Contact } from './components/Contact'
import { Education } from './components/Education'
import { Experience } from './components/Experience'
import { HashScroll } from './components/HashScroll'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { SiteProvider } from './data/SiteProvider'

function App() {
  return (
    <SiteProvider>
      <div className="blueprint min-h-svh">
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
    </SiteProvider>
  )
}

export default App
