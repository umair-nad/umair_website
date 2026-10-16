'use client'

import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/lib/nav'
import { scrollToHash, scrollToTop } from '@/lib/scroll'

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

// The page's sections in page order (lib/nav.ts, shared with the navbar).
// Real anchors, so they work without JS; with JS they scroll like the nav:
// Home to the top, the others to just below the floating bar. On other
// pages (/book-a-call) they point at the home page's sections ("/#about")
// and navigate normally.
export default function FooterSections({ linkClassName }: { linkClassName: string }) {
  const onHome = usePathname() === '/'
  return (
    <ul className="space-y-4">
      {NAV_ITEMS.map((item) => (
        <li key={item.href}>
          <a
            href={onHome ? item.href : item.href === '#home' ? '/' : `/${item.href}`}
            onClick={(e) => {
              if (!onHome) return
              if (item.href === '#home') {
                e.preventDefault()
                scrollToTop()
              } else if (scrollToHash(item.href)) {
                e.preventDefault()
              }
            }}
            className={`${linkClassName} ${focusRing}`}
          >
            {item.name}
          </a>
        </li>
      ))}
    </ul>
  )
}
