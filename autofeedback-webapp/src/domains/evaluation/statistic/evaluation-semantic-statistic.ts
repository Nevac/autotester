import GeneratedFeedbackSemanticStatistic from "./generated-feedback-semantic-statistic";
import ExpectedFeedbackSemanticStatistic from "./expected-feedback-semantic-statistic";

export default class EvaluationSemanticStatistic {
    constructor(
        public readonly expectedFeedback: ExpectedFeedbackSemanticStatistic[],
        public readonly generatedFeedback: GeneratedFeedbackSemanticStatistic[]
    ) {}

    public static empty(): EvaluationSemanticStatistic {
        return new EvaluationSemanticStatistic (
            [],
            []
        );
    }
}