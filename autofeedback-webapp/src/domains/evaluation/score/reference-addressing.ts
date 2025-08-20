export default class ReferenceAddressing {
    constructor(
        public readonly id: string,
        public readonly addressed: boolean,
        public readonly expectedSentence: string,
        public readonly generatedSentence: string,
        public readonly similarityScore: number
    ) {}
}