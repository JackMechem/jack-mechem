import { getAllWorks } from "@/lib/api";
import WorkPage from "./WorkPage";
import { WorksResponse } from "@/types/contentful";

const Work = async () => {
	const works: WorksResponse = await getAllWorks();
	return <WorkPage categories={works.workCategoryCollection.items} />;
};

export default Work;
