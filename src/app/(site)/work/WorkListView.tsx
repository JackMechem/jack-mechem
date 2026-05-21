"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Markdown from "react-markdown";
import {
	IconLink,
	IconSearch,
	IconX,
	IconLayoutList,
	IconLayoutGrid,
	IconAdjustmentsHorizontal,
} from "@tabler/icons-react";
import { Work, WorkCategory } from "@/types/contentful";

interface WorkListViewProps {
	categories: WorkCategory[];
}

interface FlatWork {
	work: Work;
	category: string;
}

// ── Lightbox ────────────────────────────────────────────────────────────────

const Lightbox = ({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) => {
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);

	return createPortal(
		<div className="fixed inset-0 z-[9999] bg-black/92 flex flex-col" onClick={onClose}>
			<div className="flex items-center justify-between px-[24px] py-[16px] shrink-0">
				<span className="text-white/60 text-[11px] font-bold uppercase tracking-widest">{alt}</span>
				<button
					onClick={onClose}
					className="w-[36px] h-[36px] rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
				>
					<IconX size={18} />
				</button>
			</div>
			<div
				className="flex-1 flex items-center justify-center px-[24px] pb-[24px] min-h-0"
				onClick={(e) => e.stopPropagation()}
			>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img src={src} alt={alt} className="max-w-full max-h-full object-contain rounded-[12px]" />
			</div>
		</div>,
		document.body,
	);
};

// ── HoverPreview ─────────────────────────────────────────────────────────────

const PREVIEW_WIDTH = 280;
const CURSOR_OFFSET = 20;

const HoverPreview = ({ fw, x, y }: { fw: FlatWork; x: number; y: number }) => {
	const flipX = x + CURSOR_OFFSET + PREVIEW_WIDTH > window.innerWidth;
	const left = flipX ? x - CURSOR_OFFSET - PREVIEW_WIDTH : x + CURSOR_OFFSET;
	const top = Math.min(y + 10, window.innerHeight - 300);

	return createPortal(
		<div
			style={{ left, top, width: PREVIEW_WIDTH }}
			className="fixed z-[9998] pointer-events-none opacity-[0.8] overflow-hidden animate-slideInDown"
		>
			<div className="relative w-full h-[160px] rounded-lg overflow-hidden mb-[5px] shadow-md">
				<Image src={fw.work.photo.url} alt={fw.work.title} fill className="object-cover" />
			</div>
			<div className="p-[12px] flex flex-col gap-[5px] bg-primary/80 rounded-lg shadow-2xl">
				<span className="text-[10px] text-blue font-bold tracking-wider bg-blue/20 py-[2px] px-[8px] rounded-full w-fit">
					{fw.category}
				</span>
				<p className="text-[13px] font-bold text-foreground leading-tight">{fw.work.title}</p>
				<p className="text-[11px] text-foreground-sec line-clamp-2">{fw.work.shortDescription}</p>
			</div>
		</div>,
		document.body,
	);
};

// ── PreviewPanel ─────────────────────────────────────────────────────────────

const PreviewPanel = ({ selected }: { selected: FlatWork }) => {
	const [lightboxSrc, setLightboxSrc] = useState<{ src: string; alt: string } | null>(null);

	return (
		<div className="p-[25px] bg-primary/50">
			{lightboxSrc && (
				<Lightbox src={lightboxSrc.src} alt={lightboxSrc.alt} onClose={() => setLightboxSrc(null)} />
			)}
			<div className="text-[12pt] m-0 text-blue font-bold tracking-wider bg-blue/20 w-fit py-[2px] px-[10px] rounded-full">
				{selected.category}
			</div>
			<a href={selected.work.link}>
				<h2 className="text-blue flex items-center gap-[8px] leading-[100%] mb-[0px] text-[22px]">
					{selected.work.title} <IconLink size={18} />
				</h2>
			</a>
			<p className="text-foreground-sec mb-[7px] text-[16px]">{selected.work.shortDescription}</p>
			<Image
				src={selected.work.photo.url}
				alt={selected.work.title}
				width={selected.work.photo.width}
				height={selected.work.photo.height}
				onClick={() => setLightboxSrc({ src: selected.work.photo.url, alt: selected.work.title })}
				className="w-full h-auto object-cover rounded-[16px] cursor-zoom-in hover:scale-[1.01] transition-transform"
			/>
			<div className="w-full border-b border-secondary my-[10px]" />
			<div className="text-foreground text-[13px] leading-relaxed">
				<Markdown
					components={{
						img(props) {
							const { node, src, alt, ...rest } = props;
							return (
								<img
									src={src}
									alt={alt ?? "project image"}
									onClick={() => src && setLightboxSrc({ src: src as string, alt: alt ?? "project image" })}
									className="rounded-[12px] my-[16px] cursor-zoom-in hover:scale-[1.01] transition-transform w-full"
									{...rest}
								/>
							);
						},
					}}
				>
					{selected.work.longDescription}
				</Markdown>
			</div>
		</div>
	);
};

// ── WorkListView ─────────────────────────────────────────────────────────────

const WorkListView = ({ categories }: WorkListViewProps) => {
	const flatWorks: FlatWork[] = categories.flatMap((cat) =>
		cat.worksCollection.items.map((work) => ({ work, category: cat.category })),
	);
	const categoryNames = categories.map((c) => c.category);

	const [selected, setSelected] = useState<FlatWork>(flatWorks[0]);
	const [leftPct, setLeftPct] = useState(38);
	const [condensed, setCondensed] = useState(false);
	const [filterOpen, setFilterOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [activeCategory, setActiveCategory] = useState<string | null>(null);

	const filterBtnRef = useRef<HTMLButtonElement>(null);

	// Hover preview
	const [hoveredWork, setHoveredWork] = useState<FlatWork | null>(null);
	const [showPreview, setShowPreview] = useState(false);
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
	const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleItemEnter = useCallback((fw: FlatWork, e: React.MouseEvent) => {
		setHoveredWork(fw);
		setMousePos({ x: e.clientX, y: e.clientY });
		hoverTimer.current = setTimeout(() => setShowPreview(true), 280);
	}, []);

	const handleItemMove = useCallback((e: React.MouseEvent) => {
		setMousePos({ x: e.clientX, y: e.clientY });
	}, []);

	const handleItemLeave = useCallback(() => {
		if (hoverTimer.current) clearTimeout(hoverTimer.current);
		setShowPreview(false);
		setHoveredWork(null);
	}, []);

	// Drag resize — always active; tighter min when condensed
	const isDragging = useRef(false);
	const condensedRef = useRef(condensed);
	useEffect(() => { condensedRef.current = condensed; }, [condensed]);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const onMove = (e: MouseEvent) => {
			if (!isDragging.current || !containerRef.current) return;
			const rect = containerRef.current.getBoundingClientRect();
			const pct = ((e.clientX - rect.left) / rect.width) * 100;
			const minPct = condensedRef.current ? 8 : 20;
			setLeftPct(Math.min(Math.max(pct, minPct), 72));
		};
		const onUp = () => { isDragging.current = false; };
		window.addEventListener("mousemove", onMove);
		window.addEventListener("mouseup", onUp);
		return () => {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onUp);
		};
	}, []);

	// Close flyout on outside click
	useEffect(() => {
		if (!filterOpen) return;
		const onDown = (e: MouseEvent) => {
			if (filterBtnRef.current?.contains(e.target as Node)) return;
			setFilterOpen(false);
		};
		window.addEventListener("mousedown", onDown);
		return () => window.removeEventListener("mousedown", onDown);
	}, [filterOpen]);

	const filteredWorks = flatWorks.filter(({ work, category }) => {
		const matchesCategory = activeCategory === null || category === activeCategory;
		const q = search.toLowerCase();
		const matchesSearch =
			q === "" ||
			work.title.toLowerCase().includes(q) ||
			work.shortDescription?.toLowerCase().includes(q) ||
			category.toLowerCase().includes(q);
		return matchesCategory && matchesSearch;
	});

	// Filter flyout portal (condensed mode only)
	const filterFlyout = (() => {
		if (!filterOpen || !filterBtnRef.current) return null;
		const rect = filterBtnRef.current.getBoundingClientRect();
		return createPortal(
			<div
				style={{ left: rect.left, top: rect.bottom + 6, minWidth: 240 }}
				className="fixed z-[9991] bg-primary border border-secondary rounded-[14px] p-[10px] flex flex-col gap-[8px] shadow-xl animate-slideInDown"
				onMouseDown={(e) => e.stopPropagation()}
			>
				<div className="flex items-center gap-[8px] bg-secondary/50 rounded-[10px] px-[10px] py-[6px]">
					<IconSearch size={13} className="text-foreground-sec shrink-0" />
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search..."
						autoFocus
						className="flex-1 bg-transparent text-[12px] text-foreground placeholder:text-foreground-sec outline-none"
					/>
				</div>
				<div className="flex flex-wrap gap-[5px]">
					<button
						onClick={() => setActiveCategory(null)}
						className={
							"text-[10px] font-bold tracking-wider py-[3px] px-[10px] rounded-full transition-colors " +
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
								"text-[10px] font-bold tracking-wider py-[3px] px-[10px] rounded-full transition-colors " +
								(activeCategory === cat
									? "bg-blue text-primary"
									: "bg-secondary text-foreground-sec hover:bg-blue/20 hover:text-blue")
							}
						>
							{cat}
						</button>
					))}
				</div>
			</div>,
			document.body,
		);
	})();

	// Full filter bar (expanded mode)
	const filterBar = (
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
					onClick={() => setCondensed(true)}
					className="p-[7px] rounded-[10px] bg-secondary/50 hover:bg-secondary transition-colors text-foreground-sec hover:text-foreground shrink-0"
					title="Compact image view"
				>
					<IconLayoutGrid size={14} />
				</button>
			</div>
			<div className="flex flex-wrap gap-[5px]">
				<button
					onClick={() => setActiveCategory(null)}
					className={
						"text-[10px] font-bold tracking-wider py-[3px] px-[10px] rounded-full transition-colors " +
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
							"text-[10px] font-bold tracking-wider py-[3px] px-[10px] rounded-full transition-colors " +
							(activeCategory === cat
								? "bg-blue text-primary"
								: "bg-secondary text-foreground-sec hover:bg-blue/20 hover:text-blue")
						}
					>
						{cat}
					</button>
				))}
			</div>
		</div>
	);

	// Minimal bar for condensed mode
	const condensedBar = (
		<div className="p-[8px] border-b border-secondary shrink-0 flex gap-[6px] justify-center">
			<button
				ref={filterBtnRef}
				onClick={() => setFilterOpen((o) => !o)}
				className={
					"p-[7px] rounded-[10px] transition-colors shrink-0 " +
					(filterOpen
						? "bg-blue text-primary"
						: "bg-secondary/50 hover:bg-secondary text-foreground-sec hover:text-foreground")
				}
				title="Search & filter"
			>
				<IconAdjustmentsHorizontal size={14} />
			</button>
			<button
				onClick={() => { setCondensed(false); setFilterOpen(false); }}
				className="p-[7px] rounded-[10px] bg-secondary/50 hover:bg-secondary transition-colors text-foreground-sec hover:text-foreground shrink-0"
				title="Expand list"
			>
				<IconLayoutList size={14} />
			</button>
		</div>
	);

	const listItems = filteredWorks.map(({ work, category }) => {
		const isSelected = selected.work.sys.id === work.sys.id;
		return (
			<div
				key={work.sys.id}
				onClick={() => setSelected({ work, category })}
				onMouseEnter={(e) => !isSelected && handleItemEnter({ work, category }, e)}
				onMouseMove={handleItemMove}
				onMouseLeave={handleItemLeave}
				className={
					"flex gap-[12px] p-[10px] cursor-pointer transition-colors m-[5px] rounded-xl " +
					(isSelected ? "bg-blue/20 shadow-md shadow-blue/10" : "hover:bg-secondary/50")
				}
			>
				<div className="relative self-stretch shrink-0 w-[100px] rounded-[8px] overflow-hidden shadow-sm shadow-blue/10">
					<Image src={work.photo.url} alt={work.title} fill className="object-cover" />
				</div>
				<div className="flex flex-col gap-[3px] overflow-hidden min-w-0">
					<span className="text-[12px] text-blue font-bold tracking-wider bg-blue/20 py-[2px] px-[10px] rounded-full w-fit">
						{category}
					</span>
					<p className="text-[15px] font-bold text-foreground truncate">{work.title}</p>
					<p className="text-[12px] text-foreground-sec line-clamp-1">{work.shortDescription}</p>
				</div>
			</div>
		);
	});

	const emptyState = (
		<p className="text-foreground-sec text-[12px] text-center py-[20px] px-[10px]">
			No projects match your filters.
		</p>
	);

	return (
		<>
			{showPreview && hoveredWork && (
				<HoverPreview fw={hoveredWork} x={mousePos.x} y={mousePos.y} />
			)}
			{filterFlyout}

			{/* Desktop: resizable split view */}
			<div ref={containerRef} className="lg:flex hidden flex-row h-full select-none">
				<Image
					src={selected.work.photo.url}
					width={selected.work.photo.width}
					height={selected.work.photo.height}
					alt="Project-photo"
					className="fixed w-full h-full top-0 left-0 bottom-0 right-0 z-[-10] opacity-[0.2] blur-lg"
				/>

				{/* Left panel */}
				<div
					className="h-full flex flex-col shrink-0 rounded-[18px] overflow-hidden transition-[width] duration-200"
					style={{ width: `${leftPct}%` }}
				>
					{condensed ? condensedBar : filterBar}
					{condensed ? (
						<div className="overflow-y-auto flex-1 min-h-0 p-[6px] grid grid-cols-2 gap-[5px] content-start">
							{filteredWorks.length > 0 ? (
								filteredWorks.map(({ work, category }) => (
									<div
										key={work.sys.id}
										onClick={() => setSelected({ work, category })}
										className={
											"relative aspect-square rounded-[10px] overflow-hidden cursor-pointer transition-all " +
											(selected.work.sys.id === work.sys.id
												? "ring-2 ring-blue"
												: "opacity-60 hover:opacity-100")
										}
									>
										<Image src={work.photo.url} alt={work.title} fill className="object-cover" />
									</div>
								))
							) : (
								<p className="col-span-2 text-foreground-sec text-[11px] text-center py-[12px]">
									No results.
								</p>
							)}
						</div>
					) : (
						<div className="overflow-y-auto flex-1 min-h-0">
							{listItems.length > 0 ? listItems : emptyState}
						</div>
					)}
				</div>

				{/* Drag handle — always present */}
				<div
					onMouseDown={(e) => {
						isDragging.current = true;
						e.preventDefault();
					}}
					className="w-[10px] shrink-0 flex items-center justify-center cursor-col-resize group"
				>
					<div className="w-[3px] h-[40px] rounded-full bg-secondary group-hover:bg-blue/50 transition-colors" />
				</div>

				{/* Right panel */}
				<div className="flex-1 relative min-w-0 h-full overflow-y-auto flex flex-col gap-[18px] rounded-[18px] border border-secondary">
					<PreviewPanel selected={selected} />
				</div>
			</div>

			{/* Mobile: stacked */}
			<div className="lg:hidden flex flex-col gap-[10px]">
				<div className="border border-secondary flex flex-col rounded-[18px] overflow-hidden max-h-[360px]">
					{filterBar}
					<div className="overflow-y-auto flex-1 min-h-0">
						{listItems.length > 0 ? listItems : emptyState}
					</div>
				</div>
				<div className="overflow-y-auto p-[20px] flex flex-col gap-[18px] border border-secondary rounded-[18px]">
					<PreviewPanel selected={selected} />
				</div>
			</div>
		</>
	);
};

export default WorkListView;
