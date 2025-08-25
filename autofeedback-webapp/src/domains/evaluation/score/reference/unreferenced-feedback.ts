export default class UnreferencedFeedback {
    constructor(
        public readonly generatedFeedbackIndex: number,
        public readonly generatedSentence: string,
        public readonly ignore: boolean
    ) {}
}