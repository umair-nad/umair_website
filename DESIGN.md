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

- **No cosmic atmosphere.** The reference's hero has radial color washes and a glowing planet-horizon arc in both modes. We drop all of it (CLAUDE.md also bans gradient blobs). The hero background is the plain page color; the waveform trace is the only ornament.
- **QA signature:** the waveform survives in exactly two places, the WaveformDivider between sections and the hero trace, recolored for both themes (section 2).
- **Correct system-preference mapping.** The reference uses next-themes with inverted styling: its `dark` class renders the white page, so a visitor whose OS prefers dark gets the white page. We map OS dark to our dark theme.
- **Contrast fixes.** Several reference colors fail WCAG AA for the way we use them (section 3). Where that happens we keep the closest passing value from the reference's own palette and say so in the table.
- **Novelty fonts excluded.** The reference also loads Shadows Into Light (handwritten, on its "Skills & Tools" headline) and Henny Penny (novelty, inside a bento card). Both sit in developer-novelty sections, so they are out unless you ask for them.
- **Real italic.** The reference loads only the EB Garamond Regular file, so its italic accent words are browser-synthesized slants. We load EB Garamond's real italic.
- **No copied content:** no reused text, headlines, logo, images, video, or developer-only sections (Guestbook, Spotify, Uses, Bucket List, Links, Blog, GitHub insights, icon wall, "From Concept to Code").

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

### Waveform signature, recolored (ours)

- **Hero trace:** stroked with the theme's accent gradient (light: `#ff0080 > #7928ca > #0070f3`; dark: `#ff0080 > #38bdf8`, see section 3) at low opacity, settling to flatline under the CTA row.
- **WaveformDivider:** neutral stroke, `fg` at 12% (black/12 in light, white/12 in dark).
- Both are `aria-hidden` decoration, so no contrast minimum applies. Nothing else on the page draws a waveform.

Grain: none. No glow surfaces exist in this revision.

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
| `line-strong` | `#000000/0.20` | `#ffffff/0.20` | Badge and nav-CTA borders | hero badge, "Book a Call" |
| `fg` | `#000000` | `#ffffff` | Headlines, card titles, primary text | `h1`, `h2`, card `h3` |
| `text` | `#404040` | `#a1a1a1` | Mono body copy and captions | bento caption |
| `text-hero` | `#404040` | `#d4d4d4` | Hero subline | hero subline |
| `muted` | `#000000/0.60` | `#ffffff/0.60` | Footer links, secondary UI text, micro-labels | footer links |
| `accent` | `#7928ca` | `#c27aff` | Active nav item, focus rings, check bullets | nav "Home" (see note 1) |
| `accent-gradient` | `#ff0080 > #7928ca > #0070f3` | `#ff0080 > #38bdf8` | The one accent word per headline (gradient text, 135deg) and the hero trace | hero accent span (see note 2) |
| `inverse` / `inverse-fg` | `#171717` / `#ffffff` | `#ffffff` / `#000000` | "Download resume" button, CTA arrow chip | footer CV button; CTA chip (light #000, dark #fff) |
| `live` | `#00c950` (label text `#000000`) | `#00c950` (label text `#000000`) | Status dot and hero badge chip | "NEW" chip (see note 3) |

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
| Light | "Download resume" (`inverse-fg` on `inverse`) | `#ffffff` | `#171717` | 17.93:1 | AAA |
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
| Dark | "Download resume" (`inverse-fg` on `inverse`) | `#000000` | `#ffffff` | 21.00:1 | AAA |
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
| "Download resume" button | Source Code Pro | 12px | 700 | normal |
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
- Corner radius system (measured on the reference): cards and nav pill 10px (the reference's `--radius: 0.625rem`); nav link hover/active tint 10px; inset panels 14px; status capsule 14px; large panel (contact CTA) 24px; small buttons ("Download resume", theme toggle) 8px; keycaps 8px; primary CTA, badges, and chips full pill. Nothing else.
- Layout families across the 6 sections (no family repeats): centered stage (hero), asymmetric bento, timeline split, grouped chip sheet, contact panel, footer columns.

---

## 6. Components

### Chrome (verdicts from the code audit)

| Piece | Verdict | Notes |
|---|---|---|
| `SmoothScrollProvider` | **Keep** | ScrollSmoother 1.2 + data-speed parallax. Fixed elements stay outside `#smooth-content`; anchors go through `smoother.scrollTo`. |
| `lib/gsap.ts`, `lib/magnetic.ts`, `lib/motion-preferences.ts` | **Keep** | The motion contract. All new sections follow the documented `gsap.matchMedia` pattern with `gsap.set` reduced-motion fallbacks. |
| `WaveformDivider` | **Adapt** | Signature section divider; restroke from teal to the neutral `fg`/12% line in both themes (section 2). Scrub-drawn, static under reduced motion. |
| `AmbientBackground` | **Drop** | Its graticule grid, drifting traces, teal glow blobs, grain filter, and cursor glow all belong to the retired dark-only Signal & Noise look, and a full-page waveform layer would exceed the "divider + hero trace only" signature. The reference's replacement atmosphere (radial washes, planet arc) is excluded too. |
| `Preloader` | **Drop** | Its only content is a waveform draw, which would be a third waveform use; a static single-page site doesn't need a loading screen. |
| `Navbar` | **Adapt** | Keep all scroll/menu/magnetic/a11y plumbing; rebuild the shell as the floating pill nav, status capsule, and theme toggle (below). |
| `Footer` | **Adapt** | Keep the waveform-settling-to-baseline closing beat (WaveformDivider); rebuild content (dynamic year, links from content.ts, "Download resume"). |
| `Cursor` | **Drop** | Custom cursors are a banned tell; payoff is near zero. Magnetic hover stays. |
| `ParticleCanvas` + `lib/three/particle-field.ts` | **Drop** | Removes Three.js and its ~580 KB async chunk (size as recorded in commit `1cce18e`; it never shipped in First Load JS). The hero trace replaces it. |
| `Hero`, `About`, `Experience`, `Skills`, `Contact` | **Drop / rebuild** | All hardcoded, partly stale or rule-violating (old headshot, "SQA Engineer" title, missing Smart In Media role, published phone number). Rebuilt from `lib/content.ts`. |

New component: **`ThemeToggle`** (section 2), plus the inline no-flash script in `app/layout.tsx`.

### New component vocabulary

- **Logo (Umair's own "UN" serif monogram, added 2026-10-10):** source of truth is `assets/brand/un-monogram.svg`, traced from the original raster (`assets/brand/un-monogram-original.png`, kept for reference, not public). Pixel overlap with the original's ink is 0.988 IoU at zero offset. It has a transparent background and `fill="currentColor"`, viewBox `0 0 401 396`, one even-odd path. The `Logo` component (`components/brand/Logo.tsx`, built in step 1, with the path copied verbatim from the SVG) inlines it, colored `fg` so it follows the theme. Inside the home link the SVG is `aria-hidden` and the link carries `aria-label="Umair Nadeem, back to top"`; standalone it is `role="img"` with an accessible name. Sizes (ours): 32px tall in the nav (the reference's mark measures about 34px), 40px in the footer. Never recolor it with the accent gradient, stretch it, or put it on a tinted plate.
- **Floating nav (measured):** three zones on one row. Left: the `Logo` (home link). Center: a 40px-tall pill (`line` border, 10px radius, backdrop blur 12px; reference fill white/5 in dark, black/10 in light) holding the 4 anchor links (About, Experience, Skills, Contact) in Alata 13px, the active one in `accent` with a 10px-radius tint (reference: white/5), and one embedded "Get in touch" button (reference "Book a Call": 30px tall, white/10 fill, white/20 border, 10px radius). The reference's light-mode pill border is white/10, which is invisible on white, so we use `line` (black/10) in light. Right: status capsule (desktop, `lg`+) then the theme toggle. Hamburger below `md`, reusing the existing GSAP menu logic, placed left of the toggle.
- **Status capsule (desktop only):** 38px tall, 14px radius, backdrop blur 12px; light fill black/8, border black/15; dark fill white/5, border white/10 (all measured). Mono 11px. The reference's capsule holds weather, a place name, a clock, and a ⌘K keycap. Ours holds only the green `live` dot and Umair's local time, `ISB 14:32 PKT`, drawn from `content.location` (Islamabad). No weather, no visitor counter, no greeting, no ⌘K.
- **Primary button (measured):** full pill, 48px tall, padding `4px 4px 4px 12px`, backdrop blur 4px; light fill black/20 with black/10 border, dark fill white/10 with white/10 border; Alata 16px label; embedded 38px circular arrow chip in `inverse` (black in light, white in dark). `:active` scale 0.98; magnetic on fine pointers. Exactly one contact-intent label site-wide: **"Get in touch"** (the nav CTA is the same anchor link, not a second styled intent).
- **Download resume button (measured on the reference's "CV" button):** 8px radius, padding `6px 12px`, Source Code Pro 12px/700, `inverse` fill with `inverse-fg` text. `href="/UmairNadeem_SQA.pdf"` with the `download` attribute. Appears in the hero CTA row and the footer.
- **Copy-email row:** lucide `Copy` icon + Source Code Pro email, with "copied" feedback; sits beside the CTAs. Email is the only direct contact method (locked rule).
- **Bento card (measured):** `surface` fill, 1px border (light `line` black/10; dark `#242424/0.30`, as on the reference), 10px radius, light-mode `shadow-lg`, backdrop blur 8px; caption lockup bottom-left; one focal visual per card; hover lift 2px + border step to `line-strong`.
- **Chip (ours; the reference's chips were not separately measured):** full pill, `surface-2`, 1px `line`, Source Code Pro 13px. **Text only, no icons**, for tool and skill chips alike (user decision 2026-10-10).
- **Check bullet:** list markers in evidence cards are small `accent` lucide `Check` glyphs.
- **Status badge (measured):** full pill, padding `4px 12px`, white/10 fill, black/20 border, backdrop blur 10px, 12px text; holds a `live` chip (10px radius, black label). Used exactly once (hero), factual text only.

Icons: lucide-react (already a dependency). One family, `strokeWidth` 1.75 globally.

---

## 7. Motion rules

Infrastructure: GSAP + ScrollTrigger + SplitText via `lib/gsap.ts`; ScrollSmoother via the provider. No `window.addEventListener('scroll')`, no scroll state in React, animate only `transform`/`opacity`.

Every animation must answer "what does this communicate" in one sentence:

| Moment | Animation | Why |
|---|---|---|
| Hero headline | SplitText line reveal, once | Hierarchy: the claim lands first |
| Hero baseline | The gradient trace runs under the headline and settles toward flatline | Storytelling: signal verified, no defects |
| Section entries | `whileInView`-style fade/translate reveals, staggered, once | Sequence matches reading order |
| Tools marquee | Two counter-scrolling chip rows inside one bento card | Breadth without a data dump. **The only marquee on the page.** |
| Timeline spine | 1px rule draws downward on scroll | Progress through time |
| Typewriter | One mono line in the contact CTA | The machine voice speaks once |
| Hovers | Card lift, button magnetic pull, chip border step | Feedback |
| Theme switch | None (transitions suppressed for one frame) | A theme change is a state change, not a show |

Reduced motion (`prefers-reduced-motion`): every animated component ships a `gsap.set` final-state fallback; ScrollSmoother is not created; marquee rows render static; typewriter renders full text. This is the existing `lib/motion-preferences.ts` contract, followed verbatim. Known limitation to document in code: the preference is sampled at mount, not live-watched.

No scroll cues, no pinned/hijacked sections in v1, no infinite loops outside the marquee and the 2s-period status dot pulse.

---

## 8. Responsive behavior

- Breakpoints: Tailwind defaults. Mobile-first; every multi-column section declares its collapse in the same component.
- Bento collapses to a single column in content-priority order (role card, specializations, portrait, tools, time zone, contact).
- Timeline collapses to a single column: metadata block above its evidence card, spine hidden.
- Nav: pill collapses to the `Logo` left, hamburger + theme toggle right (toggle at the far right, as on the reference); status capsule hidden below `lg`.
- Hero type scale: `text-4xl md:text-5xl lg:text-[60px]` (the headline is 9 words; no 7xl vanity scale). Headline max 2 lines at desktop.
- Test at 390px and 1440px with playwright-cli after each section, **in both themes** (locked workflow rule).

---

## 9. Accessibility and SEO

### Accessibility

- Semantic landmarks; exactly one `h1` (the hero headline); sections are `h2`.
- WCAG AA minimum everywhere, in both themes. Every text color pairing is computed in section 3; anything that failed is replaced there. Recompute if any token changes.
- Focus-visible rings in `accent` (7.07:1 light, 7.09:1 dark) on all interactive elements, including the theme toggle; keep the existing `focusRing` pattern from the old Hero.
- Theme toggle: native button, action-describing `aria-label`, decorative icons `aria-hidden`, 36x36 target (above the 24px WCAG 2.5.8 minimum).
- Alt text on every image; the headshot alt describes Umair, not "profile picture".
- Headshot: `public/umair-nadeem.jpg` at its natural color in both themes (no color grading), 10px radius, 1px `line` border.

### SEO

All metadata stays in `app/layout.tsx` (static export) plus Next.js file conventions. Titles and descriptions come from `content.seo`.

- **Site URL (user decision 2026-10-10):** no domain exists yet. The site deploys free on Vercel first; a custom domain may come later. One helper, `lib/site-url.ts`, exports `SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')`. The localhost fallback is for development only; a production build without the variable logs a build warning. No URL is hard-coded anywhere else. `NEXT_PUBLIC_*` values are inlined at build time, so changing the variable in Vercel requires a redeploy. Everything below reads `SITE_URL`.
- **`metadataBase`:** `new URL(SITE_URL)`.
- **Canonical:** `alternates: { canonical: '/' }` (resolved against `metadataBase`).
- **Open Graph + Twitter:** `og:title`, `og:description`, `og:url`, `og:type=profile`, `og:image`; `twitter:card=summary_large_image`.
- **OG image:** 1200x630, generated at build time by `app/opengraph-image.tsx` (`next/og`) in the light theme (the default; an OG image can't follow the viewer's theme): white background, the hero headline in EB Garamond with "break" in the light accent gradient, and "Umair Nadeem | QA Engineer" in Source Code Pro. `alt` export set to a descriptive sentence. Fonts bundled as files for `next/og`.
- **`sitemap.xml`:** `app/sitemap.ts`, one entry for `/` (hash anchors are not separate URLs), `lastModified` at build time.
- **`robots.txt`:** `app/robots.ts`, allow all, `sitemap: ${SITE_URL}/sitemap.xml`.
- **JSON-LD `Person`:** one `<script type="application/ld+json">` in the page, every field from `lib/content.ts`:
  - `name` (`content.name`), `jobTitle` (`content.title`, "QA Engineer"), `description` (`content.seo.description`)
  - `email`: `mailto:` + `content.contact.email`
  - `address`: `PostalAddress` with `addressLocality` "Islamabad", `addressCountry` "PK" (from `content.location`)
  - `worksFor`: `Organization` "Smart In Media" (`experience[0]`, the role with end "Present")
  - `alumniOf`: `CollegeOrUniversity` "Islamia College Peshawar" (`education[0]`)
  - `knowsLanguage`: `content.spokenLanguages`
  - `knowsAbout`: the items of the `testing-types` skill group
  - `sameAs`: the `content.links` hrefs (LinkedIn, Upwork)
  - `url`: `SITE_URL`; `image`: `${SITE_URL}/umair-nadeem.jpg`
  - Never a `telephone` (locked rule).
- **`themeColor`:** per scheme, via the `viewport` export (section 2).
- **Icons and manifest (in place since 2026-10-10, Next.js file conventions):**
  - All icons were regenerated on 2026-10-10 from the approved `assets/brand/un-monogram.svg` (the generator's grey-background originals are gone). Rendered in the browser via playwright-cli; the ICO was assembled from those renders.
  - `app/icon.svg`: the primary tab icon. Transparent, monogram at 90% of the square, with an embedded `@media (prefers-color-scheme: dark)` rule: black on light browser UI, white on dark. It follows the browser or OS theme, not the site's own toggle; browsers don't expose the page theme to favicons.
  - `app/favicon.ico` (PNG-encoded 16, 32, and 48px entries) and `app/icon1.png` (32x32): fallback for browsers without SVG favicon support. Black monogram at 90% on opaque white. At 16px the hairline serifs blur; that's inherent to a high-contrast serif at that size, and SVG-capable browsers use `icon.svg` instead. Next 16 labels the ICO `sizes="48x48"` (its largest entry; 14.0.4 used the first, 16x16); harmless.
  - `app/apple-icon.png` (180x180), `public/android-chrome-192x192.png`, and `public/android-chrome-512x512.png`: opaque white with a black monogram at 65%, inside the circular maskable safe zone (iOS fills transparency with black, so these stay opaque).
  - The PNG is named `icon1.png`, not `icon.png`: with both `icon.svg` and `icon.png` present, Next 14.0.4 emitted a `<link>` for only one of them; the numbered suffix makes it emit both. Re-checked on Next 16.4: still one link per file, with no duplicates.
  - `app/manifest.ts` (served as `/manifest.webmanifest`) replaces the generator's `site.webmanifest`: `name` from `content.seo.title`, `short_name` from `content.name`, `description` from `content.seo.description`, `display: standalone`, and `theme_color` / `background_color` `#ffffff` (the light `bg`; a manifest can't follow the viewer's theme).
  - Generated tags (checked on a freshly started dev server): `icon` for the ICO, `icon` for `icon.svg` (`image/svg+xml`, `sizes="any"`), `icon` for the 32px PNG, one `apple-touch-icon`, and one `manifest`. Every file returns 200, and there are no duplicates.

---

## 10. Security

The site is static: no database, no forms, no file uploads, no API routes or server actions, no webhooks, no server-side fetches, no cookies or sessions. Protections are built only where an attack surface exists; everything else is verified and recorded as not applicable. Baseline checks below were run on 2026-10-10 and are re-run in the final build step.

### 10.1 XSS and Content Security Policy

- **Why the CSP lives in `proxy.ts`, not `next.config.js`:** the App Router emits its own inline `<script>` tags (the `self.__next_f.push(...)` flight data; observed on the reference site, which is also App Router). A static header in `next.config.js` can't allow those without `'unsafe-inline'`, and hashing them is impractical because their content changes with every build. The supported pattern is a **per-request nonce**, per the Next.js 16 CSP guide. `proxy.ts` (Next 16's name for middleware; it runs on the Node.js runtime) generates a random nonce and sets the CSP on both the response and the request headers. Next parses the request CSP and applies the nonce to its own framework and inline scripts. The root layout becomes `async`, reads the nonce with `(await headers()).get('x-nonce')` (async-only since Next 16), and passes it to `<ThemeScript nonce={...} />`, which already accepts it. Consequence, confirmed in the guide: nonces require dynamic rendering, so the page renders per request instead of being prerendered. That costs some time-to-first-byte on Vercel, and Partial Prerendering can't be used. Next's experimental SRI (`experimental.sri`) keeps static rendering, but it is experimental, so it isn't the plan. All other security headers stay static in `next.config.js` (10.2).
- **Production policy:**
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
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=(), browsing-topics=()`. `clipboard-write` is left alone because the copy-email button uses `navigator.clipboard.writeText`. |
| `Strict-Transport-Security` | Check what Vercel sends after the first deploy; add `max-age=63072000; includeSubDomains` only if it's missing. No `preload` until a custom domain is owned. |

Also `poweredByHeader: false` (drops `X-Powered-By: Next.js`).

### 10.3 CORS

Keep the defaults: Next sends no `Access-Control-Allow-Origin` on pages or assets, and nothing here needs cross-origin reads. Never add a wildcard. Verified 2026-10-10: `next.config.js` defines no headers at all. Re-verify with `curl -I` against the deployment.

### 10.4 Source maps and external links

- **Production browser source maps:** off. `productionBrowserSourceMaps` is not set in `next.config.js` (Next's default is `false`), verified 2026-10-10. The hardening step confirms no `.map` files are served from `/_next/static`.
- **External links:** every `target="_blank"` link carries `rel="noopener noreferrer"`. All 5 existing ones already do (Contact, Footer x2, Hero x2, verified 2026-10-10); the rebuilt sections keep the rule.

### 10.5 Sensitive data (baseline, 2026-10-10)

- **Secrets:** a scan of every added line in the full history of all branches for API keys, tokens, passwords, private keys, and common key formats found none. The 3 pattern hits were false positives inside `.next` build output.
- **`.env` files:** none ever committed; `.gitignore` covers `.env*`.
- **`data/` and `refrence/`:** never committed on any branch (`git log --all -- data refrence` is empty, and nothing is tracked under them).
- **Personal data already in history:**
  - **Phone number:** in `components/Contact.tsx` from the first commit (`e074d83`) up to the current tree, in `.next` build output committed in `e074d83` (untracked in `f75e7a1`), and in `UmairNadeem_SQA.pdf`, tracked since `e074d83`. The rebuilt Contact section removes it from the tree. History keeps it on `main` and `redesign`.
  - **Older email address** (not the one in `content.ts`): in the PDF and earlier code.
  - **Repo visibility:** `origin` (`github.com/umair-nad/umair_website`) answers 404 to an unauthenticated GitHub API request, so it isn't public today. Scrubbing history would mean rewriting `main` and force-pushing; that is the user's call, and nothing is planned.
- **Resume PDF:** it contains the phone number and the older email. It is not moved into `public/` until Umair confirms it may be published (section 11.1).

### 10.6 Dependencies

**Decision (user, 2026-10-10):** upgrade to the latest stable majors, done in build step 1: `next` and `eslint-config-next` 16.4.0, `react` and `react-dom` 19.3.0, `lucide-react` 1.55.0, Tailwind 4.3.3, ESLint 9.39.5 with a flat config, TypeScript 5.9.3.

- **Baseline before the upgrade** (`next` 14.0.4): 22 findings, 1 critical, 18 high, 3 moderate.
- **Fixed by the upgrade:** GHSA-ffhc-5mcf-pf4q (nonce CSP XSS, patched in 16.2.5); GHSA-2xp9-vwfh-vxw4 (image optimizer RCE with AVIF) and GHSA-p293-qw3h-jr36 (RCE on Windows-hosted servers), both patched in 16.3.3; GHSA-f82v-jwr5-mffw (middleware authorization bypass); every other `next` advisory; and all Tailwind 3 build-chain findings.
- **After the upgrade** (`npm audit`, 2026-10-10): 5 high, 0 critical, 0 moderate. All five are one dev-only lint chain: `braces` GHSA-vfj7-8cjw-p6xm (no patched version exists) via `micromatch` and `fast-glob` inside `@next/eslint-plugin-next`, which reaches the tree through `eslint-config-next`. It runs only when linting and never ships to the browser. npm's suggested "fix" is a downgrade to `eslint-config-next` 14, which is rejected. Re-check at the hardening step.
- **ESLint 9 is marked unsupported** by ESLint, but `eslint-plugin-react`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-import` (all pulled in by `eslint-config-next` 16) cap their peer range at ESLint 9. Move to ESLint 10 once they support it. Biome is the documented alternative.
- Any further major upgrade needs the user's approval (CLAUDE.md).

### 10.7 Not applicable (verified 2026-10-10)

| Threat | Why it doesn't apply | Evidence |
|---|---|---|
| SQL injection | No database, no queries | No DB client in `package.json`; the only "SQL" in code is a skill label in the old `Skills.tsx` |
| CSRF | No forms, no server actions, no API routes, no cookies or sessions | No `<form>`, `<input>`, `'use server'`, or `app/api` |
| File uploads | No upload inputs or handlers | No `type="file"`, no route handlers |
| SSRF | No server-side fetches, no external rewrites, no image `remotePatterns`; the OG image renders from bundled fonts | No `fetch(` or `axios` in `app/`, `components/`, `lib/` |
| Webhook signatures | No webhook endpoints | No route handlers or `proxy.ts` yet (the CSP proxy will only set headers) |

If a contact form, API route, server action, or any server-side fetch is ever added, CSRF protection, server-side input validation, and rate limiting become required, and this table must be redone.

### 10.8 Never disable selection or copying

No `user-select: none`, `select-none`, copy, cut, or context-menu blocking anywhere (the reference sets `select-none` on its nav; we don't copy that). Verified 2026-10-10: none in the current code.

---

## 11. Page plan (section by section)

Single route, hash anchors preserved: `#about`, `#experience`, `#skills`, `#contact`.

### 11.1 Hero (`<header>`, full viewport stage)

Centered stage (the one intentionally centered section; everything after is asymmetric), on the plain page background. Stack, max 4 text elements:

1. Status badge (`live` chip): **"Senior QA Engineer · Smart In Media"** (`experience[0].title` + `experience[0].company`; set by the user 2026-10-10)
2. `h1`, 2 lines: **"I break things so your users don't have to."** (verbatim from the approved bio; "break" is the italic gradient accent word)
3. Mono subline (`text-hero`): **"Umair Nadeem | Islamabad, Pakistan"** (`content.name` + `content.location`; set by the user 2026-10-10)
4. CTA row: "Get in touch" primary pill + "Download resume" button + copy-email row (`uminadeem06@gmail.com`)

Below the stack, the gradient signal trace settles to baseline at the fold. No color washes, no horizon arc, no trust strips, no scroll cue, no version labels.

**Resume move (Hero step, user decision 2026-10-10):** `git mv UmairNadeem_SQA.pdf public/UmairNadeem_SQA.pdf` (keeps its history), then the hero and footer buttons point to `/UmairNadeem_SQA.pdf`. Update the README and CLAUDE.md references to the old path in the same step. **Gate:** the PDF's text contains Umair's phone number and an older email address (no street address; location is "Islamabad, Pakistan" only). Publishing the phone would conflict with the no-phone rule, so the move waits for Umair's explicit OK, or for a replacement PDF without the phone. If the gate isn't cleared when the Hero step starts, build the hero without the resume button and add it once cleared.

### 11.2 About bento (`#about`)

Asymmetric grid, 6 cards for 6 real content items (exact cell count, 3 or more cells visually differentiated):

| Card | Size | Content (all from content.ts) | Visual |
|---|---|---|---|
| Current role | Wide 2x1 | Title "Senior QA Engineer"; company line **"Smart In Media (Cologne, Germany)"** (the company's location, so it doesn't read as Umair's); `experience[0].highlights[0]` rendered verbatim: "Tested digital pathology software across multiple PathoZoom projects"; tags Digital Pathology / Healthcare Software / Test Automation | The three tags as chips; caption lockup. No waveform (signature limited to divider + hero). |
| Portrait / bio | Tall 1x2 | `public/umair-nadeem.jpg` (next/image, priority false), sentences 2-3 of `content.bio` verbatim in mono (sentence 1 is the hero `h1`) | Natural-color photo; giant cropped "QA" in EB Garamond behind it as texture, in `line` color, `aria-hidden` |
| QA specializations | 1x1 | 4 headline items: Manual and Exploratory, Test Automation, API Testing, Regression Testing | Check-glyph list. "AI & LLM Testing" stays an ordinary chip in Skills until Umair confirms it (open item in CLAUDE.md). |
| Tools marquee | 1x1 | Text-only chips (no icons) from `skills.tools` + `skills.automation-frameworks` (Cypress, Postman, Apache JMeter, Jira, TestRail...) | Two counter-scrolling chip rows, clipped at card edges |
| Time zone | 1x1 | Pinned copy, sourced facts only: title "Islamabad, Pakistan" (`content.location`), caption `PKT (UTC+5)` (Islamabad's standard time zone, derived from the location, not a claim about Umair's work), plus a live local clock. No copy about remote work (not in any source). | Typographic clock in EB Garamond, `fg` |
| Contact teaser | 1x1 | Copy-email bar + LinkedIn and Upwork links | Inset mono email bar (`surface-2`) |

The middle-dot rule from revision 1 no longer applies: the time-zone card now splits the place and the zone into title and caption.

### 11.3 Experience (`#experience`)

Optional eyebrow slot NOT used; headline: **"Over five years of *finding* bugs before users do."** (accent word "finding"; wording set by the user 2026-10-10; matches the bio's "5+ years"). Narrower reading container (~900px).

Timeline, 4 entries (3 roles + education), reference-pattern split:
- Left (~35%): circled node glyph, role title (Alata, `fg`), company (Source Code Pro 600), date range and location (mono, `muted`). Hyphens in ranges.
- Right (~62%): evidence card (`surface`, 1px border, 10px radius) with the role's highlight bullets from content.ts, `accent` check glyphs, mono 14px; then that role's `tags` as a text-chip row.
- 1px `line` spine connects nodes, draws on scroll.
- Education entry (Islamia College Peshawar, BS Computer Software Engineering, 2017-2021) reuses the identical component.

### 11.4 Skills (`#skills`)

Not an icon wall (excluded by CLAUDE.md ask-first list). A grouped specimen sheet: the 4 groups from content.ts (Testing Types, Automation Frameworks, Tools, Practices) as a 2x2 grid at desktop (single column mobile), each group a borderless cluster with an Alata group label and wrapped text chips. Group count is real (4), chips are real (33). Long-list rule satisfied by grouping; no divide-y row tables.

### 11.5 Contact CTA (`#contact`)

A full-width rounded panel (`surface`, 1px `line` border, 24px radius as measured on the reference's large panel, light-mode card shadow, inset from the page edges). No glow, no grain: the gradient accent word is the panel's only color. Centered:

1. Display headline with accent word: "Ship it **tested**."
2. One mono typewriter line (the machine voice's only speech): `umair@qa: all checks passed. ready when you are.` styled as a terminal prompt, factual-neutral tone (approved as written by the user 2026-10-10)
3. "Get in touch" pill (mailto) + copy-email row + LinkedIn / Upwork links

No contact form (nothing to back it), no booking tool (none exists in sources), no phone (locked rule).

### 11.6 Footer

Compact single-page footer, not the reference's 12-link sitemap: the `Logo` (40px) + one role line left (`content.title` and `content.location`, "QA Engineer | Islamabad, Pakistan"; no new copy); right side Alata uppercase micro-labels (`muted`) over short Source Code Pro link rows: the 4 anchors and the 2 external links from content.ts. A **"Download resume"** button pointing to the PDF moved in the Hero step (11.1). Hairline `line` rule, then a legal line with `© {new Date().getFullYear()} Umair Nadeem` (fixes the hardcoded 2024). Above it, the WaveformDivider settles to flatline: the sign-off beat.

---

## 12. Explicitly out of scope

Blog, GitHub insights/stats/graphs, Guestbook, Bucket List, Uses, Links page, Spotify, command palette / ⌘K (can be proposed later as its own item), visitor counter, weather widget, greeting text, the reference's cosmic atmosphere (hero color washes, planet-horizon arc), its novelty fonts (Shadows Into Light, Henny Penny), projects section (`content.projects` is empty), certifications section (empty), phone number anywhere, any metric/tool/claim not present in `lib/content.ts`.

## 13. Build order (Phase 4+, one step per review stop)

1. **Theme foundation and navbar shell (done 2026-10-10, awaiting review):**
   - The framework upgrade (section 10.6).
   - Removal of the dropped chrome (Three.js, `ParticleCanvas`, `lib/three/`, `Cursor`, `AmbientBackground`, `Preloader`) and of the legacy tokens and scrollbar colors.
   - The light (`:root`) and dark (`.dark`) token sets from section 3.
   - EB Garamond, Alata, and Source Code Pro via `next/font`.
   - The no-flash `ThemeScript` (static, nonce-ready per 10.1), `ThemeToggle`, and per-scheme `themeColor`.
   - The floating navbar with the `Logo`, the pill, the status capsule, the toggle placement, and the mobile menu.
2. Hero, including the "Download resume" button and the `git mv` of the PDF into `public/`, only once the PDF gate in 11.1 is cleared
3. About bento
4. Experience timeline
5. Skills
6. Contact CTA + Footer
7. SEO pass: `lib/site-url.ts` (`NEXT_PUBLIC_SITE_URL` with the localhost fallback), `metadataBase`, canonical, OG image, `sitemap.xml`, `robots.txt`, JSON-LD
8. **Security hardening (section 10):** CSP nonce `proxy.ts` wired to the theme script; static headers and `poweredByHeader: false` in `next.config.js`; JSON-LD escaping check; `rel` audit of every external link; confirm no source maps and no `Access-Control-Allow-Origin`; re-run the history and secrets scan and `npm audit`; re-verify the not-applicable table; check that no CSP violations appear in the console in either theme. After the first Vercel deploy: set `NEXT_PUBLIC_SITE_URL`, redeploy, and check the live response headers (including HSTS) with `curl -I`.

Each step ends with `npm run lint`, `tsc --noEmit`, and playwright-cli checks at 390px and 1440px in both themes, then stops for review.
