# PROGRESS-LOG.md

Detailed history of the portfolio rebuild. **Not loaded every session.** Read it only when you need the reasoning, commit hashes, measurements, or verification record behind a decision. Current status, open decisions, next steps, and every standing rule live in `CLAUDE.md`; the design source of truth is `DESIGN.md`. Dates are 2026.

Contents: 1 Timeline, 2 Section build records, 3 Decisions and reasoning, 4 Source records, 5 Investigations and measurements, 6 Technical gotchas, 7 Verification method.

---

## 1. Timeline

| Date | Event |
|---|---|
| 10-04 | Phase 2: `lib/content.ts` (`8798bf9`), strings fact-traced against all sources. Decisions: LinkedIn wins source conflicts; title "QA Engineer"; email only, no phone in site text. |
| 10-10 | Phase 3: DESIGN.md approved (`d67538b`). Phase 4 step 1: framework upgrade `d37bd0d`, old chrome removed `ed41941`, theme system `f9d3467`, navbar `3d4876b`, docs `519ce51`. Step 2 Hero: `4b03407` (favicon tile), `dda3c6e` (Hero), `80eac6e` (badge spacing). Resume approved for publishing as is. |
| 10-12 | Workflow change: `redesign` fast-forward merged into `main` and deleted (local and remote), tag `pre-redesign-main` (`261e550`) pushed; `origin/addition-by-ammar` deleted. Then, in one long session: resume move and button, About bento and two later rounds, hero feedback, navigation, Skills wall, Experience, Contact, Footer. |
| 10-15 | Contact and Footer approved: glow kept (`d4c673d`), footer role line `content.footerRole` (`09fc658`, separator break `3a32be6`); resume stays until Umair sends a new one. SEO pass (step 7): `6ee0017` site URL and metadata, `a2d4d29` sitemap and robots, `b7b5226` OG image, `557ecf4` headshot, `0ddd42b` JSON-LD. `e177e63` README rewrite. Later the same day: SEO approved; "AI & LLM Testing" confirmed by the user (`8dbb78a`); security hardening step 8 except the CSP: `ca32bbb` static headers, `6400757` patch updates, `55e6e4a` verification records; CSP options measured and presented; the user chose B: `bb49f6e` static CSP. Final QA: `afeefa0` hero LCP fix, `692e356` nav pill wrap at 768 to 1023px, `76218ce` 384px image size. Final QA approved; pre-deploy round: `809cc0e` keyboard-reachable reveals, JS-size experiments reverted, `134c634` gitignore, `4cf308f` Node 22.x pin. `830486c` original logo raster moved to `data/`. Site live on Vercel at https://umair-nadeem.vercel.app (old alias `umair-website-pink.vercel.app`); `NEXT_PUBLIC_SITE_URL` not yet in effect. |

---

## 2. Section build records

### Hero (`components/Hero.tsx`, `hero/CopyEmail.tsx`, `hero/HeroAtmosphere.tsx`)
- h1 is bio sentence 1 with the accent word "break". Subline is `content.heroSubline`, typed in per character like the reference (`8b35e28`; measured: staggered per-character fade, 0.02s apart, no cursor; started together with the headline in `b243141`; done by about 1.2s; sr-only full sentence read once; CLS 0).
- `af4d80e` atmosphere: corner washes and horizon arc from playwright-cli measurements (numbers in DESIGN.md section 2); replaced `HeroTrace`. No `filter: blur`. All hero text AA over the glow in both themes at 390 and 1440 (tightest: the accent word in light, 3.19:1).
- `fdfdaa0` copy-email star burst: canvas-confetti 1.9.4 via `lib/star-burst.ts`, loaded on click (separate 10 KB chunk), own main-thread instance (the default export uses a blob-URL worker), skipped under reduced motion.
- `a704eec` "Download resume" as a secondary outlined pill. `b0337ba` status badge removed. `8e15b80` CTA hover matches the reference (button never moves; fill grows in, label inverts, arrow swaps; 300ms). `988d44c` label "Let’s Connect" in `content.contact.cta`.
- Resume: moved to `public/umair-nadeem-qa-engineer-resume.pdf` (`a4a0d88`), button `7736ea5`, docs `c1c2beb`; verified 200 `application/pdf`.
- `ecea4f4` text selection off site-wide (user decision); email, inputs, and editable content stay selectable; copy, context menu, and shortcuts are never blocked.

### Navigation
- `df04fac` Home is the first pill tab (hero is `#home`; Home and the logo scroll to the top, smooth, instant under reduced motion). `0a916c3` floating mobile nav below md, measured on the reference (48px inverse circles, 6px apart), replacing the hamburger; top bar keeps the logo, clock capsule (fits down to 320px), and theme toggle. CopyEmail hides its "Copied" label below sm so the open stack never overlaps it.
- `33f421f` page order Hero, About, Skills, Experience, Contact; both navs reordered. `lib/nav.ts` (`4109fb8`) shares the list with the footer. `4bcde12` Contact stays highlighted to the very end of the page (last trigger ends 1px past max scroll).

### About bento (`components/About.tsx`, `about/*`)
- Commits `705c841` grid and role card, `6b6f3ea` portrait, `422c1c8` specializations, `0fee8a2` tools marquee, `d54612c` shared clock (`lib/local-time.ts`), `6e0eb1f` time zone, `070796f` contact, `9941ecc` reveals, `08315c7` old About removed, `f9ebaac` guidelines fixes, `47b248a` focus order.
- Round 2: `9a83b8a` rotating globe (cobe 2.0.1; loads only near the viewport, separate 5.9 KB gzip chunk; 0 WebGL draws while scrolled away; static frame under reduced motion with a settle loop because the texture is async; CSS dot-sphere fallback without WebGL; worst text pixel over it 7.13:1). `63c8ff9` time zone card two tiles wide at lg, tools card single. `90e74cd` portrait card: user-approved cut-out (rembg 2.0.67 `birefnet-portrait`, run through uvx outside the project; trimmed 808x1400 WebP, 154 KB), two `content.portraitWords` rows scrolling behind at the measured 36 and 44 px/s, caption = bio sentence 3.
- Mobile order ends with tools so keyboard focus follows the visual order. `specializations`, `timeZone`, `resume` added to content.ts.
- Lighthouse mobile (user flow, median of 3, production): before (`fb46555`) navigation 82 (LCP 3.5 s, TBT 375 ms, CLS 0, 402 KiB), scroll 100; after (`90e74cd`) navigation 85 (TBT 257 ms, 437 KiB, +33 KiB is the cut-out), scroll 99 (TBT 103 ms from cobe starting). Navigation-only runs: 83 before, 83 after.

### Skills & Tools wall (`components/Skills.tsx`, `lib/tool-icons.ts`, `lib/tool-logo-names.ts`)
- `bd1307e` 31 confirmed tools added to content (44 total; `featuredTools` keeps the About marquee at 13). `12225d7` the wall: 31 Simple Icons logos and 13 text tiles, core QA tools first, roving-tabindex keyboard navigation, tooltips on hover, focus, and tap, static glow, reveal once. Icon contrast 4.64:1 light, 11.8:1 dark.
- `ea8ac75` credits line (later moved into the footer), `6498632` uniform square tiles with exact-width rows (no lone last tile; 15/15/14, 4 x 11, 9/9/9/9/8, 5 x 8 + 4), `eb8016c` logo paths lazy-load near the section (20 KB gzip out of the first load; CLS 0), `6148f5f` 56px tiles below 640px so text tiles read at 11px.

### Experience (`components/Experience.tsx`)
- `e1c15dc` headline in content; `ca0fee6` the timeline, measured on the reference's `/about` page: 40px circled nodes with a page-colored ring, 2px spine drawn on scroll (tip 70% down the viewport), `1fr 2fr` split from md, evidence cards with verbatim highlights and accent checks, role tags as chips, education entry without a card (no source lists highlights), testing types and practices as a compact group after the timeline. Tokens `node` and `node-icon`. `10c16e5` guideline fixes (`translate="no"` on tool tags).
- Not copied from the reference: sticky left column (ScrollSmoother's transform disables sticky), 10px chips (ours stay pills), centered heading.
- Verified at 390 and 1440, both themes: no overflow, nav hands over at the center line, nothing focusable inside, reduced motion shows everything.

### Contact and Footer (`components/Contact.tsx`, `components/Footer.tsx`, `components/footer/*`)
- Shared pieces: `baf7941` `PrimaryCta`, `4109fb8` `lib/nav.ts` and `scrollToTop`, `9f6b17c` `ProfileLink` and `ResumeButton`, `b7dd298` `content.contact.headline` and `.line`.
- `52984f9` Contact: measured panel (1376x600 at 1440, 374x549 at 390, 14px radius), "Ship it *tested*.", static terminal line, mailto pill, copy-email, profiles, static cyan glow pools and vignette (no motion, blur, or grain).
- `464734c` Footer (server component; client parts in `footer/`): logo, role sentence (`content.seo.description`), resume pill, Sections and Profiles columns, `© {year}` from `CurrentYear` (build year on the server, current year on the client, hydration-safe), logo credits (`LogoCredits.tsx` deleted), waveform settling flat at the page end. Outside `<main>` (contentinfo landmark). `4e748a9` dropped the unused waveform scrub; `cb4e7ba` guideline fixes (credit names never split; `touch-action: manipulation`).
- Verified at 390 and 1440, both themes: geometry against the reference; worst text contrast over the glow 4.61:1 (prompt, dark 390) and 3.46:1 for the gradient word (large text, needs 3:1); `mailto:uminadeem06@gmail.com`; resume 200; star burst fires; every control shows the 2px accent ring in order; reduced motion static; no phone number, `tel:`, or old email in the HTML; credits end 48px above the dock toggle on phones.
- Keyboard note: Tab from the Skills wall skips Experience (nothing focusable) to the panel; ScrollSmoother takes 1 to 2 s to ease the view there.
- 10-15, approved by the user. `09fc658` footer role line "Software Quality Assurance Engineer | Islamabad, Pakistan" (`content.footerRole`), replacing the three-line `content.seo.description`; one line at 1440. `3a32be6` keeps each half whole, so at 390 it breaks at the separator instead of orphaning "Pakistan".

### SEO (`lib/site-url.ts`, `app/layout.tsx`, `app/opengraph-image.tsx`, `app/sitemap.ts`, `app/robots.ts`, `components/PersonJsonLd.tsx`)
- `6ee0017` `SITE_URL` (trimmed, trailing slashes removed, localhost fallback; a production build without the variable logs one warning per build worker). Metadata from `content.seo`: title "Umair Nadeem | QA Engineer" (was "Umair Nadeem - QA Engineer"; the manifest name follows), `metadataBase`, canonical `/`, `og:type=profile`, `og:url`, `og:site_name`, author, creator, `twitter:card=summary_large_image`. The old hard-coded "SQA Engineer, over 3 years" title and description in layout.tsx are gone.
- `a2d4d29` sitemap (one `/` entry, build-time `lastModified`) and robots (allow all, sitemap URL), both from `SITE_URL`.
- `b7b5226` OG image (DESIGN.md section 9). Fonts: static TTFs from the Google Fonts CSS API (a request without a browser user agent returns `truetype` URLs), OFL texts from the google/fonts repo, in `assets/fonts/`. The headline derivation moved to `lib/hero-headline.ts` (hero unchanged, checked at 1440); the monogram path is exported from `Logo.tsx`. First render's corner washes (760px circles) tinted the whole canvas beige and banded; pulled into the corners (560px circles at the top corners). `twitter-image.tsx` re-exports it (Next accepts the re-export: both routes prerender, identical 93 KB PNGs).
- `557ecf4` headshot 2048px 2.1 MB to 800px 32 KB (sharp, mozjpeg q80; the original had no EXIF, ICC, or XMP). `public/.gitkeep` removed. Every remaining public file is referenced.
- `0ddd42b` JSON-LD `Person`: one block, parses, no raw `<`, no telephone; `addressCountry` "Pakistan" (split from `content.location`, so not "PK"); `image` from `content.seo.image`. `knowsAbout` includes "AI & LLM Testing" (the testing-types group, as shown on the page; still unconfirmed by Umair).
- Verified on the production build (`next start -p 3100`): `/`, `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, `/twitter-image`, `/umair-nadeem.jpg`, `/manifest.webmanifest` all 200 with the right types; `lang="en"`; one h1; headings h1, h2 per section, h3 inside, no skipped levels; the one `<img>` has alt, the logo SVG is named, every other SVG is aria-hidden; all link names descriptive; external links `noopener noreferrer`; no unnamed buttons; repeated head tags are only the 5 font preloads, 3 icon formats, and the 2 per-scheme theme-colors.
- Approved by the user 2026-10-15.
- Lighthouse 12 (npx, Playwright's Chromium via `CHROME_PATH`): mobile Performance 83, Accessibility 100, Best Practices 100, SEO 100; desktop 100 / 100 / 100 / 100. Mobile LCP 3.8 s: the element is the hero h1, 88% render delay (hidden until the SplitText reveal). Other flags on both: unused JS 74 KiB, legacy JS 13 KiB, DOM 925 elements, cut-out image 37 KiB savings.

### Security hardening (`next.config.js`; DESIGN.md section 10)
- `ca32bbb` static headers on `/(.*)` and `poweredByHeader: false`, explicit `productionBrowserSourceMaps: false`. `curl -I` on `next start`: the four headers on `/`, `/opengraph-image`, the resume PDF, and a `/_next/static` chunk; no `X-Powered-By`, no `Access-Control-Allow-Origin`. Chromium logs no unrecognized Permissions-Policy features.
- HSTS: Vercel docs (Encryption and TLS, "Support for HSTS", updated 2026-09-15): `*.vercel.app` gets `max-age=63072000; includeSubDomains; preload`, custom domains `max-age=63072000`, and a project header modifies (replaces) it. So none is set here.
- `6400757` patch updates (see DESIGN.md 10.6); browser smoke test after: no console messages, globe canvas, 44 skill tiles (31 logos).
- `55e6e4a` records: source maps (none, `.map` 404), secrets re-scan (history and bundle; only polyfill URL fields), links (6, all `ProfileLink`), `dangerouslySetInnerHTML` (2, static), not-applicable table re-grep.
- **CSP options, measured 2026-10-15** on `next start` (localhost, Next 16.4.1). Each option was built temporarily in the working tree and reverted; nothing committed. TTFB: 30 requests after 5 warm-ups. Lighthouse 12 mobile performance: median of 3.

  | Build | `/` render | `Cache-Control` | TTFB median / p90 | LH mobile perf | LCP | Works |
  |---|---|---|---|---|---|---|
  | Baseline (no CSP) | static (○) | `s-maxage=31536000` | 4.1 / 4.7 ms | 88 | 3.74 s | yes |
  | A: nonce `proxy.ts`, async layout passes the nonce to `ThemeScript` | dynamic (ƒ) | `private, no-cache, no-store` | 14.0 / 17.4 ms | 88 | 3.72 s | yes: every script nonced, no violations (scroll, globe, copy-email burst, theme toggle) |
  | B strict: static CSP, `script-src 'self'` | static | cacheable | n/a | n/a | n/a | **no**: 4 inline scripts blocked (theme script plus 3 `self.__next_f` flight scripts), React never hydrates |
  | B: static CSP, `script-src 'self' 'unsafe-inline'` | static | `s-maxage=31536000` | 3.9 / 4.7 ms | 89 | 3.73 s | yes, no violations |
  | C: `experimental.sri` + static `script-src 'self'` | static | cacheable | n/a | n/a | n/a | **no**: integrity on 5 of 8 external chunks only; the same 4 inline scripts blocked, no hydration |

  User decision: B (static CSP), built in `bb49f6e`. Final policy and its feature-by-feature zero-violation check are in DESIGN.md 10.1 (scripted playwright run with a `securitypolicyviolation` listener added by `addInitScript`).

  Locally A costs about 10 ms of server time and no Lighthouse points, because the server is on the same machine. On Vercel the difference is structural: B serves `/` from the CDN cache in the visitor's nearest region; A sends every visit to a function in the project's single region (Hobby: one region, default `iad1`, Washington, D.C., per Vercel's region docs), uncached, so a visitor in Islamabad or Cologne pays the transatlantic round trip plus render time (and occasional cold starts) on every load. That was not measured (no deploy yet); it is the expected cost.

### Final QA (2026-10-15, `next start`, Next 16.4.1, static CSP on)
- **Hero LCP (`afeefa0`):** the h1 lost `data-reveal` and the SplitText mask; it gets `data-hero-headline`, painted 0.3em low by CSS when `data-motion='ok'` (2.5s failsafe to `transform: none`), and the split lines take that offset in the same frame and rise (1.1s, `expo.out`, 0.12s stagger). Per-frame sampling at 1440: visible with opacity 1 from the first sampled frame (135 ms), rises 18px to rest by about 0.9s, never moves down. Reduced motion: no offset, no split. 390: two lines, settled transforms identity.
  - Lighthouse mobile, simulated (median of 3): before 87, LCP 3.73 s; after 88, LCP 3.65 s. Observed (unthrottled) trace: before LCP 551 ms after FCP 311 ms; after LCP = FCP (492 ms). Lantern's simulated LCP still includes the async chunk downloads that finish before the observed LCP.
  - Lighthouse mobile, applied DevTools throttling (`--throttling-method=devtools`, median of 3): before 48, FCP 2.20 s, LCP 5.95 s, TBT 2.05 s; after 67, FCP 2.41 s, LCP 2.41 s, TBT 1.86 s.
- **Layout (scripted, reduced motion, full-page screenshots in `review/qa-*.png`, sliced into `review/sheets/`):** 390, 768, 1024, 1440, both themes: `scrollWidth` equals the viewport, no element escapes it outside a clipping ancestor, no console messages, no CSP violations. Computed contrast found nothing real (the only flags were a parser miss on Tailwind's `oklab()` background of the terminal box: actual about 10:1 text and 7:1 prompt). Skills logos and the globe load when scrolled near (by design), so they are blank in static full-page captures.
- **Bug fixed (`692e356`):** the absolutely positioned nav pill shrank to half the bar (352px at 768) and wrapped "Let’s Connect" inside its 30px pill from 768 to 1023px; `w-max` fixes it (pill 159 to 609 at 768, clear of the logo at 64 and the toggle at 700).
- **Keyboard (1440, 390):** after a 4s pause: skip link, nav, hero, About (copy, LinkedIn, Upwork, marquee pause), Skills (one roving tile stop), Contact (mailto, copy, LinkedIn, Upwork), footer; every stop has an outline or ring; no traps; Enter on the skip link moves focus into `main`. With a 1.5s pause, About, Skills, and Contact are skipped (still `visibility: hidden`): open decision in CLAUDE.md.
- **Image (`76218ce`):** with `sizes` containing `85vw`, Next only offers widths of at least 0.85 x the smallest device size (544px), so the 311px desktop slot got the 640px file (50 KB). `deviceSizes` now starts at 384: 1x desktop loads 384 (16 KB), 2x 640, 390@3x 1080. Lighthouse "properly size images" passes.
- **Lighthouse final (median of 3):** mobile Performance 88, Accessibility 100, Best Practices 100, SEO 100 (LCP 3.71 s, TBT 126 ms, CLS 0.005); desktop 100 / 100 / 100 / 100 (LCP 0.75 s, TBT 0, CLS 0.010). Remaining flags: unused JS 74 KiB, legacy JS 13 KiB, DOM about 920 elements; the informational CSP audit marks `'unsafe-inline'` High (accepted with option B).
- Approved by the user 2026-10-15.

### Pre-deploy round (2026-10-15)
- **Keyboard-reachable reveals (`809cc0e`):** `lib/reveal.ts` `scrollReveal(root, elements, { y, start, duration, stagger })` replaces the four copies of the `ScrollTrigger.batch` reveal (same values per section). Unrevealed: `opacity: 0`, `pointer-events: none`, `visibility: visible` (focusable, in the accessibility tree; pointers pass through as with `visibility: hidden`). Pointers are handed back when an element's fade starts (as `autoAlpha` did). A `focusin` listener on the section, only for `:focus-visible`, shows everything still pending at once; the batch skips anything already shown. Hero: CTAs fade with opacity only, pointers blocked until the fade starts; keyboard focus in the hero completes the intro timeline. The pre-hydration CSS `visibility: hidden` and its 2.5s failsafe are unchanged.
  - Verified (`next start`): Tab pressed right after the load event: 1440 skip link, nav, hero CTAs, About, Skills, Contact, footer; 390 the same with the dock toggle; every focused element in a revealed section at opacity 1; no console messages. Mouse: unrevealed Contact CTA wrapper `opacity 0`, `pointer-events: none`; after the scroll reveal `elementFromPoint` hits the CTA. Per-frame samples: hero CTA hidden before hydration, then opacity 0 with pointers off, fade from about 0.55s with pointers back at the start; Experience heading fades 0 to 1 over about 0.6s on scroll.
- **JS size, measured and reverted (nothing committed):** baseline mobile median 89, LCP 3.72 s, 215 KiB JS transferred. Initial scripts (gzip): React and Next runtime 70 KB (holds the 13 KB of polyfills Lighthouse calls legacy), app code with GSAP and plugins 74 KB, Next client router 47 KB, small runtime chunks; a 38 KB `noModule` polyfill file is never loaded by modern browsers. (A) `browserslist` Chrome/Edge 111, Firefox 128, Safari 16.4: byte-identical chunks (Next 16's built-in modern target is Chrome/Edge 111, Firefox 111, Safari 16.4 in `next/dist/shared/lib/modern-browserslist-target.js`; the framework polyfills ship regardless). (B) a client wrapper with `next/dynamic` for About, Skills, Experience, Contact (SSR on; the docs say a Server Component's dynamic import of a Client Component is not code-split): initial gzip 213 to 202 KB, but 3-run median 86, LCP 3.87 s, 229 KiB total JS, TBT about doubled, so reverted.
- **Cleanup (`134c634`):** `git ls-files`: 80 files, 3,242,793 bytes; nothing under `review/`, `refrence/`, `data/`, `.claude/`, `.agents/`, `.next/`, `node_modules/`, no screenshots or scratch files. Every public asset, font, component, lib file, and config is referenced (icons through Next file conventions). `.gitignore` gained `.playwright/`, `test-results/`, `playwright-report/`, `blob-report/`, `.vercel/`. After: 3,242,975 bytes. Over 100 KB: the original logo PNG (1.48 MB, kept, open decision), the four OG fonts (390, 339, 121, 121 KB, used), `package-lock.json` (243 KB), the portrait cut-out (158 KB, used).
- **Node 22 (`4cf308f`):** Vercel docs (Supported Node.js versions): majors 24.x (default) and 22.x; `engines` overrides the dashboard; `>=22.0.0`-style ranges map to the newest (24.x). `engines` is now `22.x` (lockfile root entry changed by hand: `npm install --package-lock-only` also rewrote unrelated optional-package metadata). `npx -p node@22` (v22.23.3): `next build` and `next start` pass; with `NEXT_PUBLIC_SITE_URL=https://example.com/` (reserved test domain, local only) canonical, `og:url`, OG and Twitter images, JSON-LD `@id`/`url`/`image`, robots, and sitemap all use it, no `localhost:3000` left; the full feature and CSP check passes.
- **Original logo raster (`830486c`):** by the user's decision, `assets/brand/un-monogram-original.png` (1.48 MB) was copied to the gitignored `data/` (byte-identical) and removed with `git rm`; earlier commits keep it. Tracked size 3.24 MB to 1.77 MB.

### Live on Vercel (2026-10-15)
- The user deployed `main`; first address `umair-website-pink.vercel.app`, then renamed to **https://umair-nadeem.vercel.app**. The old address serves the same deployment (same ETag and build ID, HTTP 200), so it is an alias, not a redirect yet.
- **Live checks (17:12 to 17:25 UTC):**
  - Headers, each exactly once, on the page, a JS chunk (Vercel serves them from `/_next/static/immutable/chunks/` with `public,max-age=31536000,immutable`), the OG image, and the resume: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (from Vercel), the CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`; no `X-Powered-By`. Vercel's CDN also adds `Access-Control-Allow-Origin: *` everywhere (`next start` sends none; open decision).
  - `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, `/twitter-image` (93 KB PNG), the resume PDF, the headshot, and the manifest: 200 with the right types.
  - Browser (scripted, live URL): 390, 768, 1024, 1440, both themes: no overflow, zero console messages, zero CSP violations (the only contrast flag is the known `oklab()` parser miss); full feature check passes (theme script and toggle, typing, nav and mobile nav, ScrollSmoother, Skills logos and tooltip, cobe globe, marquees, copy email with clipboard and burst, resume, OG, JSON-LD).
  - Lighthouse 12 live (median of 3): mobile 92 / 100 / 100 / 100 (FCP 1.01 s, LCP 2.98 s, TBT 147 ms, CLS 0.005, TTFB 71 ms); desktop 100 / 100 / 100 / 100 (FCP 0.30 s, LCP 0.62 s, TBT 0, CLS 0.010). Mobile is better than local (88): Vercel's compression and edge TTFB. Lighthouse SEO does not flag the localhost canonical.
- **Blocking: `NEXT_PUBLIC_SITE_URL` not in effect.** Canonical, `og:url`, OG and Twitter image URLs, JSON-LD `@id`/`url`/`image`, robots, and sitemap all say `http://localhost:3000`. The served build's sitemap `lastmod` is 17:11:21 UTC, the build from the `b7f7c7b` push; a 10-minute poll (17:12 to 17:22) and a recheck at 17:25 saw no newer build go live. Reproduced locally: `NEXT_PUBLIC_SITE_URL=umair-nadeem.vercel.app` (no scheme) fails `next build` with `TypeError: Invalid URL` ("Failed to collect configuration for /"), and Vercel keeps serving the last good deployment. Likely cause; not confirmed (no dashboard access). **Resolved later the same day:** the actual cause was that the variable had never been added in Vercel; the user added `https://umair-nadeem.vercel.app` (Production), redeployed, and confirmed the live page source shows no `localhost`.
- **Failed preview deployment:** `git ls-remote` shows only `main` (and tags `0.001`, `pre-redesign-main`), so not from another branch. `gh` is not installed and the repo is private, so the deployment's source and log need the Vercel dashboard.

---

## 3. Decisions and reasoning

- **Workflow (10-12):** all work on `main`, small commits, push after each, lint + tsc before every push (plus build when components or config change), never force-push. Reason: simple history that always builds, because Vercel will deploy every push. Identity is Umair Nadeem <uminadeem06@gmail.com>, set by the user; attribution is off in the uncommitted `.claude/settings.local.json` so commits show only Umair. The user still reviews after each section. Tag `0.001` is the user's; leave it alone.
- **Stack:** Next.js 16.4.0, React 19.3.0, Tailwind 4 CSS-first, lucide-react 1.x (no brand icons, so LinkedIn and Upwork are text links), ESLint 9 flat config, TypeScript 5.9. Vercel needs Node 20.9+.
- **Theme:** light default; OS preference on first visit, remembered choice afterwards. Palette and fonts match the reference (EB Garamond, Alata, Source Code Pro). The reference's `dark` class renders its white page (inverted), so its `dark:` values are what we use in light.
- **Logo and favicons:** SVG monogram `assets/brand/un-monogram.svg` is the logo; `app/icon.svg` is a dark rounded tile with a white monogram so it reads on any tab color.
- **Resume:** Umair approved publishing the PDF as is, phone number and older details included (10-10). Site text still follows LinkedIn and never shows the phone.
- **Domain:** none yet. Deploy free on Vercel first, then set `NEXT_PUBLIC_SITE_URL` and redeploy.
- **Skills wall (10-12):** replaces the planned chip sheet; sits directly after the About bento; text tiles where no licensed logo exists; credits in one low-key footer line.
- **Marquees (10-12):** exactly two approved (About tools, portrait word rows).
- **Contact line (10-12):** plain static text, no typing, so the typing effect appears once (hero subline).
- **Bio sentence 2** is the Experience intro; testing types and practices sit in Experience (10-12).
- **Robot Framework (10-12):** permanently a text tile (mark is CC BY-NC-SA 4.0).
- **AGENTS.md (10-12):** `next dev` generates it; gitignored, CLAUDE.md is the single instruction file (`ab18a53`).
- **Text selection (10-12):** disabled site-wide by the user's decision (DESIGN.md 10.8).

---

## 4. Source records

**Tools.** 13 come from the approved sources: Cypress, Cucumber, Robot Framework, Jira, Linear, Trello, TestRail, Zephyr, Postman, Swagger, Apache JMeter, Chrome DevTools, Confluence. The user confirmed in chat on 10-12 that Umair has used these 31 more: Slack, Microsoft Teams, Notion, Figma, Git, GitHub, GitLab, Bitbucket, Jenkins, GitHub Actions, Playwright, Selenium, Appium, WebdriverIO, Pytest, k6, Insomnia, Charles Proxy, Fiddler, BrowserStack, LambdaTest, Sauce Labs, PostHog, Sentry, Datadog, Google Analytics, Docker, SQL, Xray, qTest, Azure DevOps. These 44 are the complete list.

**Logo research for the 13 text tiles (10-12): none added.** Devicon (MIT set) and svgl have logos for Playwright, qTest, Azure DevOps, BrowserStack, Slack, and Microsoft Teams, but their owners' terms don't allow our use (Microsoft: logos and icons need a license and may not be altered; Slack: no recoloring, third-party use needs a written license; BrowserStack and Tricentis publish no logo permission). Chrome DevTools has no logo of its own (Chrome's would misrepresent it); SQL is a language with no logo; Zephyr, Xray, Fiddler, and LambdaTest have no logo in either set; Robot Framework is CC BY-NC-SA.

**Credits (footer line):** Simple Icons marks; Git logo by Jason Long, CC BY 3.0; Jenkins logo, CC BY-SA 3.0; Apache JMeter logo, Apache License 2.0.

**lib/content.ts** was fact-traced against all sources on 10-04; treat its values as settled unless a source changes. Smart In Media bullets are the user's own words; do not extend them.

---

## 5. Investigations and measurements

- **"1 Issue" dev indicator (10-12):** found on its second appearance in `.next/dev/logs/next-development.log` (Next 16 logs browser errors there). A hydration mismatch from an attribute `__processed_<uuid>__="true"` that something in the user's browser (extension or security tool) stamps on `<body>` before React hydrates. Reproduced by stamping the same attribute; fixed in `18ef805` with `suppressHydrationWarning` on `<body>` only.
- **npm audit:** 5 high findings, all in the `eslint-config-next` dev chain (braces, micromatch, fast-glob); dev only, nothing ships to the browser. Re-check in the security step.
- **Reference measurements** (playwright-cli at 1440 and 390, both themes, `getComputedStyle`) are recorded in DESIGN.md next to each component. Capture scripts lived in the session scratchpad and are gone; re-measure with playwright-cli if needed. Reference captures were saved to `review/ref-*` (gitignored, local only).
- **Headshot:** the 2.1 MB original `public/umair-nadeem.jpg` is no longer displayed (the cut-out is). next/image served resized copies, so it only weighs on the repo. Re-encode (about quality 80, roughly 0.5 MB) was recommended and never decided.

---

## 6. Technical gotchas

- **GSAP `matchMedia`** only runs a conditions-object callback while at least one condition matches; include `always: ALWAYS_QUERY` (`lib/motion-preferences.ts`).
- **Scaled triggers:** a ScrollTrigger on an element at `scaleY: 0` measures 0px; trigger on its parent (Experience spine).
- **Reveals:** `gsap.set` first, then `fromTo` with explicit end values; a plain `from()` captures the CSS-hidden state as its end. `html[data-motion='ok'] [data-reveal]` is hidden pre-paint with a 2.5s CSS failsafe.
- **Hover lifts** use the CSS `translate` and `scale` properties so they compose with GSAP's `transform`.
- **Focus rings:** transition `[color,background-color,border-color]`, not `colors` (which fades the outline in).
- **ScrollSmoother** distorts Playwright element screenshots and disables `position: sticky`; Navbar sits outside the provider because the smoother fixes its wrapper.
- **Tailwind 4:** arbitrary `min-[1352px]` sorts before `xl`; use `min-[84.5rem]`. Dev server can serve stale CSS after outside edits; verify on the production build.
- **TypeScript:** no iterating strings, NodeLists, or Sets with `for...of` or spread; use `Array.from`. No top-level `await` (tsconfig target); in metadata image routes, read files inside the handler.
- **next/og:** can't use `next/font` files; it needs TTF, OTF, or WOFF (not WOFF2) on disk, read with `readFile(join(process.cwd(), ...))`. Text layout is flexbox only, so mixed-style headlines are one flex item per word; `backgroundClip: 'text'` works for the gradient word.
- **Lighthouse on Windows:** pass `CHROME_PATH` as a Windows path (`C:\Users\...\ms-playwright\chromium-*\chrome-win64\chrome.exe`), and in Git Bash `require()` reports with a relative path after `cd` (a `/c/...` path is not found).
- **Shell (Git Bash, Windows):** never put backticked markdown in a double-quoted `node -e`; use the Edit tool or a script file. Source files are CRLF in the working copy; node edit scripts normalize to LF and restore CRLF. TaskStop on a backgrounded `next start` leaves the node process alive; kill by port (`Get-NetTCPConnection`) or the next server fails with EADDRINUSE and you test the stale one. Long-path worktree removal needs a `\\?\` PowerShell delete plus `git worktree prune`.

---

## 7. Verification method

- Always on the production build (`npm run build`, `next start -p 3100`), 390px and 1440px, both themes, plus reduced motion (`emulateMedia`).
- Screenshots: scroll natively to the section's summed `offsetTop`, wait about 2.5s, viewport screenshot; under emulated reduced motion there is no smoother, so `locator('#section').screenshot()` works (hide the fixed nav first).
- Contrast: hide text, screenshot, sample pixels under Range rects (text runs only); compare the CSS gradient redrawn on a canvas for gradient words.
- CLS via PerformanceObserver; Lighthouse 13.5 user flows (navigation, then a timespan that scrolls) for mobile.
- Each section also gets the web-design-guidelines skill (rules fetched from the Vercel Web Interface Guidelines repo); fixes go in their own commit.
