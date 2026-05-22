import Link from "next/link";
import Image from "next/image";
import {
	IconBrandGithub,
	IconArrowRight,
	IconMail,
	IconMapPin,
} from "@tabler/icons-react";
import { getAllWorks, getPage } from "../../lib/api";
import { WorksResponse, ContentfulImage } from "@/types/contentful";
import HeroHoneycomb from "./HeroHoneycomb";
import MobileHoneycomb from "./MobileHoneycomb";

const STACK = ["React", "Next.js", "TypeScript", "Java", "PostgreSQL", "Node.js"];

const Home = async () => {
	const [landingPage, works] = await Promise.all([
		getPage("landing-page"),
		getAllWorks() as Promise<WorksResponse>,
	]);

	const headshot = landingPage.blocksCollection.items
		.flatMap((b) => b.columnsCollection?.items ?? [])
		.flatMap((c) => c.rowsCollection?.items ?? [])
		.find((r) => r.__typename === "Image")?.image?.url;
	const featured = works.workCategoryCollection.items
		.flatMap((cat) => cat.worksCollection.items.map((work) => ({ work, category: cat.category })));

	const fcrEntry = featured[0];
	const fcrPhotos = fcrEntry
		? [fcrEntry.work.photo, ...(fcrEntry.work.otherImagesCollection?.items ?? [])]
		: [];

	return (
		<div className="overflow-y-auto h-full pb-[80px] lg:pb-0">

			{/* ── HERO ──────────────────────────────────────────────────── */}
			<div className="relative lg:min-h-[calc(100dvh-20px)] flex flex-col overflow-hidden">
				{/* Mobile honeycomb block — sits above the bio */}
				<div className="lg:hidden">
					<MobileHoneycomb featured={featured} headshot={headshot} />
				</div>

				{/* Honeycomb — desktop only */}
				<HeroHoneycomb featured={featured} headshot={headshot} />

				{/* Bio content */}
				<div className="relative z-10 flex flex-col justify-center flex-1 pl-[32px] pr-[32px] lg:pl-[72px] lg:pr-[52px] py-[20px] lg:py-[48px]">
					<div className="flex flex-col gap-[24px] max-w-[500px]">
						<h1 className="text-[72px] lg:text-[96px] xl:text-[116px] font-black text-foreground leading-[0.87] tracking-[-0.04em]">
							Jack<br />Mechem
						</h1>

						<div className="flex items-center gap-[10px]">
							<span className="text-[13px] font-semibold text-foreground-sec">
								Freelance Full-Stack Engineer
							</span>
							<span className="text-foreground-sec/30">·</span>
							<span className="flex items-center gap-[3px] text-[12px] text-foreground-sec/50">
								<IconMapPin size={11} strokeWidth={2} />
								Los Angeles, CA
							</span>
						</div>

						<p className="text-[14px] lg:text-[15px] text-foreground-sec leading-relaxed">
							I&apos;m a freelance full-stack engineer based in Los Angeles, California.
						</p>

						<div className="flex items-center gap-[8px] flex-wrap">
							<a
								href="https://github.com/JackMechem"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-[7px] px-[16px] py-[9px] bg-blue text-primary rounded-[12px] text-[12px] font-bold hover:bg-blue/85 transition-colors"
							>
								<IconBrandGithub size={15} /> GitHub
							</a>
							<Link
								href="/contact"
								className="flex items-center gap-[7px] px-[16px] py-[9px] bg-secondary/60 hover:bg-secondary text-foreground rounded-[12px] text-[12px] font-bold transition-colors"
							>
								<IconMail size={15} /> Contact
							</Link>
							<Link
								href="/work"
								className="flex items-center gap-[5px] px-[10px] py-[9px] text-foreground-sec hover:text-foreground text-[12px] font-semibold transition-colors"
							>
								View Work <IconArrowRight size={13} />
							</Link>
						</div>

						<div className="flex flex-wrap gap-[6px]">
							{STACK.map((s) => (
								<span key={s} className="text-[10px] text-foreground-sec/55 bg-secondary/30 border border-secondary px-[10px] py-[4px] rounded-full">
									{s}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* ── FCR PHOTO GALLERY ─────────────────────────────────────── */}
			{fcrPhotos.length > 0 && (
				<>
					<div className="px-[28px] lg:px-[64px] py-[40px] lg:py-[56px]">
						<h2 className="text-[28px] lg:text-[36px] font-black text-foreground leading-tight tracking-[-0.02em]">
							{fcrEntry!.work.title}
						</h2>
						<p className="text-[13px] lg:text-[15px] text-foreground-sec mt-[10px] max-w-[520px] leading-relaxed">
							{fcrEntry!.work.shortDescription}
						</p>
					</div>
					{fcrPhotos.map((photo, i) => (
						<div
							key={i}
							className="relative overflow-hidden rounded-[16px] border border-secondary"
							style={{
								margin: "10px",
								aspectRatio: `${photo.width}/${photo.height}`,
							}}
						>
							<Image src={photo.url} alt={fcrEntry!.work.title} fill className="object-cover" />
						</div>
					))}
				</>
			)}
		</div>
	);
};

export default Home;
