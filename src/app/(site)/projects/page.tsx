import { sanityFetch } from "@/utils/sanity/client";
import { SanityDocument } from "next-sanity";
import { projectsQuery } from "../../../../sanity/queries";
import ProjectContent from "./projectContent";

const Projects = async () => {
    // const projects = await getProjects();
    const projects = await sanityFetch<SanityDocument[]>({ query: projectsQuery });
    return (
        <>
            <ProjectContent projects={projects} />
        </>
    );
};

export default Projects;
