/**
 * Crates: the categories that projects are grouped into on the home page
 * (shown as divider tabs). Managed on /admin/projects.
 */
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { assertAdmin, direction, moveInOrder, nextOrder, text } from "./helpers";

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
    return await ctx.db.insert("crates", { name: name(n), order: await nextOrder(ctx, "crates") });
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

/** Admin: move a crate (tab) left / right, shown as up / down in the admin. */
export const move = mutation({
  args: { secret: v.string(), id: v.id("crates"), dir: direction },
  handler: async (ctx, { secret, id, dir }) => {
    assertAdmin(secret);
    await moveInOrder(ctx, "crates", id, dir);
  },
});
