/**
 * A project's case study: /work/<slug>
 *
 * Header (record + "Put it back", title, facts), the main screenshot, an
 * optional gallery, then the Side A / B tracklist next to the Markdown
 * write-up, and links to the previous / next record. All content is edited
 * in /admin/projects. New projects get a page without a redeploy
 * (dynamicParams); drafts 404.
 * Styles: styles/case-study.css
 */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fitStyle } from "@/lib/format";
import { getProject, getProjects, getShelves } from "@/lib/content";
import { CrateIcon } from "@/components/records/CrateIcon";
import { Deck } from "@/components/records/Deck";
import { Tracklist } from "@/components/records/Tracklist";

export const dynamicParams = true;
export const revalidate = 3600;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = await getProject((await params).slug);
  return p ? { title: p.name, description: p.summary } : {};
}

export default async function CaseStudy({ params }: Params) {
  const { slug } = await params;
  const [p, { shelves, projects }] = await Promise.all([getProject(slug), getShelves()]);
  if (!p) notFound();

  // which crate it's in, and its position there (sleeve colour + "Put it back" target)
  const shelf = shelves.find((s) => s.projects.some((q) => q.slug === slug));
  const positionInCrate = Math.max(0, shelf?.projects.findIndex((q) => q.slug === slug) ?? 0);
  const backHref = shelf ? `/?crate=${shelf.id}&record=${p.slug}#crate` : "/#crate";
  const crateName = shelves.length > 1 && shelf ? `${shelf.name} crate` : "the crate";

  // previous / next across all crates, wrapping around
  const index = Math.max(0, projects.findIndex((q) => q.slug === slug));
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <article>
      <header className="case-head">
        <div className="case-deck">
          <Deck project={p} index={positionInCrate} />
          <Link href={backHref} className="case-return">
            <CrateIcon size={44} />
            <span>
              <b>Put it back</b>
              <span className="cap">{crateName}</span>
            </span>
          </Link>
        </div>

        <div className="case-meta">
          <Link href={backHref} className="case-back cap">
            <span aria-hidden="true">←</span>
            <CrateIcon size={22} />
            Back to {crateName}
          </Link>
          <span className="cap">
            {p.cat} · {p.years}
            {shelf && shelves.length > 1 && ` · ${shelf.name}`}
          </span>
          <h1 className="fit" style={fitStyle(p.name)}>
            {p.name}
          </h1>
          <p className="case-kind">{p.kind}</p>
          <p className="case-summary">{p.summary}</p>
          <dl className="case-facts">
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
        <figure className="case-shot">
          <Image src={p.image} alt={`${p.name} screenshot`} width={1600} height={1000} sizes="100vw" priority />
          {p.imageNote && <figcaption className="cap">{p.imageNote}</figcaption>}
        </figure>
      )}

      {p.gallery && p.gallery.length > 0 && (
        <div className="case-gallery">
          {p.gallery.map((g) => (
            <figure key={g.src}>
              <Image src={g.src} alt={g.caption ?? `${p.name} screenshot`} width={1600} height={1000} sizes="(max-width: 980px) 100vw, 50vw" />
              {g.caption && <figcaption className="cap">{g.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}

      <div className="case-body">
        <aside className="case-aside">
          <div className="case-aside-inner">
            <h2 className="cap">Tracklist</h2>
            <Tracklist project={p} />
          </div>
        </aside>
        <div className="prose">
          <Markdown remarkPlugins={[remarkGfm]}>{p.body}</Markdown>
        </div>
      </div>

      {projects.length > 1 && prev && next && (
        <nav className="case-next" aria-label="More projects">
          <Link href={`/work/${prev.slug}`}>
            <span className="cap">← Previous record</span>
            <b className="fit" style={fitStyle(prev.name)}>
              {prev.name}
            </b>
          </Link>
          <Link href={`/work/${next.slug}`}>
            <span className="cap">Next record →</span>
            <b className="fit" style={fitStyle(next.name)}>
              {next.name}
            </b>
          </Link>
        </nav>
      )}
    </article>
  );
}
