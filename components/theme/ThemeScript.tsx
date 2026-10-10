import { THEME_INIT_SCRIPT } from '@/lib/theme'

// Blocking inline script for <head>: sets the theme before first paint so
// there is no flash of the wrong theme. `nonce` is optional today and gets
// the per-request CSP nonce in the security-hardening step (DESIGN.md 10.1).
export default function ThemeScript({ nonce }: { nonce?: string }) {
  return <script nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
}
