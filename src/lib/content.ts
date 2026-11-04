import "server-only";
import { cache } from "react";
import { todayInLA } from "./format";
import type { Clip, Crate, Gig, Project, ProjectWithBody, Shelf } from "./types";

export const TAGS = { gigs: "gigs", projects: "projects", clips: "clips" } as const;

/**
 * Query Convex over HTTP so Next can cache the result (an hour) under a tag
 * that /admin clears on save. Throws on failure: during revalidation Next then
 * keeps serving the last good page instead of an empty one.
 */
async function convexQuery<T>(path: string, args: Record<string, unknown>, tag: string): Promise<T> {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
  const res = await fetch(`${url}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
    next: { revalidate: 3600, tags: [tag] },
  });
  if (!res.ok) throw new Error(`Convex ${path}: HTTP ${res.status}`);
  const json = await res.json();
  if (json.status !== "success") throw new Error(`Convex ${path}: ${json.errorMessage ?? "failed"}`);
  return json.value as T;
}

/**
 * Published projects grouped into crates, in display order. Projects without a crate
 * land in an "Other" crate at the end. `projects` is the same list flattened.
 */
export const getShelves = cache(async () => {
  const [crates, all] = await Promise.all([
    convexQuery<Crate[]>("crates:list", {}, TAGS.projects),
    convexQuery<Project[]>("projects:published", {}, TAGS.projects),
  ]);
  const shelves: Shelf[] = crates.map((c) => ({ id: c._id, name: c.name, projects: all.filter((p) => p.crate === c._id) }));
  const known = new Set(crates.map((c) => c._id as string));
  const loose = all.filter((p) => !p.crate || !known.has(p.crate));
  if (loose.length) shelves.push({ id: "other", name: "Other", projects: loose });
  const filled = shelves.filter((s) => s.projects.length);
  return { shelves: filled, projects: filled.flatMap((s) => s.projects) };
});

export const getProjects = cache(async () => (await getShelves()).projects);

export const getProject = cache((slug: string) => convexQuery<ProjectWithBody | null>("projects:bySlug", { slug }, TAGS.projects));

/** Clips and gigs are extras: if Convex is down the page still renders without them. */
export const getClips = cache(async () => {
  try {
    return await convexQuery<Clip[]>("clips:list", {}, TAGS.clips);
  } catch {
    return [];
  }
});

export const getUpcomingGigs = cache(async (): Promise<Gig[] | null> => {
  try {
    const today = todayInLA();
    return (await convexQuery<Gig[]>("gigs:upcoming", {}, TAGS.gigs)).filter((g) => g.date >= today);
  } catch {
    return null;
  }
});
