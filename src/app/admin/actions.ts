"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { del } from "@vercel/blob";
import { ConvexError } from "convex/values";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { adminSecret, checkPassword, convex, endSession, isAdmin, startSession } from "@/lib/admin";
import { TAGS } from "@/lib/content";

export type FormState = { error?: string };

/* ───────── session ───────── */

export async function login(_: FormState, form: FormData): Promise<FormState> {
  if (!checkPassword(String(form.get("password") ?? ""))) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return { error: "Wrong password." };
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin");
}

/* ───────── helpers ───────── */

const field = (form: FormData, name: string) => String(form.get(name) ?? "").trim();
const optional = (form: FormData, name: string) => field(form, name) || undefined;
const lines = (form: FormData, name: string) =>
  field(form, name)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

function refresh(tag: string) {
  updateTag(tag);
  revalidatePath("/", "layout");
}

/** Run a Convex write as admin, turning failures into a form error. */
async function write(fn: (secret: string) => Promise<unknown>): Promise<FormState | null> {
  if (!(await isAdmin())) return { error: "You've been signed out. Reload and sign in again." };
  try {
    await fn(adminSecret());
    return null;
  } catch (e) {
    return { error: e instanceof ConvexError ? String(e.data) : "Couldn't save. Is Convex running?" };
  }
}

/** Delete files we uploaded to Vercel Blob (paths in /public are left alone). */
async function deleteBlobs(...urls: (string | undefined)[]) {
  const blobs = urls.filter((u): u is string => !!u && /\.blob\.vercel-storage\.com\//.test(u));
  if (blobs.length) await del(blobs).catch(() => {});
}

/* ───────── gigs ───────── */

export async function saveGig(_: FormState, form: FormData): Promise<FormState> {
  const gig = {
    date: field(form, "date"),
    act: field(form, "act"),
    venue: field(form, "venue"),
    city: field(form, "city"),
    time: optional(form, "time"),
    url: optional(form, "url"),
  };
  const id = field(form, "id");
  const err = await write((secret) =>
    id
      ? convex().mutation(api.gigs.update, { secret, id: id as Id<"gigs">, ...gig })
      : convex().mutation(api.gigs.create, { secret, ...gig }),
  );
  if (err) return err;
  refresh(TAGS.gigs);
  redirect("/admin?saved=1");
}

export async function deleteGig(form: FormData) {
  await write((secret) => convex().mutation(api.gigs.remove, { secret, id: field(form, "id") as Id<"gigs"> }));
  refresh(TAGS.gigs);
  redirect("/admin");
}

/* ───────── clips ───────── */

export async function saveClip(_: FormState, form: FormData): Promise<FormState> {
  const clip = {
    src: field(form, "src"),
    poster: optional(form, "poster"),
    title: field(form, "title"),
    detail: field(form, "detail"),
    alt: field(form, "alt"),
    credit: optional(form, "credit"),
    creditUrl: optional(form, "creditUrl"),
  };
  const id = field(form, "id");
  const err = await write((secret) =>
    id
      ? convex().mutation(api.clips.update, { secret, id: id as Id<"clips">, ...clip })
      : convex().mutation(api.clips.create, { secret, ...clip }),
  );
  if (err) return err;
  refresh(TAGS.clips);
  redirect("/admin/clips?saved=1");
}

export async function deleteClip(form: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  const removed = await convex().mutation(api.clips.remove, { secret: adminSecret(), id: field(form, "id") as Id<"clips"> });
  await deleteBlobs(removed?.src, removed?.poster);
  refresh(TAGS.clips);
  redirect("/admin/clips");
}

export async function moveClip(form: FormData) {
  await write((secret) =>
    convex().mutation(api.clips.move, { secret, id: field(form, "id") as Id<"clips">, dir: field(form, "dir") === "up" ? "up" : "down" }),
  );
  refresh(TAGS.clips);
  redirect("/admin/clips");
}

/* ───────── projects ───────── */

/** "Label | https://…" per line */
function parseLinks(form: FormData) {
  return lines(form, "links").map((line) => {
    const [label, ...rest] = line.split("|");
    const href = rest.join("|").trim();
    return href ? { label: label.trim(), href } : { label: label.trim(), href: label.trim() };
  });
}

export async function saveProject(_: FormState, form: FormData): Promise<FormState> {
  const project = {
    slug: field(form, "slug"),
    name: field(form, "name"),
    cat: field(form, "cat"),
    years: field(form, "years"),
    kind: field(form, "kind"),
    stack: field(form, "stack")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    summary: field(form, "summary"),
    image: optional(form, "image"),
    imageNote: optional(form, "imageNote"),
    sideA: lines(form, "sideA"),
    sideB: lines(form, "sideB"),
    links: parseLinks(form),
    gallery: lines(form, "gallery").map((line) => {
      const [src, ...caption] = line.split("|");
      return { src: src.trim(), caption: caption.join("|").trim() || undefined };
    }),
    body: String(form.get("body") ?? ""),
    published: form.get("published") === "on",
    ...(field(form, "crate") && { crate: field(form, "crate") as Id<"crates"> }),
  };
  const id = field(form, "id");
  const err = await write((secret) =>
    id
      ? convex().mutation(api.projects.update, { secret, id: id as Id<"projects">, ...project })
      : convex().mutation(api.projects.create, { secret, ...project }),
  );
  if (err) return err;
  const previousImage = optional(form, "previousImage");
  if (previousImage && previousImage !== project.image) await deleteBlobs(previousImage);
  refresh(TAGS.projects);
  redirect("/admin/projects?saved=1");
}

export async function deleteProject(form: FormData) {
  await write((secret) => convex().mutation(api.projects.remove, { secret, id: field(form, "id") as Id<"projects"> }));
  await deleteBlobs(optional(form, "image"));
  refresh(TAGS.projects);
  redirect("/admin/projects");
}

export async function moveProject(form: FormData) {
  await write((secret) =>
    convex().mutation(api.projects.move, {
      secret,
      id: field(form, "id") as Id<"projects">,
      dir: field(form, "dir") === "up" ? "up" : "down",
    }),
  );
  refresh(TAGS.projects);
  redirect("/admin/projects");
}

/* ───────── crates ───────── */

const backToProjects = (error?: string | null) =>
  redirect(error ? `/admin/projects?error=${encodeURIComponent(error)}` : "/admin/projects");

export async function createCrate(form: FormData) {
  const err = await write((secret) => convex().mutation(api.crates.create, { secret, name: field(form, "name") }));
  if (!err) refresh(TAGS.projects);
  backToProjects(err?.error);
}

export async function renameCrate(form: FormData) {
  const err = await write((secret) =>
    convex().mutation(api.crates.rename, { secret, id: field(form, "id") as Id<"crates">, name: field(form, "name") }),
  );
  if (!err) refresh(TAGS.projects);
  backToProjects(err?.error);
}

export async function moveCrate(form: FormData) {
  await write((secret) =>
    convex().mutation(api.crates.move, { secret, id: field(form, "id") as Id<"crates">, dir: field(form, "dir") === "up" ? "up" : "down" }),
  );
  refresh(TAGS.projects);
  backToProjects();
}

export async function deleteCrate(form: FormData) {
  const err = await write((secret) => convex().mutation(api.crates.remove, { secret, id: field(form, "id") as Id<"crates"> }));
  if (!err) refresh(TAGS.projects);
  backToProjects(err?.error);
}
