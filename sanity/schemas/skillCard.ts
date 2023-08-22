import { BaseSchemaType, Schema } from "sanity";

const SkillCard = {
    name: "skillCard",
    title: "Skill Card",
    type: "document",
    fields: [
        {
            name: "name",
            title: "Name",
            type: "string",
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "name" },
        },
        {
            name: "description",
            title: "Description",
            type: "string",
        },
        {
            name: "logo",
            title: "Logo",
            type: "image",
        },
        {
            name: "titleOne",
            title: "Title One",
            type: "string",
        },
        {
            name: "bodyOne",
            title: "Body One",
            type: "text",
        },
        {
            name: "titleTwo",
            title: "Title Two",
            type: "string",
        },
        {
            name: "bodyTwo",
            title: "Body Two",
            type: "text",
        },
    ],
};

export default SkillCard;
