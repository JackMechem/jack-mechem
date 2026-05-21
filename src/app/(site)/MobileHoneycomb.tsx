"use client";

import Image from "next/image";

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

const W = 120, H = Math.round(W * 2 / Math.sqrt(3)), GAP = 14, VGAP = 10, COLS = 3, R = 7;
const HEX_PATH = buildHexPath(W, H, R);

export default function MobileHoneycomb({ featured, headshot }: { featured: HoneycombItem[]; headshot?: string }) {
	const rows: HoneycombItem[][] = [];
	for (let i = 0; i < featured.length; i += COLS) rows.push(featured.slice(i, i + COLS));

	return (
		<div className="w-full overflow-hidden flex justify-center py-[20px]">
			<div className="relative">
				{rows.map((row, ri) => (
					<div key={ri} className="flex" style={{
						marginTop: ri > 0 ? `${-(H * 0.25) + VGAP}px` : 0,
						marginLeft: ri % 2 === 1 ? `${(W + GAP) / 2}px` : 0,
					}}>
						{row.map(({ work, category }, ci) => (
							<div key={ci} className="relative overflow-hidden shrink-0" style={{
								width: W, height: H,
								margin: `0 ${GAP / 2}px`,
								clipPath: HEX_PATH,
							}}>
								<Image src={work.photo.url} alt={work.title} fill className="object-cover brightness-[0.55]" />
							</div>
						))}
					</div>
				))}
				{headshot && (
					<div
						className="absolute overflow-hidden z-10"
						style={{
							width: W,
							height: H,
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							clipPath: HEX_PATH,
						}}
					>
						<Image src={headshot} alt="Jack Mechem" fill className="object-cover" />
					</div>
				)}
			</div>
		</div>
	);
}
