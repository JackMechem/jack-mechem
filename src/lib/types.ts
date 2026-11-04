import type { Doc } from "../../convex/_generated/dataModel";

/** A project without its write-up (what the crate and overlay need). */
export type Project = Omit<Doc<"projects">, "body">;
export type ProjectWithBody = Doc<"projects">;
export type Clip = Doc<"clips">;
export type Gig = Doc<"gigs">;
export type Crate = Doc<"crates">;

/** A crate as the site shows it: its name and its published projects, in order. */
export type Shelf = { id: string; name: string; projects: Project[] };
