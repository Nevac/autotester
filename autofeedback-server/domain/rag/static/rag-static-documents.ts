export default class RagStaticDocuments {
    constructor(
        public readonly entityId: string,
        public readonly ragDocuments: string[],
    ) {}
}