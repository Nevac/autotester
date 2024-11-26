export default class ChatGroupListItem {

    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly exercise: string,
        public readonly promptGroup: string,
        public readonly createdAt: string
    ) {
    }
}