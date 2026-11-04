"use server";

/** Crate (category) actions, used on /admin/projects. Errors are shown via ?error= on that page. */
import { redirect } from "next/navigation";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { convex } from "@/lib/convex-admin";
import { TAGS } from "@/lib/content";
import { direction, field, refreshSite, write } from "./shared";

const backToProjects = (error?: string) => redirect(error ? `/admin/projects?error=${encodeURIComponent(error)}` : "/admin/projects");
const crateId = (form: FormData) => field(form, "id") as Id<"crates">;

export async function createCrate(form: FormData) {
  const result = await write((secret) => convex().mutation(api.crates.create, { secret, name: field(form, "name") }));
  if (!result) refreshSite(TAGS.projects);
  backToProjects(result?.error);
}

export async function renameCrate(form: FormData) {
  const result = await write((secret) => convex().mutation(api.crates.rename, { secret, id: crateId(form), name: field(form, "name") }));
  if (!result) refreshSite(TAGS.projects);
  backToProjects(result?.error);
}

export async function moveCrate(form: FormData) {
  await write((secret) => convex().mutation(api.crates.move, { secret, id: crateId(form), dir: direction(form) }));
  refreshSite(TAGS.projects);
  backToProjects();
}

/** Only empty crates can be deleted (Convex refuses otherwise, and the message is shown). */
export async function deleteCrate(form: FormData) {
  const result = await write((secret) => convex().mutation(api.crates.remove, { secret, id: crateId(form) }));
  if (!result) refreshSite(TAGS.projects);
  backToProjects(result?.error);
}
