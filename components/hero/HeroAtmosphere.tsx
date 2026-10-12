import type { CSSProperties } from 'react'

// Hero atmosphere (DESIGN.md section 2), our own build from measurements of
// the reference hero (2026-10-12, playwright-cli, 1440x900): corner light
// washes and a glowing horizon arc. Colors are theme tokens in globals.css
// (--wash-*, --glow-*, --arc-*). Nothing here uses `filter: blur`: soft
// radial gradients stand in for the reference's 60-70px blurs, so mobile
// GPUs never rasterize large blurred layers. Everything is static paint.

// Corner washes: three circular light pools per top corner, positioned in
// px from that corner (the reference's rotated spotlights reduce to these
// centers and radii). One element, six gradients, one paint.
const washes = (side: 'left' | 'right') => {
  const x = (px: number) => (side === 'left' ? `${px}px` : `calc(100% - ${px}px)`)
  return [
    `radial-gradient(circle 1021px at ${x(245)} 182px, var(--wash-1) 0, var(--wash-1-mid) 511px, transparent 1021px)`,
    `radial-gradient(circle 647px at ${x(98)} -97px, var(--wash-2) 0, var(--wash-2-mid) 388px, transparent 647px)`,
    `radial-gradient(circle 647px at ${x(-452)} 6px, var(--wash-3) 0, var(--wash-3-mid) 324px, transparent 647px)`,
  ]
}

const WASH_STYLE: CSSProperties = {
  backgroundImage: [...washes('left'), ...washes('right')].join(', '),
}

// A blurred ellipse approximated by a wider, taller radial gradient with a
// soft falloff (no filter). Peak alpha accounts for what the blur spreads.
const glow = (color: string, peak: number) =>
  `radial-gradient(closest-side, color-mix(in srgb, ${color} ${peak}%, transparent) 0%, color-mix(in srgb, ${color} ${Math.round(peak * 0.62)}%, transparent) 35%, color-mix(in srgb, ${color} ${Math.round(peak * 0.22)}%, transparent) 68%, transparent 100%)`

// Below md the left and right pools overlap in the middle and double up, so
// they render dimmer there; that keeps the gradient accent word in the h1 at
// 3:1 or better over the light theme's peach (measured 2026-10-12).
export function HeroWashes() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-55 md:opacity-100" style={WASH_STYLE} />
  )
}

// The horizon arc. A 1200x400 stage, faded out toward both sides, holding
// two glows and a very wide ellipse whose rim is drawn by box-shadows: an
// inner violet edge and a pink halo above it (measured values). The apex
// sits 197px above the stage's bottom edge.
// The stage fades out toward both sides (measured) and, ours, toward its
// top edge, so the soft glows never end in a hard clip line.
const STAGE_MASK: CSSProperties = {
  maskImage:
    'linear-gradient(to right, transparent, black 30%, black 70%, transparent), linear-gradient(to bottom, transparent, black 40%)',
  maskComposite: 'intersect',
  WebkitMaskComposite: 'source-in',
}

export function HeroArc({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-0 left-1/2 h-100 w-300 -translate-x-1/2 overflow-hidden ${className}`}
      style={STAGE_MASK}
    >
      {/* Glow A: the reference's 900x120 source (center 210px up), grown by
          its 60px blur to 1200x420 around the same center. */}
      <div
        className="absolute bottom-0 left-1/2 h-105 w-300 -translate-x-1/2 opacity-60"
        style={{ backgroundImage: glow('var(--glow-a)', 70) }}
      />
      {/* Glow B: the 600x100 source (center 230px up), grown by its 70px
          blur to 1020x520 around the same center. */}
      <div
        className="absolute -bottom-7.5 left-1/2 h-130 w-255 -translate-x-1/2 opacity-60"
        style={{ backgroundImage: glow('var(--glow-b)', 48) }}
      />
      <div className="absolute -bottom-189.75 left-1/2 h-239 w-561 -translate-x-1/2 rounded-[100%] shadow-[inset_0_2px_50px_0_var(--arc-rim),0_-15px_50px_1px_var(--arc-halo)]" />
    </div>
  )
}
