import RagDocumentMetadata from "./rag-document-metadata";

export default class RagDocumentUpsert {
    constructor(
        public readonly externalId: string,
        public readonly externallyManaged: string,
        public readonly metadata: RagDocumentMetadata
    ) {}
}