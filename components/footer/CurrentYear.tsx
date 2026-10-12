'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}
const readYear = () => new Date().getFullYear()

// The copyright year, never hardcoded. The server renders the year it was
// built in (passed down as `initial`, so hydration matches exactly); the
// client then shows the visitor's current year, so a site that isn't
// rebuilt over New Year still reads right.
export default function CurrentYear({ initial }: { initial: number }) {
  return useSyncExternalStore(subscribe, readYear, () => initial)
}
