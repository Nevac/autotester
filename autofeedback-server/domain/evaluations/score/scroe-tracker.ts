import ExpectedFeedbackSemanticStatistic from "../statistic/expected-feedback-semantic-statistic";
import FeedbackMetric from "../../attempts/expected-feedback/feedback-metric";
import ReferenceAddressingUpsert from "./reference-addressing-upsert";

export default class ScoreTracker {
    public readonly correctness: Map<string, ReferenceAddressingUpsert> = new Map();
    public readonly suggestion: Map<string, ReferenceAddressingUpsert> = new Map();
    public readonly codeStyle: Map<string, ReferenceAddressingUpsert> = new Map();

    constructor() {}

    public addCorrectnessReference(id: string) {
        if(!this.correctness.has(id)) {
            this.correctness.set(id, ReferenceAddressingUpsert.create(id))
        }
    }

    public addSuggestionReference(id: string) {
        if(!this.suggestion.has(id)) {
            this.suggestion.set(id, ReferenceAddressingUpsert.create(id))
        }
    }

    public addCodeStyleReference(id: string) {
        if(!this.codeStyle.has(id)) {
            this.codeStyle.set(id, ReferenceAddressingUpsert.create(id))
        }
    }

    public addressReference(
        expectedFeedback: ExpectedFeedbackSemanticStatistic
    ) {

        const id = expectedFeedback.id;
        const referenceAddressing = ReferenceAddressingUpsert.create(id);

        if(expectedFeedback.scores.length > 0) {
            const expectedSemanticScore = expectedFeedback.scores[0];
            referenceAddressing
                .setAddressed(true)
                .setSimilarityScore(expectedSemanticScore.score)
                .setGeneratedSentence(expectedSemanticScore.sentence)
        }
        referenceAddressing.setExpectedSentence(expectedFeedback.sentence)

        switch (expectedFeedback.metric) {
            case FeedbackMetric.CORRECTNESS:
                this.checkAndSetReferenceIfHigherScore(id, this.correctness, referenceAddressing);
                break;
            case FeedbackMetric.SUGGESTION:
                this.checkAndSetReferenceIfHigherScore(id, this.suggestion, referenceAddressing);
                break;
            case FeedbackMetric.CODE_STYLE:
                this.checkAndSetReferenceIfHigherScore(id, this.codeStyle, referenceAddressing);
                break;
        }
    }

    private checkAndSetReferenceIfHigherScore(
        id: string,
        map: Map<string, ReferenceAddressingUpsert>,
        referenceAddressing: ReferenceAddressingUpsert
    ): void {
        if(map.has(id)) {
            const existingReference = map.get(id)!;

            if(!existingReference.addressed || referenceAddressing.similarityScore > existingReference.similarityScore) {
                map.set(id, referenceAddressing);
            }
        }
    }
}