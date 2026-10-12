'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { UserRound } from 'lucide-react'
import { content } from '@/lib/content'
import { BentoCard, CardLockup, IconChip } from '@/components/about/BentoCard'

// The bio's third sentence, verbatim, with a typographic apostrophe (as the
// hero h1 does). Sentence 1 is the hero h1.
const CAPTION = (content.bio.split(/(?<=\.)\s+/)[2] ?? '').replace(/'/g, '’')

// Measured on the reference (2026-10-12): row 1 drifts left at ~36 px/s,
// row 2 right at ~44 px/s.
const ROW_SPEED = [36, 44] as const

// One scrolling row: the words twice, so moving the track by -50% (the
// `marquee` keyframes in globals.css) lands on the second copy seamlessly.
// The duration is set from the measured width of one copy, so the speed in
// px/s matches the reference at every font size.
function WordRow({ words, speed, reverse }: { words: string[]; speed: number; reverse: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const fit = () => {
      const copy = track.scrollWidth / 2
      if (copy) track.style.animationDuration = `${(copy / speed).toFixed(2)}s`
    }
    fit()
    const resize = new ResizeObserver(fit)
    resize.observe(track)
    void document.fonts?.ready.then(fit) // EB Garamond swaps in after first paint
    return () => resize.disconnect()
  }, [speed])

  const copy = (key: string) => (
    <span key={key} className="flex shrink-0 items-center gap-x-6 py-2 pr-6 md:gap-x-10 md:pr-10">
      {words.map((word) => (
        <span key={word}>{word}</span>
      ))}
    </span>
  )

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div
        ref={trackRef}
        className={`flex w-max animate-[marquee_60s_linear_infinite] group-data-paused/words:[animation-play-state:paused] motion-reduce:animate-none ${reverse ? '[animation-direction:reverse]' : ''}`}
      >
        {copy('a')}
        {copy('b')}
      </div>
    </div>
  )
}

// Portrait card (DESIGN.md 11.2), rebuilt after the reference's portrait
// card (user decision 2026-10-12). Layers, back to front inside the card:
// two rows of large EB Garamond words scrolling in opposite directions; the
// cut-out portrait, unframed and anchored to the bottom edge, with a soft
// drop shadow; a card-colored gradient rising from the bottom so his body
// fades into the card; then the icon chip and the caption lockup. The word
// rows are decorative (aria-hidden; the same words are in Skills), pause
// while the card is off screen, and stand still under reduced motion.
export default function PortraitCard({ className = '' }: { className?: string }) {
  const wordsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const words = wordsRef.current
    if (!words) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) words.removeAttribute('data-paused')
      else words.setAttribute('data-paused', '')
    })
    io.observe(words)
    return () => io.disconnect()
  }, [])

  return (
    <BentoCard className={`isolate min-h-180 md:min-h-0 ${className}`}>
      <div
        ref={wordsRef}
        data-paused
        aria-hidden="true"
        className="group/words pointer-events-none absolute inset-x-0 top-[22%] -z-30 font-display text-4xl leading-10 font-bold tracking-[-0.02em] text-fg/90 md:text-6xl md:leading-16"
      >
        {content.portraitWords.map((words, i) => (
          <WordRow key={i} words={words} speed={ROW_SPEED[i]} reverse={i === 1} />
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-0 left-1/2 -z-20 h-[85%] w-[85%] -translate-x-1/2 md:w-[90%] lg:h-[80%] lg:w-[75%]">
        <Image
          src="/umair-nadeem-cutout.webp"
          alt="Umair Nadeem in a dark hoodie with his arms crossed"
          fill
          sizes="(min-width: 1024px) 312px, (min-width: 768px) 310px, 85vw"
          className="object-contain object-bottom drop-shadow-[0_25px_25px_rgb(0_0_0/0.15)]"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-surface via-surface/20 to-transparent"
      />

      <IconChip icon={UserRound} />

      <CardLockup caption={CAPTION} title={<span translate="no">{content.name}</span>} />
    </BentoCard>
  )
}
