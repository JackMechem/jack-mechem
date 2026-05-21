import Link from "next/link";
import Image from "next/image";
import {
	IconBriefcase,
	IconUser,
	IconMail,
	IconAppWindow,
	IconBrandGithub,
	IconArrowRight,
	IconMapPin,
} from "@tabler/icons-react";
import { getPage, getAllWorks } from "../../lib/api";
import { WorksResponse } from "@/types/contentful";

const NAV = [
	{ href: "/work",    icon: IconBriefcase, label: "Work",    desc: "Projects & case studies",  borderClass: "border-r border-b lg:border-b-0 border-secondary" },
	{ href: "/demos",   icon: IconAppWindow, label: "Demos",   desc: "Live project demos",        borderClass: "border-b lg:border-b-0 lg:border-r border-secondary" },
	{ href: "/about",   icon: IconUser,      label: "About",   desc: "Background & skills",       borderClass: "border-r border-secondary" },
	{ href: "/contact", icon: IconMail,      label: "Contact", desc: "Get in touch",              borderClass: "" },
];

const Home = async () => {
	const [landingPage, works] = await Promise.all([
		getPage("landing-page"),
		getAllWorks() as Promise<WorksResponse>,
	]);

	// Extract profile photo from Contentful blocks
	const photoUrl = landingPage.blocksCollection.items
		.flatMap((b) => b.columnsCollection?.items ?? [])
		.flatMap((c) => c.rowsCollection?.items ?? [])
		.find((r) => r.__typename === "Image")?.image?.url;

	// Recent projects for the featured section
	const featured = (works as WorksResponse).workCategoryCollection.items
		.flatMap((cat) => cat.worksCollection.items.map((work) => ({ work, category: cat.category })))
		.slice(0, 4);

	return (
		<div className="overflow-y-auto h-full flex flex-col pb-[80px] lg:pb-0">

			{/* ── Hero ──────────────────────────────────────────────── */}
			<div className="flex flex-col lg:flex-row">
				{/* Bio */}
				<div className="flex-1 p-[32px] lg:p-[48px] flex flex-col gap-[20px] justify-center">
					<div className="flex items-center gap-[8px] flex-wrap">
						<span className="text-[11px] text-blue font-bold tracking-wider bg-blue/20 py-[2px] px-[10px] rounded-full">
							Full-Stack Engineer
						</span>
						<span className="flex items-center gap-[4px] text-[11px] text-foreground-sec">
							<IconMapPin size={11} />
							Los Angeles, CA
						</span>
					</div>

					<h1 className="text-[52px] lg:text-[72px] font-bold text-foreground leading-[1.05] tracking-tight">
						Jack<br />Mechem
					</h1>

					<p className="text-[14px] text-foreground-sec leading-relaxed max-w-[420px]">
						I build web applications end-to-end — from polished interfaces to
						solid backend architecture. React, Next.js, Java, and more.
					</p>

					<div className="flex items-center gap-[8px] flex-wrap">
						<a
							href="https://github.com/JackMechem"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-[7px] px-[14px] py-[7px] bg-blue text-primary rounded-[10px] text-[12px] font-bold hover:bg-blue/80 transition-colors cursor-pointer"
						>
							<IconBrandGithub size={15} />
							GitHub
						</a>
						<Link
							href="/contact"
							className="flex items-center gap-[7px] px-[14px] py-[7px] bg-secondary/60 hover:bg-secondary text-foreground rounded-[10px] text-[12px] font-bold transition-colors"
						>
							<IconMail size={15} />
							Contact
						</Link>
						<Link
							href="/work"
							className="flex items-center gap-[6px] px-[14px] py-[7px] hover:bg-secondary/50 text-foreground-sec hover:text-foreground rounded-[10px] text-[12px] font-bold transition-colors"
						>
							View Work <IconArrowRight size={13} />
						</Link>
					</div>
				</div>

				{/* Photo */}
				<div className="lg:w-[300px] border-t lg:border-t-0 lg:border-l border-secondary flex items-center justify-center p-[32px]">
					{photoUrl ? (
						<div className="relative w-[160px] h-[160px] lg:w-[200px] lg:h-[200px] rounded-[20px] overflow-hidden ring-2 ring-blue/30">
							<Image src={photoUrl} alt="Jack Mechem" fill className="object-cover" priority />
						</div>
					) : (
						<div className="w-[160px] h-[160px] lg:w-[200px] lg:h-[200px] rounded-[20px] bg-secondary/50 ring-2 ring-blue/20" />
					)}
				</div>
			</div>

			<div className="border-t border-secondary" />

			{/* ── Quick nav ─────────────────────────────────────────── */}
			<div className="grid grid-cols-2 lg:grid-cols-4 border-b border-secondary">
				{NAV.map(({ href, icon: Icon, label, desc, borderClass }) => (
					<Link
						key={href}
						href={href}
						className={`flex flex-col gap-[6px] p-[20px] lg:p-[24px] hover:bg-secondary/50 transition-colors ${borderClass}`}
					>
						<Icon size={18} className="text-blue" />
						<p className="text-[14px] font-bold text-foreground">{label}</p>
						<p className="text-[11px] text-foreground-sec">{desc}</p>
					</Link>
				))}
			</div>

			{/* ── Featured work ─────────────────────────────────────── */}
			<div className="p-[24px] lg:p-[32px] flex-1">
				<div className="flex items-center justify-between mb-[16px]">
					<div className="flex items-center gap-[8px]">
						<span className="text-[10px] font-bold tracking-wider text-foreground-sec uppercase">
							Featured Work
						</span>
						<div className="h-px w-[32px] bg-secondary" />
					</div>
					<Link
						href="/work"
						className="flex items-center gap-[4px] text-[11px] text-foreground-sec hover:text-blue transition-colors font-semibold"
					>
						View all <IconArrowRight size={12} />
					</Link>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-[6px]">
					{featured.map(({ work, category }) => (
						<Link
							key={work.sys.id}
							href={`/work?project=${work.slug}`}
							className="flex gap-[12px] p-[10px] rounded-[12px] hover:bg-secondary/50 transition-colors group"
						>
							<div className="relative w-[80px] h-[56px] shrink-0 rounded-[8px] overflow-hidden">
								<Image
									src={work.photo.url}
									alt={work.title}
									fill
									className="object-cover group-hover:scale-[1.04] transition-transform duration-300"
								/>
							</div>
							<div className="flex flex-col gap-[3px] min-w-0 justify-center">
								<span className="text-[10px] text-blue font-bold tracking-wider bg-blue/20 py-[2px] px-[6px] rounded-full w-fit">
									{category}
								</span>
								<p className="text-[13px] font-bold text-foreground truncate">{work.title}</p>
								<p className="text-[11px] text-foreground-sec line-clamp-1">{work.shortDescription}</p>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default Home;
