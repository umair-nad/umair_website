const PATH_D = 'M0 20 Q25 0 50 20 T100 20 T150 20 T200 20 T250 20 T300 20'

// The QA signature before the footer (DESIGN.md section 2): a neutral
// stroke in `fg` at 12% opacity, so it follows the light/dark theme via
// currentColor. Decorative only (aria-hidden), so no contrast minimum. The
// footer's FooterWaveform settles it toward a flat line on scroll.
export default function WaveformDivider({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 40" preserveAspectRatio="none" className={`h-10 w-full text-fg ${className}`} aria-hidden="true">
      <path
        d={PATH_D}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.12}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
