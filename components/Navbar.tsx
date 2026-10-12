'use client'

import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollSmoother, ScrollTrigger, registerGsap } from '@/lib/gsap'
import { ALWAYS_QUERY, prefersReducedMotion, REDUCED_MOTION_QUERY, COARSE_POINTER_QUERY } from '@/lib/motion-preferences'
import { applyMagneticHover } from '@/lib/magnetic'
import { scrollToElement } from '@/lib/scroll'
import { content } from '@/lib/content'
import Logo from '@/components/brand/Logo'
import StatusCapsule from '@/components/nav/StatusCapsule'
import ThemeToggle from '@/components/theme/ThemeToggle'

registerGsap()

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

// Home (the hero, #home) comes first; it scrolls to the top like the logo.
const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Skills', href: '#skills' },
  { name: 'Contact', href: '#contact' },
]

// Gap kept between the floating bar and a section heading after an anchor
// jump (the bar sits 16px from the top and is 40px tall).
const SCROLL_GAP = 16

// Floating pill navbar (DESIGN.md section 6). Three zones on one row: the
// Logo (home link) on the left, the centered pill with Home and the 4 anchors and
// the embedded contact CTA (content.contact.cta), and on the right the status capsule
// (lg and up) then the theme toggle, which sits at the far right at every
// width, as on the reference. Below md the pill becomes a menu panel.
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const { contextSafe } = useGSAP({ scope: navRef })

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(
        { always: ALWAYS_QUERY, reduceMotion: REDUCED_MOTION_QUERY, coarsePointer: COARSE_POINTER_QUERY },
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

      // Active-section tint: each section toggles aria-current on its link
      // when it crosses the viewport center. Written straight to the DOM,
      // so scroll position never becomes React state (DESIGN.md section 7).
      // Elements are resolved with document.querySelector because the
      // sections live in <main>, outside this hook's <nav> scope.
      const triggers = navItems.flatMap((item) => {
        const section = document.querySelector<HTMLElement>(item.href)
        if (!section) return []
        const links = navRef.current?.querySelectorAll<HTMLElement>(`[data-section="${item.href}"]`) ?? []
        return [
          ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onToggle: (self) =>
              links.forEach((link) =>
                self.isActive ? link.setAttribute('aria-current', 'true') : link.removeAttribute('aria-current')
              ),
          }),
        ]
      })

      return () => {
        triggers.forEach((t) => t.kill())
        mm.revert()
      }
    },
    { scope: navRef }
  )

  // The GSAP work below goes through contextSafe at event time, never
  // during render, so every tween is still reverted on unmount.
  const closeMenu = () => {
    setIsOpen(false)
    contextSafe(() => {
      // The menu's height is entirely GSAP-managed via inline styles, so
      // flipping `isOpen` alone wouldn't collapse it.
      if (!menuRef.current) return
      if (prefersReducedMotion()) {
        gsap.set(menuRef.current, { height: 0 })
      } else {
        gsap.to(menuRef.current, { height: 0, duration: 0.3, ease: 'power2.in' })
      }
    })()
  }

  const openMenu = () => {
    setIsOpen(true)
    contextSafe(() => {
      if (!menuRef.current) return
      gsap.set(menuRef.current, { height: 'auto' })
      if (prefersReducedMotion()) return
      gsap.from(menuRef.current, { height: 0, duration: 0.35, ease: 'power2.out' })
      gsap.fromTo(
        menuRef.current.querySelectorAll('[data-mobile-link]'),
        { autoAlpha: 0, y: -8 },
        { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.05, delay: 0.1 }
      )
    })()
  }

  const toggleMenu = () => (isOpen ? closeMenu() : openMenu())

  const scrollToSection = (href: string) => {
    contextSafe(() => {
      // Resolve via plain DOM lookup, not a GSAP selector string: inside
      // contextSafe (scoped to <nav>), GSAP would resolve the selector
      // within the nav and ScrollSmoother would get an empty target.
      const target = document.querySelector<HTMLElement>(href)
      if (!target) return
      // Offset measured from the live bar, so the section lands clear of it.
      scrollToElement(target, (barRef.current?.getBoundingClientRect().bottom ?? 0) + SCROLL_GAP)
    })()
    if (isOpen) closeMenu()
  }

  const scrollToTop = () => {
    contextSafe(() => {
      const smoother = ScrollSmoother.get()
      if (smoother) {
        smoother.scrollTo(0, true)
      } else {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
      }
    })()
    if (isOpen) closeMenu()
  }

  // Escape closes the open mobile menu and returns focus to its button.
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      closeMenu()
      menuButtonRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
    // closeMenu is recreated each render; the listener only needs isOpen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const onAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    if (href === '#home') scrollToTop()
    else scrollToSection(href)
  }

  return (
    <nav ref={navRef} aria-label="Primary" className="fixed inset-x-0 top-4 z-50">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div ref={barRef} className="relative flex h-10 items-center justify-between">
          {/* Left: Logo, home link */}
          <a
            href="#main-content"
            onClick={(e) => {
              e.preventDefault()
              scrollToTop()
            }}
            aria-label="Umair Nadeem, back to top"
            data-magnetic
            className={`inline-flex items-center rounded-control text-fg ${focusRing}`}
          >
            <Logo className="h-8 w-auto" />
          </a>

          {/* Center: the pill (md and up), centered on the row */}
          <ul className="absolute left-1/2 top-0 hidden h-10 -translate-x-1/2 items-center gap-0.5 rounded-card border border-line bg-black/10 px-1.25 backdrop-blur-md md:flex dark:bg-white/5">
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  data-section={item.href}
                  data-magnetic
                  onClick={(e) => onAnchorClick(e, item.href)}
                  className={`inline-flex h-6.5 items-center rounded-card px-3 text-[13px] text-fg transition-[color,background-color,border-color] hover:bg-fg/5 aria-current:bg-fg/5 aria-current:text-accent ${focusRing}`}
                >
                  {item.name}
                </a>
              </li>
            ))}
            <li className="ml-0.5">
              <a
                href="#contact"
                data-magnetic
                onClick={(e) => onAnchorClick(e, '#contact')}
                className={`inline-flex h-7.5 items-center rounded-card border border-line-strong bg-white/10 px-3 text-[13px] text-fg transition-[color,background-color,border-color] hover:bg-white/20 ${focusRing}`}
              >
                {content.contact.cta}
              </a>
            </li>
          </ul>

          {/* Right: status capsule (lg+), menu button (below md), theme toggle */}
          <div className="flex items-center gap-2">
            {/* Visibility lives on a wrapper: the capsule's own inline-flex
                would otherwise compete with `hidden`. */}
            <div className="hidden lg:block">
              <StatusCapsule />
            </div>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={toggleMenu}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className={`inline-flex size-9 items-center justify-center rounded-control text-fg transition-[color,background-color,border-color] hover:bg-fg/5 md:hidden ${focusRing}`}
            >
              {isOpen ? <X size={20} strokeWidth={1.75} aria-hidden="true" /> : <Menu size={20} strokeWidth={1.75} aria-hidden="true" />}
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile menu panel (below md). Inert while closed, so its links
            can't be reached by keyboard while it is collapsed. */}
        <div id="mobile-menu" ref={menuRef} inert={!isOpen} className="h-0 overflow-hidden md:hidden">
          <div className="mt-3 rounded-card border border-line bg-surface/95 p-2 shadow-lg backdrop-blur-md">
            <ul>
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    data-section={item.href}
                    data-mobile-link
                    onClick={(e) => onAnchorClick(e, item.href)}
                    className={`block rounded-control px-3 py-2.5 text-[15px] text-fg transition-[color,background-color,border-color] hover:bg-fg/5 aria-current:text-accent ${focusRing}`}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              data-mobile-link
              onClick={(e) => onAnchorClick(e, '#contact')}
              className={`mt-2 flex h-10 items-center justify-center rounded-card border border-line-strong bg-fg/5 text-[15px] text-fg ${focusRing}`}
            >
              {content.contact.cta}
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
