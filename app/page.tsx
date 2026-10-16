import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import MoreAbout from '@/components/MoreAbout'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'
import PersonJsonLd from '@/components/PersonJsonLd'
import SkipLink from '@/components/SkipLink'

export default function Home() {
  return (
    <>
      <PersonJsonLd />
      <SkipLink />
      {/* Fixed elements (the navbar) stay outside SmoothScrollProvider:
          ScrollSmoother applies position:fixed to #smooth-wrapper
          internally, which breaks position:fixed on anything inside it. */}
      <Navbar />
      <SmoothScrollProvider>
        <main id="main-content" className="min-h-screen">
          <Hero />
          <About />
          <MoreAbout />
          {/* The Skills & Tools wall belongs to the About area (user decision 2026-10-12). */}
          <Skills />
          <Experience />
          <Contact />
        </main>
        {/* Outside <main>, so it is the page's contentinfo landmark. */}
        <Footer />
      </SmoothScrollProvider>
    </>
  )
}
