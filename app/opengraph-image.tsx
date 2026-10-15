import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { content } from '@/lib/content'
import { ACCENT_WORD, AFTER, BEFORE, HAS_ACCENT } from '@/lib/hero-headline'
import { PATH as LOGO_PATH, VIEWBOX as LOGO_VIEWBOX } from '@/components/brand/Logo'

// Open Graph image (DESIGN.md section 9), 1200x630, generated at build time.
// Light theme, the site default (a shared image can't follow the viewer's
// theme): white, the hero's warm corner washes and a soft pink and sky glow
// low in the frame, the monogram, the hero headline in EB Garamond with the
// accent word in the light gradient, and the name and role in Source Code
// Pro. Colors are the light tokens from app/globals.css. The fonts are the
// static OFL files in assets/fonts (next/og can't use the next/font files).

export const alt = `${content.name}, ${content.title}: ${BEFORE}${HAS_ACCENT ? ACCENT_WORD : ''}${AFTER}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const font = (file: string) => readFile(join(process.cwd(), 'assets/fonts', file))

const FG = '#000000'
const TEXT = '#404040'
const MUTED = 'rgba(0, 0, 0, 0.6)'
const LINE = 'rgba(0, 0, 0, 0.1)'
const ACCENT_GRADIENT = 'linear-gradient(135deg, #ff0080, #7928ca, #0070f3)'

// --wash-1 / --wash-2 in the two top corners, and --glow-a / --glow-b as one
// low horizon glow (the hero's arc, simplified for a still image).
const BACKGROUND = [
  'radial-gradient(circle 560px at 40px 0px, rgba(255, 149, 0, 0.12), rgba(204, 153, 0, 0.04) 55%, transparent 100%)',
  'radial-gradient(circle 560px at 1160px 0px, rgba(255, 149, 0, 0.12), rgba(204, 153, 0, 0.04) 55%, transparent 100%)',
  'radial-gradient(ellipse 680px 210px at 600px 680px, rgba(255, 105, 180, 0.3), rgba(0, 191, 255, 0.12) 55%, transparent 100%)',
].join(', ')

// next/og lays text out with flexbox only, so the headline is one flex item
// per word; wrapping and centering then match the hero.
const words = (text: string) => text.split(' ').filter(Boolean).map((word, i) => <span key={`${text}-${i}`}>{word}</span>)

export default async function Image() {
  const [garamond, garamondItalic, mono, monoSemiBold] = await Promise.all([
    font('EBGaramond-Regular.ttf'),
    font('EBGaramond-Italic.ttf'),
    font('SourceCodePro-Regular.ttf'),
    font('SourceCodePro-SemiBold.ttf'),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '64px 80px 56px',
          backgroundColor: '#ffffff',
          backgroundImage: BACKGROUND,
          color: FG,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <svg width={61} height={60} viewBox={LOGO_VIEWBOX} fill={FG}>
            <path fillRule="evenodd" d={LOGO_PATH} />
          </svg>
          <span style={{ fontFamily: 'Source Code Pro', fontSize: 22, color: MUTED }}>{content.location}</span>
        </div>

        <div
          style={{
            flexGrow: 1,
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'center',
            justifyContent: 'center',
            columnGap: 20,
            padding: '0 40px',
            fontFamily: 'EB Garamond',
            fontSize: 80,
            lineHeight: 1.15,
            textAlign: 'center',
          }}
        >
          {words(BEFORE)}
          {HAS_ACCENT && (
            <span
              style={{
                fontStyle: 'italic',
                backgroundImage: ACCENT_GRADIENT,
                backgroundClip: 'text',
                color: 'transparent',
                paddingRight: 4,
              }}
            >
              {ACCENT_WORD}
            </span>
          )}
          {words(AFTER)}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
            paddingTop: 28,
            borderTop: `1px solid ${LINE}`,
            fontFamily: 'Source Code Pro',
            fontSize: 30,
          }}
        >
          <span style={{ fontWeight: 600, color: FG }}>{content.name}</span>
          <span style={{ color: MUTED }}>|</span>
          <span style={{ color: TEXT }}>{content.title}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'EB Garamond', data: garamond, style: 'normal', weight: 400 },
        { name: 'EB Garamond', data: garamondItalic, style: 'italic', weight: 400 },
        { name: 'Source Code Pro', data: mono, style: 'normal', weight: 400 },
        { name: 'Source Code Pro', data: monoSemiBold, style: 'normal', weight: 600 },
      ],
    }
  )
}
