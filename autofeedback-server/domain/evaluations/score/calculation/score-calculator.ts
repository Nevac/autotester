import ExpectedFeedback from "../../../attempts/expected-feedback/expected-feedback";
import EvaluationSemanticStatistic from "../../statistic/evaluation-semantic-statistic";
import FeedbackReference from "../../../attempts/expected-feedback/feedback-reference";
import MetricScore from "../metric/metric-score";
import ScoreTracker from "./scroe-tracker";
import ReferenceAddressing from "../reference/reference-addressing";
import FeedbackMetric from "../../../attempts/expected-feedback/feedback-metric";
import GeneratedFeedbackSemanticStatistic from "../../statistic/generated-feedback-semantic-statistic";
import SCORE_THRESHOLD from "./score-threshold";
import MetricOvergenerationScore from "../metric/metric-overgeneration-score";
import UnreferencedFeedback from "../reference/unreferenced-feedback";
import OvergenerationValidity from "../metric/overgeneration-validity";
import {EvaluationScoreUpsert} from "../evaluation-score-upsert";
import MetricScoreUpsert from "../metric/metric-score-upsert";
import MetricOvergenerationScoreUpsert from "../metric/metric-overgeneration-score-upsert";
import UnreferencedFeedbackUpsert from "../reference/unreferenced-feedback-upsert";
import OvergenerationUpsert from "../metric/overgeneration-upsert";

export default class ScoreCalculator {
    public static calculateFromStatistic(
        expectedFeedback: ExpectedFeedback,
        evaluationStatistic: EvaluationSemanticStatistic
    ): EvaluationScoreUpsert {
        return new ScoreCalculator().calculateFromStatistic(
            expectedFeedback,
            evaluationStatistic
        )
    }

    public static calculate(
        uncalculatedCorrectness: MetricScoreUpsert,
        uncalculatedSuggestion: MetricScoreUpsert,
        uncalculatedCodeStyle: MetricScoreUpsert,
        uncalculatedOvergeneration: MetricOvergenerationScoreUpsert
    ): EvaluationScoreUpsert {
        return new ScoreCalculator().calculate(
            uncalculatedCorrectness,
            uncalculatedSuggestion,
            uncalculatedCodeStyle,
            uncalculatedOvergeneration
        )
    }

    public calculateFromStatistic(
        expectedFeedback: ExpectedFeedback,
        evaluationStatistic: EvaluationSemanticStatistic,
    ): EvaluationScoreUpsert {
        const scoreTracker = new ScoreTracker();
        this.addExpectedReferencesToTracker(
            expectedFeedback,
            scoreTracker
        );

        this.checkIfReferencesAreAddressed(
            evaluationStatistic,
            scoreTracker
        );

        const unreferencedCorrectness = this.gatherUnreferencedFeedbacks(
            FeedbackMetric.CORRECTNESS,
            evaluationStatistic.generatedFeedback
        );

        const unreferencedSuggestion = this.gatherUnreferencedFeedbacks(
            FeedbackMetric.SUGGESTION,
            evaluationStatistic.generatedFeedback
        );

        const overgenerations = evaluationStatistic.generatedFeedback
            .filter(statistic => this.filterOvergeneratedMetrics(
                FeedbackMetric.CODE_STYLE,
                statistic
            )).map(semantic =>
                new OvergenerationUpsert(
                    semantic.index,
                    semantic.sentence,
                    OvergenerationValidity.VALID
                )
            );

        return this.calculate(
            MetricScoreUpsert.uncalculated(
                Array.from(scoreTracker.correctness.values()),
                unreferencedCorrectness,
            ),
            MetricScoreUpsert.uncalculated(
                Array.from(scoreTracker.suggestion.values()),
                unreferencedSuggestion
            ),
            MetricScoreUpsert.uncalculated(
                Array.from(scoreTracker.codeStyle.values()),
                []
            ),
            MetricOvergenerationScoreUpsert.uncalculated(overgenerations)
        )
    }

    public calculate(
        uncalculatedCorrectness: MetricScoreUpsert,
        uncalculatedSuggestion: MetricScoreUpsert,
        uncalculatedCodeStyle: MetricScoreUpsert,
        uncalculatedOvergeneration: MetricOvergenerationScoreUpsert
    ): EvaluationScoreUpsert {
        const correctness = this.calculateMetricScore(uncalculatedCorrectness);
        const suggestion = this.calculateMetricScore(uncalculatedSuggestion);
        const codeStyle = this.calculateCodeStyle(
            uncalculatedCodeStyle,
            uncalculatedOvergeneration
        );
        const overgeneration = this.calculateOvergeneration(
            uncalculatedOvergeneration
        );

        return this.calculateAndReturnEvaluationScore(
            correctness,
            suggestion,
            codeStyle,
            overgeneration
        );
    }

    private calculateAndReturnEvaluationScore(
        correctness: MetricScoreUpsert,
        suggestion: MetricScoreUpsert,
        codeStyle: MetricScoreUpsert,
        overgeneration: MetricOvergenerationScoreUpsert
    ): EvaluationScoreUpsert {
        return new EvaluationScoreUpsert(
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
        emptyMetricScore: MetricScoreUpsert
    ): MetricScoreUpsert {
        const unreferencedFeedback = emptyMetricScore.unreferencedFeedbacks;
        const referenceAddressings = emptyMetricScore.referenceAddressings;
        const totalReferences = referenceAddressings.length;

        let score = this.calculateScore(
            this.extractAddressedReferencesCount(referenceAddressings),
            totalReferences,
            this.extractUnreferencedFeedbackCount(unreferencedFeedback),
            0
        );

        return emptyMetricScore.setScore(
            parseFloat(score.toPrecision(4))
        );
    }

    private calculateCodeStyle(
        emptyCodeStyle: MetricScoreUpsert,
        emptyOvergeneration: MetricOvergenerationScore
    ): MetricScoreUpsert {
        const unreferencedFeedback = emptyCodeStyle.unreferencedFeedbacks;
        const referenceAddressings = emptyCodeStyle.referenceAddressings;
        const totalReferences = referenceAddressings.length;

        let malus = this.extractUnreferencedFeedbackCount(unreferencedFeedback)
        const bonus = emptyOvergeneration.overgenerations.filter(overgeneration =>
            overgeneration.validity === OvergenerationValidity.CODE_STYLE
        ).length;

        // const validOvergenerationsCount = emptyOvergeneration.overgenerations
        //     .filter(overgeneration => overgeneration.validity === OvergenerationValidity.VALID)
        //     .length;
        // if(totalReferences === 0 && validOvergenerationsCount > 0) {
        //     malus += 1;
        // }

        let score = this.calculateScore(
            this.extractAddressedReferencesCount(referenceAddressings),
            totalReferences,
            malus,
            bonus
        );

        return emptyCodeStyle.setScore(
            parseFloat(score.toPrecision(4))
        );
    }

    private extractAddressedReferencesCount(
        referenceAddressings: ReferenceAddressing[]
    ): number {
        return referenceAddressings
            .filter(addressing =>
                (addressing.addressed && !addressing.ignore) ||
                (!addressing.addressed && addressing.ignore))
            .length;
    }

    private extractUnreferencedFeedbackCount(
        unreferencedFeedback: UnreferencedFeedback[]
    ): number {
        return unreferencedFeedback
            .filter(feedback => !feedback.ignore)
            .length;
    }

    private calculateScore(
        addressedReferences: number,
        totalReferences: number,
        malus: number = 0,
        bonus: number = 0,
    ): number {
        let score = 1;
        let modifier = bonus - malus;
        if(totalReferences !== 0) {
            score = (addressedReferences + modifier) / totalReferences;
        } else {
            score += modifier;
        }

        if(score < 0) {
            score = 0;
        } else if(score > 1) {
            score = 1;
        }

        return score;
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

    private gatherUnreferencedFeedbacks(
        metric: FeedbackMetric,
        generatedSemanticStatistics: GeneratedFeedbackSemanticStatistic[]
    ): UnreferencedFeedbackUpsert[] {
        return generatedSemanticStatistics
            .filter(statistic =>
                this.filterOvergeneratedMetrics(
                    metric,
                    statistic
                )
            ).map(statistic =>
                new UnreferencedFeedbackUpsert(
                    statistic.index,
                    statistic.sentence,
                    false
                )
            );
    }

    private filterOvergeneratedMetrics(
        metric: FeedbackMetric,
        statistic: GeneratedFeedbackSemanticStatistic
    ): boolean {
        return statistic.metric === metric && (statistic.scores.length === 0 || statistic.scores[0].score < SCORE_THRESHOLD);
    }

    private calculateOvergeneration(
        emptyMetricScore: MetricOvergenerationScoreUpsert
    ): MetricOvergenerationScoreUpsert {
        const overgenerations = emptyMetricScore.overgenerations;
        const overgenerationCount = overgenerations.filter(overgeneration =>
            overgeneration.validity === OvergenerationValidity.VALID
        ).length;

        let score = 1;
        if(overgenerationCount >= 2) {
            score = 0;
        } else if (overgenerationCount >= 1) {
            score = 0.5;
        }

        return emptyMetricScore
            .setScore(score);
    }
}