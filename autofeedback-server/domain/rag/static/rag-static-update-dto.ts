import RagStaticDocuments from "./rag-static-documents";

export default class RagStaticUpdateDto {
    constructor(
        public readonly name: String,
        public readonly exerciseRagDocuments: RagStaticDocuments[],
        public readonly attemptRagDocuments: RagStaticDocuments[],
    ) {
    }
}