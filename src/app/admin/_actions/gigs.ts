"use server";

/** Gig actions for /admin (the gigs page). */
import { redirect } from "next/navigation";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { convex } from "@/lib/convex-admin";
import { TAGS } from "@/lib/content";
import { field, optional, refreshSite, write, type FormState } from "./shared";

/** Create a gig, or update it when the form has an id. */
export async function saveGig(_: FormState, form: FormData): Promise<FormState> {
  const gig = {
    date: field(form, "date"),
    act: field(form, "act"),
    venue: field(form, "venue"),
    city: field(form, "city"),
    time: optional(form, "time"),
    url: optional(form, "url"),
  };
  const id = field(form, "id") as Id<"gigs">;
  const error = await write((secret) =>
    id ? convex().mutation(api.gigs.update, { secret, id, ...gig }) : convex().mutation(api.gigs.create, { secret, ...gig }),
  );
  if (error) return error;
  refreshSite(TAGS.gigs);
  redirect("/admin?saved=1");
}

export async function deleteGig(form: FormData) {
  await write((secret) => convex().mutation(api.gigs.remove, { secret, id: field(form, "id") as Id<"gigs"> }));
  refreshSite(TAGS.gigs);
  redirect("/admin");
}
