"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import Container from "../components/container";
import { IconLink } from "@tabler/icons-react";
import useComponentVisible from "../components/useComponentVisible";

const FloatingWorkWindow = dynamic(
	() => import("../components/floatingWorkWindow"),
	{ ssr: false }
);

interface WorkEntryProps {
	work: any;
}

const WorkEntry = ({ work }: WorkEntryProps) => {
	const sidebarState = useComponentVisible(false);

	return (
		<Container key={work.sys.id} className="flex flex-col">
			{sidebarState.isComponentVisible && (
				<FloatingWorkWindow work={work} sideBarState={sidebarState} />
			)}
			<Image
				src={work.photo.url}
				alt="work photo"
				width={work.photo.width}
				height={work.photo.height}
				className="md:h-[400px] h-[300px] w-full rounded-[30px] mb-[10px] object-cover hover:shadow-bluexlr hover:scale-[1.01] hover:cursor-pointer"
				onClick={() => {
					sidebarState.setIsComponentVisible(true);
				}}
			/>
			<a href={work.link}>
				<h3 className="text-blue flex items-center gap-3">
					{work.title} <IconLink />
				</h3>
			</a>
			<p className="font-semibold text-foreground-sec">
				{work.shortDescription}
			</p>
		</Container>
	);
};

export default WorkEntry;
