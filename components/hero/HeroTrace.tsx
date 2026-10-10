import type { Ref } from 'react'

// The hero's QA signature (DESIGN.md sections 2 and 7): a signal whose
// amplitude decays half-cycle by half-cycle into a flat baseline, i.e. the
// "signal verified, no defects" beat. Stroked with the theme's accent
// gradient stops (globals.css --accent-stop-*), so it follows light/dark.

const W = 1200
const H = 120
const MID = H / 2

// Deterministic path (identical on server and client): quadratic half-
// cycles with geometric amplitude decay, then a straight run to the edge.
function buildTrace(): string {
  const halfCycles = 14
  const span = W * 0.68
  const step = span / halfCycles
  let amp = 46
  let d = `M0 ${MID}`
  for (let i = 0; i < halfCycles; i++) {
    const x0 = i * step
    const dir = i % 2 === 0 ? -1 : 1
    // A quadratic's peak sits halfway to its control point, so double it.
    d += ` Q${(x0 + step / 2).toFixed(1)} ${(MID + dir * amp * 2).toFixed(1)} ${(x0 + step).toFixed(1)} ${MID}`
    amp *= 0.74
  }
  return `${d} L${W} ${MID}`
}

const TRACE_D = buildTrace()

interface HeroTraceProps {
  /** The <g> that GSAP scales toward the baseline ("settling"). */
  groupRef?: Ref<SVGGElement>
  /** The <path> that GSAP draws in. */
  pathRef?: Ref<SVGPathElement>
  className?: string
}

export default function HeroTrace({ groupRef, pathRef, className = '' }: HeroTraceProps) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <linearGradient id="hero-trace-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: 'var(--accent-stop-1)' }} />
          <stop offset="0.5" style={{ stopColor: 'var(--accent-stop-2)' }} />
          <stop offset="1" style={{ stopColor: 'var(--accent-stop-3)' }} />
        </linearGradient>
        {/* Soft fade at both ends so the line emerges from and returns to the page. */}
        <linearGradient id="hero-trace-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.12" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.85" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="hero-trace-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          <rect width={W} height={H} fill="url(#hero-trace-fade)" />
        </mask>
      </defs>
      <g ref={groupRef} mask="url(#hero-trace-mask)" style={{ transformOrigin: `0 ${MID}px` }}>
        <path
          ref={pathRef}
          d={TRACE_D}
          fill="none"
          stroke="url(#hero-trace-stroke)"
          strokeWidth="1.5"
          strokeLinecap="round"
          // Brighter in dark: the pink start reads muddy at 0.7 on #0a0a0a.
          className="[stroke-opacity:0.7] dark:[stroke-opacity:0.95]"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  )
}
