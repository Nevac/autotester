import MetricScoreUpsert from "./metric/metric-score-upsert";
import MetricOvergenerationScoreUpsert from "./metric/metric-overgeneration-score-upsert";
import {EvaluationScore} from "./evaluation-score";

export class EvaluationScoreUpsert {

    constructor(
        public total: number,
        public correctness: MetricScoreUpsert,
        public suggestion: MetricScoreUpsert,
        public codeStyle: MetricScoreUpsert,
        public overgeneration: MetricOvergenerationScoreUpsert,
        public confusion: boolean = false
) {}

    public static ofEvaluationScore(evaluationScore: EvaluationScore) {
        return new EvaluationScoreUpsert(
            evaluationScore.total,
            MetricScoreUpsert.ofMetricScore(evaluationScore.correctness),
            MetricScoreUpsert.ofMetricScore(evaluationScore.suggestion),
            MetricScoreUpsert.ofMetricScore(evaluationScore.codeStyle),
            MetricOvergenerationScoreUpsert.ofMetricOvergenerationScore(evaluationScore.overgeneration)
        ).setConfusion(evaluationScore.confusion);
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

    public setConfusion(value: boolean): EvaluationScoreUpsert {
        this.confusion = value;
        return this;
    }
}