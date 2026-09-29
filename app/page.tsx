import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import Preloader from '@/components/Preloader'
import Cursor from '@/components/Cursor'
import AmbientBackground from '@/components/AmbientBackground'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'

export default function Home() {
  return (
    <>
      {/* Fixed sibling outside SmoothScrollProvider, same reason as
          Navbar: ScrollSmoother applies position:fixed to #smooth-wrapper
          internally, which breaks position:fixed on anything placed
          inside it. Rendered first so it stacks behind everything else
          by DOM order (it also sets z-0 itself, but placement matters
          too - see the component for the full stacking explanation). To
          remove the effect entirely, delete this import and this line. */}
      <AmbientBackground />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-bg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg"
      >
        Skip to content
      </a>
      <Preloader />
      <Cursor />
      <Navbar />
      <SmoothScrollProvider>
        <main id="main-content" className="min-h-screen">
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Contact />
          <Footer />
        </main>
      </SmoothScrollProvider>
    </>
  )
}
