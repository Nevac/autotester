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
import UnreferencedFeedback from "./unreferenced-feedback";
import ReferenceAddressingUpsert from "./reference-addressing-upsert";
import Overgeneration from "./overgeneration";
import OvergenerationValidity from "./overgeneration-validity";

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

        const unreferencedCorrectness = this.gatherUnreferencedFeedbacks(
            FeedbackMetric.CORRECTNESS,
            evaluationStatistic.generatedFeedback
        );

        const correctness = this.calculateMetricScore(
            unreferencedCorrectness,
            Array.from(scoreTracker.correctness.values())
        );

        const unreferencedSuggestion = this.gatherUnreferencedFeedbacks(
            FeedbackMetric.SUGGESTION,
            evaluationStatistic.generatedFeedback
        );

        const suggestion = this.calculateMetricScore(
            unreferencedSuggestion,
            Array.from(scoreTracker.suggestion.values())
        );

        const codeStyle = this.calculateMetricScore(
            [],
            Array.from(scoreTracker.codeStyle.values())
        )

        const overgenerations = evaluationStatistic.generatedFeedback
            .filter(statistic => this.filterOvergeneratedMetrics(
                FeedbackMetric.CODE_STYLE,
                statistic
            )).map(semantic =>
                new Overgeneration(
                    semantic.index,
                    semantic.sentence,
                    OvergenerationValidity.VALID
                )
            );

        const overgeneration = this.calculateOvergeneration(
            overgenerations
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
        unreferencedFeedback: UnreferencedFeedback[],
        referenceAddressings: ReferenceAddressingUpsert[]
    ): MetricScore {
        const totalReferences = referenceAddressings.length;

        const addressedReferences = referenceAddressings
            .filter(addressing => addressing.addressed && !addressing.ignore)
            .length;

        const malus = unreferencedFeedback
            .filter(feedback => !feedback.ignore)
            .length;

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
            referenceAddressings,
            unreferencedFeedback
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
            overgenerations.map(overgeneration => new UnreferencedFeedback(
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

    private gatherUnreferencedFeedbacks(
        metric: FeedbackMetric,
        generatedSemanticStatistics: GeneratedFeedbackSemanticStatistic[]
    ): UnreferencedFeedback[] {
        return generatedSemanticStatistics
            .filter(statistic =>
                this.filterOvergeneratedMetrics(
                    metric,
                    statistic
                )
            ).map(statistic =>
                new UnreferencedFeedback(
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
        overgenerations: Overgeneration[],
    ): MetricOvergenerationScore {
        const overgenerationCount = overgenerations.filter(overgeneration =>
            overgeneration.validity === OvergenerationValidity.VALID
        ).length;

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