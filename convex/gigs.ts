import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { assertAdmin } from "./admin";

const gigFields = {
  date: v.string(),
  time: v.optional(v.string()),
  act: v.string(),
  venue: v.string(),
  city: v.string(),
  url: v.optional(v.string()),
};

type GigInput = {
  date: string;
  time?: string;
  act: string;
  venue: string;
  city: string;
  url?: string;
};

function clean(g: GigInput): GigInput {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(g.date)) throw new ConvexError("Date must be YYYY-MM-DD");
  const text = (s: string | undefined, field: string, required: boolean) => {
    const t = (s ?? "").trim();
    if (required && !t) throw new ConvexError(`${field} is required`);
    if (t.length > 200) throw new ConvexError(`${field} is too long`);
    return t || undefined;
  };
  const url = text(g.url, "Link", false);
  if (url && !/^https?:\/\//i.test(url)) throw new ConvexError("Link must start with http:// or https://");
  return {
    date: g.date,
    time: text(g.time, "Time", false),
    act: text(g.act, "Act", true)!,
    venue: text(g.venue, "Venue", true)!,
    city: text(g.city, "City", true)!,
    url,
  };
}

/** Public: gigs from yesterday (UTC) onward. The site trims to "today in LA". */
export const upcoming = query({
  args: {},
  handler: async (ctx) => {
    const from = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    return await ctx.db
      .query("gigs")
      .withIndex("by_date", (q) => q.gte("date", from))
      .order("asc")
      .take(50);
  },
});

export const all = query({
  args: { secret: v.string() },
  handler: async (ctx, { secret }) => {
    assertAdmin(secret);
    return await ctx.db.query("gigs").withIndex("by_date").order("desc").take(200);
  },
});

export const create = mutation({
  args: { secret: v.string(), ...gigFields },
  handler: async (ctx, { secret, ...gig }) => {
    assertAdmin(secret);
    return await ctx.db.insert("gigs", clean(gig));
  },
});

export const update = mutation({
  args: { secret: v.string(), id: v.id("gigs"), ...gigFields },
  handler: async (ctx, { secret, id, ...gig }) => {
    assertAdmin(secret);
    await ctx.db.replace(id, clean(gig));
  },
});

export const remove = mutation({
  args: { secret: v.string(), id: v.id("gigs") },
  handler: async (ctx, { secret, id }) => {
    assertAdmin(secret);
    await ctx.db.delete(id);
  },
});
