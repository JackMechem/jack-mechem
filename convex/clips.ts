import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { assertAdmin, text, url } from "./admin";

const fields = {
  src: v.string(),
  poster: v.optional(v.string()),
  title: v.string(),
  detail: v.string(),
  alt: v.string(),
  credit: v.optional(v.string()),
  creditUrl: v.optional(v.string()),
};

const clean = (c: { src: string; poster?: string; title: string; detail: string; alt: string; credit?: string; creditUrl?: string }) => ({
  src: url(c.src, "Video", true)!,
  poster: url(c.poster, "Preview image"),
  title: text(c.title, "Title", { required: true, max: 80 })!,
  detail: text(c.detail, "Detail", { max: 120 }) ?? "",
  alt: text(c.alt, "Description", { max: 200 }) ?? text(c.title, "Title")!,
  credit: text(c.credit, "Filmed by", { max: 80 }),
  creditUrl: url(c.creditUrl, "Credit link"),
});

/** Public: clips in display order. */
export const list = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("clips").withIndex("by_order").order("asc").take(50),
});

export const create = mutation({
  args: { secret: v.string(), ...fields },
  handler: async (ctx, { secret, ...c }) => {
    assertAdmin(secret);
    const last = await ctx.db.query("clips").withIndex("by_order").order("desc").first();
    return await ctx.db.insert("clips", { ...clean(c), order: (last?.order ?? 0) + 1 });
  },
});

export const update = mutation({
  args: { secret: v.string(), id: v.id("clips"), ...fields },
  handler: async (ctx, { secret, id, ...c }) => {
    assertAdmin(secret);
    await ctx.db.patch(id, clean(c));
  },
});

/** Returns the removed clip so the caller can delete its files from storage. */
export const remove = mutation({
  args: { secret: v.string(), id: v.id("clips") },
  handler: async (ctx, { secret, id }) => {
    assertAdmin(secret);
    const c = await ctx.db.get(id);
    await ctx.db.delete(id);
    return c;
  },
});

export const move = mutation({
  args: { secret: v.string(), id: v.id("clips"), dir: v.union(v.literal("up"), v.literal("down")) },
  handler: async (ctx, { secret, id, dir }) => {
    assertAdmin(secret);
    const c = await ctx.db.get(id);
    if (!c) return;
    const q = ctx.db.query("clips").withIndex("by_order", (q) => (dir === "up" ? q.lt("order", c.order) : q.gt("order", c.order)));
    const other = await q.order(dir === "up" ? "desc" : "asc").first();
    if (!other) return;
    await ctx.db.patch(c._id, { order: other.order });
    await ctx.db.patch(other._id, { order: c.order });
  },
});
