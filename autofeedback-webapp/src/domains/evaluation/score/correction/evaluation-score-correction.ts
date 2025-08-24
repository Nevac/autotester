import MetricScoreCorrection from "./metric-score-correction";
import MetricOvergenerationScoreCorrection from "./metric-overgeneration-score-correction";

export class EvaluationScoreCorrection {
    constructor(
        public correctness: MetricScoreCorrection,
        public suggestion: MetricScoreCorrection,
        public codeStyle: MetricScoreCorrection,
        public overgeneration: MetricOvergenerationScoreCorrection
    ) {}
}