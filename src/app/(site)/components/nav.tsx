"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const Nav = () => {
	const pathname = usePathname();
	const { push } = useRouter();

	const [timeDate, setTimeDate] = useState<Date>();
	const monthNames = [
		"Jan",
		"Feb",
		"March",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	useEffect(() => {
		setInterval(() => setTimeDate(new Date()), 1000);
	}, []);

	return (
		<>
			<div className="z-[999] fixed bottom-[20px] left-[20px] right-[20px] bg-green text-[20px] text-foreground dark-theme:text-primary px-[1px] lg:flex hidden justify-between">
				<p>[website]</p>
				<div className="flex gap-[12px] justify-self-center">
					{pathname === "/" ? (
						<div className="bg-blue">
							<p>0:home*</p>
						</div>
					) : (
						<div
							className="cursor-pointer"
							onClick={() => {
								push("/");
							}}
						>
							<p>0:home</p>
						</div>
					)}
					{pathname === "/about" ? (
						<div className="bg-blue">
							<p>1:about*</p>
						</div>
					) : (
						<div
							className="cursor-pointer"
							onClick={() => {
								push("/about");
							}}
						>
							<p>1:about</p>
						</div>
					)}
					{pathname === "/work" ? (
						<div className="bg-blue">
							<p>2:work*</p>
						</div>
					) : (
						<div
							className="cursor-pointer"
							onClick={() => {
								push("/work");
							}}
						>
							<p>2:work</p>
						</div>
					)}
					{pathname === "/contact" ? (
						<div className="bg-blue">
							<p>4:contact*</p>
						</div>
					) : (
						<div
							className="cursor-pointer"
							onClick={() => {
								push("/contact");
							}}
						>
							<p>4:contact</p>
						</div>
					)}
				</div>
				<div className="flex gap-[12px]">
					<p>&quot;user97&quot;</p>
					{timeDate && (
						<>
							<p>{timeDate.getHours() + ":" + timeDate.getMinutes()}</p>
							<p>
								{timeDate.getDate() +
									"-" +
									monthNames[timeDate.getMonth()] +
									"-" +
									timeDate.getFullYear()}
							</p>
						</>
					)}
				</div>
			</div>

			<div className="fixed lg:hidden flex justify-center bottom-[30px] left-[20px] right-[20px]">
				<div className="md:text-[16px] text-[14px] bg-secondary rounded-full border-[2px] border-green p-[5px] flex flex-row gap-[0px]">
					<div
						onClick={() => {
							push("/");
						}}
						className={
							pathname === "/"
								? " cursor-pointer bg-blue text-primary rounded-full  px-[10px] py-[4px]"
								: "rounded-full cursor-pointer px-[12px] py-[4px]"
						}
					>
						home
					</div>
					<div
						onClick={() => {
							push("/about");
						}}
						className={
							pathname === "/about"
								? " cursor-pointer bg-blue text-primary rounded-full  px-[10px] py-[4px]"
								: "rounded-full cursor-pointer px-[12px] py-[4px]"
						}
					>
						about
					</div>
					<div
						onClick={() => {
							push("/work");
						}}
						className={
							pathname === "/work"
								? " cursor-pointer bg-blue text-primary rounded-full  px-[10px] py-[4px]"
								: "rounded-full cursor-pointer px-[12px] py-[4px]"
						}
					>
						work
					</div>
					<div
						onClick={() => {
							push("/music");
						}}
						className={
							pathname === "/music"
								? " cursor-pointer bg-blue text-primary rounded-full  px-[10px] py-[4px]"
								: "rounded-full cursor-pointer px-[12px] py-[4px]"
						}
					>
						music
					</div>
					<div
						onClick={() => {
							push("/contact");
						}}
						className={
							pathname === "/contact"
								? " cursor-pointer bg-blue text-primary rounded-full  px-[10px] py-[4px]"
								: "rounded-full cursor-pointer px-[12px] py-[4px]"
						}
					>
						contact
					</div>
				</div>
			</div>
		</>
	);
};

export default Nav;
