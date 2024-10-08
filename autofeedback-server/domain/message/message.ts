import Author from "./author";

export default class Message {

    constructor(
        public readonly id: string,
        public readonly author: Author,
        public readonly text: string,
        public readonly createdAt: Date
    ) {
    }
}