const Thought = {
    name: "thought",
    title: "Thought",
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
            name: "date",
            title: "Date",
            type: "string",
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

export default Thought;
