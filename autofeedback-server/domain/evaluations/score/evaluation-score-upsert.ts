import MetricScoreUpsert from "./metric/metric-score-upsert";
import MetricOvergenerationScoreUpsert from "./metric/metric-overgeneration-score-upsert";
import {EvaluationScore} from "./evaluation-score";
import MetricScore from "./metric/metric-score";
import MetricOvergenerationScore from "./metric/metric-overgeneration-score";

export class EvaluationScoreUpsert {
    constructor(
        public total: number,
        public correctness: MetricScoreUpsert,
        public suggestion: MetricScoreUpsert,
        public codeStyle: MetricScoreUpsert,
        public overgeneration: MetricOvergenerationScoreUpsert
    ) {}

    public static ofEvaluationScore(evaluationScore: EvaluationScore) {
        return new EvaluationScoreUpsert(
            evaluationScore.total,
            MetricScoreUpsert.ofMetricScore(evaluationScore.correctness),
            MetricScoreUpsert.ofMetricScore(evaluationScore.suggestion),
            MetricScoreUpsert.ofMetricScore(evaluationScore.codeStyle),
            MetricOvergenerationScoreUpsert.ofMetricOvergenerationScore(evaluationScore.overgeneration)
        )
    }

    public static zero(): EvaluationScoreUpsert {
        return new EvaluationScoreUpsert(
            0,
            MetricScoreUpsert.zero(),
            MetricScoreUpsert.zero(),
            MetricScoreUpsert.zero(),
            MetricOvergenerationScoreUpsert.zero()
        );
    }
}