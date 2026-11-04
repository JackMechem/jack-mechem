/**
 * Helpers shared by the Convex functions in this folder: the admin check,
 * input validation and ordering. Not callable from outside (no queries or
 * mutations here).
 */
import { ConvexError, v } from "convex/values";
import type { MutationCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

/* ---- Access ---- */

/**
 * Functions that change data (or read drafts) take the admin secret as an
 * argument. It must match ADMIN_SECRET on this deployment, which only the
 * site's server knows. Set it with: npx convex env set ADMIN_SECRET <value>
 */
export function assertAdmin(secret: string) {
  const expected = process.env.ADMIN_SECRET;
  if (!expected || secret !== expected) throw new ConvexError("Unauthorized");
}

/* ---- Validation (errors are shown to you in the admin forms) ---- */

/** Trim a text field; check it's present (if required) and not too long. Empty → undefined. */
export function text(value: string | undefined, field: string, opts: { required?: boolean; max?: number } = {}) {
  const t = (value ?? "").trim();
  if (opts.required && !t) throw new ConvexError(`${field} is required`);
  if (t.length > (opts.max ?? 200)) throw new ConvexError(`${field} is too long`);
  return t || undefined;
}

/** A link (http/https) or a path on this site (/clips/video.mp4). Empty → undefined. */
export function url(value: string | undefined, field: string, required = false) {
  const u = text(value, field, { required, max: 1000 });
  if (u && !/^(https?:\/\/|\/(?!\/))/i.test(u)) throw new ConvexError(`${field} must be a link (https://…) or a path starting with /`);
  return u;
}

/** An external link only (http/https). Empty → undefined. */
export function webLink(value: string | undefined, field: string) {
  const u = text(value, field, { max: 1000 });
  if (u && !/^https?:\/\//i.test(u)) throw new ConvexError(`${field} must start with http:// or https://`);
  return u;
}

/* ---- Ordering ----
   Projects, clips and crates have an `order` number; lists are shown lowest
   first. New items go at the end; ↑ / ↓ swap with the neighbour. */

type OrderedTable = "projects" | "clips" | "crates";

/** Argument validator for ↑ / ↓. */
export const direction = v.union(v.literal("up"), v.literal("down"));

async function inOrder<T extends OrderedTable>(ctx: MutationCtx, table: T) {
  const docs = (await ctx.db.query(table).collect()) as Doc<T>[];
  return docs.sort((a, b) => a.order - b.order);
}

/** The order number for a new item at the end of the list. */
export async function nextOrder(ctx: MutationCtx, table: OrderedTable) {
  const docs = await inOrder(ctx, table);
  return (docs.at(-1)?.order ?? 0) + 1;
}

/**
 * Swap an item with its neighbour above or below. `sameGroup` limits which
 * items count as neighbours (projects only swap within their crate).
 */
export async function moveInOrder<T extends OrderedTable>(
  ctx: MutationCtx,
  table: T,
  id: Id<T>,
  dir: "up" | "down",
  sameGroup: (a: Doc<T>, b: Doc<T>) => boolean = () => true,
) {
  const docs = await inOrder(ctx, table);
  const item = docs.find((d) => d._id === id);
  if (!item) return;
  const group = docs.filter((d) => sameGroup(d, item));
  const neighbour = group[group.indexOf(item) + (dir === "up" ? -1 : 1)];
  if (!neighbour) return;
  const setOrder = (docId: Id<OrderedTable>, order: number) => ctx.db.patch(docId, { order });
  await setOrder(item._id, neighbour.order as number);
  await setOrder(neighbour._id, item.order as number);
}
