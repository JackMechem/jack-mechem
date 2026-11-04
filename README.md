# jackmechem.dev

My portfolio: projects presented as vinyl records in milk crates, plus my gigs and live clips.

**Live:** [jackmechem.dev](https://www.jackmechem.dev) · **Admin:** [jackmechem.dev/admin](https://www.jackmechem.dev/admin)

Built with **Next.js 16** (App Router, React 19) and plain CSS. Content lives in **Convex** and is edited in a password-protected admin panel. Hosted on **Vercel**.

---

## Contents

- [Everyday tasks](#everyday-tasks)
- [Running it locally](#running-it-locally)
- [How it works](#how-it-works)
- [Project structure](#project-structure)
- [Styling](#styling)
- [Data model](#data-model)
- [Environment variables](#environment-variables)
- [Deploying](#deploying)
- [Scripts](#scripts)
- [Troubleshooting](#troubleshooting)

---

## Everyday tasks

Most changes don't need any code: sign in at `/admin`.

| I want to… | Do this |
|---|---|
| **Add, edit or remove a gig** | `/admin` (the Gigs tab). Past gigs disappear from the site automatically. |
| **Add a project** | `/admin/projects` → **+ New project**. Fill in the card, pick a crate, write the case study in Markdown (there's a live preview), tick **Published**, save. Its page `/work/<slug>` exists straight away. |
| **Edit a project / write-up** | `/admin/projects` → **Edit**. |
| **Reorder projects or crates** | ↑ / ↓ on `/admin/projects`. The first three projects (across all crates, in order) are the hero's *Featured records*. |
| **Add a category (crate)** | `/admin/projects` → the "New crate name" box at the bottom. Crates can only be deleted once they're empty. |
| **Add a project screenshot** | Put the image in `public/projects/`, then type its path (e.g. `/projects/my-app.png`) into the editor. Extra screenshots go in **More screenshots** (`/projects/x.png \| caption`, one per line); the case study shows them all in a viewer, main image first. Uploading straight from the editor also works if Vercel Blob is set up (see [Environment variables](#environment-variables)). |
| **Add a video to the Archive** | Put the MP4 in `public/clips/` (keep it short, 720p), then on `/admin/clips` type its path (e.g. `/clips/my-gig.mp4`), title, detail and "Filmed by". Commit and push so the file reaches the live site. |
| **Change the bio, skills, CV entries, hero text, links** | Edit `src/content/site.ts`, then push. |
| **Change the logo / favicon / share image** | Edit the sources in `scripts/brand/`, run `pnpm icons`, then push. |

Saving anything in `/admin` updates the live site immediately, with no redeploy.

---

## Running it locally

You need Node 22+ and pnpm.

```sh
pnpm install
pnpm convex      # terminal 1: runs the Convex dev deployment and keeps functions in sync
pnpm dev         # terminal 2: the site at http://localhost:3000
```

The first `pnpm convex` asks you to log in to Convex and pick the project (`jack-mechem`). It writes `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` to `.env.local`. Add the admin variables from [Environment variables](#environment-variables) to `.env.local` too.

Before pushing, run:

```sh
pnpm check       # TypeScript (site + Convex) and ESLint
pnpm build       # optional: a full production build
```

---

## How it works

```
                       ┌────────────────────────── Next.js (Vercel) ──────────────────────────┐
  visitor ──────────▶  │  pages (app/(site))  ──▶  lib/content.ts  ──(HTTP, cached 1h)──┐     │
                       │                                                                │     │
  you at /admin ────▶  │  admin pages ──▶ server actions (app/admin/_actions) ──────────┼──┐  │
                       └────────────────────────────────────────────────────────────────┼──┼──┘
                                                                                        ▼  ▼
                                                      Convex: queries (public) · mutations (need ADMIN_SECRET)
```

- **Reading.** Pages call the functions in `src/lib/content.ts`, which run Convex's *public* queries over HTTP. Next.js caches the results for an hour under a tag (`projects`, `clips`, `gigs`). If Convex is down during a refresh, the last good page keeps being served.
- **Writing.** The admin forms call server actions in `src/app/admin/_actions/`. Those run on the server and call Convex mutations with `ADMIN_SECRET`. Each mutation checks that secret, so nothing from the browser can change data. After a save, the action clears the matching cache tag, so the public site updates immediately.
- **Signing in.** `/admin` has a single password (`ADMIN_PASSWORD`). Signing in sets a signed, httpOnly cookie (see `src/lib/auth.ts`). There are no user accounts.
- **Files.** Images and videos are served from `public/`. Optional uploads from the admin go to Vercel Blob instead (`src/app/admin/upload/route.ts`).
- **Static pages.** The home page, case studies and CV are pre-rendered and re-rendered at least hourly. New projects get pages on first visit (no rebuild needed). Drafts return 404.

---

## Project structure

```
convex/                     Database: schema + functions (deployed to Convex, not Vercel)
  schema.ts                   tables: projects, crates, clips, gigs
  projects.ts crates.ts       queries (public) + mutations (admin, need the secret)
  clips.ts gigs.ts
  helpers.ts                  admin check, input validation, ordering (↑/↓)
  _generated/                 generated by Convex; don't edit

src/
  app/                      Routes (Next.js App Router)
    layout.tsx                root: fonts, global styles, metadata, theme script
    (site)/                   public pages, sharing the top bar + footer (layout.tsx)
      page.tsx                  home: one section per component in components/home
      work/[slug]/page.tsx      a case study
      cv/page.tsx               printable CV
    admin/                    the admin panel
      layout.tsx                sign-in gate + tabs
      page.tsx                  Gigs        clips/page.tsx   Clips
      projects/page.tsx         Projects    projects/[id]/   project editor
      upload/route.ts           Vercel Blob upload token (optional)
      _actions/                 server actions, one file per area (+ shared.ts helpers)
      _components/              admin forms and list controls
      _lib/upload.ts            browser-side upload helpers
    icon.svg favicon.ico apple-icon.png opengraph-image.png manifest.ts   generated icons + share image

  components/
    layout/                   TopBar, ThemeToggle, RecordMark (logo), SectionHead
    records/                  the record pieces: Cover (sleeve), RecordLabel, Turntable,
                                Tracklist, CrateIcon, RecordPreview (gatefold overlay)
    home/                     one component per home section: Hero, FeaturedRecords,
                                CrateBrowser, GigList, ClipPlayer, About, Contact,
                                plus CopyEmail
    case-study/               ScreenshotViewer (screenshots + full-screen zoom)
    cv/                       PrintButton

  content/site.ts           copy and details that rarely change (bio, skills, CV, links)
  hooks/                    useCrateGestures (crate wheel + swipe), useActiveSection
                              (top-bar highlight), useSwipe (screenshot viewer)
  lib/
    content.ts                reading content from Convex (cached)
    auth.ts                   admin session (password + signed cookie)
    convex-admin.ts           server-side Convex client + admin secret
    types.ts                  Project, Clip, Gig… (derived from the Convex schema)
    format.ts                 dates, pad2, fitStyle (fit long titles)
    theme.ts wheel.ts         small shared constants / helpers
  styles/                   all CSS: one file per area, imported by index.css

public/                     files served as-is: headshot, clips/, projects/ screenshots, app icons
scripts/                    one-off tools (see Scripts)
```

**Conventions**

- Every file starts with a short comment saying what it is and where it's used.
- Components are server components unless they need the browser (state, effects, event listeners). Those start with `"use client"`.
- Imports use aliases: `@/…` is `src/…`, and `@convex/…` is `convex/…`.
- Folders starting with `_` inside `app/` are private: they hold code for that route, not routes themselves.

---

## Styling

Plain CSS, no framework. Everything is in `src/styles/`, one file per area, all imported by `src/styles/index.css`:

| File | Covers |
|---|---|
| `base.css` | design tokens, element defaults, utilities (`.cap`, `.btn`, `.fit`, `.halftone`, `.grain`, `.eq`) |
| `layout.css` | top bar, `.section` / `.section-head`, footer |
| `records.css` | sleeve covers, records and labels, tracklists (shared) |
| `hero.css` · `crate.css` · `music.css` · `about.css` | the home page sections |
| `gatefold.css` | the record preview overlay |
| `case-study.css` · `viewer.css` · `cv.css` · `admin.css` | the other pages (`viewer.css`: case-study screenshots) |

- **Class names are prefixed by area** (`.crate-…`, `.gatefold-…`, `.case-…`, `.admin-…`). To find a rule, search for the prefix.
- **Two colours only:** `--paper` and `--ink`. Dark mode (the default) swaps them via `<html data-theme>`. Always use the variables, never hard-coded colours, so both themes keep working.
- **Fonts:** Instrument Sans everywhere, loaded in `app/layout.tsx`. Titles (`--display`) use its condensed width: every title rule sets `font-stretch: var(--display-stretch)`, so add that line to any new title style. `--dw` (in `base.css`) scales the fluid title sizes to the face's width; if you change fonts, set it to the new face's width relative to the old one.
- **Long titles:** add `className="fit"` and `style={fitStyle(text)}` (`lib/format.ts`). The text then shrinks to fit its column. Its container needs `container-type: inline-size` and the element sets `--fit-max`.
- **Breakpoints:** `980px` (desktop ↔ tablet/phone layout) and `760px` (phone). The crate and archive fill exactly one screen on desktops above 981×640.
- **Motion:** every animation respects `prefers-reduced-motion`.

---

## Data model

Defined in `convex/schema.ts`. TypeScript types for the site come from it automatically (`src/lib/types.ts`).

| Table | What it holds | Key fields |
|---|---|---|
| `projects` | the records and their case studies | `slug` (URL), `name`, `cat` (catalogue no.), `years`, `kind`, `stack[]`, `summary`, `image`, `imageNote`, `gallery[]`, `sideA[]`, `sideB[]`, `links[]`, `body` (Markdown), `published`, `crate`, `order` |
| `crates` | categories (the divider tabs) | `name`, `order` |
| `clips` | Archive videos | `src`, `poster`, `title`, `detail`, `alt`, `credit`, `creditUrl`, `order` |
| `gigs` | upcoming shows | `date` (YYYY-MM-DD), `time`, `act`, `venue`, `city`, `url` |

To change a table: edit `convex/schema.ts` (and the matching validator in that table's file). `pnpm convex` applies it to development; `npx convex deploy` applies it to production (see below).

---

## Environment variables

Locally in `.env.local`; in production, in Vercel → Project → Settings → Environment Variables.

| Variable | Needed by | What it is |
|---|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | the site | the Convex deployment URL. Written locally by `pnpm convex`; in Vercel it's the **production** URL |
| `ADMIN_SECRET` | the site **and** Convex | a long random string that authorises admin writes. Must be identical in both places: `npx convex env set ADMIN_SECRET …` (add `--prod` for production) |
| `ADMIN_PASSWORD` | the site | the `/admin` password |
| `SESSION_SECRET` | the site | 32+ random characters; signs the admin cookie |
| `BLOB_READ_WRITE_TOKEN` | the site (optional) | only for uploading files from the admin. Create a Blob store in Vercel → Storage and connect it to the project. Locally, copy the token from the store's `.env.local` tab |
| `CONVEX_DEPLOYMENT` | Convex CLI | written by `pnpm convex`; local only |

Generate a secret with:

```sh
node -e 'console.log(require("crypto").randomBytes(32).toString("hex"))'
```

---

## Deploying

- **The site** deploys automatically when you push to `main` (Vercel). The build needs the environment variables above.
- **Convex functions and schema** deploy separately. After changing anything in `convex/`, run:

  ```sh
  npx convex deploy
  ```

  To automate that, add `CONVEX_DEPLOY_KEY` (Convex dashboard → production → Settings) to Vercel and set Vercel's build command to `npx convex deploy --cmd 'pnpm build'`.

Content edits made in `/admin` need no deploy at all.

---

## Scripts

`package.json`:

| Command | Does |
|---|---|
| `pnpm dev` | runs the site locally |
| `pnpm convex` | runs the Convex dev deployment (keeps `convex/` in sync) |
| `pnpm build` / `pnpm start` | production build / serve it |
| `pnpm check` | typecheck (site + Convex) and lint |
| `pnpm icons` | regenerates favicon, app icons and the share image from `scripts/brand/` |
| `pnpm seed` | imports `scripts/seed-data.json` into Convex (for a fresh deployment) |

`scripts/`:

- `seed.mjs` and `seed-data.json`: a snapshot of the crates, projects and first clip, used to fill an empty deployment. It's safe to re-run: existing items are kept.
- `update-projects.mjs`: bulk-update projects from a JSON file or a folder of Markdown write-ups.
- `brand/`: the logo (`mark.svg`), app icon (`record.html`) and share image (`og.html`) templates, plus `render.sh`, which renders them (needs Chromium).

Scripts write straight to Convex, so the site's cache doesn't know about their changes. The live site picks them up within an hour, or immediately after you save anything in `/admin`.

---

## Troubleshooting

- **The admin says "Couldn't reach Convex".** Locally, check `pnpm convex` is running. In production, check that `NEXT_PUBLIC_CONVEX_URL` and `ADMIN_SECRET` in Vercel match the production Convex deployment.
- **"Unauthorized" when saving.** `ADMIN_SECRET` differs between the site and Convex. Set the same value in both.
- **A change I made with a script doesn't show up.** That's the hour-long cache. Save anything in `/admin` to refresh it.
- **The Vercel build fails at "Generating static pages".** The build reads from Convex, so it needs `NEXT_PUBLIC_CONVEX_URL`.
- **An uploaded file fails with "Uploads need Vercel Blob".** Set `BLOB_READ_WRITE_TOKEN`, or put the file in `public/` and use its path instead.
- **A new project doesn't appear.** Check it's ticked **Published**, and that it's in a crate (if not, it shows under "Other").
