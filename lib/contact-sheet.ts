import type { MouseEvent } from 'react'

// The Get in Touch sheet (DESIGN.md 11.9) opens from several places: the
// navbar's Book a Call pill, the mobile nav, and the hero's and contact
// panel's "Let’s Connect" buttons. Each trigger is a real mailto: link, so
// without JavaScript (or before the sheet has mounted) it still starts an
// email; once the sheet is mounted, a plain click opens the sheet instead.

type Opener = (returnFocusTo: HTMLElement | null) => void

let opener: Opener | null = null

/** Called by the mounted sheet; returns the cleanup. */
export function registerContactSheet(open: Opener) {
  opener = open
  return () => {
    if (opener === open) opener = null
  }
}

/**
 * onClick for a trigger link: opens the sheet and cancels the mailto:.
 * Modified clicks keep the link's own behavior. `returnFocusTo` is where
 * focus goes when the sheet closes (default: the link itself). Returns
 * whether the sheet opened.
 */
export function openContactSheet(e: MouseEvent<HTMLAnchorElement>, returnFocusTo?: HTMLElement | null) {
  if (!opener || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false
  e.preventDefault()
  opener(returnFocusTo ?? e.currentTarget)
  return true
}
