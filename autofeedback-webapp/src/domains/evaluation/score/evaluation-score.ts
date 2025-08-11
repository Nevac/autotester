import MetricScore from "./metric-score";
import MetricOvergenerationScore from "./metric-overgeneration-score";

export default class EvaluationScore {
    constructor(
        public readonly total: number,
        public readonly correctness: MetricScore,
        public readonly suggestion: MetricScore,
        public readonly codeStyle: MetricScore,
        public readonly overgeneration: MetricOvergenerationScore
    ) {}

    public static zero(): EvaluationScore {
        return new EvaluationScore(
            0,
            MetricScore.zero(),
            MetricScore.zero(),
            MetricScore.zero(),
            MetricOvergenerationScore.zero()
        );
    }
}
