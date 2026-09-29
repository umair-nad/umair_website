'use client'

import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion-preferences'

registerGsap()

// Same device-tier signal used by the hero particle field (small viewport,
// low core count, or a coarse pointer), duplicated here on purpose rather
// than imported: this component has no dependency on anything Three.js/
// hero-related, so deleting this one file and its import in app/page.tsx
// removes the effect completely, with nothing else to untangle.
function isLightTier(): boolean {
  const smallViewport = window.innerWidth < 768
  const lowCores = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches
  return smallViewport || lowCores || coarsePointer
}

// One 4-period wave unit (100 units each), continued for 4 more periods so
// the whole path is exactly two copies of the same unit back to back. That
// makes it exactly periodic every 400 units, so translating the whole
// element by -50% (= -400 of its 800-unit viewBox) loops seamlessly.
const WAVE_D = 'M0 50 Q50 20 100 50 T200 50 T300 50 T400 50 T500 50 T600 50 T700 50 T800 50'

export default function AmbientBackground() {
  const [mounted, setMounted] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [light, setLight] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const blobRefs = useRef<(HTMLDivElement | null)[]>([])
  const traceRefs = useRef<(SVGSVGElement | null)[]>([])
  const cursorGlowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Mount only once the browser is idle (falling back to a short
    // timeout where requestIdleCallback doesn't exist, e.g. Safari), not
    // just after one animation frame. A single rAF still let this
    // component's setup work land inside the window Lighthouse measures
    // Total Blocking Time over - measured: mobile TBT was still elevated
    // even after gating the grain filter below. Deferring to idle time
    // keeps this fully out of that critical path, on top of already
    // never competing with Hero's text for the LCP slot (same reasoning
    // Preloader/Cursor already use, just via idle callback instead of rAF).
    const schedule = (cb: () => void) =>
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(cb, { timeout: 2000 })
        : window.setTimeout(cb, 200)
    const cancel = (id: number) =>
      typeof window.cancelIdleCallback === 'function' ? window.cancelIdleCallback(id) : window.clearTimeout(id)

    const id = schedule(() => {
      setReduced(prefersReducedMotion())
      setLight(isLightTier())
      setMounted(true)
    })
    return () => cancel(id)
  }, [])

  // Light tier gets zero animated elements, not just fewer - only the
  // static grid still renders. Measuring smaller reductions (1 blob/1
  // trace, grain and parallax already dropped) against real mobile
  // Lighthouse runs produced too much run-to-run variance in this
  // environment (61-87 across identical code) to confidently confirm
  // they were light enough, so this goes further than "measured
  // sufficient" to "structurally can't cost much more than the grid
  // alone" instead.
  const blobCount = light ? 0 : 2
  const traceCount = light ? 0 : 2
  const showCursorGlow = mounted && !reduced && !light

  useGSAP(
    () => {
      if (!mounted || reduced) return

      const tweens: gsap.core.Tween[] = []

      blobRefs.current.slice(0, blobCount).forEach((el, i) => {
        if (!el) return
        tweens.push(
          gsap.to(el, {
            x: i % 2 === 0 ? 60 : -50,
            y: i % 2 === 0 ? -40 : 50,
            duration: 40 + i * 12,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          })
        )
      })

      traceRefs.current.slice(0, traceCount).forEach((el, i) => {
        if (!el) return
        tweens.push(
          gsap.to(el, {
            xPercent: -50,
            duration: 55 + i * 20,
            ease: 'none',
            repeat: -1,
          })
        )
      })

      // Scroll-linked parallax for the trace layers - a pure enhancement,
      // not the core of the effect, so it's skipped on the light tier as
      // part of lightening this after a real mobile Lighthouse run
      // showed a noticeable Performance drop (see the commit message).
      // This component is a fixed sibling outside #smooth-content (see
      // the comment on AmbientBackground's usage in app/page.tsx for
      // why), so ScrollSmoother's data-speed isn't available to it -
      // that only affects elements actually inside the smoothed content.
      // Tracking scroll progress directly via ScrollTrigger works
      // regardless of where the observing element lives, confirmed
      // against gsap.com's docs for the no-trigger "start:0, end:'max'"
      // whole-page-progress pattern.
      const scrollTrigger = light
        ? undefined
        : ScrollTrigger.create({
            start: 0,
            end: 'max',
            onUpdate: (self) => {
              traceRefs.current.slice(0, traceCount).forEach((el, i) => {
                if (!el) return
                gsap.set(el, { y: self.progress * (i % 2 === 0 ? 30 : -20) })
              })
            },
          })

      let handleMove: ((e: MouseEvent) => void) | undefined
      if (showCursorGlow && cursorGlowRef.current) {
        const quickX = gsap.quickTo(cursorGlowRef.current, 'x', { duration: 0.9, ease: 'power3' })
        const quickY = gsap.quickTo(cursorGlowRef.current, 'y', { duration: 0.9, ease: 'power3' })
        handleMove = (e: MouseEvent) => {
          quickX(e.clientX)
          quickY(e.clientY)
        }
        window.addEventListener('mousemove', handleMove)
      }

      // A position:fixed, inset:0 layer is either fully in view or the
      // tab isn't visible at all - there's no meaningful "scrolled
      // offscreen" state distinct from tab-hidden to track separately,
      // so visibilitychange alone covers the pause requirement here.
      const handleVisibility = () => {
        tweens.forEach((t) => (document.hidden ? t.pause() : t.resume()))
      }
      document.addEventListener('visibilitychange', handleVisibility)

      return () => {
        tweens.forEach((t) => t.kill())
        scrollTrigger?.kill()
        document.removeEventListener('visibilitychange', handleVisibility)
        if (handleMove) window.removeEventListener('mousemove', handleMove)
      }
    },
    { scope: rootRef, dependencies: [mounted, reduced, light, showCursorGlow] }
  )

  if (!mounted) return null

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Graticule grid - static, no animation, so no motion or
          reduced-motion handling is needed for it. */}
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="ambient-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgb(var(--muted))" strokeOpacity={0.05} strokeWidth={1} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ambient-grid)" />
      </svg>

      {/* Grain - measured cost, not assumed: an initial version rendered
          this unconditionally, and a real Lighthouse run showed mobile
          Total Blocking Time jump from 110ms to 530ms (Performance
          95->80). feTurbulence is genuinely expensive to rasterize even
          though it never animates - "static" doesn't mean "free". Gated
          behind the light tier fixed it (see the commit message for the
          re-measured numbers); it stays for standard-tier desktop only. */}
      {!light && (
        <svg className="absolute inset-0 h-full w-full">
          <defs>
            <filter id="ambient-grain">
              <feTurbulence type="fractalNoise" baseFrequency={0.85} numOctaves={1} stitchTiles="stitch" result="noise" />
              <feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.02 0" />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter="url(#ambient-grain)" />
        </svg>
      )}

      {/* Waveform traces - teal, low opacity (peak contrast checked: see
          commit message), reuses the same wave motif as the Preloader and
          WaveformDivider. Static (still visible, un-animated) under
          reduced motion since the ref array is still populated either
          way - only the GSAP tweens above are skipped. */}
      {Array.from({ length: traceCount }).map((_, i) => (
        <svg
          key={i}
          ref={(el) => {
            traceRefs.current[i] = el
          }}
          className="absolute h-24 w-[200vw]"
          style={{ top: `${22 + i * 32}%`, left: 0 }}
          viewBox="0 0 800 100"
          preserveAspectRatio="none"
        >
          <path d={WAVE_D} fill="none" stroke="rgb(var(--accent-2))" strokeOpacity={0.12} strokeWidth={1.5} />
        </svg>
      ))}

      {/* Glow blobs - teal only. Coral is reserved for interactive
          elements and large text per the locked palette, not repurposed
          for this decorative layer. Peak opacity 0.10 at each blob's
          center, fading to fully transparent by 70% radius. */}
      {Array.from({ length: blobCount }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            blobRefs.current[i] = el
          }}
          className="absolute h-[40rem] w-[40rem] rounded-full"
          style={{
            top: i === 0 ? '8%' : '55%',
            left: i === 0 ? '58%' : '8%',
            background: 'radial-gradient(circle, rgb(var(--accent-2) / 0.10) 0%, transparent 70%)',
          }}
        />
      ))}

      {/* Cursor-following glow - desktop only (skipped under reduced
          motion, the light tier, and therefore coarse pointers), same
          eased-follow technique as components/Cursor.tsx. */}
      {showCursorGlow && (
        <div
          ref={cursorGlowRef}
          className="absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgb(var(--accent-2) / 0.08) 0%, transparent 70%)' }}
        />
      )}
    </div>
  )
}
