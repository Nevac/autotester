import ExpectedFeedbackSemanticStatistic from "../statistic/expected-feedback-semantic-statistic";
import MetricBestHit from "./metric-best-hit";
import FeedbackMetric from "../../attempts/expected-feedback/feedback-metric";
import ScoreAddressing from "./score-addressing";

export default class ScoreTracker {
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
                this.addressMetricReference(id, this.correctness, addressed, bestHit);
                break;
            case FeedbackMetric.SUGGESTION:
                this.addressMetricReference(id, this.suggestion, addressed, bestHit);
                break;
            case FeedbackMetric.CODE_STYLE:
                this.addressMetricReference(id, this.codeStyle, addressed, bestHit);
                break;
        }
    }

    private addressMetricReference(
        id: string,
        map: Map<string, ScoreAddressing>,
        addressed: boolean,
        bestHit: MetricBestHit
    ): void {
        if(map.has(id)) {
            this.addressMetricAndSetBestHit(
                map.get(id)!,
                addressed,
                bestHit
            );
        }
    }

    private addressMetricAndSetBestHit(scoreAddressing: ScoreAddressing, addressed: boolean, bestHit: MetricBestHit) {
        if(!scoreAddressing.addressed) {
            scoreAddressing.setAddressed(addressed);
        }
        if(!scoreAddressing.bestHit || scoreAddressing.bestHit.similarityScore < bestHit.similarityScore) {
            scoreAddressing.setBestHit(bestHit);
        }
    }
}