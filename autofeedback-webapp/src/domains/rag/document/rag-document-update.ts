import RagDocumentMetadataUpdate from "./rag-document-metadata-update";

export default class RagDocumentUpdate {
    constructor(
        public externalId: string,
        public metadata: RagDocumentMetadataUpdate
    ) {}
}