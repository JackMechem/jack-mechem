import { getProjects } from "../../../../sanity/sanity-utils";
import ProjectContent from "./projectContent";

const Projects = async () => {
    const projects = await getProjects();
    return (
        <>
            <ProjectContent projects={projects} />
        </>
    );
};

export default Projects;
