# Performance Optimization Plan: jack-mechem (Next.js 16 + Tailwind v4)

This plan is ordered by impact-per-effort. Each item is concrete enough to execute without further investigation. Complete one phase, verify, then proceed.

**Global prerequisite (run once before starting):**
```
cd /home/jack/Projects/jack-mechem && pnpm build
```
Save the output (route sizes, First Load JS column) as a baseline to compare against after each phase.

---

## Phase 1 — Critical render path (biggest wins, low risk)

### 1.1 Eliminate the hydration-gated `<body>` and add a no-flash theme script
**Files:**
- `/home/jack/Projects/jack-mechem/src/app/(site)/layout.tsx` (rewrite)
- `/home/jack/Projects/jack-mechem/src/app/(site)/components/layoutWrapper.tsx` (delete)
- `/home/jack/Projects/jack-mechem/src/stores/useThemeStore.ts` (modify init)

**What changes:**
1. Delete `layoutWrapper.tsx`. The current file is a client component that returns no `<body>` at all until `isHydrated && theme.includes("dark/light")` — meaning the body is never rendered during SSR, breaking streaming, FCP, and LCP entirely. The conditional `theme.includes("light")` also fails until hydration, which means the FIRST paint after JS arrives, not the SSR HTML.
2. Convert `layout.tsx` into a fully server-rendered shell:
   - Render `<html lang="en">` and `<body className={jetbrains.className + " bg-primary overflow-hidden"}>` directly.
   - Import `JetBrains_Mono` from `next/font/google` at module scope in this file (server side), assign `variable: "--font-jetbrains"`, and apply both `jetbrains.variable` and `jetbrains.className` to `<html>`.
   - Place `<SpeedInsights />` inside `<body>` (currently it is between `<html>` and `<LayoutWrapper>`, which is invalid HTML — only `<head>` and `<body>` are valid children of `<html>`).
3. Add a blocking `<script>` injected via `dangerouslySetInnerHTML` in `<head>` that runs BEFORE hydration:
   ```js
   (function(){try{var t=JSON.parse(localStorage.getItem("theme"));var v=t&&t.state&&t.state.theme;if(v==="dark"){document.documentElement.classList.add("dark-theme")}}catch(e){}})()
   ```
   Put `dark-theme` class on `<html>` (not `<body>`), and update `@custom-variant dark-theme` selector in `globals.css` so the variant still matches descendants of `html.dark-theme`. The CSS variable cascade still works because variables live on `:root` / `.dark-theme`.
4. In `useThemeStore.ts`: after `setTheme` toggles, also call `document.documentElement.classList.toggle("dark-theme")` so the DOM and the persisted state stay in sync without requiring a full re-render.
5. Header still calls `useTheme()` to flip the `IconMoon` / `IconSun` glyph — this is fine because the icon swap is below-the-fold-ish and a one-frame mismatch is acceptable. To avoid hydration mismatch warnings, render both icons and toggle visibility via the `dark-theme` variant in Tailwind v4 (no JS needed for icon swap either).

**Why:** This is the single biggest win. Currently the server sends HTML with no `<body>` children rendered for the theme branches — the document body is effectively empty until React hydrates, then renders. That kills LCP, FCP, and TTFB-to-paint. Moving rendering server-side enables streaming SSR for the first time and removes the hydration gate on every visible element.

**Risk:** Medium. Touches root layout. Validate dark theme still toggles, no FOUC, no hydration warnings in console.

**Verification:**
- `pnpm build && pnpm start`, visit `/` in incognito with theme=dark in localStorage — page should render dark immediately, no flash.
- Open DevTools Network tab, throttle Slow 3G — confirm initial HTML contains real page content (View Source should show `<body>` with header/nav/main inside).
- Confirm Lighthouse LCP improves dramatically (likely from >4s to <2s on throttled mobile).

---

### 1.2 Remove `transition-duration: 0.3s` from the universal selector
**File:** `/home/jack/Projects/jack-mechem/src/app/globals.css`

**What changes:** In the `@layer base` block, the `* { transition-duration: 0.3s }` rule applies a transition to every element including layout properties (positions changing on initial render trigger a 300ms transition on first paint). Remove this rule. Apply explicit transitions only where intended (header icon, hover states already have their own).

**Why:** TBT / INP / animation-correctness. A universal transition causes every initially-positioned element to animate from its prior position on first render, and any state-change triggers 300ms of compositing work everywhere. This is also why the `floatingWorkWindow` had to add `transition-none` manually.

**Risk:** Low. Visual regression possible (less smooth hover transitions). The theme color change will no longer fade — if desired, add `transition-colors duration-300` on `<html>` or `<body>` only.

**Verification:** Load `/`, click theme toggle — confirm theme still changes (instantly now). Hover header items — confirm hover styles still apply.

---

### 1.3 Move fonts to root layout (already covered by 1.1 but call out explicitly)
**File:** `/home/jack/Projects/jack-mechem/src/app/(site)/layout.tsx`

**What changes:** Already part of 1.1: `JetBrains_Mono` import moves from the client `layoutWrapper.tsx` (where Next cannot statically inline the preload link or self-host the woff2) to the server `layout.tsx`. Set `display: "swap"` explicitly and a `variable` for future Tailwind v4 `--font-jetbrains` use.

**Why:** FCP, CLS. next/font in a server layout emits `<link rel="preload" as="font" ... crossorigin>` in `<head>` and self-hosts the font (no Google Fonts roundtrip). In a client component it does too, but late in the load and is not always preloaded for the initial document.

**Risk:** Low.

**Verification:** View Source on `/`, confirm `<link rel="preload" as="font" ...>` is present in `<head>`.

---

## Phase 2 — Images

### 2.1 Switch all Contentful images to `next/image`
**Files:**
- `/home/jack/Projects/jack-mechem/next.config.js`
- `/home/jack/Projects/jack-mechem/src/app/(site)/page.tsx`
- `/home/jack/Projects/jack-mechem/src/app/(site)/[slug]/page.tsx`
- `/home/jack/Projects/jack-mechem/src/app/(site)/work/workEntry.tsx`
- `/home/jack/Projects/jack-mechem/src/app/(site)/components/floatingWorkWindow.tsx`
- `/home/jack/Projects/jack-mechem/src/app/(site)/components/header.tsx`

**What changes:**
1. In `next.config.js`: replace the `cdn.sanity.io` remote pattern with `images.ctfassets.net` (the actual Contentful Images API origin — confirmed: the GraphQL queries return `image { url }` from Contentful's CDN, not Sanity. Sanity is dead config).
2. The Contentful GraphQL `image { url }` query returns only the URL — no width/height. Two options: (a) extend the GraphQL fragment in `src/lib/api.ts` to also request `width`, `height`, and update `PageResponse` / `PagesResponse` types in `src/types/contentful.ts` accordingly; (b) use `next/image` with `fill` + a wrapping `<div className="relative aspect-...">` parent. **Prefer (a)** because it gives correct intrinsic dimensions and prevents CLS. Add `width`, `height` to the `Image` inline fragment in `PAGE_QUERY_STRING` and the `photo` selection in `WORK_QUERY_STRING`.
3. Replace every `<img src=... />` with `<Image src={...} width={...} height={...} alt={...} sizes={...} />`.
   - For the homepage hero / first-visible image: add `priority` prop and `fetchPriority="high"`.
   - For work grid images (`workEntry.tsx`): no `priority`, use `sizes="(min-width: 1024px) 50vw, 100vw"`.
   - For `floatingWorkWindow.tsx`: the modal is conditionally mounted, so no priority needed; use `sizes="(min-width: 768px) 600px, 100vw"`.
   - For header logo (`header.tsx`): the logo is currently imported as `Logo` from an SVG via `Logo.src`. SVGs imported this way work as static imports — replace with `import Logo from ".../logo.svg"` + `<Image src={Logo} alt="logo" priority />`. Static imports get auto dimensions.
4. Configure Contentful image transforms via Image's `loader` or pass through with default Next loader (Vercel will optimize on first request). The Contentful CDN supports `?w=&h=&fm=webp&q=` query params natively, but Next's image optimization will handle conversion regardless.

**Why:** LCP. Raw `<img>` ships full-resolution Contentful images uncompressed and unsized. Currently the `globals.css` `img { object-fit: cover; width: auto; height: auto }` rule makes the browser layout-shift on every image as it loads (CLS). `next/image` emits responsive `srcset`, modern formats (AVIF/WebP), lazy-loads by default, and reserves space.

**Risk:** Medium. The `img` base style in globals.css will conflict with `next/image`'s inline styles — remove or scope the `img` rule to `img:not([data-nimg])` or simply delete it. Verify each replaced image visually.

**Verification:**
- `pnpm build` — confirm no images.ctfassets.net error.
- Load `/work` — DevTools Network tab — confirm image responses are `image/webp` or `image/avif` and resized (not 4MB originals).
- Run Lighthouse — confirm CLS = 0.

---

### 2.2 Remove the global `img` rule from globals.css
**File:** `/home/jack/Projects/jack-mechem/src/app/globals.css`

**What changes:** Delete the `img { object-fit: cover; width: auto; height: auto; }` rule in `@layer base`. With `next/image`, this rule is harmful — it fights the component's inline width/height/sizing.

**Why:** CLS, correctness with next/image.

**Risk:** Low after 2.1 completes. Any remaining `<img>` tags will lose their default `object-fit: cover`. Grep first to confirm none remain in app code.

**Verification:** Visual review of `/`, `/work`, `/about` (slug page).

---

## Phase 3 — Bundle (client → server, lazy load heavy)

### 3.1 Convert leaf components to Server Components
**Files:**
- `/home/jack/Projects/jack-mechem/src/app/(site)/components/container.tsx` — remove `"use client"` (no directive currently, but verify it stays server-only; it has no hooks/handlers).
- `/home/jack/Projects/jack-mechem/src/app/(site)/components/separator.tsx` — same; verify server-only.
- `/home/jack/Projects/jack-mechem/src/app/(site)/components/command.tsx` — same; verify server-only.
- `/home/jack/Projects/jack-mechem/src/app/(site)/components/mediumBlock.tsx` — same; verify server-only.
- `/home/jack/Projects/jack-mechem/src/app/(site)/components/Buttons.tsx` — currently exports `LandButton` which accepts `onClick`. The `onClick` is only used (briefly) by `floatingWorkWindow` indirectly; in actual usage in `page.tsx` and `[slug]/page.tsx` the button is wrapped in a `<Link>` and `onClick` is never passed. Drop the `onClick` prop OR split into `LandButton` (server) and `LandButtonInteractive` (client). Prefer dropping `onClick` since no caller uses it.

**What changes:** Confirm none of these files have `"use client"` (they don't), and confirm Buttons.tsx becomes free of any handler prop. Together they should remain in the server graph by virtue of being imported from server pages.

**Why:** Bundle size. These pull into the client bundle today only through the import chain from `LayoutWrapper` (client). Once `LayoutWrapper` is deleted (1.1), the chain breaks and these stay server-only automatically.

**Risk:** Low.

**Verification:** `pnpm build` — confirm First Load JS for `/`, `/about`, `/work` shrinks.

---

### 3.2 Convert `Header` and `Nav` to mostly-server with thin client islands
**Files:**
- `/home/jack/Projects/jack-mechem/src/app/(site)/components/header.tsx`
- `/home/jack/Projects/jack-mechem/src/app/(site)/components/nav.tsx`

**What changes:**
1. `header.tsx`: Split into `Header.tsx` (server: renders logo + HIRE ME link + theme toggle slot) and `ThemeToggle.tsx` (client: the moon/sun icon button only). The server part renders Link/img/h4 statically. The toggle reads `useTheme` / `useSetTheme`. Per 1.1, render both icons and use the `dark-theme:` Tailwind variant to swap visibility — that eliminates the need for `useTheme()` entirely in the toggle (only `useSetTheme()`). Even better: use a plain `<button onClick={() => document.documentElement.classList.toggle('dark-theme'); /* + localStorage write */}>` and skip zustand for this UI bit.
2. `nav.tsx`: Split into `Nav.tsx` (server: renders the static nav links and shell) and `NavClock.tsx` (client: the `setInterval` clock display only). The pathname-based active state currently uses `usePathname()` + `useRouter().push()` — replace with `<Link href=...>` + `usePathname()` in a single small client component `NavLinks.tsx`. The static surrounding chrome stays server. The `setInterval` runs every 1s and updates state — that triggers a re-render of the entire `Nav` tree every second; isolating it into `NavClock` stops that ripple.
3. Also: in `nav.tsx` the `setInterval` is never cleared (`useEffect` with empty deps starts an interval but the cleanup is missing). Add the cleanup.

**Why:** TBT, bundle. Header + Nav are on every page. Currently every Link/h4/img in them is in the client bundle. Reducing the client surface to one button + one clock + one pathname-aware link group cuts a meaningful chunk of First Load JS.

**Risk:** Medium. Easy to break the active-state styling. Visually verify each route.

**Verification:** `pnpm build`, compare First Load JS. Visit each route, confirm active-state highlighting works.

---

### 3.3 Lazy-load `FloatingWorkWindow` via `next/dynamic`
**File:** `/home/jack/Projects/jack-mechem/src/app/(site)/work/workEntry.tsx`

**What changes:** Replace `import FloatingWorkWindow from "../components/floatingWorkWindow";` with:
```ts
import dynamic from "next/dynamic";
const FloatingWorkWindow = dynamic(() => import("../components/floatingWorkWindow"), { ssr: false });
```
Additionally, only render `<FloatingWorkWindow>` when `sidebarState.isComponentVisible` is true — currently it's always mounted with `className="hidden"`. Mounting on demand prevents the Draggable + Markdown JS from being parsed at all until the user clicks a work card.

**Why:** Bundle, TBT. `react-draggable` (+ refs, drag math) and `react-markdown` (+ remark + micromark) together are ~30–50 KB gzipped. Today they ship on every `/work` page load even though the modal is hidden.

**Risk:** Low. Confirm the open/close click handler still works (the ref pattern requires the modal to be mounted to attach `useComponentVisible`'s outside-click ref — verify the `sideBarState` indirection still works when the component is conditionally mounted; if the ref is needed externally, hoist mounting decision but keep dynamic import).

**Verification:** `pnpm build` — confirm `/work` First Load JS drops. Network tab: visit `/work`, confirm no chunk containing `react-draggable` or `react-markdown` loads until you click a card.

---

### 3.4 Make `<Markdown>` content server-rendered on `/` and `/[slug]`
**Files:**
- `/home/jack/Projects/jack-mechem/src/app/(site)/page.tsx`
- `/home/jack/Projects/jack-mechem/src/app/(site)/[slug]/page.tsx`

**What changes:** `react-markdown` works fine in a Server Component (no `"use client"` needed). The current pages are already server components — confirm Markdown renders server-side by running `pnpm build` and checking that View Source on the production HTML contains the rendered `<p>`/`<h3>` from markdown (not the raw markdown text). If the page builds with `react-markdown` in a server component, no change needed. If there's an error, wrap each `<Markdown>` usage in a tiny client component file. **Most likely** it already works server-side, so the markdown content stays out of the client bundle entirely.

**Why:** Bundle, FCP. If markdown can render server-side, ~25 KB gz disappears from the home page bundle.

**Risk:** Low. Just verify build succeeds and HTML is server-rendered.

**Verification:** `pnpm build && pnpm start`, `curl http://localhost:3000/ | grep -i '<p>'` — confirm body text from CMS is in the HTML.

---

### 3.5 Drop `zustand` for theme (replace with a tiny `useSyncExternalStore` hook or eliminate)
**File:** `/home/jack/Projects/jack-mechem/src/stores/useThemeStore.ts`

**What changes:** Theme is a single boolean. Replace zustand + `persist` + `devtools` middleware with a ~15-line custom hook using `useSyncExternalStore` that reads/writes `document.documentElement.classList` directly and persists to `localStorage` under key `"theme"`. The no-flash script in 1.1 already writes the class on initial load.

Alternatively: keep zustand only if other state will be added soon. For one bool, zustand + middleware is ~5–8 KB gz of pure overhead.

**Why:** Bundle. Removes zustand+middleware from every page that includes the theme toggle (i.e., every page).

**Risk:** Low/medium. Touches the only state store. Header's theme toggle is the only consumer.

**Verification:** `pnpm build`, confirm First Load JS drops by another 3–6 KB; theme toggle still works and persists across reload.

---

## Phase 4 — Data fetching

### 4.1 Strip request-time `console.log` from `src/lib/api.ts` and pages
**Files:**
- `/home/jack/Projects/jack-mechem/src/lib/api.ts` (lines 142, 154)
- `/home/jack/Projects/jack-mechem/src/app/(site)/[slug]/page.tsx` (lines 40–48 — `console.log` inside the render loop, runs on EVERY row for EVERY block)
- `/home/jack/Projects/jack-mechem/src/app/api/email/route.ts` (lines 29–30)

**What changes:** Remove the active `console.log` calls. The two in `[slug]/page.tsx` are inside `.map()` and run during SSR for every render — they bloat logs and add measurable overhead on cold serverless invocations.

**Why:** TTFB (especially for `[slug]` pages on serverless), log noise, observability cost.

**Risk:** None.

**Verification:** `pnpm build` succeeds; no `console.log` output in `next start` server logs when visiting pages.

---

### 4.2 Increase revalidate window and align with content cadence
**File:** `/home/jack/Projects/jack-mechem/src/lib/api.ts`

**What changes:** Current `revalidate: 3600` (1 hour) — for a portfolio that changes weekly at most, raise to `86400` (24 hours) or use `false` (cache forever, rely on `revalidateTag("pages")` from a Contentful webhook). The tag is already in place (`tags: ["pages"]`), so add a webhook later — for now bump to 86400. The pages are also statically generated via `generateStaticParams`, so the practical effect is that ISR re-renders happen less often.

**Why:** TTFB on revalidation misses, Vercel function invocation cost. With `next: { tags: ["pages"] }` already set, revalidate-on-demand via a Contentful webhook would be ideal but is out of scope here.

**Risk:** None (content lag of up to 24h until manual `revalidateTag`).

**Verification:** `pnpm build` shows pages as ISR with the new revalidate value.

---

### 4.3 Fix typing on `getAllWorks` / `getWork` (currently `Promise<any>`)
**File:** `/home/jack/Projects/jack-mechem/src/lib/api.ts`

**What changes:** Add proper response types to `src/types/contentful.ts` for Work + WorkCategory and use them. Also `getWork` has a bug: it returns `page.data.pageCollection.items[0]` but the query is `workCollection` — fix to `page.data.workCollection.items[0]`. (Not a perf bug but fix while touching the file.)

**Why:** Correctness; enables better tree-shaking and dead-code elimination by the compiler when types are known.

**Risk:** Low.

**Verification:** `pnpm build` typecheck passes; `/work` still loads.

---

## Phase 5 — Cleanup (small wins, low risk)

### 5.1 Delete unused files
**Files (delete each):**
- `/home/jack/Projects/jack-mechem/src/app/(site)/components/headerOLD.tsx` — confirmed: zero imports anywhere in `/src`. References stale theme tokens (`colors.border`, `colors.accent`) that don't exist in the Tailwind v4 `@theme` block.
- `/home/jack/Projects/jack-mechem/src/app/(site)/components/wip.tsx` — confirmed: zero imports. Uses default Tailwind palette (`text-yellow-200`, `bg-gray-100`, etc.) and `BsGithub` from `react-icons`.
- `/home/jack/Projects/jack-mechem/src/app/(site)/components/mobileNav.tsx` — confirmed: zero imports (mobile nav is implemented inline inside `nav.tsx`).

**Why:** Bundle, repo hygiene. Removing `wip.tsx`, `mobileNav.tsx`, `headerOLD.tsx` eliminates ALL usage of `react-icons`, which can then be removed from `package.json`. `react-icons` is a sizable dependency even with tree-shaking.

**Risk:** None — confirmed unused via grep.

**Verification:** `pnpm build` succeeds. `grep -r "react-icons" /home/jack/Projects/jack-mechem/src` returns nothing. Then `pnpm remove react-icons`.

---

### 5.2 Remove dead `cdn.sanity.io` remotePattern
**File:** `/home/jack/Projects/jack-mechem/next.config.js`

**What changes:** Already covered in 2.1 (replace with `images.ctfassets.net`).

**Why:** Correctness.

---

### 5.3 Tighten `serverExternalPackages` config
**File:** `/home/jack/Projects/jack-mechem/next.config.js`

**What changes:** Current config lists `"resend/dist/index.mjs"` and `"resend"` — the path-suffixed entry is unnecessary, the package name alone covers it. Same for `@react-email/components` / `@react-email/render` (both already listed correctly). Slim to `["@react-email/components", "@react-email/render", "resend"]`.

**Why:** Config hygiene, prevents bundler confusion.

**Risk:** None.

**Verification:** `pnpm build` succeeds, `/api/email` POST still works.

---

### 5.4 Add `experimental.optimizePackageImports` for tabler icons
**File:** `/home/jack/Projects/jack-mechem/next.config.js`

**What changes:** Add:
```js
experimental: { optimizePackageImports: ["@tabler/icons-react"] }
```
This is Next.js's documented optimization for named icon imports — it transforms barrel imports into deep per-icon imports at build time, even though Tabler is `sideEffects: false`. Belt-and-suspenders.

**Why:** Bundle. Verified Tabler has `sideEffects: false` so tree-shaking already works in principle, but `optimizePackageImports` ensures it does in practice across both Turbopack and Webpack.

**Risk:** None.

**Verification:** `pnpm build`, check `/work` and `/` bundles shrink slightly.

---

### 5.5 Remove dev-only zustand `devtools` middleware in production
**File:** `/home/jack/Projects/jack-mechem/src/stores/useThemeStore.ts`

**What changes:** If zustand is kept (skipped 3.5), wrap `devtools` to only apply in development:
```ts
const wrap = process.env.NODE_ENV === "development" ? devtools : (s: any) => s;
```
or just drop `devtools` entirely.

**Why:** Bundle. `devtools` middleware adds non-trivial code.

**Risk:** None.

**Verification:** Theme toggle still works.

---

### 5.6 Fix nav.tsx interval leak (covered in 3.2)
Already addressed in 3.2: add `clearInterval` cleanup.

---

### 5.7 Static metadata polish
**File:** `/home/jack/Projects/jack-mechem/src/app/(site)/layout.tsx`

**What changes:** Add to `metadata`:
- `metadataBase: new URL("https://jackmechem.dev")`
- `openGraph` and `twitter` cards (with image)
- `themeColor` for browser chrome
- `viewport: { width: "device-width", initialScale: 1 }` (Next 14+ moved this out of metadata into a separate `export const viewport`)

**Why:** SEO / sharing perf signals (PageSpeed checks meta). Not a perf metric directly but Lighthouse SEO score impacts.

**Risk:** None.

**Verification:** `pnpm build`, View Source on `/`, confirm meta tags present.

---

## Execution order recap (single linear list)

1. Baseline `pnpm build`, save route table.
2. Phase 1: 1.1 → 1.2 → 1.3 (1.3 is part of 1.1 commit).
3. `pnpm build` — verify gains, manual smoke test `/`, `/work`, `/about` (a slug), theme toggle.
4. Phase 5 first half: 5.1 (delete unused files), 5.3 (config), then `pnpm remove react-icons`.
5. Phase 2: 2.1 → 2.2.
6. `pnpm build` — verify image migration. Lighthouse run.
7. Phase 3: 3.1 → 3.2 → 3.3 → 3.4 (verify), 3.5 (decision point).
8. `pnpm build` — verify bundle drops.
9. Phase 4: 4.1 → 4.2 → 4.3.
10. Phase 5 rest: 5.4, 5.5, 5.7.
11. Final `pnpm build` + Lighthouse. Compare against baseline.
