import { ScrollSmoother } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion-preferences'

/** The fixed navbar's clearance in px, read from the --nav-height token. */
export function navOffset(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--nav-height').trim()
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  const value = parseFloat(raw)
  if (Number.isNaN(value)) return 0
  return raw.endsWith('rem') ? value * rem : value
}

/**
 * Scrolls an in-page target into view below the floating navbar. Uses
 * ScrollSmoother when it exists ("top top+=N" lands the target N px below
 * the viewport top); otherwise window.scrollTo, honoring reduced motion
 * (scrollIntoView has no offset and would override the CSS preference).
 */
export function scrollToElement(target: HTMLElement, offset: number = navOffset()) {
  const smoother = ScrollSmoother.get()
  if (smoother) {
    smoother.scrollTo(target, true, `top top+=${offset}`)
    return
  }
  const targetY = target.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top: targetY, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

/** scrollToElement for a hash like "#contact"; returns false if it isn't on the page. */
export function scrollToHash(hash: string, offset?: number): boolean {
  const target = document.querySelector<HTMLElement>(hash)
  if (!target) return false
  scrollToElement(target, offset)
  return true
}
