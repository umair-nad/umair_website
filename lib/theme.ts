// Light/dark theme plumbing (DESIGN.md section 2). The `dark` class on
// <html> is the single source of truth: Tailwind's `dark:` variant and the
// `.dark` token block in globals.css both key off it.

export type Theme = 'light' | 'dark'

/** localStorage key for an explicit user choice (same key the reference uses). */
export const THEME_STORAGE_KEY = 'theme'

/** Page background per theme, mirrored into <meta name="theme-color">. */
export const THEME_COLOR: Record<Theme, string> = { light: '#ffffff', dark: '#0a0a0a' }

export const DARK_QUERY = '(prefers-color-scheme: dark)'

/**
 * Runs in <head> before first paint (see ThemeScript). A stored choice
 * wins; otherwise follow the OS preference; light when neither is known.
 * It also sets data-motion="ok" on <html> when reduced motion is off, so
 * entrance animations can hide their elements without a flash.
 * Must stay a static string (only the module constants above are
 * interpolated, never request or user data): it is emitted with
 * dangerouslySetInnerHTML and, once the CSP lands, carries the request's
 * nonce (CLAUDE.md security rules).
 */
export const THEME_INIT_SCRIPT = `(function () {
  var d = document.documentElement, t = null;
  try { t = localStorage.getItem('${THEME_STORAGE_KEY}'); } catch (e) {}
  if (t !== 'light' && t !== 'dark') {
    t = window.matchMedia && window.matchMedia('${DARK_QUERY}').matches ? 'dark' : 'light';
  }
  d.classList.toggle('dark', t === 'dark');
  d.style.colorScheme = t;
  // Entrance animations may pre-hide their elements only when motion is
  // allowed (globals.css, [data-reveal]); reduced motion paints them final.
  try {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) d.setAttribute('data-motion', 'ok');
  } catch (e) {}
})();`

export function getTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function getStoredTheme(): Theme | null {
  try {
    const t = localStorage.getItem(THEME_STORAGE_KEY)
    return t === 'light' || t === 'dark' ? t : null
  } catch {
    return null
  }
}

export function getSystemTheme(): Theme {
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

/** Applies a theme to <html>; `persist` records it as the user's choice. */
export function applyTheme(theme: Theme, { persist }: { persist: boolean }) {
  const root = document.documentElement
  // Suppress transitions for one frame so colors snap instead of animating.
  root.classList.add('theme-switching')
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
  syncThemeColorMeta(theme)
  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Storage blocked (private mode etc.): the choice still applies for this page view.
    }
  }
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')))
}

/**
 * The viewport export emits one theme-color meta per OS scheme. When the
 * visitor's choice differs from the OS, point both at the active theme so
 * the browser chrome matches the page.
 */
export function syncThemeColorMeta(theme: Theme) {
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((m) => m.setAttribute('content', THEME_COLOR[theme]))
}

/** useSyncExternalStore subscription: fires when <html>'s class changes. */
export function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}
