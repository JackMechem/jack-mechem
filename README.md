## jackmechem.dev

Production: [jackmechem.dev](https://www.jackmechem.dev)

Next.js 16 (App Router) with plain CSS. Content lives in Convex, uploads in Vercel Blob, and everything is edited at `/admin`.

### Content

| What | Where |
|---|---|
| Projects, grouped into crates (categories) | `/admin/projects` → Convex `crates` + `projects` tables |
| Live clips | `/admin/clips` → Convex `clips` table, files in Vercel Blob |
| Gigs | `/admin` → Convex `gigs` table |
| Bio, experience, skills, links | `src/content/site.ts` |
| CV page (`/cv`) | Experience, music and education in `src/content/site.ts`; projects come from Convex |

Project write-ups are Markdown (GitHub-flavoured), with a live preview in the editor. Drafts are hidden from the site. New projects get a page at `/work/<slug>` immediately, without a redeploy.

The public pages read Convex server-side and cache for an hour. Saving anything in `/admin` refreshes the affected pages straight away. If Convex can't be reached during a refresh, Next keeps serving the last good version of the page.

Files uploaded through `/admin` go from the browser straight to Vercel Blob. Files already in `public/` (the original clip and screenshots) keep working, so only new uploads need Blob.

### Setup

```sh
pnpm install
npx convex dev                                   # log in and create/link the project; keeps running
node --env-file=.env.local scripts/seed.mjs     # first time only: imports the original projects + clip
pnpm dev
```

Environment variables (`.env.local` locally, Vercel project settings in production):

| Variable | Where | Notes |
|---|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | Next.js | written by `npx convex dev` |
| `ADMIN_PASSWORD` | Next.js | your admin login |
| `SESSION_SECRET` | Next.js | 32+ random characters; signs the admin cookie |
| `ADMIN_SECRET` | Next.js **and** Convex | random; set the Convex side with `npx convex env set ADMIN_SECRET …` (add `--prod` for production) |
| `BLOB_READ_WRITE_TOKEN` | Next.js | Vercel → Storage → create a Blob store and connect it to the project (this sets it in Vercel). Locally, copy it from the store's `.env.local` tab. Don't use `vercel env pull .env.local`, which replaces the whole file. |

Generate secrets with `node -e 'console.log(require("crypto").randomBytes(32).toString("hex"))'`.

Vercel Blob on the Hobby plan includes 1 GB of storage and 10 GB of transfer per month. Going over pauses Blob until the next month; it never bills you. Shorter, compressed clips (720p MP4) go much further.

### Deploying

On Vercel, set the build command to `npx convex deploy --cmd 'pnpm build'` and add `CONVEX_DEPLOY_KEY` (from the Convex dashboard) along with the variables above. After the first production deploy, seed it once:

```sh
NEXT_PUBLIC_CONVEX_URL=<prod url> ADMIN_SECRET=<prod secret> node scripts/seed.mjs
```

After that, `scripts/seed-data.json` can be deleted.
