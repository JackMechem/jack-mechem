import { groq } from "next-sanity";

export const landingPageQuery = groq`
    *[_type == "page"]{
        _id,
        _createdAt,
        "slug": slug.current,
        titleText,
        titleBio,
        aboutTitle,
        aboutText,
        skillsTitle
    }
`;

export const skillCardQuery = groq`
    *[_type == "skillCard"]{
        _id,
        _createdAt,
        name,
        "slug": slug.current,
        description,
        "logo": logo.asset->url,
        titleOne,
        bodyOne,
        titleTwo,
        bodyTwo
    }
`;

export const projectsQuery = groq`
            *[_type == "project"]|order(orderRank){
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
