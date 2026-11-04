/**
 * The first screen: halftone photo with the name, the featured records, and
 * the one-line pitch (from content/site.ts) with a link down to the crates.
 * Styles: styles/hero.css
 */
import Image from "next/image";
import { site } from "@/content/site";
import type { Project } from "@/lib/types";
import { FeaturedRecords } from "./FeaturedRecords";

export function Hero({ projects }: { projects: Project[] }) {
  return (
    <section className="hero page-stop">
      {/* always dark, whatever the site theme */}
      <div className="hero-photo" data-theme="dark">
        <div className="halftone">
          <Image src="/headshot.jpg" alt="Jack Mechem at the drums" fill priority sizes="67vw" />
        </div>
        <div className="hero-scanline" />
        <div className="hero-tags cap">
          <span>● Live</span>
          <span>{site.location}</span>
        </div>
        <h1 className="hero-name">
          Jack
          <br />
          Mechem
        </h1>
      </div>

      <FeaturedRecords projects={projects} />

      <div className="hero-strip">
        <p>
          {site.hero} <span>{site.heroSub}</span>
        </p>
        <a href="#crate" className="cap">
          Dig through the crate <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
