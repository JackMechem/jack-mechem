"use client";

import { IconLayoutGrid, IconLayoutList } from "@tabler/icons-react";
import WorkListView from "./WorkListView";
import WorkEntry from "./workEntry";
import Container from "../components/container";
import Command from "../components/command";
import MediumBlock from "../components/mediumBlock";
import { WorkCategory } from "@/types/contentful";
import { useWorkLayout, useSetWorkLayout } from "@/stores/useWorkLayoutStore";

interface WorkPageProps {
	categories: WorkCategory[];
}

const WorkPage = ({ categories }: WorkPageProps) => {
	const layout = useWorkLayout();
	const setLayout = useSetWorkLayout();
	const toggleButtons = (
		<div className="flex justify-end gap-[6px]">
			<button
				onClick={() => setLayout("grid")}
				className={
					"p-[8px] rounded-full transition-colors cursor-pointer " +
					(layout === "grid"
						? "bg-blue text-primary"
						: "text-foreground hover:bg-secondary")
				}
				aria-label="Grid layout"
			>
				<IconLayoutGrid size={16} />
			</button>
			<button
				onClick={() => setLayout("list")}
				className={
					"p-[8px] rounded-full transition-colors cursor-pointer " +
					(layout === "list"
						? "bg-blue text-primary"
						: "text-foreground hover:bg-secondary")
				}
				aria-label="List layout"
			>
				<IconLayoutList size={16} />
			</button>
		</div>
	);

	if (layout === "list") {
		return (
			<div className="lg:h-full flex flex-col px-[10px] lg:pb-[50px] pb-[100px] pt-[10px] relative">
				<div className="absolute p-[3px] bg-primary border border-secondary rounded-full right-[35px] top-[30px] w-fit z-99">{toggleButtons}</div>
				<div className="flex-1 min-h-0">
					<WorkListView categories={categories} />
				</div>
			</div>
		);
	}

	return (
		<Container>
			<MediumBlock
				className="lg:max-w-[1500px] flex flex-col gap-[40px]"
				parentClassName="lg:px-[25px]"
			>
				{toggleButtons}
				<div className="flex flex-col gap-[100px]">
					{categories.map((workCat) => (
						<Container key={workCat.category}>
							<Command className="lowercase">./{workCat.category}</Command>
							<h1 className="mb-[50px]">{workCat.category}</h1>
							<Container className="grid lg:grid-cols-2 grid-cols-1 gap-[50px] pb-[50px]">
								{workCat.worksCollection.items.map((work, index) => (
									<WorkEntry key={index} work={work} />
								))}
							</Container>
						</Container>
					))}
				</div>
			</MediumBlock>
		</Container>
	);
};

export default WorkPage;
