import {RagDocDocument} from "./rag-doc";
import EntityUtil from "../../entities/entity";

export default class RagDocumentListEntry {
    constructor(
        public readonly _id: string,
        public readonly externalId: string,
        public readonly createdAt: Date
    ) {}

    public static ofDocument(ragDocument: RagDocDocument): RagDocumentListEntry {
        const [createdAt, _] = EntityUtil.checkForProperties(ragDocument);

        return new RagDocumentListEntry(
            EntityUtil.convertId(ragDocument._id),
            ragDocument.externalId,
            createdAt
        )
    }
}