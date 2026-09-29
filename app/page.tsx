import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import Preloader from '@/components/Preloader'
import Cursor from '@/components/Cursor'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'

export default function Home() {
  return (
    <>
      <Preloader />
      <Cursor />
      <Navbar />
      <SmoothScrollProvider>
        <main className="min-h-screen">
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
