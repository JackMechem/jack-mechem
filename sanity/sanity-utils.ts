import { createClient, groq } from "next-sanity";

const getProjects = () => {
    const utcDate = new Date().toISOString().replace(/T.*/, "").split("-").join("-");
    console.log("Sanity API Version UTC Date: ", utcDate);
    const client = createClient({
        projectId: "e4i7tez4",
        dataset: "production",
        useCdn: false,
        apiVersion: "1",
    });

    return client.fetch(
        groq`
            *[_type == "project"]{
                _id,
                _createdAt,
                name,
                date,
                "slug": slug.current,
                link,
                "logo": logo.asset->url,
                "hero": hero.asset->url,
                body[]{
                    _type == "image" => {
                        "url": asset->url,
                        "_type": "image"
                    },
                    _type == "block" => @,
                }
            }
        `
    );
};

const getThoughts = () => {
    const utcDate = new Date().toISOString().replace(/T.*/, "").split("-").join("-");
    console.log("Sanity API Version UTC Date: ", utcDate);
    const client = createClient({
        projectId: "e4i7tez4",
        dataset: "production",
        useCdn: false,
        apiVersion: "1",
    });

    return client.fetch(
        groq`
            *[_type == "thought"]{
                _id,
                _createdAt,
                name,
                date,
                "slug": slug.current,
                body[]{
                    _type == "image" => {
                        "url": asset->url,
                        "_type": "image"
                    },
                    _type == "block" => @,
                }
            }
        `
    );
};

export { getProjects, getThoughts };
