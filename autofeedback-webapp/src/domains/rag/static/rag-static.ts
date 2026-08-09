import RagStaticDocuments from "./rag-static-documents";

export default class RagStatic {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly exerciseRagDocuments: RagStaticDocuments[],
        public readonly attemptRagDocuments: RagStaticDocuments[],
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {
    }
}