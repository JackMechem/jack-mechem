import { createClient, groq } from "next-sanity";

const getProjects = () => {
    const utcDate = new Date().getDay();
    const client = createClient({
        projectId: "e4i7tez4",
        dataset: "production",
        useCdn: false,
        apiVersion: utcDate.toString(),
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

export { getProjects };
