import { getAllWorks } from "@/lib/api";
import DemosListView from "./DemosListView";
import { WorksResponse } from "@/types/contentful";

const Demos = async ({ searchParams }: { searchParams: Promise<{ project?: string }> }) => {
	const { project } = await searchParams;
	const works: WorksResponse = await getAllWorks();
	return (
		<div className="h-full flex flex-col">
			<DemosListView categories={works.workCategoryCollection.items} initialSlug={project} />
		</div>
	);
};

export default Demos;
