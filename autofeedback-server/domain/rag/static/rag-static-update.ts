export default class RagStaticUpdate {
    constructor(
        public readonly name: String,
        public readonly exerciseRagDocuments: Map<string, string[]>,
        public readonly attemptRagDocuments: Map<string, string[]>,
    ) {
    }
}