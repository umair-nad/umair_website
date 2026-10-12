import { useSyncExternalStore } from 'react'
import { content } from '@/lib/content'

// Umair's local time (content.timeZone), shared by the nav status capsule
// and the About time-zone card.

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: content.timeZone.iana,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

const readTime = () => formatter.format(new Date())

// Re-read every 15s: cheap, and the minute flips within 15s of the real one.
function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 15_000)
  return () => window.clearInterval(id)
}

/** "HH:MM" in content.timeZone. The server can't know the visitor's render
 *  time, so it renders "--:--" and the client fills in the real time after
 *  hydration. */
export function useLocalTime() {
  return useSyncExternalStore(subscribe, readTime, () => '--:--')
}
