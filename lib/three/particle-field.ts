import * as THREE from 'three'

export type ParticleTier = 'standard' | 'reduced'

export interface ParticleFieldOptions {
  tier: ParticleTier
  /** Static reduced-motion mode: render once at the resolved shape, no rAF loop. */
  reducedMotion: boolean
}

const TIER_CONFIG: Record<ParticleTier, { count: number; maxPixelRatio: number }> = {
  standard: { count: 4000, maxPixelRatio: 2 },
  reduced: { count: 1000, maxPixelRatio: 1 },
}

const RIBBON_WIDTH = 12
const RIBBON_ROWS = 3
const ROW_SPACING = 0.6
const WAVE_AMPLITUDE = 1.1
const RESOLVE_DURATION = 1.4 // seconds, scatter -> resolved ribbon

function waveY(x: number, z: number, t: number): number {
  return (
    Math.sin(x * 0.6 + t * 1.2) * WAVE_AMPLITUDE * 0.6 +
    Math.sin(x * 1.3 - t * 0.8 + z) * WAVE_AMPLITUDE * 0.4
  )
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

interface RibbonBuild {
  geometry: THREE.BufferGeometry
  material: THREE.PointsMaterial
  points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>
  startPositions: Float32Array
  targetXZ: Float32Array // [x0,z0,x1,z1,...] - target x/z are fixed, y is animated
}

function buildRibbon(count: number, staticShape: boolean): RibbonBuild {
  const startPositions = new Float32Array(count * 3)
  const targetXZ = new Float32Array(count * 2)
  const initialPositions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const i2 = i * 2

    // Scattered start: random point in a loose cube (the "noise").
    startPositions[i3] = (Math.random() - 0.5) * 20
    startPositions[i3 + 1] = (Math.random() - 0.5) * 20
    startPositions[i3 + 2] = (Math.random() - 0.5) * 20

    // Target: a few parallel rows across X (the "ribbon").
    const x = (Math.random() - 0.5) * RIBBON_WIDTH
    const row = Math.floor(Math.random() * RIBBON_ROWS) - Math.floor(RIBBON_ROWS / 2)
    const z = row * ROW_SPACING
    targetXZ[i2] = x
    targetXZ[i2 + 1] = z

    if (staticShape) {
      // Reduced-motion: render directly at the final wave shape, no
      // scatter phase, no time-based animation.
      initialPositions[i3] = x
      initialPositions[i3 + 1] = waveY(x, z, 0)
      initialPositions[i3 + 2] = z
    } else {
      initialPositions[i3] = startPositions[i3]
      initialPositions[i3 + 1] = startPositions[i3 + 1]
      initialPositions[i3 + 2] = startPositions[i3 + 2]
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(initialPositions, 3))

  const material = new THREE.PointsMaterial({
    color: 0xff5c5c,
    size: 0.045,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
  })

  const points = new THREE.Points(geometry, material)

  return { geometry, material, points, startPositions, targetXZ }
}

export class ParticleField {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  private geometry: THREE.BufferGeometry
  private material: THREE.PointsMaterial
  private points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>
  private startPositions: Float32Array
  private targetXZ: Float32Array
  private clock = new THREE.Clock()
  private rafId: number | null = null
  private paused = false
  private isStatic: boolean
  private mouseX = 0
  private mouseY = 0

  constructor(canvas: HTMLCanvasElement, width: number, height: number, options: ParticleFieldOptions) {
    const { count, maxPixelRatio } = TIER_CONFIG[options.tier]
    this.isStatic = options.reducedMotion

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    // WebGLRenderer's constructor throws if a context can't be created,
    // which the caller (ParticleCanvas) catches; this is a defensive
    // second check in case a given browser/Three version fails silently
    // instead.
    if (!this.renderer.getContext()) {
      throw new Error('WebGL context unavailable')
    }
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio))
    this.renderer.setSize(width, height, false)

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
    this.camera.position.set(0, 0, 10)

    const { geometry, material, points, startPositions, targetXZ } = buildRibbon(count, this.isStatic)
    this.geometry = geometry
    this.material = material
    this.points = points
    this.startPositions = startPositions
    this.targetXZ = targetXZ
    this.scene.add(points)
  }

  mount() {
    if (this.isStatic) {
      // Static reduced-motion case: one render call, no frame loop.
      this.renderer.render(this.scene, this.camera)
      return
    }
    this.clock.start()
    this.startLoop()
  }

  private startLoop() {
    if (this.rafId !== null) return
    const tick = () => {
      if (this.paused) return
      this.update(this.clock.getElapsedTime())
      this.renderer.render(this.scene, this.camera)
      this.rafId = requestAnimationFrame(tick)
    }
    this.rafId = requestAnimationFrame(tick)
  }

  private update(t: number) {
    const position = this.geometry.attributes.position as THREE.BufferAttribute
    const resolveT = easeOutCubic(Math.min(t / RESOLVE_DURATION, 1))

    for (let i = 0; i < position.count; i++) {
      const i3 = i * 3
      const i2 = i * 2
      const sx = this.startPositions[i3]
      const sy = this.startPositions[i3 + 1]
      const sz = this.startPositions[i3 + 2]
      const tx = this.targetXZ[i2]
      const tz = this.targetXZ[i2 + 1]
      const ty = waveY(tx, tz, t)

      position.setXYZ(i, sx + (tx - sx) * resolveT, sy + (ty - sy) * resolveT, sz + (tz - sz) * resolveT)
    }
    position.needsUpdate = true

    // Gentle mouse-driven parallax, eased toward the target rotation.
    this.points.rotation.y += (this.mouseX * 0.3 - this.points.rotation.y) * 0.05
    this.points.rotation.x += (this.mouseY * 0.15 - this.points.rotation.x) * 0.05
  }

  /** nx, ny expected normalized to roughly -1..1. */
  onMouseMove(nx: number, ny: number) {
    this.mouseX = nx
    this.mouseY = ny
  }

  pause() {
    this.paused = true
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  resume() {
    if (this.isStatic || !this.paused) return
    this.paused = false
    this.startLoop()
  }

  resize(width: number, height: number) {
    if (width === 0 || height === 0) return
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setPixelRatio(this.renderer.getPixelRatio())
    this.renderer.setSize(width, height, false)
    if (this.isStatic) {
      this.renderer.render(this.scene, this.camera)
    }
  }

  destroy() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    this.geometry.dispose()
    this.material.dispose()
    this.renderer.dispose()
  }
}
