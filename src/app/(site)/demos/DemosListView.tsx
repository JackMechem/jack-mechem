"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
	IconSearch,
	IconExternalLink,
	IconBriefcase,
	IconAlertTriangle,
} from "@tabler/icons-react";
import { Work, WorkCategory } from "@/types/contentful";

interface DemosListViewProps {
	categories: WorkCategory[];
	initialSlug?: string;
}

interface FlatWork {
	work: Work;
	category: string;
}

// Tabs per demo — add more here later
const DEMO_TABS = [
	{ id: "live-demo", label: "Live Demo" },
];

// Per-slug warnings shown above the iframe
const DEMO_WARNINGS: Record<string, string> = {
	"doem-shop": "Payments are no longer accepted on this website.",
};

const DemosListView = ({ categories, initialSlug }: DemosListViewProps) => {
	const flatWorks: FlatWork[] = categories.flatMap((cat) =>
		cat.worksCollection.items.map((work) => ({ work, category: cat.category })),
	);
	const categoryNames = categories.map((c) => c.category);
	const router = useRouter();

	const initialWork = (initialSlug ? flatWorks.find((fw) => fw.work.slug === initialSlug) : null) ?? flatWorks[0];
	const [selected, setSelectedState] = useState<FlatWork>(initialWork);
	const [activeTab, setActiveTab] = useState("live-demo");

	useEffect(() => {
		if (!initialSlug) return;
		const match = flatWorks.find((fw) => fw.work.slug === initialSlug);
		if (match) setSelectedState(match);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialSlug]);

	const setSelected = useCallback((fw: FlatWork) => {
		setSelectedState(fw);
		router.replace(`/demos?project=${fw.work.slug}`, { scroll: false });
	}, [router]);
	const [leftPct, setLeftPct] = useState(30);
	const [search, setSearch] = useState("");
	const [activeCategory, setActiveCategory] = useState<string | null>(null);

	const isDragging = useRef(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setActiveTab("live-demo");
	}, [selected.work.sys.id]);

	useEffect(() => {
		const onMove = (e: MouseEvent) => {
			if (!isDragging.current || !containerRef.current) return;
			const rect = containerRef.current.getBoundingClientRect();
			const pct = ((e.clientX - rect.left) / rect.width) * 100;
			setLeftPct(Math.min(Math.max(pct, 15), 60));
		};
		const onUp = () => { isDragging.current = false; };
		window.addEventListener("mousemove", onMove);
		window.addEventListener("mouseup", onUp);
		return () => {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onUp);
		};
	}, []);

	const filtered = flatWorks.filter(({ work, category }) => {
		const matchesCat = activeCategory === null || category === activeCategory;
		const q = search.toLowerCase();
		const matchesSearch =
			q === "" ||
			work.title.toLowerCase().includes(q) ||
			work.shortDescription?.toLowerCase().includes(q) ||
			category.toLowerCase().includes(q);
		return matchesCat && matchesSearch;
	});

	const filterBar = (
		<div className="p-[10px] flex flex-col gap-[8px] shrink-0">
			<div className="flex items-center gap-[8px] bg-secondary/50 rounded-[10px] px-[10px] py-[6px]">
				<IconSearch size={13} className="text-foreground-sec shrink-0" />
				<input
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search..."
					className="flex-1 bg-transparent text-[12px] text-foreground placeholder:text-foreground-sec outline-none"
				/>
			</div>
			{categoryNames.length > 1 && (
				<div className="flex flex-wrap gap-[5px]">
					<button
						onClick={() => setActiveCategory(null)}
						className={
							"text-[10px] font-bold tracking-wider py-[3px] px-[10px] rounded-full transition-colors cursor-pointer " +
							(activeCategory === null
								? "bg-blue text-primary"
								: "bg-secondary text-foreground-sec hover:bg-blue/20 hover:text-blue")
						}
					>
						All
					</button>
					{categoryNames.map((cat) => (
						<button
							key={cat}
							onClick={() => setActiveCategory(cat)}
							className={
								"text-[10px] font-bold tracking-wider py-[3px] px-[10px] rounded-full transition-colors cursor-pointer " +
								(activeCategory === cat
									? "bg-blue text-primary"
									: "bg-secondary text-foreground-sec hover:bg-blue/20 hover:text-blue")
							}
						>
							{cat}
						</button>
					))}
				</div>
			)}
		</div>
	);

	const listItems = filtered.length > 0 ? (
		filtered.map(({ work, category }) => {
			const isSelected = selected.work.sys.id === work.sys.id;
			return (
				<div
					key={work.sys.id}
					onClick={() => setSelected({ work, category })}
					className={
						"flex gap-[12px] p-[10px] cursor-pointer transition-colors m-[5px] rounded-xl " +
						(isSelected ? "bg-blue/20 shadow-md shadow-blue/10" : "hover:bg-secondary/50")
					}
				>
					<div className="relative w-[52px] h-[52px] shrink-0 rounded-[8px] overflow-hidden bg-secondary">
						<Image src={work.photo.url} alt={work.title} fill className="object-cover" />
					</div>
					<div className="flex flex-col gap-[3px] overflow-hidden min-w-0 flex-1">
						<span className="text-[11px] text-blue font-bold tracking-wider bg-blue/20 py-[2px] px-[8px] rounded-full w-fit">
							{category}
						</span>
						<p className="text-[14px] font-bold text-foreground truncate">{work.title}</p>
						<p className="text-[11px] text-foreground-sec line-clamp-1">{work.shortDescription}</p>
					</div>
					<Link
						href={`/work?project=${work.slug}`}
						onClick={(e) => e.stopPropagation()}
						className="shrink-0 self-center p-[6px] rounded-[8px] text-foreground-sec hover:text-blue hover:bg-blue/10 transition-colors cursor-pointer"
						title="View project details"
					>
						<IconExternalLink size={14} />
					</Link>
				</div>
			);
		})
	) : (
		<p className="text-foreground-sec text-[12px] text-center py-[20px] px-[10px]">
			No demos match your filters.
		</p>
	);

	return (
		<>
			{/* ── Desktop: split view ─────────────────────────────────── */}
			<div ref={containerRef} className="lg:flex hidden flex-row h-full select-none">
				{/* Left panel */}
				<div
					style={{ width: `${leftPct}%` }}
					className="h-full flex flex-col shrink-0 overflow-hidden"
				>
					{filterBar}
					<div className="overflow-y-auto flex-1 min-h-0">
						{listItems}
					</div>
				</div>

				{/* Drag handle */}
				<div
					onMouseDown={(e) => { isDragging.current = true; e.preventDefault(); }}
					className="w-[10px] shrink-0 flex items-center justify-center cursor-col-resize group"
				>
					<div className="w-[3px] h-[40px] rounded-full bg-blue/20 group-hover:bg-blue/50 transition-colors" />
				</div>

				{/* Right panel */}
				<div className="flex-1 min-w-0 h-full flex flex-col border-l border-secondary">
					{/* Header */}
					<div className="px-[20px] py-[14px] shrink-0 border-b border-secondary">
						<div className="flex items-center gap-[8px] flex-wrap">
							<span className="text-[11px] text-blue font-bold tracking-wider bg-blue/20 py-[2px] px-[10px] rounded-full">
								{selected.category}
							</span>
							<Link
								href={`/work?project=${selected.work.slug}`}
								className="flex items-center gap-[5px] text-[11px] font-bold tracking-wider text-foreground-sec bg-secondary/60 hover:bg-secondary hover:text-foreground py-[2px] px-[10px] rounded-full transition-colors"
							>
								<IconBriefcase size={12} />
								View Project
							</Link>
							<a
								href={selected.work.link}
								target="_blank"
								rel="noopener noreferrer"
								className="ml-auto flex items-center gap-[5px] text-[11px] text-foreground-sec hover:text-blue transition-colors cursor-pointer"
							>
								<IconExternalLink size={13} />
								Open
							</a>
						</div>
						<h2 className="text-[18px] font-bold text-foreground mt-[4px] mb-[2px]">{selected.work.title}</h2>
						<p className="text-[13px] text-foreground-sec">{selected.work.shortDescription}</p>
					</div>

					{/* Tab bar */}
					<div className="flex border-b border-secondary shrink-0 px-[16px]">
						{DEMO_TABS.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={
									"py-[8px] px-[4px] mr-[16px] text-[12px] font-semibold border-b-[2px] transition-colors cursor-pointer " +
									(activeTab === tab.id
										? "border-blue text-blue"
										: "border-transparent text-foreground-sec hover:text-foreground")
								}
							>
								{tab.label}
							</button>
						))}
					</div>

					{/* Warning banner */}
					{DEMO_WARNINGS[selected.work.slug] && (
						<div className="px-[16px] py-[8px] bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-[8px] shrink-0">
							<IconAlertTriangle size={14} className="text-amber-400 shrink-0" />
							<p className="text-[12px] text-amber-400">{DEMO_WARNINGS[selected.work.slug]}</p>
						</div>
					)}

					{/* Tab content */}
					{activeTab === "live-demo" && (
						<div className="flex-1 min-h-0 select-auto">
							<iframe
								key={selected.work.sys.id}
								src={selected.work.link}
								title={selected.work.title}
								className="w-full h-full border-0 bg-white"
								allow="fullscreen"
							/>
						</div>
					)}
				</div>
			</div>

			{/* ── Mobile: stacked ─────────────────────────────────────── */}
			<div className="lg:hidden flex flex-col pb-[120px] px-[10px]">
				{filterBar}
				<div className="flex flex-col">
					{filtered.length > 0 ? (
						filtered.map(({ work, category }) => {
							const isSelected = selected.work.sys.id === work.sys.id;
							return (
								<div
									key={work.sys.id}
									onClick={() => setSelected({ work, category })}
									className={
										"flex gap-[12px] p-[10px] cursor-pointer transition-colors rounded-xl " +
										(isSelected ? "bg-blue/20 shadow-md shadow-blue/10" : "hover:bg-secondary/50")
									}
								>
									<div className="relative w-[48px] h-[48px] shrink-0 rounded-[8px] overflow-hidden bg-secondary">
										<Image src={work.photo.url} alt={work.title} fill className="object-cover" />
									</div>
									<div className="flex flex-col gap-[2px] overflow-hidden min-w-0 flex-1">
										<span className="text-[10px] text-blue font-bold tracking-wider bg-blue/20 py-[2px] px-[6px] rounded-full w-fit">
											{category}
										</span>
										<p className="text-[13px] font-bold text-foreground truncate">{work.title}</p>
										<p className="text-[11px] text-foreground-sec line-clamp-1">{work.shortDescription}</p>
									</div>
								</div>
							);
						})
					) : (
						<p className="text-foreground-sec text-[12px] text-center py-[20px]">
							No demos match your filters.
						</p>
					)}
				</div>

				{/* Selected demo card */}
				<div className="border-t border-secondary mt-[4px]">
					<div className="py-[12px] flex flex-col gap-[6px]">
						<div className="flex items-center justify-between gap-[10px]">
							<span className="text-[11px] text-blue font-bold tracking-wider bg-blue/20 py-[2px] px-[8px] rounded-full">
								{selected.category}
							</span>
							<a
								href={selected.work.link}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-[5px] text-[11px] text-foreground-sec hover:text-blue transition-colors shrink-0"
							>
								<IconExternalLink size={13} />
								Open site
							</a>
						</div>
						<h3 className="text-[18px] font-bold text-foreground">{selected.work.title}</h3>
						<p className="text-[13px] text-foreground-sec">{selected.work.shortDescription}</p>
					</div>
					<Link
						href={`/work?project=${selected.work.slug}`}
						className="flex items-center gap-[8px] py-[12px] border-t border-secondary text-[13px] font-semibold text-blue hover:bg-blue/10 transition-colors"
					>
						<IconExternalLink size={14} />
						View Project Details
					</Link>
				</div>
			</div>
		</>
	);
};

export default DemosListView;
