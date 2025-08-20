import ExpectedFeedbackSemanticStatistic from "../statistic/expected-feedback-semantic-statistic";

export default class ReferenceHit {
    constructor(
        public readonly id: string,
        public readonly expectedSentence: string,
        public readonly generatedSentence: string,
        public readonly similarityScore: number
    ) {}

    public static ofExpectedFeedback(
        expectedFeedback: ExpectedFeedbackSemanticStatistic
    ): ReferenceHit {
        let sentence = "NOT ADDRESSED";
        let score = 0;
        if(expectedFeedback.scores.length > 0) {
            const expectedSemanticScore = expectedFeedback.scores[0];
            sentence = expectedSemanticScore.sentence;
            score = expectedSemanticScore.score;
        }

        return new ReferenceHit(
            expectedFeedback.id,
            expectedFeedback.sentence,
            sentence,
            score
        )
    }
}