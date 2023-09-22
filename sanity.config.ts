import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { myStructure } from "./deskStructure";
import schemas from "./sanity/schemas";

const config = defineConfig({
    projectId: "e4i7tez4",
    dataset: "production",
    title: "Jack Mechem",
    apiVersion: "2023-01-01",
    basePath: "/admin",
    plugins: [
        deskTool({
            structure: myStructure,
        }),
    ],
    schema: { types: schemas },
});

export default config;
