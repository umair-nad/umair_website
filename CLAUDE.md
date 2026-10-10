# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project overview

Personal portfolio of Umair Nadeem, a Software Quality Assurance (SQA) engineer. Currently a single-page site (all sections on one route with hash-anchor navigation), being rebuilt on the `redesign` branch.

- Framework: Next.js 16.4 (App Router, Turbopack), React 19.3, TypeScript 5.9 (upgraded 2026-10-10)
- Styling: Tailwind CSS 4 (CSS-first config: theme tokens live in `@theme` in `app/globals.css`; there is no `tailwind.config.js`), PostCSS via `@tailwindcss/postcss`
- Animation: GSAP 3 with @gsap/react (ScrollTrigger, ScrollSmoother, SplitText; registered in `lib/gsap.ts`)
- Icons: lucide-react 1.x (no brand icons). Fonts via next/font/google: EB Garamond (display, with real italic), Alata (UI), Source Code Pro (mono body and captions)
- Theme: light (default) and dark via a `dark` class on `<html>`. Tokens are in `app/globals.css` (`:root` and `.dark`), logic in `lib/theme.ts`, the pre-paint script in `components/theme/ThemeScript.tsx` (nonce-ready), and the toggle in `components/theme/ThemeToggle.tsx`
- Package manager: npm

### Commands

- `npm run dev` - dev server at http://localhost:3000
- `npm run build` - production build
- `npm start` - serve the production build
- `npm run lint` - ESLint 9 CLI with the flat `eslint.config.mjs` (`next lint` no longer exists in Next 16, and `next build` no longer lints, so run lint yourself)

There is no test framework configured; UI verification is done with the playwright-cli skill (see Workflow below).

### Repo layout

- `app/` - layout.tsx (fonts and all site metadata), page.tsx (composes the sections), globals.css, plus the icon file conventions (favicon.ico, icon.svg, icon1.png, apple-icon.png) and manifest.ts
- `assets/brand/` - non-public brand sources: `un-monogram.svg` (Umair's "UN" logo, `currentColor`, the source of truth for the Logo component and any regenerated favicons), `un-monogram-original.png` (the original raster, reference only). Never serve files from here directly.
- `review/` - local review screenshots for the user. Gitignored; never commit.
- `components/` - one file per section (Navbar, Hero, About, Experience, Skills, Contact, Footer) plus chrome (WaveformDivider, providers/SmoothScrollProvider). Preloader, Cursor, AmbientBackground, and the Three.js hero canvas were removed on 2026-10-10 (DESIGN.md section 6).
- `lib/` - support code (gsap.ts, magnetic.ts, motion-preferences.ts) plus content.ts, the typed content source for all site copy
- `public/` - static assets (headshot, android-chrome icons for the manifest)
- `data/` - Umair's LinkedIn export (Profile.pdf). Gitignored. Content source only.
- `refrence/` - spelled without the second "e" on disk; when the user writes "reference/", this folder is what they mean. Screenshots of a developer portfolio (dhirajbhawsar.in) used for design inspiration only. Gitignored.
- `UmairNadeem_SQA.pdf` at the repo root is the public resume and is already tracked in git history. Do not confuse it with the private LinkedIn PDF in `data/`.

All user-visible copy is still hardcoded in component JSX or local const arrays; `lib/content.ts` (added 2026-10-04) is the typed content source the redesigned sections will pull from. There is no CMS.

## Project rules

### Identity
- This is Umair Nadeem's portfolio. Umair is a QA engineer, so the site must present QA and test automation work, not a software developer profile.

### Git
- Work only on the branch `redesign`. Never touch `main`.
- Never commit anything inside `data/` or `refrence/`. Both are gitignored; `data/` contains personal information.

### Content
- Content sources are `data/` (LinkedIn PDF), the public resume `UmairNadeem_SQA.pdf`, the existing site content, and facts the user provides directly in chat about Umair's work. When sources conflict, follow LinkedIn (user decision 2026-10-04). Never invent projects, metrics, dates, tools, or achievements. If something is missing from all sources, stop and ask the user.
- Smart In Media content: present only what the user stated in chat or what is publicly visible on smartinmedia.com. Write product names as "PathoZoom Digital Lab" and "PathoZoom Scan & LiveView", skip the ® symbol in body text, and never describe internal details or clients.
- Do not publish Umair's phone number anywhere on the site (user decision 2026-10-04). Email is the only direct contact method.
- The reference site in `refrence/` belongs to a developer (Dhiraj Bhawsar). Match the reference site's theme (colors, light/dark modes, typography); never reuse its logo, text, images, video, or developer-only sections.
- Do NOT include a blog page or blog section.
- Do NOT include GitHub insights, contribution graphs, GitHub stats, or repo activity widgets.
- The reference site also contains these developer-specific or novelty sections: code-centric case studies with dev-stack chips, a developer Skills and Tools icon wall, a "From Concept to Code" CTA, a developer-framed experience timeline, a Uses page, a Guest Book, a Bucket List, a Links page, and a Spotify integration. Before adding anything similar, list what is being considered and ask the user first.

### Design
- Follow DESIGN.md (approved 2026-10-10) and the taste-skill (design-taste-frontend). Avoid generic AI layouts such as a centered hero with three feature cards and gradient blobs.
- Do not use em dashes in any text content on the site.

### Security (every build step; details in DESIGN.md section 10)
- CSP: production `script-src` never contains `'unsafe-inline'` or `'unsafe-eval'`. Every inline script, including the no-flash theme script, carries the per-request nonce from the CSP middleware. Keep the theme script a static string with no interpolated data. Don't add inline scripts or third-party script, style, font, image, or connect origins without updating the CSP and asking the user.
- `dangerouslySetInnerHTML` only for the static theme script and the JSON-LD block. JSON-LD is `JSON.stringify(...)` with `<` escaped to `<`, built only from `lib/content.ts`. Never pass unescaped or user-supplied data.
- Every `target="_blank"` link has `rel="noopener noreferrer"`.
- Never disable text selection, copying, or the context menu.
- Keep production browser source maps off. Never add a wildcard `Access-Control-Allow-Origin`.
- No secrets in the repo. `.env*` stays gitignored; only `NEXT_PUBLIC_*` values that are safe to be public go into client code.
- The site has no forms, API routes, server actions, uploads, webhooks, or server-side fetches. If any of these is ever added (for example a contact form), CSRF protection, server-side input validation, and rate limiting become required, and the DESIGN.md 10.7 not-applicable table must be redone first.
- Ask the user before any major version upgrade of a dependency.

### SEO (required on every page)
- Unique title and meta description per page, Open Graph tags, semantic HTML, exactly one h1 per page, and alt text on every image.
- Today all metadata lives in the static export in `app/layout.tsx`.
- Every absolute URL (metadataBase, canonical, sitemap, robots, JSON-LD, OG) comes from `SITE_URL` in `lib/site-url.ts`, which reads `NEXT_PUBLIC_SITE_URL` with a `http://localhost:3000` fallback for development. Never hard-code or invent a domain.

### Deployment
- Hosting: Vercel (free tier) first; there is no domain yet, and a custom domain may be bought later.
- Node.js: Next.js 16 needs Node 20.9 or newer. Set the Vercel project's Node.js version to 20.x or later (22.x recommended); `package.json` declares `"engines": { "node": ">=20.9.0" }`.
- After the first Vercel deploy, set `NEXT_PUBLIC_SITE_URL` in the Vercel project settings (Production) to the deployment's URL, then redeploy: `NEXT_PUBLIC_*` values are inlined at build time. If a custom domain is added later, update the variable to that domain and redeploy again.

### Workflow
- Work in small steps, one section at a time, and stop for the user's review after each section.
- After major UI changes, test with the playwright-cli skill at mobile and desktop widths.

## Progress

As of 2026-10-10:

- Phases 0 to 3 are complete. Phase 3 produced DESIGN.md, approved by the user on 2026-10-10 (theme matches dhirajbhawsar.in in light and dark, with values measured on the live site using playwright-cli; contrast computed; Security section added).
- Brand (2026-10-10): Umair's own "UN" monogram is the site logo, traced to `assets/brand/un-monogram.svg` (transparent, `currentColor`); the user approved the trace. All favicons and app icons were regenerated from it with the user's OK, and the manifest is in place (DESIGN.md section 9, "Icons and manifest").
- Decision pending before the Hero step: Umair's OK to publish the resume PDF, which contains his phone number and an older email address (DESIGN.md 11.1).
- Phase 4 build step 1, FIRST item: the framework upgrade (user decision 2026-10-10, based on the research summarized here). It supersedes the "14.2.35 vs Next 15" choice in DESIGN.md 10.6 and 13; update those sections in the same step.
  - Targets, all latest stable on 2026-10-10: `next` and `eslint-config-next` 16.4.0, `react` and `react-dom` 19.3.0, `@types/react` and `@types/react-dom` 19.3.0, `lucide-react` 1.55.0 (0.294 only accepts React up to 18). `gsap` 3.15.0 and `@gsap/react` 2.1.2 already accept React 19 (no change). Stay on `typescript` 5.9.3 (Next 16 needs 5.1+; TS 7 is untested here) and `eslint` 9.39.5. ESLint marks 9.x unsupported, but `eslint-plugin-react`, `-jsx-a11y`, and `-import` (pulled in by `eslint-config-next`) cap their peer range at ESLint 9. Biome is the documented alternative. Remove `three` and `@types/three` as already planned.
  - Required changes: `"lint": "next lint"` becomes `"lint": "eslint ."` (`next lint` was removed in 16); `.eslintrc.json` becomes a flat `eslint.config.mjs`; the planned `middleware.ts` is named `proxy.ts` instead (Node.js runtime only); `headers()` is async-only, so the root layout becomes `async` and awaits it for the nonce; Turbopack is now the default bundler (there's no custom webpack config, so no action); `next/image` defaults are now `qualities: [75]` and no 16px `imageSizes`. Set Vercel's Node.js version to 20.9 or newer (also add `"engines": { "node": ">=20.9.0" }`). Next 16 rewrites `tsconfig.json` on first build (`jsx: react-jsx`, adds `.next/dev/types/**/*.ts`); commit that.
  - Breakage found in a throwaway trial upgrade of a copy (scratchpad, not this repo; 2026-10-10): only lucide-react 1.x dropping brand icons (`Linkedin`, `Github`, and so on), used in `Contact.tsx`, `Footer.tsx`, and `Hero.tsx`, which are all being rebuilt anyway. LinkedIn and Upwork become text links. After that one fix: `tsc --noEmit` clean, `next build` green, the page is still statically prerendered, the production page loaded with zero console errors, ScrollSmoother mounted and scrolled, and there's exactly one `h1`. The kept code (`lib/gsap.ts`, `lib/magnetic.ts`, `lib/motion-preferences.ts`, `WaveformDivider`, `SmoothScrollProvider`, the Navbar plumbing, `app/manifest.ts`, the icon files) needed no changes.
  - Advisories: `npm audit` on the target set reports zero for `next`. The upgrade fixes GHSA-ffhc-5mcf-pf4q (nonce CSP XSS, patched in 16.2.5), GHSA-2xp9-vwfh-vxw4 and GHSA-p293-qw3h-jr36 (the two RCEs, patched in 16.3.3), and GHSA-f82v-jwr5-mffw (middleware bypass). Still open, all dev-only lint or build tooling: `braces` GHSA-vfj7-8cjw-p6xm (no patched version exists) via `@next/eslint-plugin-next` > `fast-glob` > `micromatch`. With Tailwind 3.4.19, 4 more: `chokidar`, `postcss-nested`, `postcss-selector-parser`, and `tailwindcss` itself.
  - Open sub-decision for the user: stay on Tailwind 3.4.19 (v3 LTS, works with Next 16, verified in the trial) or move to Tailwind 4.3.3, a major version with CSS-first config. Step 1 rewrites the tokens anyway, and v4 clears the 4 Tailwind advisories, but it raises the Firefox floor to 128 (Next 16's own floor is Chrome 111, Safari 16.4, Firefox 111). Ask before installing.
- Phase 2 produced `lib/content.ts`, the approved typed content source for all site copy (fact-checked against the sources, `tsc --noEmit` clean). Components do not read from it yet.
- Key decisions: when sources conflict, LinkedIn wins; the public resume and facts the user states in chat are official content sources; the professional title is "QA Engineer"; no phone number on the site; no blog; no GitHub insights or stats.
- Open items waiting on Umair: which automation tools he uses at Smart In Media, whether he tested AI modules (the "AI & LLM Testing" skill rests on his LinkedIn headline alone), projects worth showcasing, certifications.
- Next step: Phase 4 build step 1, the theme foundation (DESIGN.md section 13): tokens, fonts, no-flash script, toggle, removal of the old chrome. Stop for review afterwards.

## Redesign TODO

Items confirmed with the user on 2026-10-04, to handle during the redesign:

- New headshot is `public/umair-nadeem.jpg` (2048x2048 JPEG, copied on 2026-10-04 from the gitignored `data/Profilepic.jpg`; the original stays in `data/`). Use it with next/image and descriptive alt text when the new Hero/About is built. `public/muhammad.jpg` is still referenced by `components/Hero.tsx`: delete it only after no component references it.
- Footer year is hardcoded as "© 2024" in `components/Footer.tsx`: fix it while rebuilding the footer.
- The resume `UmairNadeem_SQA.pdf` stays public and tracked. User approved on 2026-10-10: during the Hero build step, `git mv` it into `public/` and add "Download resume" buttons in the hero CTA row and the footer (DESIGN.md 11.1). Gated: the PDF contains Umair's phone number, so wait for his explicit OK (or a PDF without the phone) before moving it.
