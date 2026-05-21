"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IconSearch, IconLayoutList } from "@tabler/icons-react";
import WorkListView from "./WorkListView";
import { WorkCategory } from "@/types/contentful";
import { useWorkLayout, useSetWorkLayout } from "@/stores/useWorkLayoutStore";

interface WorkPageProps {
	categories: WorkCategory[];
	initialSlug?: string;
}

const WorkPage = ({ categories, initialSlug }: WorkPageProps) => {
	const layout = useWorkLayout();
	const setLayout = useSetWorkLayout();
	const router = useRouter();

	// Grid-view search / filter state
	const [search, setSearch] = useState("");
	const [activeCategory, setActiveCategory] = useState<string | null>(null);
	const [activeYear, setActiveYear] = useState<number | null>(null);
	const categoryNames = categories.map((c) => c.category);

	const allWorks = categories.flatMap((cat) =>
		cat.worksCollection.items.map((work) => ({ work, category: cat.category })),
	);
	const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	const yearFromIso = (d: string) => parseInt(d.slice(0, 4), 10);
	const monthFromIso = (d: string) => MONTHS[parseInt(d.slice(5, 7), 10) - 1] ?? "";

	const allYears = [...new Set(
		allWorks.flatMap(({ work }) => [
			work.startDate ? yearFromIso(work.startDate) : null,
			work.endDate ? yearFromIso(work.endDate) : null,
		]).filter((y): y is number => y !== null && !isNaN(y)),
	)].sort((a, b) => b - a);

	const fmtDateRange = (start: string, end: string) => {
		const sy = yearFromIso(start); const ey = yearFromIso(end);
		const sm = monthFromIso(start); const em = monthFromIso(end);
		if (sy === ey) return `${sm} – ${em} '${String(sy).slice(2)}`;
		return `${sm} '${String(sy).slice(2)} – ${em} '${String(ey).slice(2)}`;
	};

	const pillClass = (active: boolean) =>
		"text-[10px] font-bold tracking-wider py-[3px] px-[10px] rounded-full transition-colors cursor-pointer " +
		(active ? "bg-blue text-primary" : "bg-secondary text-foreground-sec hover:bg-blue/20 hover:text-blue");

	if (layout === "list") {
		return (
			<div className="lg:h-full flex flex-col px-[10px] lg:px-0 pb-[100px] lg:pb-0">
				<div className="flex-1 min-h-0">
					<WorkListView
						categories={categories}
						initialSlug={initialSlug}
						onLayoutChange={setLayout}
					/>
				</div>
			</div>
		);
	}

	// ── Grid layout ──────────────────────────────────────────────────────────
	const filtered = allWorks.filter(({ work, category }) => {
		const matchesCat = activeCategory === null || category === activeCategory;
		const q = search.toLowerCase();
		const matchesSearch =
			q === "" ||
			work.title.toLowerCase().includes(q) ||
			work.shortDescription?.toLowerCase().includes(q) ||
			category.toLowerCase().includes(q);
		const matchesYear = activeYear === null ||
			(work.startDate && work.endDate &&
				yearFromIso(work.startDate) <= activeYear &&
				yearFromIso(work.endDate) >= activeYear);
		return matchesCat && matchesSearch && matchesYear;
	});

	const grouped = categories
		.map((cat) => ({
			category: cat.category,
			items: filtered.filter((fw) => fw.category === cat.category),
		}))
		.filter((g) => g.items.length > 0);

	const handleCardClick = (slug: string) => {
		setLayout("list");
		router.push(`/work?project=${slug}`);
	};

	return (
		<div className="lg:h-full flex flex-col px-[10px] lg:px-0 pb-[100px] lg:pb-0">
			{/* Filter bar */}
			<div className="p-[10px] flex flex-col gap-[8px] border-b border-secondary shrink-0">
				<div className="flex items-center gap-[8px]">
					<div className="flex items-center gap-[8px] bg-secondary/50 rounded-[10px] px-[10px] py-[6px] flex-1">
						<IconSearch size={13} className="text-foreground-sec shrink-0" />
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search..."
							className="flex-1 bg-transparent text-[12px] text-foreground placeholder:text-foreground-sec outline-none"
						/>
					</div>
					<button
						onClick={() => setLayout("list")}
						className="p-[7px] rounded-[10px] bg-secondary/50 hover:bg-secondary transition-colors text-foreground-sec hover:text-foreground shrink-0 cursor-pointer"
						title="List layout"
					>
						<IconLayoutList size={14} />
					</button>
				</div>
				<div className="flex flex-wrap gap-[5px]">
					<button onClick={() => setActiveCategory(null)} className={pillClass(activeCategory === null)}>All</button>
					{categoryNames.map((cat) => (
						<button key={cat} onClick={() => setActiveCategory(cat)} className={pillClass(activeCategory === cat)}>{cat}</button>
					))}
				</div>
				{allYears.length > 0 && (
					<div className="flex flex-wrap gap-[5px]">
						<button onClick={() => setActiveYear(null)} className={pillClass(activeYear === null)}>All years</button>
						{allYears.map((yr) => (
							<button key={yr} onClick={() => setActiveYear(yr)} className={pillClass(activeYear === yr)}>{yr}</button>
						))}
					</div>
				)}
			</div>

			{/* Grid content */}
			<div className="overflow-y-auto flex-1 min-h-0">
				{grouped.length > 0 ? (
					<div className="p-[10px] flex flex-col gap-[20px]">
						{grouped.map(({ category, items }) => (
							<div key={category}>
								<div className="flex items-center gap-[8px] mb-[8px]">
									<span className="text-[10px] font-bold tracking-wider text-foreground-sec uppercase">
										{category}
									</span>
									<div className="flex-1 h-px bg-secondary" />
								</div>
								<div className="grid grid-cols-2 lg:grid-cols-3 gap-[8px]">
									{items.map(({ work }) => (
										<div
											key={work.sys.id}
											onClick={() => handleCardClick(work.slug)}
											className="flex flex-col rounded-[12px] overflow-hidden bg-secondary/30 hover:bg-secondary/60 cursor-pointer transition-colors group"
										>
											<div className="relative aspect-video overflow-hidden">
												<Image
													src={work.photo.url}
													alt={work.title}
													fill
													className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
												/>
											</div>
											<div className="p-[10px] flex flex-col gap-[4px]">
												<span className="text-[10px] text-blue font-bold tracking-wider bg-blue/20 py-[2px] px-[6px] rounded-full w-fit">
													{category}
												</span>
												{work.startDate && work.endDate && (
													<span className="text-[10px] text-foreground-sec/60">
														{fmtDateRange(work.startDate, work.endDate)}
													</span>
												)}
												<p className="text-[12px] font-bold text-foreground leading-tight line-clamp-2">
													{work.title}
												</p>
												<p className="text-[11px] text-foreground-sec line-clamp-2">
													{work.shortDescription}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="text-foreground-sec text-[12px] text-center py-[20px]">
						No projects match your filters.
					</p>
				)}
			</div>
		</div>
	);
};

export default WorkPage;
