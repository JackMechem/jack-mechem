"use server";

/** Archive clip actions for /admin/clips. */
import { redirect } from "next/navigation";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { isAdmin } from "@/lib/auth";
import { adminSecret, convex } from "@/lib/convex-admin";
import { TAGS } from "@/lib/content";
import { deleteBlobs, direction, field, optional, refreshSite, write, type FormState } from "./shared";

/** Create a clip, or update it when the form has an id. `src` / `poster` are set by ClipForm. */
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
  const id = field(form, "id") as Id<"clips">;
  const error = await write((secret) =>
    id ? convex().mutation(api.clips.update, { secret, id, ...clip }) : convex().mutation(api.clips.create, { secret, ...clip }),
  );
  if (error) return error;
  refreshSite(TAGS.clips);
  redirect("/admin/clips?saved=1");
}

/** Delete a clip and, if it was uploaded to Blob, its files. */
export async function deleteClip(form: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  const removed = await convex().mutation(api.clips.remove, { secret: adminSecret(), id: field(form, "id") as Id<"clips"> });
  await deleteBlobs(removed?.src, removed?.poster);
  refreshSite(TAGS.clips);
  redirect("/admin/clips");
}

export async function moveClip(form: FormData) {
  await write((secret) => convex().mutation(api.clips.move, { secret, id: field(form, "id") as Id<"clips">, dir: direction(form) }));
  refreshSite(TAGS.clips);
  redirect("/admin/clips");
}
