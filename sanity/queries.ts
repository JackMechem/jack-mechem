import { groq } from "next-sanity";

export const projectsQuery = groq`
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
        `;

export const thoughtsQuery = groq`
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
        `;
