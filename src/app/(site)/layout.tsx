import { TopBar } from "@/components/TopBar";
import { site } from "@/content/site";
import { getProjects, getUpcomingGigs } from "@/lib/content";
import { fmtDate } from "@/lib/format";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [projects, gigs] = await Promise.all([getProjects(), getUpcomingGigs()]);
  const next = gigs?.[0];
  const items = [
    ...projects.slice(0, 3).map((p) => ({ b: p.name, text: `${p.kind}, ${p.stack.slice(0, 2).join(" & ")}` })),
    ...(next ? [{ b: "Next gig", text: `${fmtDate(next.date, { weekday: "short", month: "short", day: "numeric" })}, ${next.act}` }] : []),
    { b: "Status", text: site.status },
  ];
  return (
    <>
      <TopBar items={items} />
      <main>{children}</main>
      <footer className="site-foot">
        <span className="cap">© {new Date().getFullYear()} {site.name}</span>
      </footer>
    </>
  );
}
