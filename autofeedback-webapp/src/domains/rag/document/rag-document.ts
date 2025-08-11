export default class RagDocument {
    constructor(
        public readonly id: string,
        public readonly text: string,
        public readonly category: string,
        public readonly language: string,
        public readonly topic: string,
        public readonly type: string,
        public readonly constructs: string[]
    ) {}
}