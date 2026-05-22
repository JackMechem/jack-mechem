"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const DESKTOP_LINKS = [
	{ href: "/", label: "0:home" },
	{ href: "/about", label: "1:about" },
	{ href: "/work", label: "2:work" },
	{ href: "/contact", label: "4:contact" },
];

const MOBILE_LINKS = [
	{ href: "/", label: "home" },
	{ href: "/about", label: "about" },
	{ href: "/work", label: "work" },
	{ href: "/music", label: "music" },
	{ href: "/contact", label: "contact" },
];

export function NavDesktopLinks() {
	const pathname = usePathname();
	return (
		<div className="flex gap-[12px] justify-self-center">
			{DESKTOP_LINKS.map(({ href, label }) =>
				pathname === href ? (
					<div key={href} className="bg-blue">
						<p>{label}*</p>
					</div>
				) : (
					<Link key={href} href={href}>
						<p>{label}</p>
					</Link>
				)
			)}
		</div>
	);
}

export function NavMobileLinks() {
	const pathname = usePathname();
	return (
		<>
			{MOBILE_LINKS.map(({ href, label }) => (
				<Link
					key={href}
					href={href}
					className={
						pathname === href
							? "cursor-pointer bg-blue text-primary rounded-full px-[10px] py-[4px]"
							: "rounded-full cursor-pointer px-[12px] py-[4px]"
					}
				>
					{label}
				</Link>
			))}
		</>
	);
}
