'use client'

import { useEffect, useRef, useState } from 'react'
import { PanelBottomOpen, X } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap'
import { ALWAYS_QUERY, REDUCED_MOTION_QUERY, COARSE_POINTER_QUERY } from '@/lib/motion-preferences'
import { applyMagneticHover } from '@/lib/magnetic'
import { scrollToElement, scrollToTop } from '@/lib/scroll'
import { NAV_ITEMS as navItems } from '@/lib/nav'
import { content } from '@/lib/content'
import Logo from '@/components/brand/Logo'
import StatusCapsule from '@/components/nav/StatusCapsule'
import ThemeToggle from '@/components/theme/ThemeToggle'

registerGsap()

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

// Gap kept between the floating bar and a section heading after an anchor
// jump (the bar sits 16px from the top and is 40px tall).
const SCROLL_GAP = 16

// Navigation (DESIGN.md section 6).
// md and up: the floating pill bar. Three zones on one row: the Logo (home
// link) on the left, the centered pill with Home and the 4 anchors plus the
// embedded contact CTA (content.contact.cta), and on the right the status
// capsule (lg and up) then the theme toggle.
// Below md: a top bar with the Logo, the status capsule, and the theme
// toggle, plus a floating round button at the bottom right that opens a
// vertical stack of round icon links (measured on the reference's phone
// nav). Both share the active-section highlighting below.
const Navbar = () => {
  const [dockOpen, setDockOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const dockRef = useRef<HTMLDivElement>(null)
  const dockButtonRef = useRef<HTMLButtonElement>(null)

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

      // Active-section highlight: each section toggles aria-current on its
      // links (pill and mobile nav) when it crosses the viewport center.
      // Written straight to the DOM, so scroll position never becomes React
      // state (DESIGN.md section 7). Sections are resolved with
      // document.querySelector because they live in <main>, outside this
      // hook's <nav> scope.
      // The last section (Contact) stays active to the end of the page, the
      // footer included: its trigger ends 1px past the maximum scroll, a
      // point never reached ('max' itself counts the very end of the page
      // as already left).
      const triggers = navItems.flatMap((item, i) => {
        const section = document.querySelector<HTMLElement>(item.href)
        if (!section) return []
        const links = navRef.current?.querySelectorAll<HTMLElement>(`[data-section="${item.href}"]`) ?? []
        return [
          ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: i === navItems.length - 1 ? () => ScrollTrigger.maxScroll(window) + 1 : 'bottom center',
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
  }

  // Tabs follow the page order (lib/nav.ts). Home scrolls to the top like
  // the logo: smooth through ScrollSmoother, instant under reduced motion.
  const goTo = (href: string) => (href === '#home' ? scrollToTop() : scrollToSection(href))

  const onAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    goTo(href)
  }

  // Mobile nav: a tapped link closes the stack, then scrolls.
  const onDockLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setDockOpen(false)
    goTo(href)
  }

  // While the stack is open: Escape closes it and returns focus to the
  // toggle; a tap or click anywhere outside the dock closes it.
  useEffect(() => {
    if (!dockOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setDockOpen(false)
      dockButtonRef.current?.focus()
    }
    const onPointerDown = (e: PointerEvent) => {
      if (!dockRef.current?.contains(e.target as Node)) setDockOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [dockOpen])

  return (
    <nav ref={navRef} aria-label="Primary" className="fixed inset-x-0 top-4 z-50">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div ref={barRef} className="relative flex h-10 items-center justify-between">
          {/* Left: Logo, home link */}
          <a
            href="#home"
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

          {/* Center: the pill (md and up), centered on the row. w-max: as an
              absolute box at left-1/2 it would otherwise shrink to half the
              row, which wrapped "Let’s Connect" from 768 to 1023px. */}
          <ul className="absolute left-1/2 top-0 hidden h-10 w-max -translate-x-1/2 items-center gap-0.5 rounded-card border border-line bg-black/10 px-1.25 backdrop-blur-md md:flex dark:bg-white/5">
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

          {/* Right: status capsule (below md, where the pill is hidden, and
              lg and up; at md the pill needs the room), then the theme toggle */}
          <div className="flex items-center gap-2">
            {/* Visibility lives on a wrapper: the capsule's own inline-flex
                would otherwise compete with `hidden`. */}
            <div className="md:hidden lg:block">
              <StatusCapsule />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Floating mobile nav (below md), as on the reference: a 48px round
          toggle 16px from the bottom-right corner (clear of the safe area),
          and above it a stack of 48px round icon links, 6px apart and 12px
          above the toggle. They rise in nearest-first with a short stagger
          (CSS transitions; the global reduced-motion rule makes them
          instant). Closed links are inert and ignore pointers, so the empty
          stack area never blocks the page. The toggle comes first in the DOM
          (flex-col-reverse draws the stack above it), so Tab moves from the
          toggle straight into the open stack. */}
      <div
        ref={dockRef}
        className="pointer-events-none fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] flex flex-col-reverse items-end gap-3 md:hidden"
      >
        <button
          ref={dockButtonRef}
          type="button"
          onClick={() => setDockOpen((open) => !open)}
          aria-label="Site navigation"
          aria-expanded={dockOpen}
          aria-controls="mobile-nav"
          className={`pointer-events-auto flex size-12 touch-manipulation items-center justify-center rounded-full bg-dock-toggle text-dock-icon shadow-lg ${focusRing}`}
        >
          {dockOpen ? (
            <X size={20} strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <PanelBottomOpen size={20} strokeWidth={1.75} aria-hidden="true" />
          )}
        </button>
        <ul id="mobile-nav" inert={!dockOpen} className="flex flex-col gap-1.5">
          {navItems.map((item, i) => {
            const Icon = item.icon
            return (
              <li key={item.name}>
                <a
                  href={item.href}
                  aria-label={item.name}
                  data-section={item.href}
                  onClick={(e) => onDockLinkClick(e, item.href)}
                  style={{ '--i': navItems.length - 1 - i } as React.CSSProperties}
                  className={`flex size-12 touch-manipulation items-center justify-center rounded-full bg-dock text-dock-icon shadow-lg transition-[opacity,translate,scale] duration-300 ease-out aria-current:text-dock-active ${
                    dockOpen
                      ? 'pointer-events-auto translate-y-0 scale-100 opacity-100 delay-[calc(var(--i)*40ms)] motion-reduce:delay-0'
                      : 'translate-y-2 scale-90 opacity-0'
                  } ${focusRing}`}
                >
                  <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
