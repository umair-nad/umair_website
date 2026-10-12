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
- **TypeScript:** no iterating strings, NodeLists, or Sets with `for...of` or spread; use `Array.from`.
- **Shell (Git Bash, Windows):** never put backticked markdown in a double-quoted `node -e`; use the Edit tool or a script file. Source files are CRLF in the working copy; node edit scripts normalize to LF and restore CRLF. TaskStop on a backgrounded `next start` leaves the node process alive; kill by port (`Get-NetTCPConnection`) or the next server fails with EADDRINUSE and you test the stale one. Long-path worktree removal needs a `\\?\` PowerShell delete plus `git worktree prune`.

---

## 7. Verification method

- Always on the production build (`npm run build`, `next start -p 3100`), 390px and 1440px, both themes, plus reduced motion (`emulateMedia`).
- Screenshots: scroll natively to the section's summed `offsetTop`, wait about 2.5s, viewport screenshot; under emulated reduced motion there is no smoother, so `locator('#section').screenshot()` works (hide the fixed nav first).
- Contrast: hide text, screenshot, sample pixels under Range rects (text runs only); compare the CSS gradient redrawn on a canvas for gradient words.
- CLS via PerformanceObserver; Lighthouse 13.5 user flows (navigation, then a timespan that scrolls) for mobile.
- Each section also gets the web-design-guidelines skill (rules fetched from the Vercel Web Interface Guidelines repo); fixes go in their own commit.
