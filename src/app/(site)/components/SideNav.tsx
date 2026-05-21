"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../../../assets/logos/logo.svg";
import {
	IconHome2,
	IconUser,
	IconBriefcase,
	IconMail,
	IconMoon,
	IconSun,
	IconChevronsLeft,
	IconChevronsRight,
	IconAppWindow,
	IconMenu2,
	IconX,
} from "@tabler/icons-react";
import { useSetTheme } from "@/stores/useThemeStore";

const LINKS = [
	{ href: "/", label: "Home", icon: IconHome2 },
	{ href: "/about", label: "About", icon: IconUser },
	{ href: "/work", label: "Work", icon: IconBriefcase },
	{ href: "/demos", label: "Demos", icon: IconAppWindow },
	{ href: "/contact", label: "Contact", icon: IconMail },
];

const COLLAPSED_W = 52;

const SideNav = () => {
	const pathname = usePathname();
	const setTheme = useSetTheme();
	const [collapsed, setCollapsed] = useState(false);
	const [sidebarWidth, setSidebarWidth] = useState(168);
	const [menuOpen, setMenuOpen] = useState(false);
	const isDragging = useRef(false);
	const wrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setMenuOpen(false);
	}, [pathname]);

	useEffect(() => {
		const onMove = (e: MouseEvent) => {
			if (!isDragging.current || !wrapperRef.current) return;
			const left = wrapperRef.current.getBoundingClientRect().left;
			setSidebarWidth(Math.max(120, Math.min(e.clientX - left, 320)));
		};
		const onUp = () => { isDragging.current = false; };
		window.addEventListener("mousemove", onMove);
		window.addEventListener("mouseup", onUp);
		return () => {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onUp);
		};
	}, []);

	return (
		<>
			{/* ── Desktop sidebar + drag handle ──────────────────────── */}
			<div ref={wrapperRef} className="hidden lg:flex flex-row shrink-0 select-none">
				{/* Sidebar content */}
				<div
					style={{ width: collapsed ? COLLAPSED_W : sidebarWidth }}
					className="flex flex-col py-[16px] overflow-hidden transition-[width] duration-200"
				>
					{/* Logo */}
					<div className={collapsed ? "flex justify-center mb-[16px] shrink-0" : "px-[16px] mb-[24px] shrink-0"}>
						<Link href="/">
							<img
								src={Logo.src}
								alt="logo"
								className={collapsed ? "max-h-[24px]" : "max-h-[36px]"}
							/>
						</Link>
					</div>

					{/* Nav links */}
					<nav className="flex flex-col gap-[2px] px-[8px] flex-1">
						{LINKS.map(({ href, label, icon: Icon }) => {
							const active =
								pathname === href ||
								(href !== "/" && pathname?.startsWith(href));
							return (
								<Link
									key={href}
									href={href}
									title={collapsed ? label : undefined}
									className={
										"w-full flex items-center rounded-[8px] transition-colors cursor-pointer " +
										(collapsed
											? "justify-center py-[7px] "
											: "gap-[10px] px-[10px] py-[7px] text-[13px] whitespace-nowrap ") +
										(active
											? "bg-blue/10 text-blue font-semibold"
											: "text-foreground-sec hover:bg-secondary/50 hover:text-foreground font-medium")
									}
								>
									<Icon size={16} strokeWidth={active ? 2.5 : 2} className="shrink-0" />
									{!collapsed && label}
								</Link>
							);
						})}
					</nav>

					{/* Theme toggle */}
					<div className="px-[8px] shrink-0">
						<button
							onClick={setTheme}
							title={collapsed ? "Toggle theme" : undefined}
							className={
								"w-full flex items-center rounded-[8px] transition-colors cursor-pointer text-foreground-sec hover:bg-secondary/50 hover:text-foreground font-medium " +
								(collapsed
									? "justify-center py-[7px]"
									: "gap-[10px] px-[10px] py-[7px] text-[13px] whitespace-nowrap")
							}
						>
							<IconMoon size={16} className="shrink-0 dark-theme:hidden" />
							<IconSun size={16} className="shrink-0 hidden dark-theme:block" />
							{!collapsed && (
								<>
									<span className="dark-theme:hidden">Dark mode</span>
									<span className="hidden dark-theme:block">Light mode</span>
								</>
							)}
						</button>
					</div>

					{/* Divider + collapse toggle */}
					<div className="mx-[8px] my-[8px] border-t border-secondary shrink-0" />
					<div className="px-[8px] shrink-0">
						<button
							onClick={() => setCollapsed((c) => !c)}
							title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
							className={
								"w-full flex items-center rounded-[8px] transition-colors cursor-pointer text-foreground-sec hover:bg-secondary/50 hover:text-foreground font-medium " +
								(collapsed
									? "justify-center py-[7px]"
									: "gap-[10px] px-[10px] py-[7px] text-[13px] whitespace-nowrap")
							}
						>
							{collapsed
								? <IconChevronsRight size={16} className="shrink-0" />
								: <IconChevronsLeft size={16} className="shrink-0" />}
							{!collapsed && "Collapse"}
						</button>
					</div>
				</div>

				{/* Drag handle — hidden when collapsed */}
				{!collapsed && (
					<div
						onMouseDown={(e) => { isDragging.current = true; e.preventDefault(); }}
						className="w-[10px] shrink-0 flex items-center justify-center cursor-col-resize group"
					>
						<div className="w-[3px] h-[40px] rounded-full bg-blue/20 transition-colors" />
					</div>
				)}
			</div>

			{/* ── Mobile header ──────────────────────────────────────── */}
			<div className="lg:hidden fixed top-0 left-0 right-0 z-[998] h-[52px] bg-primary border-b border-secondary flex items-center px-[16px]">
				<Link href="/" onClick={() => setMenuOpen(false)}>
					<img src={Logo.src} alt="logo" className="max-h-[22px]" />
				</Link>
				<button
					onClick={() => setMenuOpen((o) => !o)}
					className="ml-auto p-[7px] rounded-[8px] text-foreground-sec hover:bg-secondary/50 hover:text-foreground transition-colors cursor-pointer"
				>
					{menuOpen ? <IconX size={18} /> : <IconMenu2 size={18} />}
				</button>
			</div>

			{/* ── Mobile dropdown menu ───────────────────────────────── */}
			{menuOpen && (
				<div className="lg:hidden fixed top-[52px] left-0 right-0 z-[997] bg-primary border-b border-secondary shadow-xl">
					<nav className="flex flex-col gap-[2px] p-[8px]">
						{LINKS.map(({ href, label, icon: Icon }) => {
							const active =
								pathname === href ||
								(href !== "/" && pathname?.startsWith(href));
							return (
								<Link
									key={href}
									href={href}
									onClick={() => setMenuOpen(false)}
									className={
										"w-full flex items-center gap-[10px] px-[10px] py-[7px] text-[13px] rounded-[8px] transition-colors cursor-pointer " +
										(active
											? "bg-blue/10 text-blue font-semibold"
											: "text-foreground-sec hover:bg-secondary/50 hover:text-foreground font-medium")
									}
								>
									<Icon size={16} strokeWidth={active ? 2.5 : 2} className="shrink-0" />
									{label}
								</Link>
							);
						})}
					</nav>
					<div className="mx-[8px] border-t border-secondary" />
					<div className="p-[8px]">
						<button
							onClick={setTheme}
							className="w-full flex items-center gap-[10px] px-[10px] py-[7px] text-[13px] rounded-[8px] text-foreground-sec hover:bg-secondary/50 hover:text-foreground transition-colors cursor-pointer"
						>
							<IconMoon size={16} className="shrink-0 dark-theme:hidden" />
							<IconSun size={16} className="shrink-0 hidden dark-theme:block" />
							<span className="dark-theme:hidden">Dark mode</span>
							<span className="hidden dark-theme:block">Light mode</span>
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default SideNav;
