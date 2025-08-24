export default class UnreferencedFeedback {
    constructor(
        public readonly index: number,
        public readonly generatedSentence: string,
        public readonly ignore: boolean
    ) {}
}