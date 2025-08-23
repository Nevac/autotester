import ReferenceAddressing from "./reference-addressing";

export default class ReferenceAddressingUpsert {
    constructor(
        public readonly id: string,
        public ignore: boolean,
        public addressed: boolean,
        public expectedSentence: string,
        public generatedSentence: string,
        public similarityScore: number,
    ) {}

    public static ofReferenceAddressing(referenceAddressing: ReferenceAddressing): ReferenceAddressingUpsert {
        return new ReferenceAddressingUpsert(
            referenceAddressing.id,
            referenceAddressing.ignore,
            referenceAddressing.addressed,
            referenceAddressing.expectedSentence,
            referenceAddressing.generatedSentence,
            referenceAddressing.similarityScore
        )
    }

    public static ofReferenceAddressings(referenceAddressing: ReferenceAddressing[]): ReferenceAddressingUpsert[] {
        return referenceAddressing.map(referenceAddressing =>
            ReferenceAddressingUpsert.ofReferenceAddressing(referenceAddressing)
        );
    }

    public static create(id: string): ReferenceAddressingUpsert {
        return new ReferenceAddressingUpsert(
            id,
            false,
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

    public setIgnore(value: boolean): ReferenceAddressingUpsert {
        this.ignore = value;
        return this;
    }
}