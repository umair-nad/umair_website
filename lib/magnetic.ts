import { gsap } from '@/lib/gsap'

/**
 * Attaches a magnetic-hover effect to an element: it eases toward the
 * cursor while hovered, then eases back to rest on mouseleave. Reused
 * as-is anywhere a `[data-magnetic]` element needs this behavior, so
 * every phase gets identical motion/easing instead of a reinvented one.
 */
export function applyMagneticHover(el: HTMLElement, strength = 0.35) {
  const quickX = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' })
  const quickY = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' })

  const handleMove = (e: MouseEvent) => {
    const rect = el.getBoundingClientRect()
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)
    quickX(relX * strength)
    quickY(relY * strength)
  }

  const handleLeave = () => {
    quickX(0)
    quickY(0)
  }

  el.addEventListener('mousemove', handleMove)
  el.addEventListener('mouseleave', handleLeave)

  return () => {
    el.removeEventListener('mousemove', handleMove)
    el.removeEventListener('mouseleave', handleLeave)
  }
}
