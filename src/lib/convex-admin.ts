/**
 * Server-side Convex access for the admin panel (server only).
 *
 * Every Convex function that changes data (or reads drafts) takes a `secret`
 * argument and checks it against the ADMIN_SECRET set on the Convex
 * deployment. The same value is set in this app's environment and only ever
 * used here on the server, so the browser can never call those functions.
 */
import "server-only";
import { ConvexHttpClient } from "convex/browser";

export function adminSecret() {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("ADMIN_SECRET is not set");
  return secret;
}

export function convex() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
  return new ConvexHttpClient(url);
}
