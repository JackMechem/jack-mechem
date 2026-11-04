import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  gigs: defineTable({
    /** local (Los Angeles) calendar date, YYYY-MM-DD */
    date: v.string(),
    /** free text, e.g. "8 PM" or "8–11 PM" */
    time: v.optional(v.string()),
    act: v.string(),
    venue: v.string(),
    city: v.string(),
    url: v.optional(v.string()),
  }).index("by_date", ["date"]),

  projects: defineTable({
    slug: v.string(),
    name: v.string(),
    /** catalogue number on the sleeve, e.g. "FMT-001" */
    cat: v.string(),
    years: v.string(),
    kind: v.string(),
    stack: v.array(v.string()),
    summary: v.string(),
    /** screenshot URL: a /public path or a Vercel Blob URL */
    image: v.optional(v.string()),
    imageNote: v.optional(v.string()),
    /** extra screenshots shown on the case study page */
    gallery: v.optional(v.array(v.object({ src: v.string(), caption: v.optional(v.string()) }))),
    sideA: v.array(v.string()),
    sideB: v.array(v.string()),
    links: v.array(v.object({ label: v.string(), href: v.string() })),
    /** the case study, in Markdown */
    body: v.string(),
    published: v.boolean(),
    /** which crate (category) it sits in; none = the "Other" crate */
    crate: v.optional(v.id("crates")),
    /** position, lowest first (compared within a crate) */
    order: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_order", ["order"]),

  crates: defineTable({
    name: v.string(),
    order: v.number(),
  }).index("by_order", ["order"]),

  clips: defineTable({
    src: v.string(),
    poster: v.optional(v.string()),
    title: v.string(),
    detail: v.string(),
    alt: v.string(),
    /** who filmed it, e.g. "@jizzrael", and a link to them */
    credit: v.optional(v.string()),
    creditUrl: v.optional(v.string()),
    order: v.number(),
  }).index("by_order", ["order"]),
});
