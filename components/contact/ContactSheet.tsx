'use client'

import { useCallback, useEffect, useRef, type KeyboardEvent } from 'react'
import { usePathname } from 'next/navigation'
import { CalendarDays, Check, Copy, Mail, X } from 'lucide-react'
import { ScrollSmoother } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion-preferences'
import { registerContactSheet } from '@/lib/contact-sheet'
import { useCopyEmail } from '@/lib/use-copy-email'
import { scrollToHash } from '@/lib/scroll'
import { content } from '@/lib/content'
import ProfileLink from '@/components/ProfileLink'
import ResumeButton from '@/components/ResumeButton'

// Get in Touch sheet (DESIGN.md 11.9), after the reference's bottom sheet,
// measured 2026-10-16 at 1440 and 390 in both themes: a bottom sheet at every
// width (448px wide, full width on phones), 95% page color with a 40px
// backdrop blur, 24px top radius, a decorative handle, a mono title and
// subtitle with a round close button, two cards (Book a Call, Email Me), and
// "Also find me on" with the profile links and the resume chip. Backdrop
// black/70 with a 12px blur. It fades in over 300ms while sliding up over
// 500ms on the reference's curve, and back down over 450ms (CSS in
// globals.css); instant under reduced motion.
// A native modal <dialog>: the page behind is inert, focus moves in (the
// close button) and Tab wraps inside, Escape and a press on the backdrop
// close it, and focus returns to the control that opened it. Page scrolling
// is locked while it is open (ScrollSmoother paused, <html> overflow hidden
// with a stable gutter so nothing shifts). Labelled by its title and
// described by its subtitle.

const { title, subtitle, call, email: emailCard, also } = content.contactSheet
const EMAIL = content.contact.email
const AT = EMAIL.indexOf('@')
const EMAIL_LOCAL = EMAIL.slice(0, AT)
const EMAIL_DOMAIN = EMAIL.slice(AT)
const CLOSE_MS = 450

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
const card =
  'group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-fg/8 bg-fg/[0.04] p-4 text-left transition-[border-color,background-color] duration-200 hover:bg-fg/[0.07]'

function lockScroll() {
  ScrollSmoother.get()?.paused(true)
  const root = document.documentElement
  root.style.scrollbarGutter = 'stable'
  root.style.overflow = 'hidden'
}

function unlockScroll() {
  const root = document.documentElement
  root.style.overflow = ''
  root.style.scrollbarGutter = ''
  ScrollSmoother.get()?.paused(false)
}

export default function ContactSheet() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const pressedBackdrop = useRef(false)
  const closeTimer = useRef<number | undefined>(undefined)
  const onBookPage = usePathname() === content.bookACall.path
  const { status, copy } = useCopyEmail(EMAIL)

  const open = useCallback((returnFocusTo: HTMLElement | null) => {
    const dialog = dialogRef.current
    if (!dialog || dialog.open) return
    returnFocus.current = returnFocusTo
    lockScroll()
    // Open in the start state (faded, panel below), then let the CSS
    // transitions run from it once that state has been painted.
    dialog.setAttribute('data-entering', '')
    dialog.showModal()
    // showModal focuses the close button while the panel is still below the
    // fold, and the browser scrolls the dialog to reveal it; undo that so
    // the panel slides up from below (globals.css).
    dialog.scrollTop = 0
    requestAnimationFrame(() => requestAnimationFrame(() => dialog.removeAttribute('data-entering')))
  }, [])

  useEffect(() => registerContactSheet(open), [open])

  // Slides the sheet out, then closes it (at once under reduced motion).
  const requestClose = useCallback(() => {
    const dialog = dialogRef.current
    if (!dialog?.open || dialog.hasAttribute('data-closing')) return
    if (prefersReducedMotion()) {
      dialog.close()
      return
    }
    dialog.setAttribute('data-closing', '')
    closeTimer.current = window.setTimeout(() => dialog.close(), CLOSE_MS)
  }, [])

  // Every close ends here (the X, Escape, the backdrop, the browser):
  // undo the scroll lock and return focus to what opened the sheet.
  const onClose = () => {
    window.clearTimeout(closeTimer.current)
    dialogRef.current?.removeAttribute('data-closing')
    dialogRef.current?.removeAttribute('data-entering')
    unlockScroll()
    returnFocus.current?.focus({ preventScroll: true })
    returnFocus.current = null
  }

  // Tab and Shift+Tab wrap inside the sheet.
  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== 'Tab') return
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
    const first = items[0]
    const last = items[items.length - 1]
    if (!first || !last) return
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="contact-sheet-title"
      aria-describedby="contact-sheet-subtitle"
      className="contact-sheet"
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault()
        requestClose()
      }}
      // A press that starts and ends on the backdrop closes the sheet (a
      // drag out of the sheet doesn't).
      onPointerDown={(e) => {
        pressedBackdrop.current = e.target === e.currentTarget
      }}
      onClick={(e) => {
        if (pressedBackdrop.current && e.target === e.currentTarget) requestClose()
      }}
      onKeyDown={onKeyDown}
    >
      <div
        data-sheet-panel
        className="relative w-full max-w-md rounded-t-3xl border-x border-t border-fg/8 bg-surface-2/95 px-5 pt-4 pb-[max(2.5rem,env(safe-area-inset-bottom))] shadow-[0_-40px_100px_-15px_rgb(0_0_0/0.9)] backdrop-blur-2xl"
      >
        <div aria-hidden="true" className="mx-auto mb-5 h-1 w-9 rounded-full bg-fg/15" />

        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 id="contact-sheet-title" className="font-mono text-[15px] font-semibold tracking-tight text-fg">
              {title}
            </h2>
            <p id="contact-sheet-subtitle" className="mt-0.5 font-mono text-[11px] tracking-wide text-muted">
              {subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={requestClose}
            aria-label="Close"
            className={`relative flex size-7 shrink-0 touch-manipulation items-center justify-center rounded-full border border-fg/8 bg-fg/6 text-muted transition-[color,background-color] before:absolute before:-inset-2 hover:bg-fg/12 hover:text-fg active:scale-95 ${focusRing}`}
          >
            <X size={14} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          {/* A full page load on purpose: /book-a-call has its own CSP
              (next.config.js), which a client-side navigation would not
              apply. On that page itself, the card just closes the sheet
              and brings the calendar into view. */}
          <a
            href={content.bookACall.path}
            onClick={(e) => {
              if (!onBookPage) return
              e.preventDefault()
              requestClose()
              scrollToHash('#booking-calendar')
            }}
            className={`${card} hover:border-accent/30 ${focusRing}`}
          >
            <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-inset bg-accent/10 text-accent">
              <CalendarDays size={15} strokeWidth={2} />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="font-mono text-[12.5px] leading-tight font-semibold text-fg">{call.title}</span>
              <span className="font-mono text-[10.5px] leading-tight text-muted">{call.subtitle}</span>
            </span>
          </a>

          <div className="relative">
            <a href={`mailto:${EMAIL}`} className={`${card} hover:border-sky-500/30 ${focusRing}`}>
              <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-inset bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Mail size={15} strokeWidth={2} />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="font-mono text-[12.5px] leading-tight font-semibold text-fg">{emailCard.title}</span>
                {/* On narrow phones the address may need two lines: it
                    breaks before the "@", never inside a word. */}
                <span translate="no" className="font-mono text-[10.5px] leading-tight text-muted">
                  {EMAIL_LOCAL}
                  <wbr />
                  {EMAIL_DOMAIN}
                </span>
              </span>
            </a>
            {/* Copy, with the star burst, as in the hero's copy-email row. */}
            <button
              type="button"
              onClick={(e) => copy(e.currentTarget)}
              aria-label="Copy email address"
              className={`absolute top-3 right-3 flex size-7 touch-manipulation items-center justify-center rounded-full border border-fg/8 bg-fg/6 text-muted transition-[color,background-color] hover:bg-fg/12 hover:text-fg active:scale-95 ${focusRing}`}
            >
              {status === 'copied' ? (
                <Check size={14} strokeWidth={2} aria-hidden="true" className="text-accent" />
              ) : (
                <Copy size={14} strokeWidth={2} aria-hidden="true" />
              )}
            </button>
            <span role="status" aria-live="polite" className="sr-only">
              {status === 'copied' ? 'Email address copied to clipboard' : status === 'failed' ? 'Copy failed. The email address is shown on screen.' : ''}
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <span aria-hidden="true" className="h-px flex-1 bg-fg/8" />
          <p className="font-mono text-[9px] tracking-[0.15em] text-muted uppercase">{also}</p>
          <span aria-hidden="true" className="h-px flex-1 bg-fg/8" />
        </div>

        {/* One row down to 360px phones (the reference's icons are
            narrower; ours are text links, as everywhere on the site). */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
          <ul aria-label="Profiles" className="flex items-center gap-3">
            {content.links.map((link) => (
              <li key={link.label}>
                <ProfileLink link={link} className="font-mono text-[11px] font-semibold text-fg hover:underline" />
              </li>
            ))}
          </ul>
          <span aria-hidden="true" className="h-4 w-px bg-fg/10" />
          <ResumeButton compact />
        </div>
      </div>
    </dialog>
  )
}
