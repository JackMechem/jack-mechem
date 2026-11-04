/**
 * Admin sign-in (server only).
 *
 * The admin panel has a single user. Signing in with ADMIN_PASSWORD sets a
 * session cookie containing an expiry time plus an HMAC signature made with
 * SESSION_SECRET, so it can't be forged or extended. The cookie is httpOnly
 * and scoped to /admin. Nothing is stored server-side.
 */
import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "jm_admin";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days, in seconds

function sessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET must be set (32+ characters)");
  return secret;
}

const sign = (value: string) => createHmac("sha256", sessionSecret()).update(value).digest("base64url");

/** Constant-time comparison (hashing first so both sides are the same length). */
function sameString(a: string, b: string) {
  const hash = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(hash(a), hash(b));
}

export function checkPassword(password: string) {
  const real = process.env.ADMIN_PASSWORD;
  return !!real && sameString(password, real);
}

export async function startSession() {
  const expires = String(Date.now() + MAX_AGE * 1000);
  (await cookies()).set(COOKIE, `${expires}.${sign(expires)}`, {
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

/** True if the request carries a valid, unexpired admin session cookie. */
export async function isAdmin() {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [expires, signature] = value.split(".");
  if (!expires || !signature || !sameString(signature, sign(expires))) return false;
  return Number(expires) > Date.now();
}
