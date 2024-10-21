export default class Exercise {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly task: string,
        public readonly solution: string,
        public readonly createdAt: string
    ) {
    }
}