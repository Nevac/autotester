export default class RagDocumentListItem {
    constructor(
        public readonly _id: string,
        public readonly externalId: string,
        public readonly createdAt: Date
    ) {}
}