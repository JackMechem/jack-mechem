import { ConvexError } from "convex/values";

// Writes (and admin-only reads) need ADMIN_SECRET, which only the Next.js
// server knows. Set it with: npx convex env set ADMIN_SECRET <value>
export function assertAdmin(secret: string) {
  const expected = process.env.ADMIN_SECRET;
  if (!expected || secret !== expected) throw new ConvexError("Unauthorized");
}

export function text(value: string | undefined, field: string, opts: { required?: boolean; max?: number } = {}) {
  const t = (value ?? "").trim();
  if (opts.required && !t) throw new ConvexError(`${field} is required`);
  if (t.length > (opts.max ?? 200)) throw new ConvexError(`${field} is too long`);
  return t || undefined;
}

/** http(s) URL or a site-relative path like /clip.mp4 */
export function url(value: string | undefined, field: string, required = false) {
  const u = text(value, field, { required, max: 1000 });
  if (u && !/^(https?:\/\/|\/(?!\/))/i.test(u)) throw new ConvexError(`${field} must be a link (https://…) or a path starting with /`);
  return u;
}
