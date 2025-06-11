export default class AttemptListItem {

    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly exercise: string,
        public readonly createdAt: Date
    ) {
    }
}