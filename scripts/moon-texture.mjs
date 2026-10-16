// Renders assets/textures/moon-surface.svg (our own fractal-noise texture)
// to the small greyscale WebP the /book-a-call header uses (DESIGN.md
// 11.8). Run once after changing the SVG: node scripts/moon-texture.mjs
// sharp ships with Next.js, so nothing extra is installed.
import { mkdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const path = (rel) => fileURLToPath(new URL(rel, import.meta.url))

const svg = await readFile(path('../assets/textures/moon-surface.svg'))
await mkdir(path('../public/textures/'), { recursive: true })
const info = await sharp(svg).greyscale().webp({ quality: 55, effort: 6 }).toFile(path('../public/textures/moon-surface.webp'))
console.log(`moon-surface.webp: ${info.width}x${info.height}, ${info.size} bytes`)
