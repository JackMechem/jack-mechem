"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Markdown from "react-markdown";
import {
	IconLink,
	IconSearch,
	IconX,
	IconLayoutList,
	IconLayoutGrid,
	IconAdjustmentsHorizontal,
	IconChevronLeft,
	IconChevronRight,
	IconChevronDown,
	IconPhoto,
	IconDeviceDesktop,
} from "@tabler/icons-react";
import { Work, WorkCategory } from "@/types/contentful";

interface WorkListViewProps {
	categories: WorkCategory[];
	initialSlug?: string;
	onLayoutChange?: (layout: "grid" | "list") => void;
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

// ── GalleryLightbox ──────────────────────────────────────────────────────────

const GalleryLightbox = ({
	mainImage,
	images,
	title,
	initialIdx = null,
	onClose,
}: {
	mainImage: { url: string; width: number; height: number };
	images: { url: string; width: number; height: number }[];
	title: string;
	initialIdx?: number | null;
	onClose: () => void;
}) => {
	const allImages = [mainImage, ...images];
	const total = allImages.length;
	const [activeIdx, setActiveIdx] = useState(initialIdx ?? 0);
	const [panelOpen, setPanelOpen] = useState(true);
	const [panelWidth, setPanelWidth] = useState(200);
	const isDragging = useRef(false);
	const bodyRef = useRef<HTMLDivElement>(null);
	const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);

	const prev = useCallback(() => setActiveIdx((i) => (i - 1 + total) % total), [total]);
	const next = useCallback(() => setActiveIdx((i) => (i + 1) % total), [total]);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowLeft") prev();
			if (e.key === "ArrowRight") next();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose, prev, next]);

	// scroll active thumbnail into view
	useEffect(() => {
		thumbRefs.current[activeIdx]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
	}, [activeIdx]);

	// drag-resize the left panel
	useEffect(() => {
		const onMove = (e: MouseEvent) => {
			if (!isDragging.current || !bodyRef.current) return;
			const rect = bodyRef.current.getBoundingClientRect();
			const w = e.clientX - rect.left;
			setPanelWidth(Math.max(120, Math.min(w, rect.width * 0.5)));
		};
		const onUp = () => { isDragging.current = false; };
		window.addEventListener("mousemove", onMove);
		window.addEventListener("mouseup", onUp);
		return () => {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onUp);
		};
	}, []);

	return createPortal(
		<div className="fixed inset-0 z-[9999] bg-black/92 flex flex-col select-none">
			{/* Header */}
			<div className="flex items-center justify-between px-[16px] py-[12px] shrink-0 border-b border-white/10">
				<div className="flex items-center gap-[10px]">
					<button
						onClick={() => setPanelOpen((o) => !o)}
						className={
							"w-[32px] h-[32px] rounded-[8px] flex items-center justify-center transition-colors " +
							(panelOpen ? "bg-white/20 text-white" : "bg-white/10 text-white/50 hover:bg-white/15 hover:text-white")
						}
						title="Toggle image strip"
					>
						<IconLayoutGrid size={15} />
					</button>
					<span className="text-white/50 text-[11px] font-bold uppercase tracking-widest">
						{activeIdx + 1} / {total} — {title}
					</span>
				</div>
				<button
					onClick={onClose}
					className="w-[32px] h-[32px] rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
				>
					<IconX size={16} />
				</button>
			</div>

			{/* Body */}
			<div ref={bodyRef} className="flex-1 flex min-h-0">
				{/* Left panel */}
				{panelOpen && (
					<div
						style={{ width: panelWidth }}
						className="shrink-0 overflow-y-auto border-r border-white/10 p-[8px] flex flex-col gap-[6px]"
					>
						{allImages.map((img, i) => (
							<div
								key={i}
								ref={(el) => { thumbRefs.current[i] = el; }}
								onClick={() => setActiveIdx(i)}
								className={
									"relative w-full aspect-video rounded-[8px] overflow-hidden cursor-pointer transition-all shrink-0 " +
									(i === activeIdx
										? "ring-2 ring-white/80 opacity-100"
										: "opacity-40 hover:opacity-75")
								}
							>
								<Image src={img.url} alt={`${title} ${i + 1}`} fill className="object-cover" />
							</div>
						))}
					</div>
				)}

				{/* Drag handle */}
				{panelOpen && (
					<div
						onMouseDown={() => { isDragging.current = true; }}
						className="w-[8px] shrink-0 flex items-center justify-center cursor-col-resize group"
					>
						<div className="w-[3px] h-[36px] rounded-full bg-white/20 group-hover:bg-white/50 transition-colors" />
					</div>
				)}

				{/* Viewer */}
				<div className="flex-1 flex items-center justify-center relative min-w-0 p-[24px]">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={allImages[activeIdx].url}
						alt={`${title} ${activeIdx + 1}`}
						className="max-w-full max-h-full object-contain rounded-[12px]"
					/>
					{total > 1 && (
						<>
							<button
								onClick={prev}
								className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[38px] h-[38px] rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
							>
								<IconChevronLeft size={20} />
							</button>
							<button
								onClick={next}
								className="absolute right-[12px] top-1/2 -translate-y-1/2 w-[38px] h-[38px] rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
							>
								<IconChevronRight size={20} />
							</button>
						</>
					)}
				</div>
			</div>
		</div>,
		document.body,
	);
};

// ── PreviewPanel ─────────────────────────────────────────────────────────────

const PreviewPanel = ({ selected }: { selected: FlatWork }) => {
	const [lightboxSrc, setLightboxSrc] = useState<{ src: string; alt: string } | null>(null);
	const [galleryOpen, setGalleryOpen] = useState(false);
	const [galleryInitialIdx, setGalleryInitialIdx] = useState<number | null>(null);

	const otherImages = selected.work.otherImagesCollection?.items ?? [];

	const openGallery = (idx: number | null) => {
		setGalleryInitialIdx(idx);
		setGalleryOpen(true);
	};

	useEffect(() => {
		setGalleryOpen(false);
		setLightboxSrc(null);
	}, [selected.work.sys.id]);

	return (
		<div className="p-[25px]">
			{lightboxSrc && (
				<Lightbox src={lightboxSrc.src} alt={lightboxSrc.alt} onClose={() => setLightboxSrc(null)} />
			)}
			{galleryOpen && (
				<GalleryLightbox mainImage={selected.work.photo} images={otherImages} title={selected.work.title} initialIdx={galleryInitialIdx} onClose={() => setGalleryOpen(false)} />
			)}
			<div className="flex items-center gap-[8px] flex-wrap">
				<div className="text-[12pt] m-0 text-blue font-bold tracking-wider bg-blue/20 w-fit py-[2px] px-[10px] rounded-full">
					{selected.category}
				</div>
				<Link
					href={`/demos?project=${selected.work.slug}`}
					className="flex items-center gap-[5px] text-[11px] font-bold tracking-wider text-foreground-sec bg-secondary/60 hover:bg-secondary hover:text-foreground py-[2px] px-[10px] rounded-full transition-colors"
				>
					<IconDeviceDesktop size={12} />
					Live Demo
				</Link>
			</div>
			{selected.work.startDate && selected.work.endDate && (
				<p className="text-[11px] text-foreground-sec/60 mt-[6px]">
					{fmtDateRange(selected.work.startDate, selected.work.endDate)}
				</p>
			)}
			<a href={selected.work.link}>
				<h2 className="text-blue flex items-center gap-[8px] leading-[100%] mt-[12px] mb-[6px] text-[22px]">
					{selected.work.title} <IconLink size={18} />
				</h2>
			</a>
			<p className="text-foreground-sec mb-[14px] text-[16px]">{selected.work.shortDescription}</p>
			<div className="relative group/photo">
				<Image
					src={selected.work.photo.url}
					alt={selected.work.title}
					width={selected.work.photo.width}
					height={selected.work.photo.height}
					onClick={() => openGallery(0)}
					className="w-full h-auto object-cover rounded-[16px] cursor-zoom-in hover:scale-[1.01] transition-transform"
				/>
				{otherImages.length > 0 && (
					<button
						onClick={(e) => { e.stopPropagation(); openGallery(null); }}
						className="absolute bottom-[10px] right-[10px] flex items-center gap-[5px] px-[10px] py-[5px] rounded-full bg-black/60 hover:bg-black/80 text-white text-[11px] font-semibold backdrop-blur-sm transition-colors opacity-0 group-hover/photo:opacity-100"
					>
						<IconLayoutGrid size={12} />
						See all {otherImages.length + 1} images
					</button>
				)}
			</div>
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

// ── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const yearFromIso = (d: string) => parseInt(d.slice(0, 4), 10);
const monthFromIso = (d: string) => MONTHS[parseInt(d.slice(5, 7), 10) - 1] ?? "";

const fmtDateRange = (start: string, end: string) => {
	const sy = yearFromIso(start); const ey = yearFromIso(end);
	const sm = monthFromIso(start); const em = monthFromIso(end);
	if (sy === ey) return `${sm} – ${em} '${String(sy).slice(2)}`;
	return `${sm} '${String(sy).slice(2)} – ${em} '${String(ey).slice(2)}`;
};

// ── WorkListView ─────────────────────────────────────────────────────────────

const WorkListView = ({ categories, initialSlug, onLayoutChange }: WorkListViewProps) => {
	const flatWorks: FlatWork[] = categories.flatMap((cat) =>
		cat.worksCollection.items.map((work) => ({ work, category: cat.category })),
	);
	const categoryNames = categories.map((c) => c.category);
	const router = useRouter();

	const initialWork = (initialSlug ? flatWorks.find((fw) => fw.work.slug === initialSlug) : null) ?? flatWorks[0];
	const [selected, setSelectedState] = useState<FlatWork>(initialWork);

	// Sync when initialSlug changes (e.g. navigated from grid card click)
	useEffect(() => {
		if (!initialSlug) return;
		const match = flatWorks.find((fw) => fw.work.slug === initialSlug);
		if (match) setSelectedState(match);
	// flatWorks reference is stable per render; initialSlug drives the sync
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialSlug]);

	const setSelected = useCallback((fw: FlatWork) => {
		setSelectedState(fw);
		router.replace(`/work?project=${fw.work.slug}`, { scroll: false });
	}, [router]);
	const [leftPct, setLeftPct] = useState(38);
	const [condensed, setCondensed] = useState(false);
	const [listCollapsed, setListCollapsed] = useState(false);
	const [filterOpen, setFilterOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [activeCategory, setActiveCategory] = useState<string | null>(null);
	const [activeYear, setActiveYear] = useState<number | null>(null);

	const allYears = [...new Set(
		flatWorks.flatMap(({ work }) => [
			work.startDate ? yearFromIso(work.startDate) : null,
			work.endDate ? yearFromIso(work.endDate) : null,
		]).filter((y): y is number => y !== null && !isNaN(y)),
	)].sort((a, b) => b - a);

	const filterBtnRef = useRef<HTMLButtonElement>(null);

	// Hover preview
	const [hoveredWork, setHoveredWork] = useState<FlatWork | null>(null);
	const [showPreview, setShowPreview] = useState(false);
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
	const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isTouchDevice = useRef(false);
	useEffect(() => {
		isTouchDevice.current = window.matchMedia("(hover: none)").matches;
	}, []);

	const handleItemEnter = useCallback((fw: FlatWork, e: React.MouseEvent) => {
		if (isTouchDevice.current) return;
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
		const matchesYear = activeYear === null ||
			(work.startDate && work.endDate &&
				yearFromIso(work.startDate) <= activeYear &&
				yearFromIso(work.endDate) >= activeYear);
		return matchesCategory && matchesSearch && matchesYear;
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
			</div>,
			document.body,
		);
	})();

	const pillClass = (active: boolean) =>
		"text-[10px] font-bold tracking-wider py-[3px] px-[10px] rounded-full transition-colors cursor-pointer " +
		(active ? "bg-blue text-primary" : "bg-secondary text-foreground-sec hover:bg-blue/20 hover:text-blue");

	// Full filter bar (expanded mode)
	const filterBar = (
		<div className="p-[10px] flex flex-col gap-[8px] shrink-0">
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
					className="p-[7px] rounded-[10px] bg-secondary/50 hover:bg-secondary transition-colors text-foreground-sec hover:text-foreground shrink-0 cursor-pointer"
					title="Compact image view"
				>
					<IconPhoto size={14} />
				</button>
				{onLayoutChange && (
					<button
						onClick={() => onLayoutChange("grid")}
						className="p-[7px] rounded-[10px] bg-secondary/50 hover:bg-secondary transition-colors text-foreground-sec hover:text-foreground shrink-0 cursor-pointer"
						title="Grid layout"
					>
						<IconLayoutGrid size={14} />
					</button>
				)}
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
				className="p-[7px] rounded-[10px] bg-secondary/50 hover:bg-secondary transition-colors text-foreground-sec hover:text-foreground shrink-0 cursor-pointer"
				title="Expand list"
			>
				<IconLayoutList size={14} />
			</button>
			{onLayoutChange && (
				<button
					onClick={() => onLayoutChange("grid")}
					className="p-[7px] rounded-[10px] bg-secondary/50 hover:bg-secondary transition-colors text-foreground-sec hover:text-foreground shrink-0 cursor-pointer"
					title="Grid layout"
				>
					<IconLayoutGrid size={14} />
				</button>
			)}
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
					{work.startDate && work.endDate && (
						<span className="text-[11px] text-foreground-sec/60">{fmtDateRange(work.startDate, work.endDate)}</span>
					)}
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
					className="h-full flex flex-col shrink-0 overflow-hidden"
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
					<div className="w-[3px] h-[40px] rounded-full bg-blue/20 group-hover:bg-blue/50 transition-colors" />
				</div>

				{/* Right panel */}
				<div className="flex-1 relative min-w-0 h-full overflow-y-auto flex flex-col relative">
					<PreviewPanel selected={selected} />
				</div>
			</div>

			{/* Mobile: stacked */}
			<div className="lg:hidden flex flex-col pb-[40px]">
				{filterBar}
				{/* Collapse toggle */}
				<button
					onClick={() => setListCollapsed((c) => !c)}
					className="flex items-center justify-between px-[15px] py-[8px] text-[11px] font-semibold text-foreground-sec hover:bg-secondary/50 transition-colors border-b border-secondary"
				>
					<span>{filteredWorks.length} project{filteredWorks.length !== 1 ? "s" : ""}</span>
					<IconChevronDown
						size={14}
						className={"transition-transform duration-200 " + (listCollapsed ? "-rotate-90" : "")}
					/>
				</button>
				{/* Collapsible list */}
				{!listCollapsed && (
					<div className="flex flex-col">
						{listItems.length > 0 ? listItems : emptyState}
					</div>
				)}
				{/* Preview */}
				<div className={"px-[10px] pt-[12px] " + (listCollapsed ? "" : "border-t border-secondary")}>
					<div className="relative w-full aspect-video rounded-[12px] overflow-hidden">
						<Image src={selected.work.photo.url} alt={selected.work.title} fill className="object-cover" />
					</div>
					<div className="py-[12px] flex flex-col gap-[8px]">
						<span className="text-[11px] text-blue font-bold tracking-wider bg-blue/20 py-[2px] px-[8px] rounded-full w-fit">
							{selected.category}
						</span>
						<h3 className="text-[18px] font-bold text-foreground leading-tight">{selected.work.title}</h3>
						<p className="text-[13px] text-foreground-sec">{selected.work.shortDescription}</p>
						<a
							href={selected.work.link}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-[6px] text-blue text-[13px] font-semibold mt-[4px]"
						>
							<IconLink size={14} />
							View Project
						</a>
					</div>
					{/* Full long description */}
					<div className="border-t border-secondary pt-[14px] pb-[20px] text-foreground text-[13px] leading-relaxed">
						<Markdown
							components={{
								img(props) {
									const { node, src, alt, ...rest } = props;
									return (
										<img
											src={src}
											alt={alt ?? "project image"}
											className="rounded-[12px] my-[16px] w-full"
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
			</div>
		</>
	);
};

export default WorkListView;
