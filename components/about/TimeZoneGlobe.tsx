'use client'

import { useEffect, useRef, useState } from 'react'
import type { COBEOptions, Globe } from 'cobe'
import { COARSE_POINTER_QUERY, prefersReducedMotion } from '@/lib/motion-preferences'

// Rotating dot-matrix globe for the time zone card (DESIGN.md 11.2), drawn
// with cobe 2 (WebGL, ~6 KB gzip, its world map embedded as a data: PNG).
// Look measured on the reference (2026-10-12): dark sphere with light dots
// in both themes, theta 0.25, scale 1.1, 40k map samples, warm markers,
// about one turn every 21s.
//
// Performance: cobe is imported only when the card nears the viewport; our
// own rAF loop renders only while the card is on screen; the device pixel
// ratio is capped (1.5 on touch or narrow screens, 2 elsewhere). Reduced
// motion: one static frame, no loop (sampled at mount, like every other
// motion preference on the site). No WebGL: a CSS dot-sphere fallback.

// Pins, as [lat, lng]: Islamabad (content.location) and Cologne, Smart In
// Media's location (content.experience[0].location). No text accompanies
// them; the globe is decoration.
const MARKERS: COBEOptions['markers'] = [
  { location: [33.6844, 73.0479], size: 0.04 },
  { location: [50.9375, 6.9603], size: 0.035 },
]

const SPIN = 0.3 // rad/s (the reference adds 0.005 per frame at 60fps)
// Start with the meridian halfway between the two pins (about 40°E)
// facing the viewer, so both are in view on first paint.
const START_PHI = Math.PI - ((40 * Math.PI) / 180 - Math.PI / 2)

function supportsWebGL() {
  try {
    const probe = document.createElement('canvas') // throwaway: a canvas keeps its first context type
    return !!(probe.getContext('webgl2') || probe.getContext('webgl'))
  } catch {
    return false
  }
}

export default function TimeZoneGlobe({ className = '' }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'idle' | 'ready' | 'fallback'>('idle')

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const reduceMotion = prefersReducedMotion()
    const smallScreen = window.matchMedia(COARSE_POINTER_QUERY).matches || window.innerWidth < 768
    const dpr = Math.min(window.devicePixelRatio || 1, smallScreen ? 1.5 : 2)

    let globe: Globe | undefined
    let creating = false
    let disposed = false
    let visible = false
    let raf = 0
    let last = 0
    let phi = START_PHI
    let settleUntil = 0
    let settled = false
    let resize: ResizeObserver | undefined

    // cobe decodes its world-map texture asynchronously, so a lone first
    // frame can be drawn without the dots. Under reduced motion the globe
    // therefore keeps redrawing the same, unrotated frame for about a
    // second (until the texture is in), then stops for good.
    const SETTLE_MS = 1200

    const frame = (now: number) => {
      raf = 0
      if (!globe || !visible) return
      if (reduceMotion) {
        globe.update({})
        if (now < settleUntil) raf = requestAnimationFrame(frame)
        else settled = true
        return
      }
      // Time-based, so the speed doesn't depend on the display's refresh rate.
      if (last) phi += SPIN * Math.min((now - last) / 1000, 0.1)
      last = now
      globe.update({ phi })
      raf = requestAnimationFrame(frame)
    }
    const play = () => {
      if (raf || !globe) return
      if (reduceMotion) {
        if (settled) return // the static frame is complete
        settleUntil = performance.now() + SETTLE_MS
      }
      last = 0
      raf = requestAnimationFrame(frame)
    }
    const pause = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    const create = async () => {
      if (!supportsWebGL()) {
        setStatus('fallback')
        return
      }
      const { default: createGlobe } = await import('cobe')
      if (disposed) return
      // cobe wraps its canvas in a div of its own, so the canvas is created
      // here rather than rendered by React (React never owns those nodes).
      const canvas = document.createElement('canvas')
      canvas.style.cssText = 'width:100%;height:100%;display:block'
      host.appendChild(canvas)
      const size = host.offsetWidth
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: size,
        height: size,
        phi,
        theta: 0.25,
        dark: 1,
        diffuse: 1.2,
        scale: 1.1,
        mapSamples: 40000,
        mapBrightness: 6,
        baseColor: [0.4, 0.4, 0.4],
        markerColor: [1, 0.5, 0.2],
        glowColor: [0.1, 0.1, 0.1],
        markers: MARKERS,
      })
      resize = new ResizeObserver(() => {
        const s = host.offsetWidth
        if (s) globe?.update({ width: s, height: s }) // also redraws the static frame
      })
      resize.observe(host)
      setStatus('ready')
      if (visible) play()
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (!visible) return pause()
        if (!globe && !creating) {
          creating = true
          void create()
        } else play()
      },
      { rootMargin: '200px 0px' } // start loading just before it scrolls in
    )
    io.observe(host)

    return () => {
      disposed = true
      io.disconnect()
      resize?.disconnect()
      pause()
      globe?.destroy()
      host.replaceChildren()
    }
  }, [])

  return (
    <div aria-hidden="true" className={`pointer-events-none ${className}`}>
      <div
        ref={hostRef}
        className={`size-full transition-opacity duration-700 ease-out ${status === 'ready' ? 'opacity-100' : 'opacity-0'}`}
      />
      {status === 'fallback' && (
        // No WebGL: a quiet CSS dot sphere in the same place.
        <div
          className="absolute inset-[6%] rounded-full bg-[#1a1a1a] bg-[radial-gradient(circle,rgb(255_255_255/0.5)_1px,transparent_1.6px)] bg-size-[9px_9px] mask-[radial-gradient(circle_at_40%_35%,black_45%,transparent_71%)]"
        />
      )}
    </div>
  )
}
