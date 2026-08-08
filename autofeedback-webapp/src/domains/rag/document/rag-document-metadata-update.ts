export default class RagDocumentMetadataUpdate {
    constructor(
        public text: string,
        public category?: string,
        public language?: string,
        public topic?: string,
        public type?: string,
        public constructs?: string[]
    ) {}
}