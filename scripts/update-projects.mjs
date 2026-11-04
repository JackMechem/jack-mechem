// Merges changes into existing projects (matched by slug) in Convex and in seed-data.json.
//
//   node --env-file=.env.local scripts/update-projects.mjs <changes.json>
//   node --env-file=.env.local scripts/update-projects.mjs --writeups scripts/writeups
//
// <changes.json> is { "<slug>": { image?, imageNote?, links?, summary?, sideA?, ... } }.
// --writeups reads <slug>.md (the write-up body) and optional <slug>.json (card changes).
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { ConvexHttpClient } from "convex/browser";
import { anyApi as api } from "convex/server";

const { NEXT_PUBLIC_CONVEX_URL: url, ADMIN_SECRET: secret } = process.env;
if (!url || !secret) throw new Error("Set NEXT_PUBLIC_CONVEX_URL and ADMIN_SECRET");

let changes = {};
if (process.argv[2] === "--writeups") {
  const dir = process.argv[3];
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const slug = f.slice(0, -3);
    const extra = existsSync(join(dir, `${slug}.json`)) ? JSON.parse(readFileSync(join(dir, `${slug}.json`), "utf8")) : {};
    changes[slug] = { ...extra, body: readFileSync(join(dir, f), "utf8").trim() + "\n" };
  }
} else changes = JSON.parse(readFileSync(process.argv[2], "utf8"));

const EDITABLE = ["slug", "name", "cat", "years", "kind", "stack", "summary", "image", "imageNote", "gallery", "sideA", "sideB", "links", "body", "published", "crate"];
const client = new ConvexHttpClient(url);
const all = await client.query(api.projects.all, { secret });
for (const [slug, patch] of Object.entries(changes)) {
  const p = all.find((x) => x.slug === slug);
  if (!p) { console.log(`skip ${slug}: not in Convex`); continue; }
  const next = Object.fromEntries(EDITABLE.filter((k) => p[k] !== undefined || patch[k] !== undefined).map((k) => [k, patch[k] ?? p[k]]));
  await client.mutation(api.projects.update, { secret, id: p._id, ...next });
  console.log(`updated ${slug}: ${Object.keys(patch).join(", ")}`);
}

// keep the seed file in step so a fresh Convex deployment gets the same content
const seedPath = new URL("./seed-data.json", import.meta.url);
const seed = JSON.parse(readFileSync(seedPath, "utf8"));
for (const p of seed.projects) if (changes[p.slug]) Object.assign(p, changes[p.slug]);
writeFileSync(seedPath, JSON.stringify(seed, null, 2) + "\n");
console.log("The site picks this up within an hour. To see it now, save anything in /admin.");
