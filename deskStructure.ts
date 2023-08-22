// ./deskStructure.js
import { StructureBuilder } from "sanity/desk";

export const myStructure = (S: StructureBuilder) =>
    S.list()
        .title("Content")
        .items([
            S.listItem()
                .title("Landing Page")
                .child(S.document().schemaType("page").documentId("landingPage")),
            ...S.documentTypeListItems().filter(
                (listItem) => !["page"].includes(listItem.getId()!)
            ),
        ]);
