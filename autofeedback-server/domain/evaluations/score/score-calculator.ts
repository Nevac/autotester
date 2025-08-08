import ExpectedFeedback from "../../attempts/expected-feedback/expected-feedback";
import EvaluationSemanticStatistic from "../statistic/evaluation-semantic-statistic";
import {EvaluationScore} from "./evaluation-score";
import FeedbackMetric from "../../attempts/expected-feedback/feedback-metric";
import FeedbackReference from "../../attempts/expected-feedback/feedback-reference";
import MetricBestHit from "./metric-best-hit";
import MetricScore from "./metric-score";
import ExpectedFeedbackSemanticStatistic from "../statistic/expected-feedback-semantic-statistic";

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
        evaluationStatistic: EvaluationSemanticStatistic
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

        const correctness = this.calculateMetricScore(scoreTracker.correctness);
        const suggestion = this.calculateMetricScore(scoreTracker.suggestion);
        const codeStyle = this.calculateMetricScore(scoreTracker.codeStyle);
        const overgeneration = 1;

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
        overgeneration: number
    ): number {
        return 0.5 * correctness.score +
            0.3 * suggestion.score +
            0.15 * codeStyle.score +
            0.05 * overgeneration;
    }

    private calculateMetricScore(metricMap: Map<string, ScoreAddressing>): MetricScore {
        const scoreAddressings = Array.from(metricMap.values());
        const totalReferences = scoreAddressings.length;
        const addressedReferences = scoreAddressings.filter(addressing => addressing.addressed).length;
        const score = addressedReferences / totalReferences;

        return new MetricScore(
            score,
            scoreAddressings.map(addressing => addressing.bestHit!)
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
}

class ScoreTracker {
    public readonly correctness: Map<string, ScoreAddressing> = new Map();
    public readonly suggestion: Map<string, ScoreAddressing> = new Map();
    public readonly codeStyle: Map<string, ScoreAddressing> = new Map();

    constructor() {}

    public addCorrectnessReference(id: string) {
        if(!this.correctness.has(id)) {
            this.correctness.set(id, ScoreAddressing.create(id))
        }
    }

    public addSuggestionReference(id: string) {
        if(!this.suggestion.has(id)) {
            this.suggestion.set(id, ScoreAddressing.create(id))
        }
    }

    public addCodeStyleReference(id: string) {
        if(!this.codeStyle.has(id)) {
            this.codeStyle.set(id, ScoreAddressing.create(id))
        }
    }

    public addressReference(
        expectedFeedback: ExpectedFeedbackSemanticStatistic
    ) {

        let sentence = "NOT ADDRESSED";
        let score = 0;
        let addressed = false;
        if(expectedFeedback.scores.length > 0) {
            const expectedSemanticScore = expectedFeedback.scores[0];
            sentence = expectedSemanticScore.sentence;
            score = expectedSemanticScore.score;
            addressed = true;
        }

        const id = expectedFeedback.id;
        const bestHit = new MetricBestHit(
            id,
            expectedFeedback.sentence,
            sentence,
            score
        );

        switch (expectedFeedback.metric) {
            case FeedbackMetric.CORRECTNESS:
                this.addressCorrectnessReference(id, addressed, bestHit);
                break;
            case FeedbackMetric.SUGGESTION:
                this.addressSuggestionReference(id, addressed, bestHit);
                break;
            case FeedbackMetric.CODE_STYLE:
                this.addressCodeStyleReference(id, addressed, bestHit);
                break;
        }
    }

    public addressCorrectnessReference(
        id: string,
        addressed: boolean,
        bestHit: MetricBestHit
    ) {
        if(this.correctness.has(id)) {
            this.correctness.get(id)!
                .setAddressed(addressed)
                .setBestHit(bestHit);
        }
    }

    public addressSuggestionReference(
        id: string,
        addressed: boolean,
        bestHit: MetricBestHit
    ) {
        if (this.suggestion.has(id)) {
            this.suggestion.get(id)!
                .setAddressed(addressed)
                .setBestHit(bestHit);
        }
    }

    public addressCodeStyleReference(
        id: string,
        addressed: boolean,
        bestHit: MetricBestHit
    ) {
        if(this.codeStyle.has(id)) {
            this.codeStyle.get(id)!
                .setAddressed(addressed)
                .setBestHit(bestHit)
        }
    }
}

class ScoreAddressing  {
    constructor(
        public readonly id: string,
        public addressed: boolean,
        public bestHit?: MetricBestHit
    ) {}

    public static create(id: string): ScoreAddressing {
        return new ScoreAddressing(
            id,
            false
        )
    }

    public setAddressed(value: boolean): ScoreAddressing {
        this.addressed = value;
        return this;
    }

    public setBestHit(value: MetricBestHit): ScoreAddressing {
        this.bestHit = value;
        return this;
    }
}