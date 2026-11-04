/**
 * A project's case study: /work/<slug>
 *
 * Header (record + "Put it back", title, facts), the screenshots (main image
 * + gallery, in a viewer), then the Side A / B tracklist next to the Markdown
 * write-up, and links to the previous / next record. All content is edited
 * in /admin/projects. New projects get a page without a redeploy
 * (dynamicParams); drafts 404.
 * Styles: styles/case-study.css
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fitStyle } from "@/lib/format";
import { getProject, getProjects, getShelves } from "@/lib/content";
import { CrateIcon } from "@/components/records/CrateIcon";
import { Turntable } from "@/components/records/Turntable";
import { Tracklist } from "@/components/records/Tracklist";
import { ScreenshotViewer, type Shot } from "@/components/case-study/ScreenshotViewer";
import { Arrow } from "@/components/layout/Arrow";

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

  // the main screenshot first, then the gallery
  const shots: Shot[] = [
    ...(p.image ? [{ src: p.image, alt: `${p.name} screenshot`, caption: p.imageNote }] : []),
    ...(p.gallery ?? []).map((g) => ({ src: g.src, alt: g.caption ?? `${p.name} screenshot`, caption: g.caption })),
  ];

  return (
    <article>
      <header className="case-head">
        <div className="case-deck">
          <Turntable project={p} index={positionInCrate} />
        </div>

        <div className="case-meta">
          <Link href={backHref} className="case-back cap">
            <Arrow dir="left" />
            <CrateIcon size={22} />
            Put it back in {crateName.startsWith("the ") ? crateName : `the ${crateName}`}
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
                        {l.label} <Arrow dir="out" />
                      </a>
                    </span>
                  ))}
                </dd>
              </>
            )}
          </dl>
        </div>
      </header>

      {shots.length > 0 && <ScreenshotViewer shots={shots} />}

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
            <span className="cap">
              <Arrow dir="left" /> Previous record
            </span>
            <b className="fit" style={fitStyle(prev.name)}>
              {prev.name}
            </b>
          </Link>
          <Link href={`/work/${next.slug}`}>
            <span className="cap">
              Next record <Arrow />
            </span>
            <b className="fit" style={fitStyle(next.name)}>
              {next.name}
            </b>
          </Link>
        </nav>
      )}
    </article>
  );
}
