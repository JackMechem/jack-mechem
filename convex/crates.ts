import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { assertAdmin, text } from "./admin";

const name = (s: string) => text(s, "Crate name", { required: true, max: 40 })!;

/** Public: crates in display order. */
export const list = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("crates").withIndex("by_order").order("asc").take(50),
});

export const create = mutation({
  args: { secret: v.string(), name: v.string() },
  handler: async (ctx, { secret, name: n }) => {
    assertAdmin(secret);
    const last = await ctx.db.query("crates").withIndex("by_order").order("desc").first();
    return await ctx.db.insert("crates", { name: name(n), order: (last?.order ?? 0) + 1 });
  },
});

export const rename = mutation({
  args: { secret: v.string(), id: v.id("crates"), name: v.string() },
  handler: async (ctx, { secret, id, name: n }) => {
    assertAdmin(secret);
    await ctx.db.patch(id, { name: name(n) });
  },
});

/** Only empty crates can be deleted, so no project ever goes missing. */
export const remove = mutation({
  args: { secret: v.string(), id: v.id("crates") },
  handler: async (ctx, { secret, id }) => {
    assertAdmin(secret);
    const inside = (await ctx.db.query("projects").collect()).filter((p) => p.crate === id).length;
    if (inside) throw new ConvexError(`Move its ${inside} project${inside > 1 ? "s" : ""} to another crate first`);
    await ctx.db.delete(id);
  },
});

export const move = mutation({
  args: { secret: v.string(), id: v.id("crates"), dir: v.union(v.literal("up"), v.literal("down")) },
  handler: async (ctx, { secret, id, dir }) => {
    assertAdmin(secret);
    const c = await ctx.db.get(id);
    if (!c) return;
    const q = ctx.db.query("crates").withIndex("by_order", (q) => (dir === "up" ? q.lt("order", c.order) : q.gt("order", c.order)));
    const other = await q.order(dir === "up" ? "desc" : "asc").first();
    if (!other) return;
    await ctx.db.patch(c._id, { order: other.order });
    await ctx.db.patch(other._id, { order: c.order });
  },
});
