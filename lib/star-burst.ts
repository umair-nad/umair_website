import type { CreateTypes } from 'canvas-confetti'
import { prefersReducedMotion } from '@/lib/motion-preferences'

// Copy-email success burst: colored stars plus small flecks radiating from
// the button, as on the reference (violet, blue, cyan, pale). canvas-confetti
// (4.3 KB gzip, no dependencies) is imported on demand, so it never ships in
// the page bundle. Its default export runs in a blob-URL Web Worker, which
// the CSP would then have to allow (worker-src blob:), so we create our own
// instance on the main thread instead: one fixed, pointer-events-none
// canvas, sized to the viewport. Under reduced motion nothing loads.

const COLORS = ['#8b5cf6', '#3b82f6', '#06b6d4', '#e2e8f0']

let instance: Promise<CreateTypes> | undefined

function getConfetti() {
  instance ??= import('canvas-confetti').then(({ default: confetti }) =>
    confetti.create(undefined, { resize: true, useWorker: false, disableForReducedMotion: true })
  )
  return instance
}

export async function starBurst(from: HTMLElement) {
  if (prefersReducedMotion()) return

  const confetti = await getConfetti()
  const r = from.getBoundingClientRect()
  const origin = {
    x: (r.left + r.width / 2) / window.innerWidth,
    y: (r.top + r.height / 2) / window.innerHeight,
  }
  const shared = {
    origin,
    colors: COLORS,
    spread: 360,
    startVelocity: 26,
    gravity: 0.55,
    decay: 0.92,
    ticks: 150,
  }

  void confetti({ ...shared, particleCount: 34, shapes: ['star'], scalar: 1.15 })
  void confetti({ ...shared, particleCount: 26, shapes: ['circle'], scalar: 0.45 })
}
