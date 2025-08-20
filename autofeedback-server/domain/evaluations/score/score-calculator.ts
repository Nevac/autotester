import ExpectedFeedback from "../../attempts/expected-feedback/expected-feedback";
import EvaluationSemanticStatistic from "../statistic/evaluation-semantic-statistic";
import {EvaluationScore} from "./evaluation-score";
import FeedbackReference from "../../attempts/expected-feedback/feedback-reference";
import MetricScore from "./metric-score";
import ScoreTracker from "./scroe-tracker";
import ReferenceAddressing from "./reference-addressing";
import FeedbackMetric from "../../attempts/expected-feedback/feedback-metric";
import GeneratedFeedbackSemanticStatistic from "../statistic/generated-feedback-semantic-statistic";
import SCORE_THRESHOLD from "./score-threshold";
import MetricOvergenerationScore from "./metric-overgeneration-score";
import MetricWrongHit from "./metric-wrong-hit";
import ReferenceAddressingUpsert from "./reference-addressing-upsert";

export default class ScoreCalculator {
    public static generateScore(
        expectedFeedback: ExpectedFeedback,
        evaluationStatistic: EvaluationSemanticStatistic
    ): EvaluationScore {
        return new ScoreCalculator().generateScore(
            expectedFeedback,
            evaluationStatistic
        )
    }

    public generateScore(
        expectedFeedback: ExpectedFeedback,
        evaluationStatistic: EvaluationSemanticStatistic,
    ): EvaluationScore {
        const scoreTracker = new ScoreTracker();
        this.addExpectedReferencesToTracker(
            expectedFeedback,
            scoreTracker
        );

        this.checkIfReferencesAreAddressed(
            evaluationStatistic,
            scoreTracker
        );

        const correctness = this.calculateMetricScore(
            this.calculateMetricMalus(
                FeedbackMetric.CORRECTNESS,
                evaluationStatistic.generatedFeedback
            ),
            scoreTracker.correctness
        );
        const suggestion = this.calculateMetricScore(
            this.calculateMetricMalus(
                FeedbackMetric.SUGGESTION,
                evaluationStatistic.generatedFeedback
            ),
            scoreTracker.suggestion
        );
        const codeStyle = this.calculateMetricScore(0, scoreTracker.codeStyle);
        const overgeneration = this.calculateOvergeneration(
            evaluationStatistic.generatedFeedback
        );

        return new EvaluationScore(
            this.calculateTotalScore(
                correctness,
                suggestion,
                codeStyle,
                overgeneration
            ),
            correctness,
            suggestion,
            codeStyle,
            overgeneration
        )
    }

    private calculateTotalScore(
        correctness: MetricScore,
        suggestion: MetricScore,
        codeStyle: MetricScore,
        overgeneration: MetricOvergenerationScore
    ): number {
        return 0.35 * correctness.score +
            0.25 * suggestion.score +
            0.35 * codeStyle.score +
            0.05 * overgeneration.score;
    }

    private calculateMetricScore(
        malus: number,
        metricMap: Map<string, ReferenceAddressingUpsert>
    ): MetricScore {
        const scoreAddressings = Array.from(metricMap.values());
        const totalReferences = scoreAddressings.length;
        const addressedReferences = scoreAddressings.filter(addressing => addressing.addressed).length;

        let score = 1;
        if(totalReferences !== 0) {
            score = (addressedReferences - malus) / totalReferences;
        } else {
            score -= malus;
        }

        if(score < 0) {
            score = 0;
        }

        return new MetricScore(
            parseFloat(score.toPrecision(4)),
            scoreAddressings,
            []
        )
    }


    private prepareMetricScore(
        metric: FeedbackMetric,
        generatedSemanticStatistics: GeneratedFeedbackSemanticStatistic[],
        metricMap: Map<string, ReferenceAddressing>
    ): MetricScore {

        const overgenerations = generatedSemanticStatistics.filter(statistic => this.filterOvergeneratedMetrics(
            metric,
            statistic
        ));

        const scoreAddressings = Array.from(metricMap.values());
        const totalReferences = scoreAddressings.length;
        const addressedReferences = scoreAddressings.filter(addressing => addressing.addressed).length;

        return new MetricScore(
            0,
            scoreAddressings,
            overgenerations.map(overgeneration => new MetricWrongHit(
                overgeneration.index,
                overgeneration.sentence,
                false
            ))
        )
    }

    private checkIfReferencesAreAddressed(
        evaluationStatistic: EvaluationSemanticStatistic,
        scoreTracker: ScoreTracker
    ) {
        evaluationStatistic.expectedFeedback.forEach(expectedFeedback => {
            scoreTracker.addressReference(
                expectedFeedback
            );
        });
    }

    private addExpectedReferencesToTracker(
        expectedFeedback: ExpectedFeedback,
        scoreTracker: ScoreTracker
    ): void {
        this.addMetrics(
            expectedFeedback.correctness,
            (id: string) => scoreTracker.addCorrectnessReference(id)
        );
        this.addMetrics(
            expectedFeedback.suggestion,
            (id: string) => scoreTracker.addSuggestionReference(id)
        );
        this.addMetrics(
            expectedFeedback.codeStyle,
            (id: string) => scoreTracker.addCodeStyleReference(id)
        );
    }

    private addMetrics(
        feedbackReferences: FeedbackReference[],
        addFunction: (id: string) => void
    ): void {
        feedbackReferences.forEach(reference =>
            addFunction(reference.id)
        );
    }

    private calculateMetricMalus(
        metric: FeedbackMetric,
        generatedSemanticStatistics: GeneratedFeedbackSemanticStatistic[],
    ): number {
        return generatedSemanticStatistics.filter(statistic => this.filterOvergeneratedMetrics(
            metric,
            statistic
        )).length;
    }

    private filterOvergeneratedMetrics(
        metric: FeedbackMetric,
        statistic: GeneratedFeedbackSemanticStatistic
    ): boolean {
        return statistic.metric === metric && (statistic.scores.length === 0 || statistic.scores[0].score < SCORE_THRESHOLD);
    }

    private calculateOvergeneration(
        generatedSemanticStatistics: GeneratedFeedbackSemanticStatistic[],
    ): MetricOvergenerationScore {
        const overgenerations =  generatedSemanticStatistics.filter(statistic => this.filterOvergeneratedMetrics(
            FeedbackMetric.CODE_STYLE,
            statistic
        ));

        const overgenerationCount = overgenerations.length;
        let score = 1;
        if(overgenerationCount >= 2) {
            score = 0;
        } else if (overgenerationCount >= 1) {
            score = 0.5;
        }

        return new MetricOvergenerationScore(
            score,
            overgenerations
        );
    }
}