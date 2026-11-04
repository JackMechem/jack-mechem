/**
 * Types for the site's content. They come straight from the Convex schema
 * (convex/schema.ts), so changing a table there updates these automatically.
 */
import type { Doc } from "@convex/_generated/dataModel";

/** A project without its write-up: everything the crate, sleeves and preview need. */
export type Project = Omit<Doc<"projects">, "body">;
/** A project including its Markdown write-up (case-study pages). */
export type ProjectWithBody = Doc<"projects">;
export type Clip = Doc<"clips">;
export type Gig = Doc<"gigs">;
export type Crate = Doc<"crates">;

/** A crate as the site shows it: its name and its published projects, in order. */
export type Shelf = { id: string; name: string; projects: Project[] };
