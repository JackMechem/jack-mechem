import { getAllWorks } from "@/lib/api";
import WorkPage from "./WorkPage";
import { WorksResponse } from "@/types/contentful";

const Work = async ({ searchParams }: { searchParams: Promise<{ project?: string }> }) => {
	const { project } = await searchParams;
	const works: WorksResponse = await getAllWorks();
	return <WorkPage categories={works.workCategoryCollection.items} initialSlug={project} />;
};

export default Work;
