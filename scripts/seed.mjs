// Imports the crates, projects and clip in seed-data.json into Convex.
// Safe to re-run: existing crates (by name) and projects (by slug) are kept, projects
// that aren't in a crate yet get filed into theirs, and clips only import into an
// empty table.
//
//   node --env-file=.env.local scripts/seed.mjs
//   (for production: NEXT_PUBLIC_CONVEX_URL=<prod url> ADMIN_SECRET=<prod secret> node scripts/seed.mjs)
import { readFileSync } from "node:fs";
import { ConvexHttpClient } from "convex/browser";
import { anyApi as api } from "convex/server";

const { NEXT_PUBLIC_CONVEX_URL: url, ADMIN_SECRET: secret } = process.env;
if (!url || !secret) throw new Error("Set NEXT_PUBLIC_CONVEX_URL and ADMIN_SECRET");

const client = new ConvexHttpClient(url);
const data = JSON.parse(readFileSync(new URL("./seed-data.json", import.meta.url), "utf8"));

// crates
const crateIds = Object.fromEntries((await client.query(api.crates.list, {})).map((c) => [c.name, c._id]));
let newCrates = 0;
for (const name of data.crates ?? []) {
  if (!crateIds[name]) {
    crateIds[name] = await client.mutation(api.crates.create, { secret, name });
    newCrates++;
  }
}
console.log(`crates: created ${newCrates}`);

// projects
const existing = new Map((await client.query(api.projects.all, { secret })).map((p) => [p.slug, p]));
let created = 0;
let filed = 0;
for (const { crate, ...p } of data.projects) {
  const crateId = crate ? crateIds[crate] : undefined;
  const have = existing.get(p.slug);
  if (!have) {
    await client.mutation(api.projects.create, { secret, ...p, ...(crateId && { crate: crateId }) });
    created++;
  } else if (!have.crate && crateId) {
    await client.mutation(api.projects.assignCrate, { secret, slug: p.slug, crate: crateId });
    filed++;
  }
}
console.log(`projects: created ${created}, filed ${filed} into crates, ${existing.size} already there`);

// clips
const clips = await client.query(api.clips.list, {});
if (clips.length) console.log(`clips: ${clips.length} already there, skipping`);
else {
  for (const c of data.clips) await client.mutation(api.clips.create, { secret, ...c });
  console.log(`clips: imported ${data.clips.length}`);
}
console.log("The site picks this up within an hour. To see it now, save anything in /admin.");
