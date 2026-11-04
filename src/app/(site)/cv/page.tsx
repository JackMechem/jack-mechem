import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { getShelves } from "@/lib/content";
import { PrintButton } from "@/components/PrintButton";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "CV",
  description: `${site.name}: experience, projects, education and skills.`,
};

type Entry = {
  org: string;
  role: string;
  where: string;
  when: string;
  points: string[];
};

function Entries({ items }: { items: Entry[] }) {
  return (
    <div className="cv-entries">
      {items.map((x) => (
        <article key={x.org} className="cv-entry">
          <div className="cv-when cap">{x.when}</div>
          <div>
            <h3>{x.org}</h3>
            <p className="cv-role">
              {x.role} · {x.where}
            </p>
            <ul>
              {x.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}

export default async function CV() {
  const { shelves } = await getShelves();

  return (
    <div className="cv">
      <header className="cv-head">
        <div>
          <h1>{site.name}</h1>
          <p className="cv-sub">
            Software engineer · {site.education.what}, CSUN · Los Angeles area
          </p>
        </div>
        <div className="cv-contact">
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={site.github} target="_blank" rel="noopener noreferrer">
            github.com/JackMechem
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
            linkedin.com/in/jackmechem
          </a>
          <PrintButton />
        </div>
      </header>

      <section className="cv-sec">
        <h2>Education</h2>
        <div className="cv-entries">
          <article className="cv-entry">
            <div className="cv-when cap">{site.education.when}</div>
            <div>
              <h3>{site.education.org}</h3>
              <p className="cv-role">{site.education.what}</p>
            </div>
          </article>
        </div>
      </section>

      <section className="cv-sec">
        <h2>Experience</h2>
        <Entries items={site.experience} />
      </section>

      <section className="cv-sec">
        <h2>Projects</h2>
        <div>
          {shelves.map((s) => (
            <div key={s.id} className="cv-group">
              {shelves.length > 1 && (
                <h3 className="cv-group-title cap">{s.name}</h3>
              )}
              <div className="cv-entries">
                {s.projects.map((p) => (
                  <article key={p.slug} className="cv-entry">
                    <div className="cv-when cap">{p.years}</div>
                    <div>
                      <h3>
                        <Link href={`/work/${p.slug}`}>{p.name}</Link>
                      </h3>
                      <p className="cv-role">
                        {p.kind} · {p.stack.join(", ")}
                      </p>
                      <ul>
                        {[...p.sideA, ...p.sideB].map((pt) => (
                          <li key={pt}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cv-sec">
        <h2>Music</h2>
        <Entries items={site.music} />
      </section>

      <section className="cv-sec">
        <h2>Skills</h2>
        <dl className="cv-skills">
          {Object.entries(site.skills).map(([k, v]) => (
            <div key={k}>
              <dt className="cap">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
