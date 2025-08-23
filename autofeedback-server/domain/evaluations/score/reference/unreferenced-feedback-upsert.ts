import UnreferencedFeedback from "./unreferenced-feedback";

export default class UnreferencedFeedbackUpsert {
    constructor(
        public generatedFeedbackIndex: number,
        public generatedSentence: string,
        public ignore: boolean
    ) {}

    public static ofUnreferencedFeedback(unreferencedFeedback: UnreferencedFeedback): UnreferencedFeedbackUpsert {
        return new UnreferencedFeedbackUpsert(
            unreferencedFeedback.generatedFeedbackIndex,
            unreferencedFeedback.generatedSentence,
            unreferencedFeedback.ignore,
        )
    }

    public static ofUnreferencedFeedbacks(unreferencedFeedbacks: UnreferencedFeedback[]): UnreferencedFeedbackUpsert[] {
        return unreferencedFeedbacks.map(referenceAddressing =>
            UnreferencedFeedbackUpsert.ofUnreferencedFeedback(referenceAddressing)
        );
    }

    public setIgnore(value: boolean): UnreferencedFeedbackUpsert {
        this.ignore = value;
        return this;
    }
}