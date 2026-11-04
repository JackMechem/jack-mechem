/**
 * Projects: the records in the crates, their case-study write-ups and
 * screenshots. Edited at /admin/projects. Drafts (published: false) are
 * hidden from the public queries.
 */
import { ConvexError, v } from "convex/values";
import { mutation, query, type MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { assertAdmin, direction, moveInOrder, nextOrder, text, url } from "./helpers";

const fields = {
  slug: v.string(),
  name: v.string(),
  cat: v.string(),
  years: v.string(),
  kind: v.string(),
  stack: v.array(v.string()),
  summary: v.string(),
  image: v.optional(v.string()),
  imageNote: v.optional(v.string()),
  gallery: v.optional(v.array(v.object({ src: v.string(), caption: v.optional(v.string()) }))),
  sideA: v.array(v.string()),
  sideB: v.array(v.string()),
  links: v.array(v.object({ label: v.string(), href: v.string() })),
  body: v.string(),
  published: v.boolean(),
  crate: v.optional(v.id("crates")),
};

type Input = {
  slug: string; name: string; cat: string; years: string; kind: string; stack: string[]; summary: string;
  image?: string; imageNote?: string; gallery?: { src: string; caption?: string }[]; sideA: string[]; sideB: string[];
  links: { label: string; href: string }[]; body: string; published: boolean; crate?: Id<"crates">;
};

/** A list field (stack, Side A / B): trimmed, no blanks, a sensible length. */
const list = (items: string[], field: string, max = 12) => {
  const out = items.map((s) => s.trim()).filter(Boolean);
  if (out.length > max) throw new ConvexError(`${field}: at most ${max} items`);
  out.forEach((s) => text(s, field, { max: 120 }));
  return out;
};

/** Validate and tidy a project from the editor. */
function clean(p: Input): Input {
  const slug = p.slug.trim().toLowerCase();
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) throw new ConvexError("Slug must be lowercase letters, numbers and dashes, e.g. open-stomp");
  return {
    slug,
    name: text(p.name, "Name", { required: true, max: 60 })!,
    cat: text(p.cat, "Catalogue number", { required: true, max: 20 })!,
    years: text(p.years, "Years", { required: true, max: 30 })!,
    kind: text(p.kind, "Kind", { required: true, max: 100 })!,
    stack: list(p.stack, "Stack"),
    summary: text(p.summary, "Summary", { required: true, max: 600 })!,
    image: url(p.image, "Screenshot"),
    imageNote: text(p.imageNote, "Screenshot caption", { max: 160 }),
    gallery: (p.gallery ?? []).slice(0, 12).map((g) => ({ src: url(g.src, "Gallery image", true)!, caption: text(g.caption, "Gallery caption", { max: 160 }) })),
    sideA: list(p.sideA, "Side A"),
    sideB: list(p.sideB, "Side B"),
    links: p.links.slice(0, 8).map((l) => ({ label: text(l.label, "Link label", { required: true, max: 60 })!, href: url(l.href, "Link URL", true)! })),
    body: text(p.body, "Write-up", { max: 60000 }) ?? "",
    published: p.published,
    crate: p.crate,
  };
}

/** Slugs are the /work/<slug> URL, so they must be unique. */
async function assertSlugFree(ctx: MutationCtx, slug: string, self?: Id<"projects">) {
  const other = await ctx.db.query("projects").withIndex("by_slug", (q) => q.eq("slug", slug)).unique();
  if (other && other._id !== self) throw new ConvexError(`Another project already uses the slug "${slug}"`);
}

/** Public: published projects in crate order, without the write-up. */
export const published = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("projects").withIndex("by_order").order("asc").take(100);
    return all.filter((p) => p.published).map(({ body: _body, ...meta }) => meta);
  },
});

/** Public: one published project with its write-up. */
export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const p = await ctx.db.query("projects").withIndex("by_slug", (q) => q.eq("slug", slug)).unique();
    return p?.published ? p : null;
  },
});

export const all = query({
  args: { secret: v.string() },
  handler: async (ctx, { secret }) => {
    assertAdmin(secret);
    return await ctx.db.query("projects").withIndex("by_order").order("asc").take(100);
  },
});

export const get = query({
  args: { secret: v.string(), id: v.id("projects") },
  handler: async (ctx, { secret, id }) => {
    assertAdmin(secret);
    return await ctx.db.get(id);
  },
});

export const create = mutation({
  args: { secret: v.string(), ...fields },
  handler: async (ctx, { secret, ...input }) => {
    assertAdmin(secret);
    const p = clean(input);
    await assertSlugFree(ctx, p.slug);
    return await ctx.db.insert("projects", { ...p, order: await nextOrder(ctx, "projects") });
  },
});

export const update = mutation({
  args: { secret: v.string(), id: v.id("projects"), ...fields },
  handler: async (ctx, { secret, id, ...input }) => {
    assertAdmin(secret);
    const existing = await ctx.db.get(id);
    if (!existing) throw new ConvexError("That project no longer exists");
    const p = clean(input);
    await assertSlugFree(ctx, p.slug, id);
    await ctx.db.replace(id, { ...p, order: existing.order });
  },
});

export const remove = mutation({
  args: { secret: v.string(), id: v.id("projects") },
  handler: async (ctx, { secret, id }) => {
    assertAdmin(secret);
    await ctx.db.delete(id);
  },
});

/** Admin: move a project up / down within its crate. */
export const move = mutation({
  args: { secret: v.string(), id: v.id("projects"), dir: direction },
  handler: async (ctx, { secret, id, dir }) => {
    assertAdmin(secret);
    await moveInOrder(ctx, "projects", id, dir, (a, b) => a.crate === b.crate);
  },
});

/** Used by scripts/seed.mjs to file existing projects into crates. */
export const assignCrate = mutation({
  args: { secret: v.string(), slug: v.string(), crate: v.optional(v.id("crates")) },
  handler: async (ctx, { secret, slug, crate }) => {
    assertAdmin(secret);
    const p = await ctx.db.query("projects").withIndex("by_slug", (q) => q.eq("slug", slug)).unique();
    if (p) await ctx.db.patch(p._id, { crate });
  },
});
