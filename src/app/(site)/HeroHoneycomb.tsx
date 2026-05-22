"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";

interface HoneycombItem {
	work: { sys: { id: string }; title: string; slug: string; photo: { url: string } };
	category: string;
}

function buildHexPath(w: number, h: number, r: number): string {
	const hw = w / 2, q1 = h * 0.25, q3 = h * 0.75;
	const dx = r * (Math.sqrt(3) / 2), dy = r * 0.5;
	const f = (n: number) => n.toFixed(2);
	return `path('M ${f(hw-dx)} ${f(dy)} Q ${hw} 0 ${f(hw+dx)} ${f(dy)} L ${f(w-dx)} ${f(q1-dy)} Q ${w} ${f(q1)} ${w} ${f(q1+r)} L ${w} ${f(q3-r)} Q ${w} ${f(q3)} ${f(w-dx)} ${f(q3+dy)} L ${f(hw+dx)} ${f(h-dy)} Q ${hw} ${h} ${f(hw-dx)} ${f(h-dy)} L ${f(dx)} ${f(q3+dy)} Q 0 ${f(q3)} 0 ${f(q3-r)} L 0 ${f(q1+r)} Q 0 ${f(q1)} ${f(dx)} ${f(q1-dy)} Z')`;
}

const W = 320, H = Math.round(W * 2 / Math.sqrt(3)), GAP = 36, VGAP = 32, COLS = 3;
const HEX_PATH = buildHexPath(W, H, 18);
const HEX_GRID_W = COLS * (W + GAP);
const BIO_RIGHT_DEFAULT = 600;
const BIO_RIGHT_COMPACT  = 460;
const RIGHT_PAD = 48;

const WM = 145, HM = Math.round(WM * 2 / Math.sqrt(3)), GAPM = 16, VGAPM = 14, COLSM = 3;
const HEX_PATH_M = buildHexPath(WM, HM, 9);

function HexGrid({
	items, w, h, gap, vgap, cols, hexPath, opacity = 1, interactive = true,
}: {
	items: HoneycombItem[];
	w: number; h: number; gap: number; vgap: number; cols: number;
	hexPath: string; opacity?: number; interactive?: boolean;
}) {
	const rows: HoneycombItem[][] = [];
	for (let i = 0; i < items.length; i += cols) rows.push(items.slice(i, i + cols));

	return (
		<div style={{ opacity }}>
			{rows.map((row, ri) => (
				<div key={ri} className="flex" style={{
					marginTop: ri > 0 ? `${-(h * 0.25) + vgap}px` : 0,
					marginLeft: ri % 2 === 1 ? `${(w + gap) / 2}px` : 0,
				}}>
					{row.map(({ work, category }, ci) => interactive ? (
						<Link
							key={ci}
							href={`/work?project=${work.slug}`}
							className="group block relative overflow-hidden shrink-0 transition-transform duration-300 ease-out hover:scale-[1.12] hover:z-10 pointer-events-auto"
							style={{ width: w, height: h, margin: `0 ${gap / 2}px`, clipPath: hexPath }}
						>
							<Image
								src={work.photo.url}
								alt={work.title}
								fill
								className="object-cover brightness-[0.55] group-hover:brightness-[0.4] transition-all duration-500"
							/>
							{/* gradient on hover */}
							<div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
							{/* text overlay */}
							<div className="absolute inset-0 flex flex-col justify-between p-[22px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
								<span className="text-[8px] font-bold tracking-[0.2em] uppercase text-white/70 bg-white/15 backdrop-blur-sm px-[9px] py-[3px] rounded-full w-fit">
									{category}
								</span>
								<div>
									<p className="text-[15px] font-black text-white leading-tight mb-[6px]">
										{work.title}
									</p>
									<div className="flex items-center gap-[4px]">
										<span className="text-[10px] font-semibold text-white/55">View project</span>
										<IconArrowUpRight size={11} className="text-white/45" />
									</div>
								</div>
							</div>
						</Link>
					) : (
						<div key={ci} className="relative overflow-hidden shrink-0" style={{
							width: w, height: h,
							margin: `0 ${gap / 2}px`,
							clipPath: hexPath,
							pointerEvents: "none",
						}}>
							<Image src={work.photo.url} alt={work.title} fill className="object-cover brightness-[0.65]" />
						</div>
					))}
				</div>
			))}
		</div>
	);
}

export default function HeroHoneycomb({ featured, headshot }: { featured: HoneycombItem[]; headshot?: string }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(1);
	const [offset, setOffset] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const update = () => {
			const heroW = containerRef.current?.offsetWidth ?? window.innerWidth;
			const bioRight = window.innerWidth >= 1280 ? BIO_RIGHT_DEFAULT : BIO_RIGHT_COMPACT;
			const available = heroW - bioRight - RIGHT_PAD;
			setScale(Math.min(1, Math.max(0.3, available / HEX_GRID_W)));
		};
		update();
		const ro = new ResizeObserver(update);
		if (containerRef.current) ro.observe(containerRef.current);
		window.addEventListener("resize", update);
		return () => { ro.disconnect(); window.removeEventListener("resize", update); };
	}, []);

	const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
		const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
		setOffset({ x: nx * 20, y: ny * 12 });
	}, []);

	return (
		<div
			ref={containerRef}
			className="absolute inset-0 select-none"
			onMouseMove={onMouseMove}
			onMouseLeave={() => setOffset({ x: 0, y: 0 })}
		>
			<div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-transparent pointer-events-none" />

			{/* Desktop */}
			<div className="hidden lg:block absolute inset-0 pointer-events-none">
				<div
					className="absolute right-[48px] top-1/2 pointer-events-none"
					style={{
						transform: `translateY(-50%) translate(${offset.x}px, ${offset.y}px)`,
						transition: "transform 0.25s ease-out",
					}}
				>
					<div style={{ transform: `scale(${scale})`, transformOrigin: "right center" }}>
						<div className="relative">
							<HexGrid
								items={featured}
								w={W} h={H} gap={GAP} vgap={VGAP} cols={COLS}
								hexPath={HEX_PATH}
								opacity={0.82}
							/>
							{headshot && (
								<div
									className="absolute overflow-hidden z-[5]"
									style={{
										width: W, height: H,
										top: "50%", left: "50%",
										transform: "translate(-50%, -50%)",
										clipPath: HEX_PATH,
									}}
								>
									<Image src={headshot} alt="Jack Mechem" fill className="object-cover" priority />
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
