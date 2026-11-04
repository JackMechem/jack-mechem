import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getProject, getProjects, getShelves } from "@/lib/content";
import { Deck, Sides } from "@/components/Record";
import { CrateIcon } from "@/components/CrateIcon";
import { fitStyle } from "@/lib/format";

// New projects from /admin get a page without a rebuild.
export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getProject((await params).slug);
  return p ? { title: p.name, description: p.summary } : {};
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [p, { shelves, projects }] = await Promise.all([getProject(slug), getShelves()]);
  if (!p) notFound();
  const index = Math.max(0, projects.findIndex((q) => q.slug === slug));
  const shelf = shelves.find((s) => s.projects.some((q) => q.slug === slug));
  // same sleeve colour as in the crate (it alternates by position within the crate)
  const sleeve = Math.max(0, shelf?.projects.findIndex((q) => q.slug === slug) ?? 0);
  // back to this record's crate, with this record at the front
  const backHref = shelf ? `/?crate=${shelf.id}&record=${p.slug}#crate` : "/#crate";
  const crateName = shelves.length > 1 && shelf ? `${shelf.name} crate` : "the crate";
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <article>
      <header className="cs-head">
        <div className="cs-deck">
          <Deck p={p} index={sleeve} />
          <Link href={backHref} className="cs-return">
            <CrateIcon size={44} />
            <span>
              <b>Put it back</b>
              <span className="cap">{crateName}</span>
            </span>
          </Link>
        </div>
        <div className="cs-meta">
          <Link href={backHref} className="cs-back cap">
            <span aria-hidden="true">←</span>
            <CrateIcon size={22} />
            Back to {crateName}
          </Link>
          <span className="cap">
            {p.cat} · {p.years}
            {shelf && shelves.length > 1 && ` · ${shelf.name}`}
          </span>
          <h1 className="fit" style={fitStyle(p.name)}>{p.name}</h1>
          <p className="kind">{p.kind}</p>
          <p className="sum">{p.summary}</p>
          <dl>
            <dt>Stack</dt>
            <dd>{p.stack.join(", ")}</dd>
            {p.links.length > 0 && (
              <>
                <dt>Links</dt>
                <dd>
                  {p.links.map((l, i) => (
                    <span key={l.href}>
                      {i > 0 && " · "}
                      <a href={l.href} target="_blank" rel="noopener noreferrer">
                        {l.label} ↗
                      </a>
                    </span>
                  ))}
                </dd>
              </>
            )}
          </dl>
        </div>
      </header>

      {p.image && (
        <figure className="cs-shot" style={{ margin: 0 }}>
          <Image src={p.image} alt={`${p.name} screenshot`} width={1600} height={1000} sizes="100vw" priority />
          {p.imageNote && <figcaption className="cap">{p.imageNote}</figcaption>}
        </figure>
      )}

      {p.gallery && p.gallery.length > 0 && (
        <div className="cs-gallery">
          {p.gallery.map((g) => (
            <figure key={g.src}>
              <Image src={g.src} alt={g.caption ?? `${p.name} screenshot`} width={1600} height={1000} sizes="(max-width: 980px) 100vw, 50vw" />
              {g.caption && <figcaption className="cap">{g.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}

      <div className="cs-body">
        <aside>
          <div className="sticky">
            <h2 className="cap" style={{ marginTop: 0 }}>
              Tracklist
            </h2>
            <Sides p={p} />
          </div>
        </aside>
        <div className="prose">
          <Markdown remarkPlugins={[remarkGfm]}>{p.body}</Markdown>
        </div>
      </div>

      {projects.length > 1 && prev && next && (
        <nav className="cs-next" aria-label="More projects">
          <Link href={`/work/${prev.slug}`}>
            <span className="cap">← Previous record</span>
            <b className="fit" style={fitStyle(prev.name)}>{prev.name}</b>
          </Link>
          <Link href={`/work/${next.slug}`}>
            <span className="cap">Next record →</span>
            <b className="fit" style={fitStyle(next.name)}>{next.name}</b>
          </Link>
        </nav>
      )}
    </article>
  );
}
