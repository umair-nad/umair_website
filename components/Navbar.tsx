'use client'

import { useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollSmoother, registerGsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion-preferences'
import { applyMagneticHover } from '@/lib/magnetic'

registerGsap()

const navItems = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Skills', href: '#skills' },
  { name: 'Contact', href: '#contact' },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const { contextSafe } = useGSAP({ scope: navRef })

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const magneticEls = gsap.utils.toArray<HTMLElement>('[data-magnetic]', navRef.current)
      const cleanups = magneticEls.map((el) => applyMagneticHover(el))
      return () => cleanups.forEach((fn) => fn())
    },
    { scope: navRef }
  )

  const scrollToSection = contextSafe((href: string) => {
    const smoother = ScrollSmoother.get()
    if (smoother) {
      smoother.scrollTo(href, true)
    } else {
      // Reduced motion, or ScrollSmoother wasn't created for any reason.
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  })

  const toggleMenu = contextSafe(() => {
    const next = !isOpen
    setIsOpen(next)
    if (!menuRef.current) return

    if (prefersReducedMotion()) {
      gsap.set(menuRef.current, { height: next ? 'auto' : 0 })
      return
    }

    if (next) {
      gsap.set(menuRef.current, { height: 'auto' })
      gsap.from(menuRef.current, { height: 0, duration: 0.35, ease: 'power2.out' })
      gsap.fromTo(
        menuRef.current.querySelectorAll('[data-mobile-link]'),
        { autoAlpha: 0, y: -8 },
        { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.05, delay: 0.1 }
      )
    } else {
      gsap.to(menuRef.current, { height: 0, duration: 0.3, ease: 'power2.in' })
    }
  })

  return (
    <nav
      ref={navRef}
      className="fixed top-0 w-full bg-bg/90 backdrop-blur-sm z-50 border-b border-muted/20"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="font-display font-semibold text-xl text-fg">Umair Nadeem</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  data-magnetic
                  onClick={() => scrollToSection(item.href)}
                  className="font-mono text-xs uppercase tracking-widest text-muted hover:text-accent transition-colors duration-200"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              className="text-muted hover:text-accent transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div ref={menuRef} className="md:hidden overflow-hidden h-0">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-bg/95 border-t border-muted/20">
          {navItems.map((item) => (
            <button
              key={item.name}
              data-mobile-link
              onClick={() => scrollToSection(item.href)}
              className="font-mono text-muted hover:text-accent block px-3 py-2 text-sm uppercase tracking-widest transition-colors duration-200"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
