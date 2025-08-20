
export default class ReferenceAddressingUpsert {
    constructor(
        public readonly id: string,
        public addressed: boolean,
        public expectedSentence: string,
        public generatedSentence: string,
        public similarityScore: number,
    ) {}

    public static create(id: string): ReferenceAddressingUpsert {
        return new ReferenceAddressingUpsert(
            id,
            false,
            "",
            "",
            0
        )
    }

    public setAddressed(value: boolean): ReferenceAddressingUpsert {
        this.addressed = value;
        return this;
    }

    public setSimilarityScore(value: number): ReferenceAddressingUpsert{
        this.similarityScore = value;
        return this;
    }

    public setExpectedSentence(value: string): ReferenceAddressingUpsert {
        this.expectedSentence = value;
        return this;
    }

    public setGeneratedSentence(value: string): ReferenceAddressingUpsert {
        this.generatedSentence = value;
        return this;
    }
}