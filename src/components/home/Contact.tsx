/**
 * Contact: no form, just the email address (click to copy) and links.
 * Styles: styles/about.css (.contact-…)
 */
import { site } from "@/content/site";
import { CopyEmail } from "./CopyEmail";
import { Arrow } from "@/components/layout/Arrow";

export function Contact() {
  return (
    <section className="contact" id="contact">
      <CopyEmail email={site.email} />
      <div className="contact-links">
        <a className="btn" href={`mailto:${site.email}`}>
          Email <Arrow dir="out" />
        </a>
        <a className="btn" href={site.github} target="_blank" rel="noopener noreferrer">
          GitHub <Arrow dir="out" />
        </a>
        <a className="btn" href={site.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn <Arrow dir="out" />
        </a>
      </div>
    </section>
  );
}
