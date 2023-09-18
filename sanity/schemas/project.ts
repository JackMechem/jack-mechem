const Project = {
    name: "project",
    title: "Project",
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
            name: "link",
            title: "Link",
            type: "url",
        },
        {
            name: "date",
            title: "Date",
            type: "string",
        },
        {
            name: "logo",
            title: "Logo",
            type: "image",
        },
        {
            name: "hero",
            title: "Hero",
            type: "image",
        },
        {
            name: "body",
            title: "Body",
            type: "array",
            of: [
                {
                    type: "block",
                },
                {
                    type: "image",
                },
            ],
        },
    ],
};

export default Project;
