import RagDocumentMetadata from "./rag-document-metadata";

export default class RagDocument {
    constructor(
        public readonly _id: string,
        public readonly externalId: string,
        public readonly metadata: RagDocumentMetadata,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {
    }
}