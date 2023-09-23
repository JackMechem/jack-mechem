import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { myStructure } from "./deskStructure";
import schemas from "./sanity/schemas";

const config = defineConfig({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET as string,
    title: "Jack Mechem",
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION as string,
    basePath: "/admin",
    plugins: [
        deskTool({
            structure: myStructure,
        }),
    ],
    schema: { types: schemas },
});

export default config;
