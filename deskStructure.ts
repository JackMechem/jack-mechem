// ./deskStructure.js
import { StructureBuilder, StructureContext } from "sanity/desk";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

export const myStructure = (S: StructureBuilder, context: any) =>
    S.list()
        .title("Content")
        .items([
            S.listItem()
                .title("Landing Page")
                .child(S.document().schemaType("page").documentId("landingPage")),
            ...S.documentTypeListItems().filter(
                (listItem) => !["page", "project"].includes(listItem.getId()!)
            ),
            orderableDocumentListDeskItem({ type: "project", S, context }),
        ]);
