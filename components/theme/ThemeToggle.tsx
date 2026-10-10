'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { Moon, Sun } from 'lucide-react'
import {
  DARK_QUERY,
  applyTheme,
  getStoredTheme,
  getSystemTheme,
  getTheme,
  subscribeTheme,
  syncThemeColorMeta,
  type Theme,
} from '@/lib/theme'

// Theme toggle (DESIGN.md section 2): a native button, 36x36, 8px radius,
// far right of the header as on the reference. The Sun shows in dark mode
// and the Moon in light mode; the icons swap with CSS so the server render
// is already correct before hydration.
export default function ThemeToggle({ className = '' }: { className?: string }) {
  // null on the server and during hydration, the live theme afterwards.
  const theme = useSyncExternalStore<Theme | null>(subscribeTheme, getTheme, () => null)

  useEffect(() => {
    syncThemeColorMeta(getTheme())
    // Follow live OS changes only while the visitor hasn't chosen a theme.
    const mq = window.matchMedia(DARK_QUERY)
    const onChange = () => {
      if (getStoredTheme() === null) applyTheme(getSystemTheme(), { persist: false })
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const label =
    theme === null ? 'Toggle theme' : theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button
      type="button"
      onClick={() => applyTheme(getTheme() === 'dark' ? 'light' : 'dark', { persist: true })}
      aria-label={label}
      title={label}
      className={`inline-flex size-9 shrink-0 items-center justify-center rounded-control text-fg transition-colors hover:bg-fg/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      <Sun size={19} strokeWidth={1.75} aria-hidden="true" className="hidden dark:block" />
      <Moon size={19} strokeWidth={1.75} aria-hidden="true" className="block dark:hidden" />
    </button>
  )
}
