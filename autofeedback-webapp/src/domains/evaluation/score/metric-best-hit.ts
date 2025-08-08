import ExpectedFeedbackSemanticStatistic from "../statistic/expected-feedback-semantic-statistic";

export default class MetricBestHit {
    constructor(
        public readonly id: string,
        public readonly expectedSentence: string,
        public readonly generatedSentence: string,
        public readonly similarityScore: number
    ) {}

    public static ofExpectedFeedback(
        expectedFeedback: ExpectedFeedbackSemanticStatistic
    ): MetricBestHit {
        let sentence = "NOT ADDRESSED";
        let score = 0;
        if(expectedFeedback.scores.length > 0) {
            const expectedSemanticScore = expectedFeedback.scores[0];
            sentence = expectedSemanticScore.sentence;
            score = expectedSemanticScore.score;
        }

        return new MetricBestHit(
            expectedFeedback.id,
            expectedFeedback.sentence,
            sentence,
            score
        )
    }
}