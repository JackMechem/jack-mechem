/**
 * Contact: no form, just the email address (click to copy) and links.
 * Styles: styles/about.css (.contact-…)
 */
import { site } from "@/content/site";
import { CopyEmail } from "./CopyEmail";

export function Contact() {
  return (
    <section className="contact" id="contact">
      <span className="cap">Requests line: no forms, just email. Click to copy.</span>
      <CopyEmail email={site.email} />
      <div className="contact-links">
        <a className="btn" href={`mailto:${site.email}`}>
          Email ↗
        </a>
        <a className="btn" href={site.github} target="_blank" rel="noopener noreferrer">
          GitHub ↗
        </a>
        <a className="btn" href={site.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn ↗
        </a>
      </div>
    </section>
  );
}
