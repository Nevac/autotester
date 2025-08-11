import GeneratedFeedbackSemanticStatistic from "../statistic/generated-feedback-semantic-statistic";

export default class MetricOvergenerationScore {
    constructor(
        public readonly score: number,
        public readonly overgenerations: GeneratedFeedbackSemanticStatistic[]
    ) {}

    public static zero(): MetricOvergenerationScore {
        return new MetricOvergenerationScore(
            0,
            []
        );
    }
}