import type { CSSProperties } from 'react'

// Book a Call header atmosphere (DESIGN.md 11.8; user decision 2026-10-16),
// our own build after the reference's /book-a-call header, measured
// 2026-10-16: a band 350px tall (400px from sm, 500px from md) holding a
// large moon whose lower rim arcs behind the heading. Its geometry scales
// with the band, as on the reference: the disc is 2.48 band heights wide and
// its rim sits 49% down the band. Shading and colors come from our own pixel
// samples of the reference (tokens --moon-* in globals.css); the surface
// texture is our own generated noise (public/textures/moon-surface.webp,
// 29 KB, from assets/textures/moon-surface.svg), never the reference's file.
// The band fades in from the top (as on the reference) and into the page at
// its foot. Static paint: no motion, no filters.

const BAND: CSSProperties = {
  maskImage: 'linear-gradient(to bottom, transparent, black 25%)',
}

// The disc: radial shading along its radius (only the outer 30% is ever
// visible), a brighter glow on its bottom rim, and a wide halo around it.
// The gradients are theme tokens (--moon-disc, --moon-glow).
const DISC: CSSProperties = {
  top: 'calc(var(--band) * -1.99)',
  backgroundImage: 'var(--moon-glow), var(--moon-disc)',
  boxShadow: '0 0 calc(var(--band) * 0.2) calc(var(--band) * 0.04) var(--moon-halo)',
}

const FADE: CSSProperties = {
  backgroundImage:
    'linear-gradient(to top, var(--bg) 0%, color-mix(in srgb, var(--bg) 10%, transparent) 75%, transparent 100%)',
}

export default function MoonAtmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-(--band) overflow-hidden [--band:350px] sm:[--band:400px] md:[--band:500px]"
      style={BAND}
    >
      <div className="absolute inset-0 bg-(--moon-space)" />
      <div className="absolute left-1/2 size-[calc(var(--band)*2.48)] -translate-x-1/2 overflow-hidden rounded-full" style={DISC}>
        <div className="absolute inset-0 bg-[url(/textures/moon-surface.webp)] bg-cover opacity-(--moon-texture) mix-blend-overlay" />
      </div>
      <div className="absolute inset-0" style={FADE} />
    </div>
  )
}
