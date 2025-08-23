import {EvaluationScoreCorrection} from "./evaluation-score-correction";
import {EvaluationScore} from "../evaluation-score";
import {EvaluationScoreUpsert} from "../evaluation-score-upsert";
import MetricScoreUpsert from "../metric/metric-score-upsert";
import MetricScoreCorrection from "./metric-score-correction";
import MetricOvergenerationScoreUpsert from "../metric/metric-overgeneration-score-upsert";
import MetricOvergenerationScoreCorrection from "./metric-overgeneration-score-correction";

export default class ScoreCorrector {

    public static correct(
        evaluationScore: EvaluationScoreUpsert,
        evaluationScoreCorrection: EvaluationScoreCorrection
    ): EvaluationScoreUpsert {
        return new ScoreCorrector()
            .correct(
                evaluationScore,
                evaluationScoreCorrection
            );
    }

    public correct(
        evaluationScore: EvaluationScoreUpsert,
        evaluationScoreCorrection: EvaluationScoreCorrection,
    ): EvaluationScoreUpsert {
        const scoreUpsert = EvaluationScoreUpsert.ofEvaluationScore(evaluationScore);

        this.correctMetricScore(
            scoreUpsert.correctness,
            evaluationScoreCorrection.correctness
        );

        this.correctMetricScore(
            scoreUpsert.suggestion,
            evaluationScoreCorrection.suggestion
        );

        this.correctMetricScore(
            scoreUpsert.codeStyle,
            evaluationScoreCorrection.codeStyle
        );

        this.correctOvergenerationMetricScore(
            scoreUpsert.overgeneration,
            evaluationScoreCorrection.overgeneration
        );

        return scoreUpsert;
    }

    private correctMetricScore(
        metricScore: MetricScoreUpsert,
        metricScoreCorrection: MetricScoreCorrection
    ) {
        const referenced = metricScore.referenceAddressings;
        const referencedCorrection = metricScoreCorrection.referenced;

        const unreferenced = metricScore.unreferencedFeedbacks;
        const unreferencedCorrection = metricScoreCorrection.unreferenced;

        for (const correction of referencedCorrection) {
            for(const reference of referenced) {
                if(correction.id === reference.id) {
                    reference.setIgnore(correction.ignore);
                    break;
                }
            }
        }

        for (const correction of unreferencedCorrection) {
            for(const reference of unreferenced) {
                if(correction.generatedFeedbackIndex === reference.generatedFeedbackIndex) {
                    reference.setIgnore(correction.ignore);
                    break;
                }
            }
        }
    }

    private correctOvergenerationMetricScore(
        metricScore: MetricOvergenerationScoreUpsert,
        metricScoreCorrection: MetricOvergenerationScoreCorrection
    ) {
        const overgenerations = metricScore.overgenerations;
        const overgenerationCorrections = metricScoreCorrection.overgenerations;

        for (const overgeneration of overgenerations) {
            for(const overgenerationCorrectness of overgenerationCorrections) {
                if(overgeneration.generatedFeedbackIndex === overgenerationCorrectness.generatedFeedbackIndex) {
                    overgeneration.setValidity(overgenerationCorrectness.validity);
                }
            }
        }
    }
}