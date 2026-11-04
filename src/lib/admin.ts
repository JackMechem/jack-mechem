import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { ConvexHttpClient } from "convex/browser";

// Single-user admin: a password (ADMIN_PASSWORD) gets you a signed, httpOnly
// session cookie. Convex writes are authorized with ADMIN_SECRET, which never
// leaves the server.

const COOKIE = "jm_admin";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function sessionSecret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be set (32+ characters)");
  return s;
}

const sign = (value: string) => createHmac("sha256", sessionSecret()).update(value).digest("base64url");

/** Constant-time string comparison (hashing first so lengths always match). */
function same(a: string, b: string) {
  const h = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(h(a), h(b));
}

export function checkPassword(password: string) {
  const real = process.env.ADMIN_PASSWORD;
  return !!real && same(password, real);
}

export async function startSession() {
  const exp = String(Date.now() + MAX_AGE * 1000);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).set(COOKIE, "", { path: "/admin", maxAge: 0 });
}

export async function isAdmin() {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig || !same(sig, sign(exp))) return false;
  return Number(exp) > Date.now();
}

export function adminSecret() {
  const s = process.env.ADMIN_SECRET;
  if (!s) throw new Error("ADMIN_SECRET is not set");
  return s;
}

export function convex() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
  return new ConvexHttpClient(url);
}
