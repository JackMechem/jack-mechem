"use server";

/** Project actions for /admin/projects and the project editor. */
import { redirect } from "next/navigation";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { convex } from "@/lib/convex-admin";
import { TAGS } from "@/lib/content";
import { deleteBlobs, direction, field, lines, optional, refreshSite, splitPipe, write, type FormState } from "./shared";

/** Read the project editor form (ProjectForm.tsx) into the shape convex/projects.ts expects. */
function readProject(form: FormData) {
  return {
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
    // "Label | https://…" per line; a bare URL becomes its own label
    links: lines(form, "links").map((line) => {
      const [label, href] = splitPipe(line);
      return { label, href: href || label };
    }),
    // "/projects/file.png | caption" per line
    gallery: lines(form, "gallery").map((line) => {
      const [src, caption] = splitPipe(line);
      return { src, caption: caption || undefined };
    }),
    body: String(form.get("body") ?? ""),
    published: form.get("published") === "on",
    ...(field(form, "crate") && { crate: field(form, "crate") as Id<"crates"> }),
  };
}

/** Create a project, or update it when the form has an id. */
export async function saveProject(_: FormState, form: FormData): Promise<FormState> {
  const project = readProject(form);
  const id = field(form, "id") as Id<"projects">;
  const error = await write((secret) =>
    id ? convex().mutation(api.projects.update, { secret, id, ...project }) : convex().mutation(api.projects.create, { secret, ...project }),
  );
  if (error) return error;
  // a replaced or removed screenshot that was uploaded to Blob is deleted
  const previousImage = optional(form, "previousImage");
  if (previousImage && previousImage !== project.image) await deleteBlobs(previousImage);
  refreshSite(TAGS.projects);
  redirect("/admin/projects?saved=1");
}

export async function deleteProject(form: FormData) {
  await write((secret) => convex().mutation(api.projects.remove, { secret, id: field(form, "id") as Id<"projects"> }));
  await deleteBlobs(optional(form, "image"));
  refreshSite(TAGS.projects);
  redirect("/admin/projects");
}

/** Move a project up / down within its crate. */
export async function moveProject(form: FormData) {
  await write((secret) => convex().mutation(api.projects.move, { secret, id: field(form, "id") as Id<"projects">, dir: direction(form) }));
  refreshSite(TAGS.projects);
  redirect("/admin/projects");
}
