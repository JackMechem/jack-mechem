/**
 * Helpers shared by the admin server actions (server only).
 */
import "server-only";
import { revalidatePath, updateTag } from "next/cache";
import { del } from "@vercel/blob";
import { ConvexError } from "convex/values";
import { isAdmin } from "@/lib/auth";
import { adminSecret } from "@/lib/convex-admin";

/** What a form action returns: an error message to show, or nothing on success (it redirects). */
export type FormState = { error?: string };

/* ---- Reading form fields ---- */

/** A trimmed text field ("" if missing). */
export const field = (form: FormData, name: string) => String(form.get(name) ?? "").trim();

/** A trimmed text field, or undefined if empty (for optional values). */
export const optional = (form: FormData, name: string) => field(form, name) || undefined;

/** A textarea split into non-empty trimmed lines. */
export const lines = (form: FormData, name: string) =>
  field(form, name)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

/** "Something | something else" → [before, after] (after is "" if there's no "|"). */
export function splitPipe(line: string): [string, string] {
  const [first, ...rest] = line.split("|");
  return [first.trim(), rest.join("|").trim()];
}

/** The "up" / "down" value of a reorder button. */
export const direction = (form: FormData) => (field(form, "dir") === "up" ? "up" : "down");

/* ---- Saving ---- */

/**
 * Run a Convex write as the admin. Checks the session first and turns
 * failures into a message for the form. Returns null on success.
 */
export async function write(fn: (secret: string) => Promise<unknown>): Promise<FormState | null> {
  if (!(await isAdmin())) return { error: "You've been signed out. Reload and sign in again." };
  try {
    await fn(adminSecret());
    return null;
  } catch (e) {
    // ConvexError messages are the friendly validation messages from convex/*.ts
    return { error: e instanceof ConvexError ? String(e.data) : "Couldn't save. Is Convex running?" };
  }
}

/** After a save: clear the cached content for that area so the public site updates now. */
export function refreshSite(tag: string) {
  updateTag(tag);
  revalidatePath("/", "layout");
}

/** Delete files that were uploaded to Vercel Blob (paths in /public are left alone). */
export async function deleteBlobs(...urls: (string | undefined)[]) {
  const blobs = urls.filter((u): u is string => !!u && /\.blob\.vercel-storage\.com\//.test(u));
  if (blobs.length) await del(blobs).catch(() => {});
}
