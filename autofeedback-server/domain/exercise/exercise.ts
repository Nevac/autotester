export default class Exercise {

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly question: string,
        public readonly solution: string,
        public readonly createdAt: string,
        public readonly modifiedAt: string
    ) {
    }
}