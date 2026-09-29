'use client'

import { useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollSmoother, registerGsap } from '@/lib/gsap'
import { prefersReducedMotion, REDUCED_MOTION_QUERY, COARSE_POINTER_QUERY } from '@/lib/motion-preferences'
import { applyMagneticHover } from '@/lib/magnetic'

registerGsap()

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-sm'

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
      const mm = gsap.matchMedia()

      mm.add(
        { reduceMotion: REDUCED_MOTION_QUERY, coarsePointer: COARSE_POINTER_QUERY },
        (context) => {
          const { reduceMotion, coarsePointer } = context.conditions as {
            reduceMotion: boolean
            coarsePointer: boolean
          }
          if (reduceMotion || coarsePointer) return

          const magneticEls = gsap.utils.toArray<HTMLElement>('[data-magnetic]', navRef.current)
          const cleanups = magneticEls.map((el) => applyMagneticHover(el))
          return () => cleanups.forEach((fn) => fn())
        }
      )

      return () => mm.revert()
    },
    { scope: navRef }
  )

  // Shared close path so the mobile menu actually collapses (its height
  // is entirely GSAP-managed via inline styles set when it opens -
  // flipping the `isOpen` React state alone doesn't touch that style,
  // so callers other than toggleMenu need this to actually close it).
  const closeMenu = contextSafe(() => {
    setIsOpen(false)
    if (!menuRef.current) return
    if (prefersReducedMotion()) {
      gsap.set(menuRef.current, { height: 0 })
    } else {
      gsap.to(menuRef.current, { height: 0, duration: 0.3, ease: 'power2.in' })
    }
  })

  const scrollToSection = contextSafe((href: string) => {
    // Resolve via plain DOM lookup, not a GSAP selector string: this
    // function is wrapped in contextSafe (useGSAP({ scope: navRef })),
    // which scopes GSAP's own selector-text resolution to inside <nav>.
    // The target sections live in <main>, outside that scope, so handing
    // ScrollSmoother a string here made its internal _toArray(href)
    // return [], then crash on undefined.style - passing the already-
    // resolved element sidesteps that scoping entirely.
    const target = document.querySelector<HTMLElement>(href)
    if (!target) return

    const navHeight = navRef.current?.getBoundingClientRect().height ?? 0
    const smoother = ScrollSmoother.get()
    if (smoother) {
      // Offset by the fixed navbar's height so the section heading
      // doesn't land hidden underneath it. "top top+=N" is ScrollTrigger's
      // start syntax (confirmed against gsap.com's docs): it shifts the
      // viewport reference point down by N, so the scroll lands with the
      // target's top N pixels below the viewport top instead of flush
      // with it (which is exactly where the fixed nav covers).
      smoother.scrollTo(target, true, `top top+=${navHeight}`)
    } else {
      // Reduced motion, or ScrollSmoother wasn't created for any reason.
      // scrollIntoView has no offset parameter, and its explicit
      // `behavior` option overrides the CSS scroll-behavior:auto
      // reduced-motion rule, so both the offset and the reduced-motion
      // check are done manually here instead.
      const targetY = target.getBoundingClientRect().top + window.scrollY - navHeight
      window.scrollTo({ top: targetY, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    }
    closeMenu()
  })

  const scrollToTop = contextSafe(() => {
    const smoother = ScrollSmoother.get()
    if (smoother) {
      smoother.scrollTo(0, true)
    } else {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    }
    closeMenu()
  })

  const openMenu = contextSafe(() => {
    setIsOpen(true)
    if (!menuRef.current) return

    if (prefersReducedMotion()) {
      gsap.set(menuRef.current, { height: 'auto' })
      return
    }

    gsap.set(menuRef.current, { height: 'auto' })
    gsap.from(menuRef.current, { height: 0, duration: 0.35, ease: 'power2.out' })
    gsap.fromTo(
      menuRef.current.querySelectorAll('[data-mobile-link]'),
      { autoAlpha: 0, y: -8 },
      { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.05, delay: 0.1 }
    )
  })

  const toggleMenu = () => (isOpen ? closeMenu() : openMenu())

  return (
    <nav
      ref={navRef}
      className="fixed top-0 w-full bg-bg/90 backdrop-blur-sm z-50 border-b border-muted/20"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[var(--nav-height)]">
          <div className="flex-shrink-0">
            <a
              href="#main-content"
              onClick={(e) => {
                e.preventDefault()
                scrollToTop()
              }}
              data-magnetic
              className={`font-display font-semibold text-xl text-fg hover:text-accent transition-colors duration-200 ${focusRing}`}
            >
              Umair Nadeem
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  data-magnetic
                  onClick={() => scrollToSection(item.href)}
                  className={`font-mono text-xs uppercase tracking-widest text-muted hover:text-accent transition-colors duration-200 ${focusRing}`}
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
              className={`text-muted hover:text-accent transition-colors duration-200 ${focusRing}`}
            >
              {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
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
              className={`font-mono text-muted hover:text-accent block px-3 py-2 text-sm uppercase tracking-widest transition-colors duration-200 ${focusRing}`}
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
