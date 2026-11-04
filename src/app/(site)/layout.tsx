/**
 * Layout for the public pages (home, case studies, CV): the top bar and the
 * footer. The top-bar ticker is built here from the first three projects,
 * the next gig and the status line in content/site.ts.
 */
import { TopBar, type TickerItem } from "@/components/layout/TopBar";
import { site } from "@/content/site";
import { getProjects, getUpcomingGigs } from "@/lib/content";
import { fmtDate } from "@/lib/format";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [projects, gigs] = await Promise.all([getProjects(), getUpcomingGigs()]);
  const nextGig = gigs?.[0];

  const ticker: TickerItem[] = [
    ...projects.slice(0, 3).map((p) => ({ title: p.name, text: `${p.kind}, ${p.stack.slice(0, 2).join(" & ")}` })),
    ...(nextGig ? [{ title: "Next gig", text: `${fmtDate(nextGig.date, { weekday: "short", month: "short", day: "numeric" })}, ${nextGig.act}` }] : []),
    { title: "Status", text: site.status },
  ];

  return (
    <>
      <TopBar ticker={ticker} />
      <main>{children}</main>
      <footer className="site-footer">
        <span className="cap">
          © {new Date().getFullYear()} {site.name}
        </span>
      </footer>
    </>
  );
}
