# DESIGN.md

Design direction for the redesign of umair-nadeem portfolio (Phase 3, approved by the user 2026-10-10).
Approved content source: `lib/content.ts` only. Project rules: `CLAUDE.md`.
Reference: dhirajbhawsar.in. We match its theme (colors, light/dark modes, typography, surfaces, borders, radius). We never reuse its logo, text, images, video, or developer-only sections.

Measurement source for every reference value in this file: playwright-cli on the live site, 2026-10-10, at 1440x900 and 390x844, in both modes, read with `getComputedStyle`. Colors were converted to hex by painting them onto a canvas pixel. Alpha colors are listed as `color/alpha` and flattened over their real background for contrast math. Values marked **(ours)** are design decisions, not reference measurements.

---

## 1. Design read

Reading this as: **single-page portfolio of a QA engineer for recruiters and hiring managers, in the reference's editorial language: a classical serif display voice over a quiet neutral page, a mono "machine voice" for facts, and one gradient accent word per headline.** Umair's QA identity lives in the content and in one subtle signature: the waveform.

Dials: `DESIGN_VARIANCE: 7`, `MOTION_INTENSITY: 6`, `VISUAL_DENSITY: 4`.

### What we take from the reference

- **Theme system:** light and dark modes with a toggle at the far right of the header; a pure neutral palette (white / near-black, neutral grays, black or white alpha borders); color appears only as the gradient accent word, the active nav item, and one green status chip.
- **Typography:** EB Garamond for display headlines, Alata for UI labels and card titles, Source Code Pro for sublines, captions, and body copy.
- **Surfaces:** flat cards with 1px alpha borders and a 10px radius, frosted (backdrop-blur) chrome for the nav pill and status capsule, full-pill CTAs and badges.
- **Layout patterns:** one idea per viewport with generous whitespace; a floating centered nav pill with one embedded CTA; a status capsule beside the toggle; bento cards with a caption lockup (mono caption above, title below); a primary CTA with an embedded circular arrow chip next to a copy-email row; a three-column-style footer with uppercase micro-labels and an inverse "CV" button.

### What we deliberately do differently

- **Hero atmosphere only (approved by the user 2026-10-12).** The reference's hero has warm corner light washes and a glowing horizon arc in both modes; we rebuild those two from our own measurements (section 2). Every other cosmic or ambient element of the reference stays excluded: animated glow pulses and drifts, the spotlight motion, glow blobs in other sections, grain, and page-wide washes. Two static exceptions match a section's own glow on the reference, with no motion, blur filter, or grain: the Skills wall's glow (approved with the wall, 2026-10-12; 11.4) and the contact panel's two cyan pools (approved by the user 2026-10-15; 11.5).
- **QA signature:** the waveform survives in one place, the WaveformDivider before the footer (section 2, 11.6). The hero trace was replaced by the horizon arc on 2026-10-12.
- **Correct system-preference mapping.** The reference uses next-themes with inverted styling: its `dark` class renders the white page, so a visitor whose OS prefers dark gets the white page. We map OS dark to our dark theme.
- **Contrast fixes.** Several reference colors fail WCAG AA for the way we use them (section 3). Where that happens we keep the closest passing value from the reference's own palette and say so in the table.
- **Novelty fonts excluded.** The reference also loads Shadows Into Light (handwritten, on its "Skills & Tools" headline) and Henny Penny (novelty, inside a bento card). Both sit in developer-novelty sections, so they are out unless you ask for them.
- **Real italic.** The reference loads only the EB Garamond Regular file, so its italic accent words are browser-synthesized slants. We load EB Garamond's real italic.
- **No copied content:** no reused text, headlines, logo, images, video, or developer-only sections (Guestbook, Spotify, Uses, Bucket List, Links, Blog, GitHub insights, "From Concept to Code").

---

## 2. Visual theme

**Two modes, one design.** Light is a white page with black type; dark is a #0A0A0A page with white type. Everything else (layout, type, radius, motion) is identical across modes. Decoration stays quiet: the serif headline and its gradient accent word carry the luxury.

### Light / dark behavior (ours, matching the reference's placement)

- **Default:** light.
- **First visit:** follow `prefers-color-scheme` (OS dark gives dark; no preference or unsupported gives light).
- **Remembered choice:** clicking the toggle stores `theme` = `light` | `dark` in localStorage (same key the reference uses) and that choice wins on later visits. While no choice is stored, a live OS preference change is followed.
- **No flash of the wrong theme:** a small blocking inline script in `<head>` (in `app/layout.tsx`, before first paint) reads localStorage, falls back to `matchMedia('(prefers-color-scheme: dark)')`, then sets the `dark` class and `style.colorScheme` on `<html>`. Wrapped in try/catch so blocked storage falls back to the OS preference. `<html suppressHydrationWarning>`. No new dependency (the reference uses next-themes; a 10-line script does the same job here). **CSP-safe:** the script is a static string (no interpolated data) and carries the per-request CSP nonce read from the request headers in the layout (section 10). It must never rely on `'unsafe-inline'`.
- **Toggle control:** a native `<button type="button">`, 36x36px, 8px radius, transparent background, lucide `Sun` icon (19px) shown in dark mode and `Moon` shown in light mode, exactly as the reference does. Icons swap with CSS (`dark:` variants) so the server render is correct before hydration. `aria-label` describes the action ("Switch to dark theme" / "Switch to light theme"; "Toggle theme" before hydration). Keyboard: Tab focus, Enter and Space activate (native button), visible accent focus ring.
- **Placement:** far right of the header row, right of the status capsule, at all widths. Measured on the reference: desktop x=1300-1336 of 1440, y=22; mobile x=330-366 of 390, y=20.
- **Switch hygiene:** transitions are suppressed for one frame during a switch so colors don't animate.
- **Browser chrome:** `themeColor` per scheme (`#ffffff` light, `#0a0a0a` dark), via the Next.js `viewport` export.

### Hero atmosphere (approved 2026-10-12)

Our own CSS in `components/hero/HeroAtmosphere.tsx`, built from playwright-cli measurements of the live reference hero at 1440x900 in both themes (2026-10-12). No reference code or assets. Colors are tokens in `globals.css` (`--wash-*`, `--glow-*`, `--arc-*`); the reference's theme classes are inverted, so its `dark:` values are what we use in light.

| Layer | Geometry (measured) | Light | Dark |
|---|---|---|---|
| Corner washes | 3 circular pools per top corner, in px from the corner: r 1021 at (245, 182), r 647 at (98, -97), r 647 at (-452, 6) | warm: `255 149 0 / .12`, `230 153 0 / .10`, `255 106 0 / .08` (mid stops `/.06`, `/.04`, `/.03`) | cool: `61 122 245 / .08`, `184 61 245 / .06`, `255 51 187 / .05` |
| Arc stage | 1200x400, centered, bottom of a 240px block under the CTA row; faded out horizontally (0, 30%, 70%, 0) and, ours, toward its top | | |
| Glow A | 900x120 source centered 210px above the stage bottom, 60% opacity | `#ff69b4` | `#6a0dad` |
| Glow B | 600x100 source centered 230px above the stage bottom, 60% opacity | `#00bfff` | `#4169e1` |
| Arc | ellipse 2244x956, apex 197px above the stage bottom; rim = `inset 0 2px 50px #6a0dad` + `0 -15px 50px 1px rgb(255 105 180 / .4)` | same | same |

- **Performance:** no `filter: blur`. The reference blurs the glows by 60-70px; we enlarge each glow around the same center and give its radial gradient a soft falloff instead. The washes are one element with six gradients. Everything is static paint (the reference animates its glows and spotlights; we don't).
- **Contrast (measured over the painted glow, 390 and 1440, both themes):** all hero text passes AA. The tightest is the gradient accent word in light (3.19:1 at 390, 3.26:1 at 1440; large text needs 3:1). Below `md` the washes render at 55% because the left and right pools overlap there.
- **Motion:** the arc rises into place once in the hero entrance timeline (hierarchy: the light comes up after the claim lands); static under reduced motion. The washes don't move.
- All layers are `aria-hidden` and sit behind the text (`isolate` on the hero, layers at `-z-10`).

### Waveform signature, recolored (ours)

- **WaveformDivider:** neutral stroke, `fg` at 12% (black/12 in light, white/12 in dark). `aria-hidden` decoration, one place only: before the footer, where it settles toward a flat line as the page ends (11.6). Nothing else on the page draws a waveform.

Grain: none. Glow surfaces: the hero atmosphere above, plus two static section glows, the Skills wall's (11.4) and the contact panel's cyan pools (11.5; approved 2026-10-15).

---

## 3. Color palette and roles

Implemented in build step 1 (2026-10-10) on Tailwind 4: the raw values live as CSS variables in `app/globals.css`, in two sets, `:root` (light) and `.dark` (dark). `@theme inline` maps them to utilities (`bg-bg`, `text-text`, `border-line`, and so on), and `@custom-variant dark` makes `dark:` follow the `dark` class on `<html>`. Opacity modifiers (`bg-fg/5`) work through Tailwind 4's `color-mix`. There is no `tailwind.config.js`. The Signal & Noise tokens (coral `accent`, teal `accent-2`), the five legacy navy/teal aliases (`primary/secondary/dark/light/slate` and `--legacy-*`), and the legacy-colored webkit scrollbar are all **deleted**.

The reference's `:root` / `.dark` CSS variables are stock shadcn/ui "slate" values that its visible UI barely uses; the real visible colors come from hard-coded utility classes. The table below uses the **visible** computed values.

| Token | Light | Dark | Role | Reference element measured |
|---|---|---|---|---|
| `bg` | `#ffffff` | `#0a0a0a` | Page background | `main` |
| `surface` | `#ffffff` | `#141414` | Bento cards, contact panel | bento card |
| `surface-2` | `#fafafa` | `#0a0a0a` | Inset panels, chips, email bar | secondary panel (light #fafafa / dark #0a0a0a, 14.4px radius) |
| `line` | `#000000/0.10` | `#ffffff/0.10` | Default 1px border (cards, nav pill, chips) | card border (light); nav pill and keycap borders (dark) |
| `line-strong` | `#000000/0.20` | `#ffffff/0.20` | Nav-CTA and secondary-pill borders | "Book a Call" |
| `fg` | `#000000` | `#ffffff` | Headlines, card titles, primary text | `h1`, `h2`, card `h3` |
| `text` | `#404040` | `#a1a1a1` | Mono body copy and captions | bento caption |
| `text-hero` | `#404040` | `#d4d4d4` | Hero subline | hero subline |
| `muted` | `#000000/0.60` | `#ffffff/0.60` | Footer links, secondary UI text, micro-labels | footer links |
| `accent` | `#7928ca` | `#c27aff` | Active nav item, focus rings, check bullets | nav "Home" (see note 1) |
| `accent-gradient` | `#ff0080 > #7928ca > #0070f3` | `#ff0080 > #38bdf8` | The one accent word per headline (gradient text, 135deg) | hero accent span (see note 2) |
| `inverse` / `inverse-fg` | `#171717` / `#ffffff` | `#ffffff` / `#000000` | CTA arrow chip | CTA chip (light #000, dark #fff) |
| `live` | `#00c950` (label text `#000000`) | `#00c950` (label text `#000000`) | Status capsule dot | "NEW" chip (see note 3) |
| `node` / `node-icon` | `#d4d4d4` / `#525252` | `#262626` / `#a1a1a1` | Experience timeline node disc and glyph (5.3:1, 5.9:1) | timeline node (neutral-300/600 light, neutral-800/400 dark) |
| `cta-panel` / `--cta-glow` / `--cta-vignette` | `#f8f9fa` / cyan `34 211 238 / .24` / white/60 | `#000000` / cyan `6 182 212 / .38` / black/80 | Contact panel fill, its two glow pools, its edge vignette | closing panel (sampled glow peaks `#c9f3fa` light, `#004450` dark) |

Elevation: light cards carry the reference's shadow, `0 10px 15px -3px rgb(0 0 0/0.1), 0 4px 6px -4px rgb(0 0 0/0.1)` (Tailwind `shadow-lg`). Dark cards use the same declaration, which is effectively invisible on #141414, as in the reference. Frosted chrome uses `backdrop-filter: blur(12px)` (nav pill, status capsule), `blur(10px)` (hero badge), `blur(8px)` (cards), and `blur(4px)` (primary CTA).

Notes:
1. **Active nav.** Reference values are `#c27aff` in light and `#ad46ff` in dark. `#c27aff` on white measures 2.79:1 and `#ad46ff` on white 4.12:1; both fail AA for 13px text. We use `#7928ca` (a stop from the reference's own gradient, 7.07:1) in light and keep the reference's `#c27aff` in dark (7.09:1; the reference's own dark value `#ad46ff` also passes at 4.81:1).
2. **Gradient accent word.** Reference: `linear-gradient(135deg, #ff0080, #7928ca, #0070f3, #38bdf8, #ff0080)` in both modes, on italic EB Garamond. Sampled at 21 points, it bottoms out at 2.14:1 on white (at `#38bdf8`) and 2.79:1 on #0a0a0a (around `#732ccc`); both fail even the 3:1 large-text floor. Our per-theme stop sets use only reference stops and pass across the whole sampled ramp: light `#ff0080 > #7928ca > #0070f3` (minimum 3.77:1), dark `#ff0080 > #38bdf8` (minimum 4.17:1). The accent word is always headline size (36px and up), so the 3:1 large-text threshold applies.
3. **Live chip.** The reference puts white text on `#00c950` in light mode (2.22:1, fail) and black text in dark mode. We use black text in both (9.47:1).

### WCAG AA contrast, computed (WCAG 2.x relative luminance; alpha flattened over the real background)

| Theme | Text use | Foreground (flattened) | Background | Ratio | Result |
|---|---|---|---|---|---|
| Light | Headlines, titles (`fg`) | `#000000` | `#ffffff` | 21.00:1 | AAA |
| Light | `fg` on inset panel | `#000000` | `#fafafa` | 20.12:1 | AAA |
| Light | Body / captions (`text`) | `#404040` | `#ffffff` | 10.37:1 | AAA |
| Light | `text` on inset panel | `#404040` | `#fafafa` | 9.93:1 | AAA |
| Light | `muted` (black/60) | `#666666` | `#ffffff` | 5.74:1 | AA |
| Light | `muted` on inset panel | `#646464` | `#fafafa` | 5.67:1 | AA |
| Light | `accent` (active nav, 13px) | `#7928ca` | `#ffffff` | 7.07:1 | AAA |
| Light | Accent gradient, worst sampled point (large) | `#ff0080` | `#ffffff` | 3.77:1 | AA large |
| Light | Live chip label | `#000000` | `#00c950` | 9.47:1 | AAA |
| Dark | Headlines, titles (`fg`) | `#ffffff` | `#0a0a0a` | 19.80:1 | AAA |
| Dark | `fg` on card | `#ffffff` | `#141414` | 18.42:1 | AAA |
| Dark | Hero subline (`text-hero`) | `#d4d4d4` | `#0a0a0a` | 13.36:1 | AAA |
| Dark | Body / captions (`text`) | `#a1a1a1` | `#0a0a0a` | 7.66:1 | AAA |
| Dark | `text` on card | `#a1a1a1` | `#141414` | 7.13:1 | AAA |
| Dark | `muted` (white/60) | `#9d9d9d` | `#0a0a0a` | 7.30:1 | AAA |
| Dark | `muted` on card | `#a1a1a1` | `#141414` | 7.13:1 | AAA |
| Dark | `accent` (active nav, 13px) | `#c27aff` | `#0a0a0a` | 7.09:1 | AAA |
| Dark | Accent gradient, worst sampled point (large) | `#b942aa` | `#0a0a0a` | 4.17:1 | AA large |
| Dark | Live chip label | `#000000` | `#00c950` | 9.47:1 | AAA |

Rejected for text (decorative use only, or not at all):

| Theme | Reference value | Flattened | Ratio | Why rejected |
|---|---|---|---|---|
| Light | black/35 (tiny mono labels) | `#a6a6a6` | 2.43:1 | Fails AA; use `muted` instead |
| Light | black/50 (footer column labels) | `#808080` | 3.95:1 | Fails AA at 10.4px; footer labels use `muted` (5.74:1) |
| Dark | white/35 (tiny mono labels) | `#606060` | 3.15:1 | Fails AA; use `muted` instead |

Focus rings use `accent` (7.07:1 light, 7.09:1 dark against `bg`), which clears the 3:1 non-text minimum (WCAG 1.4.11). The reference's shadcn `--ring` (`#90a1b9`) is not used.

Rules: one gradient accent word per headline, no other gradient text. Saturated color never fills a large area. Elevation comes from 1px borders, the light-mode card shadow, and small lightness steps.

---

## 4. Typography

All three faces are free on Google Fonts and load through `next/font/google` in `app/layout.tsx` (CSS variables `--font-eb-garamond`, `--font-alata`, `--font-source-code-pro`, exposed as `font-display`, `font-sans`, `font-mono`). They replaced Bricolage Grotesque, JetBrains Mono, and Satoshi in build step 1; the Satoshi files were deleted.

| Voice | Face (reference file) | Load (ours) | Use |
|---|---|---|---|
| Display | EB Garamond (reference loads `EBGaramond_Regular.ttf` only) | 400 normal + 400 italic | `h1`, section `h2`, the accent word |
| UI | Alata (`Alata_Regular.ttf`; the family has one weight) | 400 | Nav links, buttons, card titles, micro-labels |
| Machine | Source Code Pro (reference serves `SourceCodePro_Medium.ttf` as "Codefont") | 500, 600, 700 | Hero subline, captions, body copy, chips, dates, footer links, capsule, email |

Measured scale (desktop 1440):

| Element | Face | Size / line-height | Weight / style | Tracking |
|---|---|---|---|---|
| Hero `h1` | EB Garamond | 60px / 82.5px (1.375) | 400 | normal |
| Section `h2` | EB Garamond | 56px / 70px (1.25) | 400 | normal |
| Accent word | EB Garamond | inherits | 400 italic, gradient text | normal |
| Hero subline | Source Code Pro | 20px | Medium file | normal |
| Body / caption | Source Code Pro | 14px | Medium file | normal |
| Card title | Alata | 18px / 28px | 400 (ours; see below) | 0.45px |
| Nav link | Alata | 13px | 400 | normal |
| Primary CTA label | Alata | 16px | 400 (ours; reference computes 500) | normal |
| Footer column micro-label | Alata | 10.4px / 15.6px, uppercase | 400 (ours) | 2.08px (0.2em) |
| Footer link | Source Code Pro | 14px | 600 | normal |
| "Download resume" button | Alata | 16px | 400 | normal |
| Capsule text / keycap | Source Code Pro | 11px / 10px | Medium file | normal |

- **Faux weights.** The reference computes weight 600 or 700 on Alata (single-weight family), so the browser synthesizes the bold. We render Alata at 400 to avoid faux bold; hierarchy comes from size and the serif/sans contrast. Source Code Pro gets real 600 and 700 files instead of synthesized ones.
- **Mobile scale (ours, not measured):** `h1` `text-4xl md:text-5xl lg:text-[60px]`; `h2` `text-4xl lg:text-[56px]`.
- **One accent word per headline:** EB Garamond italic with the theme's `accent-gradient` as gradient text. Never more than one. Hero: "break" in "I break things so your users don't have to."
- **Card caption lockup:** mono caption in `text` on top, Alata title in `fg` below, anchored bottom-left of every bento card (measured order on the reference: caption y=1218, title y=1263).
- **Mono micro-labels:** Alata, uppercase, 0.2em tracking, used sparingly (eyebrow budget below).
- Italic words with descenders get a `leading-[1.1]` minimum plus bottom padding reserve (gradient text clips descenders otherwise).

Eyebrow budget: the page has 6 sections; maximum 2 eyebrow micro-labels total (hero counts if used). Default: zero eyebrows; headlines stand alone.

Em dashes: **zero**, anywhere, including this file and all site strings (locked CLAUDE.md rule + taste rule 9.G). Hyphens for ranges.

---

## 5. Layout and spacing

- Container: `max-w-[1280px] mx-auto px-4 md:px-8`. Hero and CTA may use a wider stage.
- Section rhythm: `py-28 md:py-40` between sections; one idea per viewport. Dense clusters (bento, chips) against large voids is the page's rhythm.
- Grid over flex math everywhere. Explicit `<768px` single-column collapse declared per section.
- `min-h-[100dvh]` for the hero, never `h-screen`.
- Corner radius system (measured on the reference): cards and nav pill 10px (the reference's `--radius: 0.625rem`); nav link hover/active tint 10px; inset panels 14px; status capsule 14px; contact panel 14px (the reference's closing panel measures 0.9rem, 2026-10-12; it uses the inset radius, and the planned 24px token was dropped); small buttons (theme toggle) 8px; keycaps 8px; primary and secondary CTAs ("Let’s Connect", "Download resume"), badges, and chips full pill; Skills & Tools icon tiles 16px (measured on the reference, 2026-10-12). Nothing else.
- Layout families across the 6 sections (no family repeats): centered stage (hero), asymmetric bento, timeline split, centered icon wall, contact panel, footer columns.

---

## 6. Components

### Chrome (verdicts from the code audit)

| Piece | Verdict | Notes |
|---|---|---|
| `SmoothScrollProvider` | **Keep** | ScrollSmoother 1.2 + data-speed parallax. Fixed elements stay outside `#smooth-content`; anchors go through `smoother.scrollTo`. |
| `lib/gsap.ts`, `lib/magnetic.ts`, `lib/motion-preferences.ts` | **Keep** | The motion contract. All new sections follow the documented `gsap.matchMedia` pattern with `gsap.set` reduced-motion fallbacks. |
| `WaveformDivider` | **Adapt** | Signature divider; restroked from teal to the neutral `fg`/12% line in both themes (section 2). A static SVG since 2026-10-12; the footer's `FooterWaveform` settles it on scroll (11.6). |
| `AmbientBackground` | **Drop** | Its graticule grid, drifting traces, teal glow blobs, grain filter, and cursor glow all belong to the retired dark-only Signal & Noise look, and a full-page waveform layer would exceed the divider-only waveform signature. Of the reference's atmosphere, only the hero corner washes and horizon arc are used (section 2, approved 2026-10-12). |
| `Preloader` | **Drop** | Its only content is a waveform draw, which would be a third waveform use; a static single-page site doesn't need a loading screen. |
| `Navbar` | **Adapt** | Keep all scroll/menu/magnetic/a11y plumbing; rebuild the shell as the floating pill nav, status capsule, and theme toggle (below). |
| `Footer` | **Adapt** | Keep the waveform-settling-to-baseline closing beat (WaveformDivider); rebuild content (dynamic year, links from content.ts, "Download resume"). |
| `Cursor` | **Drop** | Custom cursors are a banned tell; payoff is near zero. Magnetic hover stays. |
| `ParticleCanvas` + `lib/three/particle-field.ts` | **Drop** | Removes Three.js and its ~580 KB async chunk (size as recorded in commit `1cce18e`; it never shipped in First Load JS). The hero horizon arc (section 2) now fills that space. |
| `Hero`, `About`, `Experience`, `Skills`, `Contact`, `Footer` | **Rebuilt (all done 2026-10-12)** | The originals were hardcoded, partly stale or rule-violating (old headshot, "SQA Engineer" title, missing Smart In Media role, published phone number). Each was replaced, from `lib/content.ts`, in the order of section 13. |

New component: **`ThemeToggle`** (section 2), plus the inline no-flash script in `app/layout.tsx`.

### New component vocabulary

- **Logo (Umair's own "UN" serif monogram, added 2026-10-10):** source of truth is `assets/brand/un-monogram.svg`, traced from the original raster (`assets/brand/un-monogram-original.png`, kept for reference, not public). Pixel overlap with the original's ink is 0.988 IoU at zero offset. It has a transparent background and `fill="currentColor"`, viewBox `0 0 401 396`, one even-odd path. The `Logo` component (`components/brand/Logo.tsx`, built in step 1, with the path copied verbatim from the SVG) inlines it, colored `fg` so it follows the theme. Inside the home link the SVG is `aria-hidden` and the link carries `aria-label="Umair Nadeem, back to top"`; standalone it is `role="img"` with an accessible name. Sizes (ours): 32px tall in the nav (the reference's mark measures about 34px), 40px in the footer. Never recolor it with the accent gradient, stretch it, or put it on a tinted plate.
- **Floating nav (measured):** three zones on one row. Left: the `Logo` (home link). Center: a 40px-tall pill (`line` border, 10px radius, backdrop blur 12px; reference fill white/5 in dark, black/10 in light) holding Home plus the 4 anchor links (Home, About, Skills, Experience, Contact, following the page order; Home added by the user 2026-10-12: it scrolls back to the hero `#home` like the logo, smooth via ScrollSmoother and instant under reduced motion, and is the active tab while the hero is in view) in Alata 13px, the active one in `accent` with a 10px-radius tint (reference: white/5), and one embedded "Let’s Connect" button (reference "Book a Call": 30px tall, white/10 fill, white/20 border, 10px radius). The reference's light-mode pill border is white/10, which is invisible on white, so we use `line` (black/10) in light. Right: status capsule (desktop, `lg`+) then the theme toggle. Below `md` there is no hamburger: the top bar holds the `Logo`, the status capsule, and the theme toggle, and navigation moves to the floating mobile nav (next item).
- **Floating mobile nav (below md; user decision 2026-10-12, measured on the reference's phone nav):** a 48px round toggle fixed 16px from the bottom-right (clear of the iOS safe area; lucide `PanelBottomOpen`, `X` while open) opens a vertical stack of 48px round icon links above it (6px apart, 12px above the toggle): Home (`House`, scrolls to the hero), About (`UserRound`), Skills (`ListChecks`), Experience (`BriefcaseBusiness`), Contact (`Mail`); no phone. Inverse-colored circles with `shadow-lg`: light `#171717` (toggle `#262626`) with `#a3a3a3` icons, dark `#fafafa` with `#737373` icons; the active section's icon is the other theme's accent (`#c27aff` light, `#7928ca` dark) so it reads on the inverse fill (icon contrast 7.1:1 and 4.5:1, active 6.3:1 and 7.3:1; tokens `--dock*`). Opening: links rise in nearest-first (opacity, 8px rise, 0.9 to 1 scale, 300ms, 40ms stagger), instant under reduced motion. `aria-label` on every link, `aria-expanded` and `aria-controls` on the toggle, toggle first in the DOM so Tab goes straight into the open stack; Escape closes and returns focus to the toggle; a tap outside closes; a tapped link closes and scrolls. Closed links are `inert` and ignore pointers. Active highlight shares the pill's `aria-current` ScrollTriggers. Below `sm` the copy-email button shows success through its check icon and live region only (no "Copied" label), so it reserves no width and the open stack never overlaps it.
- **Status capsule (phones and `lg`+; hidden at `md`, where the pill needs the room; fits down to 320px with 83px to spare):** 38px tall, 14px radius, backdrop blur 12px; light fill black/8, border black/15; dark fill white/5, border white/10 (all measured). Mono 11px. The reference's capsule holds weather, a place name, a clock, and a ⌘K keycap. Ours holds only the green `live` dot and Umair's local time, `ISB 14:32 PKT`, drawn from `content.location` (Islamabad). No weather, no visitor counter, no greeting, no ⌘K.
- **Primary button (measured):** full pill, 48px tall, padding `4px 4px 4px 12px`, backdrop blur 4px; light fill black/20 with black/10 border, dark fill white/10 with white/10 border; Alata 16px label; embedded 38px circular arrow chip in `inverse` (black in light, white in dark). **Hover (measured on the reference 2026-10-12, user decision):** the button never moves (no magnetic pull, no press scale). An `fg` fill grows in behind the label (scale 0 to 1, translate-x 45% to 0, opacity 0 to 1), the label turns `bg`, the chip's circle turns transparent so the arrow sits inline on the fill, and the arrow swaps with a twin sliding in from the left; all 300ms `cubic-bezier(0.4, 0, 0.2, 1)`. Hover contrast: 21:1 light, 19.8:1 dark. The reference also dims the whole button to 85% opacity; we don't. Keyboard focus shows the accent ring only. Exactly one contact-intent label site-wide: **"Let’s Connect"** (user decision 2026-10-12, replacing "Get in touch"; typographic apostrophe, as in the hero h1). It lives in `content.contact.cta`, and every contact CTA (hero, nav pill, mobile menu, and the contact panel, where it is the mailto link) reads it from there. The pill is one shared component, `components/PrimaryCta.tsx`. The nav CTA is the same anchor link, not a second styled intent.
- **Download resume button (secondary pill; user decision 2026-10-12, replacing the reference's square mono "CV" button):** same family as the primary: full pill, 48px tall, padding `0 24px`, Alata 16px in `fg`, 1px `line-strong` outline and no fill (hover: `fg`/5 fill, `fg`/40 border), lucide `Download` icon (18px) that nudges down on hover, `:active` scale 0.98. Not magnetic, so the primary still leads. `href` is `content.resume.href` (`/umair-nadeem-qa-engineer-resume.pdf`) with the `download` attribute. Appears in the hero CTA row and the footer.
- **Copy-email row:** lucide `Copy` icon + Source Code Pro email, with "copied" feedback; sits beside the CTAs. Email is the only direct contact method (locked rule).
- **Bento card (measured):** `surface` fill, 1px border (light `line` black/10; dark `#242424/0.30`, as on the reference), 10px radius, light-mode `shadow-lg`, backdrop blur 8px; caption lockup bottom-left; one focal visual per card; hover lift 2px + border step to `line-strong`.
- **Chip (ours):** full pill, `surface-2`, 1px `line`, Source Code Pro 13px. **Text only, no icons**, for tool and skill chips alike (user decision 2026-10-10). The reference's timeline chips (measured 2026-10-12) are 10px-radius, 12px mono semibold, translucent fill with a 20% border; we keep our pill so every chip on the page matches.
- **Check bullet:** list markers in evidence cards are small `accent` lucide `Check` glyphs.
- **Status badge:** removed from the hero by the user on 2026-10-12; not used anywhere.

Icons: lucide-react (already a dependency). One family, `strokeWidth` 1.75 globally.

---

## 7. Motion rules

Infrastructure: GSAP + ScrollTrigger + SplitText via `lib/gsap.ts`; ScrollSmoother via the provider. No `window.addEventListener('scroll')`, no scroll state in React, animate only `transform`/`opacity`.

Every animation must answer "what does this communicate" in one sentence:

| Moment | Animation | Why |
|---|---|---|
| Hero headline | SplitText line rise, once: painted at first paint 0.3em low (CSS, motion allowed only), lines rise to rest with a 0.12s stagger (1.1s, `expo.out`); never hidden or faded, since it is the LCP element (changed 2026-10-15 from a masked reveal from 105%) | Hierarchy: the claim lands first |
| Hero horizon | The arc rises into place under the CTA row, once | Hierarchy: the light comes up after the claim lands |
| Section entries | `whileInView`-style fade/translate reveals, staggered, once | Sequence matches reading order |
| Tools marquee | Two counter-scrolling chip rows inside one bento card | Breadth without a data dump. One of exactly two marquees on the page. |
| Portrait word rows | Two rows of large EB Garamond words scrolling in opposite directions behind the cut-out portrait (36 and 44 px/s, measured on the reference); paused off screen | Storytelling: the work passes behind the person. **The second and last approved marquee (user decision 2026-10-12)**; no other marquee may be added without asking. |
| Timeline spine | The 2px spine draws downward with the scroll (scrubbed `scaleY` from the top), its tip following a line 70% down the viewport (the reference's sits about 64% down); entries (node, metadata, card, chips) rise in once in reading order as they reach 85% of the viewport. Full spine and all entries at once under reduced motion | Progress through time |
| Hero subline typing | Measured on the reference (2026-10-12, ~125 samples per theme, fit RMSE 0.004): a staggered per-character fade, no cursor, blur, scramble, or movement; each character fades in over ~0.32s on CSS `ease` (ours: `power2.out` over 0.26s, the second-best fit), 0.02s apart. It starts together with the headline, as on the reference (user decision 2026-10-12; briefly it waited for the headline), and finishes by about 1.4s. The sentence is in the HTML from the first render (an `sr-only` copy, read once; the per-character copy is `aria-hidden`); every character holds its space from the first paint, so CLS stays 0 (measured). Full text immediately under reduced motion. | The machine voice introduces him once |
| Contact line | None. **User decision 2026-10-12:** the contact CTA's mono line is plain static text, no typing, so the typing effect appears once on the page (the hero subline). | The machine voice speaks once, in the hero |
| Footer waveform | The WaveformDivider flattens to 15% of its height as the page reaches its end (scrubbed from entering the viewport to the maximum scroll); settled state under reduced motion | Closure: the signal comes to rest |
| Hovers | Card lift, chip border step, primary CTA color inversion (button stays still), magnetic pull on the nav links only | Feedback |
| Time zone globe | The dot-matrix globe turns slowly (about one turn per 21s) while the card is on screen; static under reduced motion | Storytelling: where Umair is, and where his current company is |
| Copy email | A short burst of violet, blue, cyan, and pale stars from the button on a successful copy (canvas-confetti, loaded on click, main thread, skipped under reduced motion; added 2026-10-12). The "Copied" label stays the real feedback | Feedback |
| Theme switch | None (transitions suppressed for one frame) | A theme change is a state change, not a show |

Reduced motion (`prefers-reduced-motion`): every animated component ships a `gsap.set` final-state fallback; ScrollSmoother is not created; marquee rows render static; the hero subline renders its full text at once. This is the existing `lib/motion-preferences.ts` contract, followed verbatim. Known limitation to document in code: the preference is sampled at mount, not live-watched.

Implementation notes (learned in build step 2):
- **matchMedia gotcha.** GSAP's `matchMedia` only runs a conditions-object callback while at least one condition matches. `{ reduceMotion, coarsePointer }` alone therefore never runs on a plain desktop. Every conditions object whose conditions can all be false includes `always: ALWAYS_QUERY` (`lib/motion-preferences.ts`). Every section follows this now.
- **Entrance reveals without a flash.** The pre-paint script sets `data-motion="ok"` on `<html>` only when reduced motion is off. `globals.css` then hides `[data-reveal]` elements before first paint, with a CSS failsafe that shows them after 2.5s if JS never hydrates. The component calls `gsap.set(..., { autoAlpha: 1 })` immediately and animates with `fromTo` and explicit end values; a plain `from()` would capture the CSS-hidden state as its end value. Measured: the hero headline is visible about 50ms after load.
- **Focus rings don't animate.** Interactive elements use `transition-[color,background-color,border-color]`, not `transition-colors`, which also transitions `outline-color` and makes the focus ring fade in from `currentColor`.

No scroll cues, no pinned/hijacked sections in v1, no infinite loops outside the two marquees (tools, portrait words), the time zone globe, and the 2s-period status dot pulse.

---

## 8. Responsive behavior

- Breakpoints: Tailwind defaults. Mobile-first; every multi-column section declares its collapse in the same component.
- Bento collapses to a single column in content-priority order (role card, specializations, portrait, time zone, contact, tools). Contact comes before tools so keyboard focus follows the visual order at every width (changed 2026-10-12, WCAG 2.4.3); at `md` the grid is 2 columns.
- Timeline collapses to a single column below md: metadata block above its evidence card, nodes and spine kept on the left (as on the reference's phone layout).
- Nav: below `md` the pill is replaced by the floating mobile nav at the bottom right (section 6); the top bar keeps the `Logo` left and the status capsule + theme toggle right (toggle at the far right, as on the reference). At `md` the capsule hides so the pill has room.
- Hero type scale: `text-4xl md:text-5xl lg:text-[60px]` (the headline is 9 words; no 7xl vanity scale). Headline max 2 lines at desktop.
- Test at 390px and 1440px with playwright-cli after each section, **in both themes** (locked workflow rule).

---

## 9. Accessibility and SEO

### Accessibility

- Semantic landmarks; exactly one `h1` (the hero headline); sections are `h2`.
- WCAG AA minimum everywhere, in both themes. Every text color pairing is computed in section 3; anything that failed is replaced there. Recompute if any token changes.
- Focus-visible rings in `accent` (7.07:1 light, 7.09:1 dark) on all interactive elements, including the theme toggle; use the shared `focusRing` pattern (`focus-visible:outline-2 outline-offset-2 outline-accent`).
- Theme toggle: native button, action-describing `aria-label`, decorative icons `aria-hidden`, 36x36 target (above the 24px WCAG 2.5.8 minimum).
- Alt text on every image; the headshot alt describes Umair, not "profile picture".
- Portrait: the About card uses the cut-out `public/umair-nadeem-cutout.webp` (11.2) with a descriptive alt. The original headshot `public/umair-nadeem.jpg` is not displayed; it serves only as the JSON-LD `image` (`content.seo.image`), re-encoded on 2026-10-15 from 2048x2048 (2.1 MB) to 800x800 (32 KB, mozjpeg quality 80, no metadata). The full-size file stays in git history.

### SEO

All metadata stays in `app/layout.tsx` (static export) plus Next.js file conventions. Titles and descriptions come from `content.seo`.

- **Site URL (user decision 2026-10-10):** no domain exists yet. The site deploys free on Vercel first; a custom domain may come later. One helper, `lib/site-url.ts`, exports `SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')`. The localhost fallback is for development only; a production build without the variable logs a build warning. No URL is hard-coded anywhere else. `NEXT_PUBLIC_*` values are inlined at build time, so changing the variable in Vercel requires a redeploy. Everything below reads `SITE_URL`.
- **`metadataBase`:** `new URL(SITE_URL)`.
- **Canonical:** `alternates: { canonical: '/' }` (resolved against `metadataBase`).
- **Open Graph + Twitter:** `og:title`, `og:description`, `og:url`, `og:type=profile`, `og:image`; `twitter:card=summary_large_image`.
- **OG image (built 2026-10-15):** 1200x630, generated at build time by `app/opengraph-image.tsx` (`next/og`) in the light theme (the default; an OG image can't follow the viewer's theme): white background with the hero's warm corner washes and a soft pink and sky horizon glow, the monogram (path exported from `Logo.tsx`) top left and `content.location` top right, the hero headline (`lib/hero-headline.ts`, shared with the hero) in EB Garamond with "break" in the light accent gradient, and "Umair Nadeem | QA Engineer" in Source Code Pro below a hairline. `alt` export: name, role, and the headline. `app/twitter-image.tsx` re-exports it for the `twitter:image` tags. Fonts: static TTFs in `assets/fonts/` (EB Garamond regular and italic, Source Code Pro regular and semibold, with their OFL license files), since `next/og` can't read the `next/font` files.
- **`sitemap.xml`:** `app/sitemap.ts`, one entry for `/` (hash anchors are not separate URLs), `lastModified` at build time.
- **`robots.txt`:** `app/robots.ts`, allow all, `sitemap: ${SITE_URL}/sitemap.xml`.
- **JSON-LD `Person` (built 2026-10-15, `components/PersonJsonLd.tsx`, rendered first in `app/page.tsx`):** one `<script type="application/ld+json">` in the page, every field from `lib/content.ts`, serialized with `JSON.stringify` and every `<` escaped to `<`; `@id` is `${SITE_URL}/#person`:
  - `name` (`content.name`), `jobTitle` (`content.title`, "QA Engineer"), `description` (`content.seo.description`)
  - `email`: `mailto:` + `content.contact.email`
  - `address`: `PostalAddress` with `addressLocality` "Islamabad", `addressCountry` "Pakistan" (both split from `content.location`; the country name rather than "PK", so the value stays in content.ts)
  - `worksFor`: `Organization` "Smart In Media" (`experience[0]`, the role with end "Present")
  - `alumniOf`: `CollegeOrUniversity` "Islamia College Peshawar" (`education[0]`)
  - `knowsLanguage`: `content.spokenLanguages`
  - `knowsAbout`: the items of the `testing-types` skill group
  - `sameAs`: the `content.links` hrefs (LinkedIn, Upwork)
  - `url`: `SITE_URL`; `image`: `${SITE_URL}` + `content.seo.image` (`/umair-nadeem.jpg`)
  - Never a `telephone` (locked rule).
- **`themeColor`:** per scheme, via the `viewport` export (section 2).
- **Icons and manifest (in place since 2026-10-10, Next.js file conventions):**
  - All icons were regenerated on 2026-10-10 from the approved `assets/brand/un-monogram.svg` (the generator's grey-background originals are gone). Rendered in the browser via playwright-cli; the ICO was assembled from those renders.
  - `app/icon.svg`: the primary tab icon. A rounded `#0a0a0a` tile (512 units, radius 112) with a white monogram at 72%, the same in every scheme. This replaced, on 2026-10-10, a transparent version that switched between black and white via `prefers-color-scheme`: that one vanished whenever the browser's tab color didn't match the OS scheme. An opaque tile reads on any tab color.
  - `app/favicon.ico` (PNG-encoded 16, 32, and 48px entries) and `app/icon1.png` (32x32): fallback for browsers without SVG favicon support. Black monogram at 90% on opaque white. At 16px the hairline serifs blur; that's inherent to a high-contrast serif at that size, and SVG-capable browsers use `icon.svg` instead. Next 16 labels the ICO `sizes="48x48"` (its largest entry; 14.0.4 used the first, 16x16); harmless.
  - `app/apple-icon.png` (180x180), `public/android-chrome-192x192.png`, and `public/android-chrome-512x512.png`: opaque white with a black monogram at 65%, inside the circular maskable safe zone (iOS fills transparency with black, so these stay opaque).
  - The PNG is named `icon1.png`, not `icon.png`: with both `icon.svg` and `icon.png` present, Next 14.0.4 emitted a `<link>` for only one of them; the numbered suffix makes it emit both. Re-checked on Next 16.4: still one link per file, with no duplicates.
  - `app/manifest.ts` (served as `/manifest.webmanifest`) replaces the generator's `site.webmanifest`: `name` from `content.seo.title`, `short_name` from `content.name`, `description` from `content.seo.description`, `display: standalone`, and `theme_color` / `background_color` `#ffffff` (the light `bg`; a manifest can't follow the viewer's theme).
  - Generated tags (checked on a freshly started dev server): `icon` for the ICO, `icon` for `icon.svg` (`image/svg+xml`, `sizes="any"`), `icon` for the 32px PNG, one `apple-touch-icon`, and one `manifest`. Every file returns 200, and there are no duplicates.

---

## 10. Security

The site is static: no database, no forms, no file uploads, no API routes or server actions, no webhooks, no server-side fetches, no cookies or sessions. Protections are built only where an attack surface exists; everything else is verified and recorded as not applicable. Baseline checks below were run on 2026-10-10 and are re-run in the final build step.

### 10.1 XSS and Content Security Policy

- **Decision (user, 2026-10-15): static CSP in `next.config.js` (option B), built the same day.** The three options were built and measured (PROGRESS-LOG, "Security hardening"): a nonce CSP makes `/` dynamic and uncacheable (on Vercel Hobby, every visit would run a function in `iad1`); a static `script-src 'self'` and experimental SRI both block Next's 4 inline scripts and React never hydrates; so the static policy allows `'unsafe-inline'` scripts. Accepted because the site renders only typed constants (no user input, URL parameters, third-party scripts, forms, or logins). Built policy:
  - `default-src 'self'`; `script-src 'self' 'unsafe-inline'` (`'unsafe-eval'` added only in development); `style-src 'self' 'unsafe-inline'`; `img-src 'self' data:` (the cobe world map is a `data:` PNG; no `blob:`, since the star burst uses a main-thread confetti instance); `font-src 'self'`; `connect-src 'self'`; `object-src 'none'`; `base-uri 'self'`; `form-action 'self'`; `frame-ancestors 'none'`; `upgrade-insecure-requests`.
  - Verified on `next start` (scripted playwright check with a `securitypolicyviolation` listener installed before load): zero violations and zero console messages across the no-flash theme script (dark OS scheme), theme toggle, typing subline, nav link scroll, floating mobile nav at 390, ScrollSmoother, Skills logos (31 of 44 tiles) and tooltip, cobe globe (WebGL), all four marquee rows moving, copy-email with clipboard text and star burst, resume (200, `application/pdf`, `download`), OG image (200), JSON-LD (one `Person` block).
  - **If a form, login, or anything sensitive is ever added, switch to the nonce CSP below first.**
- **Option A, kept for that future (not built):** the plan below.
- **Why a nonce CSP would live in `proxy.ts`, not `next.config.js`:** the App Router emits its own inline `<script>` tags (the `self.__next_f.push(...)` flight data; observed on the reference site, which is also App Router). A static header in `next.config.js` can't allow those without `'unsafe-inline'`, and hashing them is impractical because their content changes with every build. The supported pattern is a **per-request nonce**, per the Next.js 16 CSP guide. `proxy.ts` (Next 16's name for middleware; it runs on the Node.js runtime) generates a random nonce and sets the CSP on both the response and the request headers. Next parses the request CSP and applies the nonce to its own framework and inline scripts. The root layout becomes `async`, reads the nonce with `(await headers()).get('x-nonce')` (async-only since Next 16), and passes it to `<ThemeScript nonce={...} />`, which already accepts it. Consequence, confirmed in the guide: nonces require dynamic rendering, so the page renders per request instead of being prerendered. That costs some time-to-first-byte on Vercel, and Partial Prerendering can't be used. Next's experimental SRI (`experimental.sri`) keeps static rendering, but it is experimental, so it isn't the plan. All other security headers stay static in `next.config.js` (10.2).
- **Option A production policy (tested 2026-10-15 with zero violations, not built):**
  - `default-src 'self'`
  - `script-src 'self' 'nonce-{nonce}' 'strict-dynamic'` (no `'unsafe-inline'`, no `'unsafe-eval'`)
  - `style-src 'self' 'unsafe-inline'` (React server-renders `style` attributes, and GSAP needs inline styles; scripts stay strict)
  - `img-src 'self' data: blob:`
  - `font-src 'self'` (`next/font` self-hosts every face)
  - `connect-src 'self'`
  - `object-src 'none'`, `base-uri 'self'`, `form-action 'none'`, `frame-ancestors 'none'`, `upgrade-insecure-requests`
- **Development only:** `script-src` adds `'unsafe-eval'` (React dev tooling needs it). Never in production.
- **Proxy matcher** skips `_next/static`, `_next/image`, the favicon and icon files, the resume PDF, and `next/link` prefetch requests (the guide's `missing` header conditions).
- **JSON-LD:** a `type="application/ld+json"` data block. It is not executed, so CSP doesn't apply to it, but React still needs `dangerouslySetInnerHTML`. Output is `JSON.stringify(person).replace(/</g, '\\u003c')`, built only from typed `lib/content.ts` constants, so a `</script>` sequence can never break out.
- **`dangerouslySetInnerHTML`** is allowed in exactly two places: the JSON-LD block above and the static theme script. Never with interpolated or user-supplied data.
- **Advisory GHSA-ffhc-5mcf-pf4q** (XSS in App Router apps using CSP nonces) is fixed: patched in 16.2.5, and the site runs 16.4.0 (10.6).

### 10.2 Static security headers (`next.config.js` `headers()`, all routes)

| Header | Value |
|---|---|
| `X-Frame-Options` | `DENY` (legacy partner of CSP `frame-ancestors 'none'`) |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), hid=(), midi=(), display-capture=(), accelerometer=(), gyroscope=(), magnetometer=(), browsing-topics=()`. `clipboard-write` is left alone because the copy-email button uses `navigator.clipboard.writeText`. Chromium logs no unrecognized-feature warnings for this list. |
| `Strict-Transport-Security` | **Not set by us (2026-10-15).** Vercel's docs (Encryption and TLS, "Support for HSTS") say every deployment already gets it: `max-age=63072000; includeSubDomains; preload` on `*.vercel.app`, `max-age=63072000` on custom domains, and a project header replaces that default. Setting our own would add nothing on `vercel.app`. Confirm with `curl -I` after the first deploy; revisit `includeSubDomains` only if a custom domain is added. |

Also `poweredByHeader: false` (drops `X-Powered-By: Next.js`) and an explicit `productionBrowserSourceMaps: false`. **Built 2026-10-15**; verified with `curl -I` on `next start`: all four headers on the page, the OG image, the resume PDF, and `/_next/static` chunks; no `X-Powered-By`, no `Access-Control-Allow-Origin`.

### 10.3 CORS

Keep the defaults: Next sends no `Access-Control-Allow-Origin` on pages or assets, and nothing here needs cross-origin reads. Never add a wildcard. Verified 2026-10-10: `next.config.js` defines no headers at all. Re-verify with `curl -I` against the deployment.

### 10.4 Source maps and external links

- **Production browser source maps:** off. `productionBrowserSourceMaps` is not set in `next.config.js` (Next's default is `false`), verified 2026-10-10. The hardening step confirms no `.map` files are served from `/_next/static`.
- **External links:** every `target="_blank"` link carries `rel="noopener noreferrer"`. Re-verified 2026-10-15: the only `target="_blank"` in source is `ProfileLink`, and all 6 rendered external links (LinkedIn and Upwork in About, Contact, and the Footer) carry the rel.
- **Verified 2026-10-15:** no `.map` files in `.next/static`, no `sourceMappingURL` comments in client JS, and a `.map` request for a served chunk returns 404. `productionBrowserSourceMaps: false` is now explicit in `next.config.js`.
- **`dangerouslySetInnerHTML` (re-verified 2026-10-15):** exactly the two allowed uses. `ThemeScript` emits `THEME_INIT_SCRIPT`, which interpolates only module constants (the storage key and the dark query); the stored theme value is only compared, never written into markup. `PersonJsonLd` is built from `lib/content.ts` with `<` escaped.

### 10.5 Sensitive data (baseline, 2026-10-10)

- **Secrets:** a scan of every added line in the full history of all branches for API keys, tokens, passwords, private keys, and common key formats found none. The 3 pattern hits were false positives inside `.next` build output.
- **`.env` files:** none ever committed; `.gitignore` covers `.env*`.
- **Re-scan 2026-10-15:** the history of all branches (added lines, excluding `.next/` and the lockfile) and the client bundle in `.next/static` were searched for AWS, GitHub, OpenAI-style, Slack, and Google keys, private keys, and `api_key`/`secret`/`password` assignments. History: none (only the variable name `NEXT_PUBLIC_SITE_URL` in code and docs). Bundle: only URL-parser field names (`s.password=r.password`) in a polyfill. No `.env` file exists. The only env reads are in `lib/site-url.ts`, imported solely by server code (layout, sitemap, robots, `PersonJsonLd`); its one value is a public URL by design.
- **`data/` and `refrence/`:** never committed on any branch (`git log --all -- data refrence` is empty, and nothing is tracked under them).
- **Personal data already in history:**
  - **Phone number:** in `components/Contact.tsx` from the first commit (`e074d83`) up to the current tree, in `.next` build output committed in `e074d83` (untracked in `f75e7a1`), and in `UmairNadeem_SQA.pdf`, tracked since `e074d83`. The rebuilt Contact section removes it from the tree. History keeps it on `main` and `redesign`.
  - **Older email address** (not the one in `content.ts`): in the PDF and earlier code.
  - **Repo visibility:** `origin` (`github.com/umair-nad/umair_website`) answers 404 to an unauthenticated GitHub API request, so it isn't public today. Scrubbing history would mean rewriting `main` and force-pushing; that is the user's call, and nothing is planned.
- **Resume PDF:** it contains the phone number and the older email. Umair approved publishing it as is (2026-10-10), and it is served from `public/umair-nadeem-qa-engineer-resume.pdf` (section 11.1).

### 10.6 Dependencies

**Decision (user, 2026-10-10):** upgrade to the latest stable majors, done in build step 1: `next` and `eslint-config-next` 16.4.0, `react` and `react-dom` 19.3.0, `lucide-react` 1.55.0, Tailwind 4.3.3, ESLint 9.39.5 with a flat config, TypeScript 5.9.3.

- **Baseline before the upgrade** (`next` 14.0.4): 22 findings, 1 critical, 18 high, 3 moderate.
- **Fixed by the upgrade:** GHSA-ffhc-5mcf-pf4q (nonce CSP XSS, patched in 16.2.5); GHSA-2xp9-vwfh-vxw4 (image optimizer RCE with AVIF) and GHSA-p293-qw3h-jr36 (RCE on Windows-hosted servers), both patched in 16.3.3; GHSA-f82v-jwr5-mffw (middleware authorization bypass); every other `next` advisory; and all Tailwind 3 build-chain findings.
- **After the upgrade** (`npm audit`, 2026-10-10): 5 high, 0 critical, 0 moderate. All five are one dev-only lint chain: `braces` GHSA-vfj7-8cjw-p6xm (no patched version exists) via `micromatch` and `fast-glob` inside `@next/eslint-plugin-next`, which reaches the tree through `eslint-config-next`. It runs only when linting and never ships to the browser. npm's suggested "fix" is a downgrade to `eslint-config-next` 14, which is rejected. Re-check at the hardening step.
- **ESLint 9 is marked unsupported** by ESLint, but `eslint-plugin-react`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-import` (all pulled in by `eslint-config-next` 16) cap their peer range at ESLint 9. Move to ESLint 10 once they support it. Biome is the documented alternative.
- **Hardening re-check (2026-10-15):** `npm audit` still shows only the same 5 high findings in the dev-only `braces` lint chain (no patched `braces` exists; the forced fix is still the rejected downgrade to `eslint-config-next` 14). Nothing for `next`, `react`, or any runtime package. Patch and minor updates applied: `next` and `eslint-config-next` 16.4.1, `react` and `react-dom` 19.3.1, `lucide-react` 1.57.0, `postcss` 8.5.30 (lint, tsc, build, and a browser smoke test clean). Majors available but not applied (user's call): TypeScript 7, ESLint 10 (still blocked by the `eslint-config-next` plugins' peer ranges), `@types/node` 26 (stays on 22 to match the Node 22 runtime).
- Any further major upgrade needs the user's approval (CLAUDE.md).

### 10.7 Not applicable (verified 2026-10-10, re-verified 2026-10-15)

| Threat | Why it doesn't apply | Evidence (2026-10-15 grep of `app/`, `components/`, `lib/`, `next.config.js`) |
|---|---|---|
| SQL injection | No database, no queries | No DB client in `package.json` (runtime deps: next, react, react-dom, gsap, @gsap/react, cobe, canvas-confetti, lucide-react, simple-icons); the only "SQL" is the skill label and a comment in `lib/tool-icons.ts` |
| CSRF | No forms, no server actions, no API routes, no cookies or sessions | No `<form>`, `<input>`, `<textarea>`, `'use server'`, `app/api`, `cookies()`, or `document.cookie` |
| File uploads | No upload inputs or handlers | No `type="file"`, no `route.ts` handlers |
| SSRF | No server-side fetches, no rewrites, no image `remotePatterns`; the OG image reads only the bundled fonts from `assets/fonts/` and takes no request input | No `fetch(`, `axios`, `XMLHttpRequest`, `rewrites`, or `searchParams` |
| Webhook signatures | No webhook endpoints | No route handlers; the only generated routes are the static metadata files (OG and Twitter images, sitemap, robots, manifest, icons) |

If a contact form, API route, server action, or any server-side fetch is ever added, CSRF protection, server-side input validation, and rate limiting become required, and this table must be redone.

### 10.8 Text selection off; copying never blocked

**User decision 2026-10-12:** text selection is disabled site-wide with `user-select: none` on `body` (`globals.css`). This reverses the earlier "never disable selection" rule at the user's request. Still selectable: `input`, `textarea`, editable content, and anything marked `data-selectable` (the email address, which CopyEmail's failure message asks visitors to select by hand). Not blocked anywhere: copy and cut events, the context menu, and keyboard shortcuts. The copy-email button uses the Clipboard API, so it works regardless of selection. Note for later: `user-select: none` is a deterrent, not protection; all text stays in the HTML and the page source.

---

## 11. Page plan (section by section)

Single route, hash anchors preserved: `#about`, `#experience`, `#skills`, `#contact`.

### 11.1 Hero (`<header>`, full viewport stage)

Centered stage (the one intentionally centered section; everything after is asymmetric), on the plain page background. Stack of 3 text elements (the status badge was removed by the user on 2026-10-12; the current role is shown in the About role card):

1. `h1`, 2 lines: **"I break things so your users don't have to."** (verbatim from the approved bio; "break" is the italic gradient accent word)
2. Mono subline (`text-hero`): **"Hello I’m Umair | A Software Quality Assurance Engineer"** (`content.heroSubline`, two parts; wording set by the user 2026-10-12, replacing "Umair Nadeem | Islamabad, Pakistan"). One line with the pipe from `sm`; below `sm` the two parts stack on two lines with no pipe, so 390px breaks at the separator, never mid-phrase. The site's title stays "QA Engineer" elsewhere; this subline spells the role out by the user's choice. It types in together with the headline, like the reference's subline (section 7, "Hero subline typing").
3. CTA row: "Let’s Connect" primary pill + "Download resume" button + copy-email row (`uminadeem06@gmail.com`)

Behind the stack, the warm (light) or cool (dark) corner washes; under the CTA row, the glowing horizon arc (section 2, approved 2026-10-12). No trust strips, no scroll cue, no version labels.

**Resume (done 2026-10-12):** the PDF was moved with `git mv` (keeping its history) to `public/umair-nadeem-qa-engineer-resume.pdf`, an SEO-friendly name. The path lives in `content.resume.href`; the hero button and, later, the footer button read it from there. The PDF contains Umair's phone number and an older email address (no street address). Umair approved publishing it as is (2026-10-10), so it is the one exception to the no-phone rule; site text still never shows the phone. Replace the file in place when Umair sends an updated resume.

### 11.2 About bento (`#about`)

Asymmetric grid, 6 cards for 6 real content items (exact cell count, 3 or more cells visually differentiated):

| Card | Size | Content (all from content.ts) | Visual |
|---|---|---|---|
| Current role | Wide 2x1 | Title "Senior QA Engineer"; company line **"Smart In Media (Cologne, Germany)"** (the company's location, so it doesn't read as Umair's); `experience[0].highlights[0]` rendered verbatim: "Tested digital pathology software across multiple PathoZoom projects"; tags Digital Pathology / Healthcare Software / Test Automation | The three tags as chips; caption lockup. No waveform (signature limited to divider + hero). |
| Portrait / bio | Tall 1x2 (720px tall at every width, as on the reference) | Rebuilt after the reference's portrait card (user decision 2026-10-12). The cut-out `public/umair-nadeem-cutout.webp` (rembg `birefnet-portrait`, approved by the user; trimmed, 808x1400 alpha WebP; the original `umair-nadeem.jpg` is kept, unused). Lockup: caption = sentence 3 of `content.bio` verbatim with a typographic apostrophe ("Manual, regression, UAT, smoke, API, edge cases no one else thinks about: that’s my lane."), title = `content.name`. Sentence 1 is the hero `h1`; sentence 2 is the Experience intro (11.3). Alt: "Umair Nadeem in a dark hoodie with his arms crossed". | Back to front: two rows of `content.portraitWords` in EB Garamond 700 (36px/40px base, 60px/64px from md; -0.02em; `fg`/90) starting 22% down, row 1 drifting left at 36 px/s and row 2 right at 44 px/s (measured on the reference; the duration is computed from each row's width so the px/s holds at every size); the cut-out, unframed, bottom-anchored (85% x 85% of the card below lg, 75% x 80% at lg, `object-contain object-bottom`) with the reference's `drop-shadow(0 25px 25px rgb(0 0 0 / .15))`, so the words pass behind his head and shoulders; a `surface` gradient rising from the bottom (`surface` to `surface`/20 at mid-height to transparent) fading his body into the card; then the icon chip and lockup. The word rows are `aria-hidden` (Skills lists the same words), pause off screen (IntersectionObserver), and stand still under reduced motion. Lockup contrast over the photo: caption 5.06:1 or better, name 15.9:1 or better, both themes, 390 and 1440. |
| QA specializations | 1x1 | 4 headline items: Manual and Exploratory, Test Automation, API Testing, Regression Testing | Check-glyph list. "AI & LLM Testing" is an ordinary chip in Experience's testing types (confirmed by the user 2026-10-15; not one of the four headline items). |
| Tools marquee | 1x1 (2x1 from the first build until 2026-10-12, when the time zone card took the wide slot; all 13 chips still fit when wrapped under reduced motion, down to 1024px) | Text-only chips (no icons) from `skills.tools` + `skills.automation-frameworks` (Cypress, Postman, Apache JMeter, Jira, TestRail...) | Two counter-scrolling chip rows, clipped at card edges; pause button (WCAG 2.2.2) and hover pause; static wrapped list under reduced motion |
| Time zone | Wide 2x1 at lg (user decision 2026-10-12, so the globe has the reference's room); one tile below lg | Pinned copy, sourced facts only: title "Islamabad, Pakistan" (`content.location`), caption `PKT (UTC+5)` (Islamabad's standard time zone, derived from the location, not a claim about Umair's work), plus a live local clock. No copy about remote work (not in any source). | Typographic clock in EB Garamond, `fg`, over a **rotating dot-matrix globe** (approved by the user 2026-10-12; `components/about/TimeZoneGlobe.tsx`, cobe 2.0.1). Look measured on the reference: dark sphere with light dots in both themes, theta 0.25, scale 1.1, 40k map samples, warm markers, about one turn per 21s. Placement at lg (two tiles, as measured on the reference): a square 170% of the card's height, top-aligned, 12% past the right edge, clear of the clock. Below lg (one tile): 150% of the card's height, 48% past the right edge and 60% below the bottom, its left side faded (mask 16% to 58%). At every width a card-colored gradient rises from the bottom (`surface` to `surface`/20 at mid-height to transparent, measured on the reference), so the crop never reads as a hard cut. The clock and lockup stay AA (worst measured pixel: 7.34:1 for the clock, 7.13:1 for the caption, both themes, 390 and 1440). Two markers, no text: Islamabad (`content.location`) and Cologne (Smart In Media, `experience[0].location`). cobe loads only when the card nears the viewport, renders only while on screen, caps the pixel ratio at 1.5 on touch or narrow screens, draws one static frame under reduced motion, and falls back to a CSS dot sphere without WebGL. Its world map is a `data:` PNG, covered by the planned `img-src 'self' data:` (section 10.1). |
| Contact teaser | 1x1 | Copy-email bar + LinkedIn and Upwork links | Inset mono email bar (`surface-2`) |

The middle-dot rule from revision 1 no longer applies: the time-zone card now splits the place and the zone into title and caption.

### 11.3 Experience (`#experience`)

**Built 2026-10-12** (`components/Experience.tsx`), after the reference's "Growth & Experience" timeline on its `/about` page, measured in both themes at 1440 and 390 (2026-10-12).

- **Heading:** no eyebrow. `h2` **"Over five years of *finding* bugs before users do."** (`content.experienceHeadline`; accent word "finding"; wording set by the user 2026-10-10; matches the bio's "5+ years"), same scale as the other section headings (`text-4xl`, 56px at lg), left-aligned on the timeline's edge (the reference centers it; ours stays asymmetric after the hero, section 11.1). Under it the intro, `content.bio` sentence 2 verbatim: "5+ years in QA hunting bugs, writing tight test cases, and keeping releases from turning into dumpster fires." (Source Code Pro 16/18px, `text`, max 672px). Container 896px (`max-w-4xl`; the reference's is 832px).
- **Entries (an `<ol>`, 4 items):** Smart In Media, Adrem Technologies, Workbox, then education (Islamia College Peshawar), all from `content.experience` and `content.education`. Each entry: a 40px circled node at the left (lucide `BriefcaseBusiness` for roles, `GraduationCap` for education, 16px), then 52px in, a `1fr 2fr` grid with a 32px gap from md (measured), stacked below md.
  - Node (measured): disc `node` (light `#d4d4d4`, dark `#262626`), glyph `node-icon` (light `#525252` 5.3:1, dark `#a1a1a1` 5.9:1), and a 4px ring in the page color that cuts the spine.
  - Left: role title (Alata 18/20px, `fg`; the company is repeated in an `sr-only` span so the heading list tells the two "Senior QA Engineer" roles apart), company (Source Code Pro 600, `fg`, `translate="no"`), date range (`<time>` elements, spaced hyphen, "Present" as is), location (`muted`). The education entry's title joins degree and field ("Bachelor of Science (BS), Computer Software Engineering", LinkedIn's format) and has no location (none in the sources).
  - Right (roles only): an evidence card styled like the bento cards (`surface`, `line-card` border, 10px radius, light-mode `shadow-lg`, hover lift 2px), holding Smart In Media's `summary` line in `muted` where a source gives one, then the highlights verbatim with `accent` check glyphs, mono 14px. Under the card, the role's `tags` as text chips (pill, section 6); tool names (Jira, Trello, Postman) carry `translate="no"`. The education entry has no card: no source lists coursework or highlights.
  - The reference's left column is `sticky`; ours isn't, because ScrollSmoother's transform disables `position: sticky`, and our cards are short enough (the longest is about 550px at 1440) to be read with their metadata in view.
- **Spine:** 2px, `line-strong`, rounded, centered under the nodes (measured: the reference's is 2px neutral-400/30 on dark, neutral-700/30 on light, which flatten to about our `line-strong`), from the first node to the end of the list, fading out over its last 64px. It draws downward on scroll (section 7).
- **Testing types and practices** (`content.skills` groups `testing-types`, 13 items, and `practices`, 7 items): no source ties them to one role, so they sit after the timeline as a compact group: a hairline, then two rows in the entries' `1fr 2fr` grid (Alata label left, text chips right), aligned to the entries' text column from md and full width below md. "AI & LLM Testing" appears here as an ordinary chip, as planned in 11.2. Chips that are wider than their whole row (only "Cross-browser & Cross-device Testing", on screens under about 340px) wrap onto two lines instead of overflowing.
- **Phones:** single column, metadata above the card, spine kept (as on the reference). The section has no focusable elements; Tab moves from the Skills wall straight to Contact. The floating nav highlights Experience from the section's top to its bottom (shared ScrollTriggers, section 6); its closed 48px toggle floats over whatever scrolls beneath it, as on the reference, and covers nothing permanently.

### 11.4 Skills (`#skills`)

**Skills & Tools icon wall (approved by the user 2026-10-12, replacing the planned grouped chip sheet).** `components/Skills.tsx`, directly after the About bento as part of the About area (page order Hero, About, Skills, Experience, Contact; user decision 2026-10-12); the Skills tab and the mobile nav's Skills icon scroll to it.

- **Heading and subline:** `h2` "Skills & *Tools*" in EB Garamond (`text-4xl`, 56px at lg, as measured; not the reference's handwritten face), "Tools" in the gradient italic accent. Subline (ours, `content.skillsSubline`): "The tools I test with, from test management and automation to APIs, CI, and monitoring." Source Code Pro 16/18px, `text`, max 672px, centered.
- **Tools:** all 44 confirmed tools (`content.skills` tool groups; source record in CLAUDE.md), core QA tools first (Jira, Postman, Playwright, Cypress, Selenium, TestRail, Apache JMeter), then group order: automation, test management, API and debugging, CI/CD, device clouds, monitoring, SQL, collaboration.
- **Tiles (measured on the reference; uniform squares since 2026-10-12):** every tile the same square, logo or not: 64px from sm, 56px below sm (as on the reference; enlarged from 48px by the user on 2026-10-12 so tile text is at least 11px), 16px radius, 14px gaps (12px below sm), 1px `tile-border` hairline, `shadow-sm`; 32px monochrome logo (28px below sm); text tiles show the name inside the same square in Alata 11px at every size, two lines where needed (Azure / DevOps, Browser / Stack, Chrome / DevTools, Lambda / Test, Microsoft / Teams, Robot / Framework) in `tile-icon` `#d4d4d4`. Light: solid grey-purple `#625668` (icon 4.64:1); dark: the reference's `neutral-900`/70 (icon 11.8:1, measured on the rendered page). Hover and keyboard focus: lift 4px, scale 1.1, `shadow-lg`, 300ms.
- **Logos:** Simple Icons 16 (`lib/tool-icons.ts`, named imports; 31 marks), loaded on demand once the section is within 1000px of the viewport (about 20 KB gzip kept out of the first load); `lib/tool-logo-names.ts` ships with the page so logo tiles hold their square until the paths arrive (CLS 0). Text tiles for the 12 tools Simple Icons doesn't have (Playwright, Zephyr, Xray, qTest, Azure DevOps, Fiddler, Chrome DevTools, BrowserStack, LambdaTest, Slack, Microsoft Teams, SQL) and for Robot Framework, whose mark is CC BY-NC-SA 4.0 (non-commercial), so it stays a text tile (final user decision 2026-10-12). The marks with attribution licenses (Git CC BY 3.0, Jenkins CC BY-SA 3.0, Apache JMeter Apache-2.0) are credited in one small, low-key line at the very bottom of the page (`components/LogoCredits.tsx`, Source Code Pro 11px, `muted`), not under the wall (user decision 2026-10-12); the Footer rebuild absorbs it. Never draw or invent a logo.
- **Rows:** centered; each max width is an exact number of tiles per row, so the 44 tiles always fill complete rows with no lone tile last: 5 per row below md (8 rows of 5, then 4; below 352px, 4 per row, 11 x 4), 9 at md (9/9/9/9/8), 11 at lg (4 x 11), 15 at xl (15/15/14).
- **Glow:** the reference spins a blurred violet-to-pink conic gradient (800x350, 25% opacity, blur 120px). Ours: the same colors as two static radial pools (`--skills-glow-a/b`, stronger in light), no blur, no motion.
- **Accessibility:** each tile is `role="img"` with the tool name as `aria-label`; the wall is one tab stop (roving tabindex: arrows move, up/down to the nearest tile in the next row, Home/End). A visible tooltip (inverse pill, on every tile) shows on hover, keyboard focus, and tap (a tap focuses the tile), and aligns to the tile's side near the viewport edges.
- **Motion:** heading, subline, and tiles rise in once on scroll (ScrollTrigger batch, 0.025s stagger); static under reduced motion.

### 11.5 Contact CTA (`#contact`)

**Built 2026-10-12** (`components/Contact.tsx`), after the reference's closing panel on its home page, measured in both themes at 1440 and 390 (2026-10-12).

- **Panel (measured):** inside a 1440px-wide container with 8px side margins on phones, 24px from sm, 32px from md, so it is 1376x600 at 1440 and 374x549 at 390, wider than the 1280px sections above, as on the reference. At least 60vh tall (65vh below md), never under 448px; 14px radius; 5% `fg` hairline. Everything centered on it, 80px vertical padding so nothing clips on short screens.
- **Atmosphere (static; the glow is approved by the user, 2026-10-15):** the reference fills the panel with two blurred cyan blobs that pulse and drift, a frosted layer, grain, and an edge vignette. Ours keeps the look and drops the motion: fill `cta-panel` (light `#f8f9fa`, dark `#000`), two radial cyan pools centered at 30%/30% and 70%/70% (36% x 48% of the panel from md; wider, 70% x 42%, on phones), colors fitted to the sampled peaks (`--cta-glow`), then the reference's edge vignette (transparent center to white/60 light, black/80 dark at 110%). No blur filter, no animation, no grain.
- **Content, from `content.contact`:**
  1. `h2` "Ship it *tested*." (`content.contact.headline`, approved as written 2026-10-10) in EB Garamond, 44px, 60px at md, 72px at lg (the reference's large headline line measures 72px), "tested" in the gradient accent.
  2. The terminal line `umair@qa: all checks passed. ready when you are.` (`content.contact.line`, approved as written 2026-10-10), plain static text (user decision 2026-10-12): Source Code Pro 14/16px in an inset 14px-radius box (`line` border, `surface`/60 light, white/5 dark), the prompt `umair@qa` in `accent`, the colon `muted`, then a static (never blinking) cursor block that stays on the last word's line when the text wraps, left-aligned like a terminal.
  3. "Let’s Connect" (`PrimaryCta`, the hero's pill and hover) as a `mailto:` link to `content.contact.email` (accessible name "Let’s Connect by email"), the copy-email row with the star burst (`CopyEmail`), then LinkedIn and Upwork (`ProfileLink`: new tab, `rel="noopener noreferrer"`, "(opens in a new tab)" for screen readers).
- **Contrast (worst pixel over the glow, 390 and 1440, both themes):** headline 14.5:1 or better, terminal text 4.77:1 (dark, 390) or better, prompt 4.61:1 (dark, 390), email and links 14:1 or better, the gradient word 3.46:1 (large text needs 3:1).
- **Motion:** headline, line, buttons, and links rise in once in order (`[data-reveal]` batch); static under reduced motion.

No contact form (nothing to back it), no booking tool (none exists in sources), no phone (locked rule). The pre-redesign Contact (phone number, an old email address, no focus rings) is deleted.

### 11.6 Footer

**Built 2026-10-12** (`components/Footer.tsx`, a server component, with client parts in `components/footer/`), after the reference's footer, measured 2026-10-12. Compact, not the reference's 12-link sitemap. Outside `<main>`, so it is the page's `contentinfo` landmark.

- **Waveform:** the WaveformDivider opens the footer and settles toward a flat line (scaled to 15% height around its centerline) as the page reaches its end, scrubbed from the moment it enters to the maximum scroll (`FooterWaveform`): the sign-off beat. Under reduced motion it shows the settled state.
- **Top row (measured layout):** left, max 384px: the `Logo` (40px, `role="img"`, named "Umair Nadeem"), one role line, "Software Quality Assurance Engineer | Islamabad, Pakistan" (`content.footerRole`, wording set by the user 2026-10-15, replacing the three-line `content.seo.description`; Alata 14px, `muted`, as the reference's sentence), and the **"Download resume"** pill (`ResumeButton`, shared with the hero; `content.resume.href`, `download`). Right: two columns under Alata 10.4px uppercase micro-labels (0.2em tracking, `muted`; the reference's black/50 fails AA): "Sections" (a `nav`: Home, About, Skills, Experience, Contact from `lib/nav.ts`, shared with the navbar; real anchors that scroll like the nav, Home to the top) and "Profiles" (LinkedIn, Upwork). Links measured: Source Code Pro 14px semibold, underlined, `muted` (ours brighten to `fg` on hover). Stacks below md (left block, then the two columns side by side).
- **Bottom:** hairline `line` rule, then centered: `© {year} Umair Nadeem. All rights reserved.` (Source Code Pro 12px, `text`) and the logo credits line (11px, `muted`; names and license identifiers never split across lines). The year is never hardcoded: the server renders its build year and the client shows the current year (`CurrentYear`, `useSyncExternalStore`, so hydration always matches).
- **Phones:** 112px of bottom padding below md, so at the end of the page the credits sit 48px above the floating nav's toggle (measured at 390: credits end at 732, toggle starts at 780).

---

## 12. Explicitly out of scope

Blog, GitHub insights/stats/graphs, Guestbook, Bucket List, Uses, Links page, Spotify, command palette / ⌘K (can be proposed later as its own item), visitor counter, weather widget, greeting text, the reference's cosmic and ambient effects beyond the approved hero washes and horizon arc and the two static section glows (Skills and the contact panel, both approved) (animated glow pulses and drifts, spotlight motion, other glow blobs, grain), its novelty fonts (Shadows Into Light, Henny Penny), projects section (`content.projects` is empty), certifications section (empty), phone number anywhere, any metric/tool/claim not present in `lib/content.ts`.

## 13. Build order (Phase 4+, one step per review stop)

Steps 1 to 6 are **built and approved section by section, 2026-10-10 to 2026-10-15**. Step 7 is **built 2026-10-15, awaiting review**. Step 8 is **not started**.

1. **Theme foundation and navbar shell (done 2026-10-10):**
   - The framework upgrade (section 10.6).
   - Removal of the dropped chrome (Three.js, `ParticleCanvas`, `lib/three/`, `Cursor`, `AmbientBackground`, `Preloader`) and of the legacy tokens and scrollbar colors.
   - The light (`:root`) and dark (`.dark`) token sets from section 3.
   - EB Garamond, Alata, and Source Code Pro via `next/font`.
   - The no-flash `ThemeScript` (static, nonce-ready per 10.1), `ThemeToggle`, and per-scheme `themeColor`.
   - The floating navbar with the `Logo`, the pill, the status capsule, the toggle placement, and the mobile menu.
2. **Hero (done 2026-10-10; resume button added 2026-10-12):** `components/Hero.tsx` plus `hero/CopyEmail.tsx` and `hero/HeroAtmosphere.tsx` (washes and arc, which replaced `hero/HeroTrace.tsx` on 2026-10-12), with all copy from `lib/content.ts`. The "Download resume" button sits between the two CTAs (11.1).
3. **About bento (done 2026-10-12, with later rounds: globe, cut-out portrait, floating mobile nav):** `components/About.tsx` plus the cards in `components/about/`, with all copy from `lib/content.ts`.
4. **Experience timeline (done 2026-10-12, approved):** `components/Experience.tsx` (11.3), replacing the pre-redesign horizontal-pin component.
5. **Skills (done 2026-10-12, approved):** the Skills & Tools icon wall, `components/Skills.tsx` (11.4).
6. **Contact CTA + Footer (built 2026-10-12, approved 2026-10-15 with the glow kept and the short footer role line):** `components/Contact.tsx` (11.5) and `components/Footer.tsx` (11.6), replacing the pre-redesign components; `LogoCredits` folded into the footer.
7. **SEO pass (built 2026-10-15, awaiting review; section 9):** `lib/site-url.ts` (`NEXT_PUBLIC_SITE_URL` with the localhost fallback), `metadataBase`, canonical, Open Graph and Twitter tags, OG image, `sitemap.xml`, `robots.txt`, JSON-LD, the 800px headshot. Lighthouse SEO 100 on mobile and desktop.
8. **Security hardening (section 10; not started: no `proxy.ts` and no headers in `next.config.js` yet):** CSP nonce `proxy.ts` wired to the theme script; static headers and `poweredByHeader: false` in `next.config.js`; JSON-LD escaping check; `rel` audit of every external link; confirm no source maps and no `Access-Control-Allow-Origin`; re-run the history and secrets scan and `npm audit`; re-verify the not-applicable table; check that no CSP violations appear in the console in either theme. After the first Vercel deploy: set `NEXT_PUBLIC_SITE_URL`, redeploy, and check the live response headers (including HSTS) with `curl -I`.

Each step ends with `npm run lint`, `tsc --noEmit`, and playwright-cli checks at 390px and 1440px in both themes, then stops for review.
