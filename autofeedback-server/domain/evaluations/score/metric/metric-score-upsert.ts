import ReferenceAddressingUpsert from "../reference/reference-addressing-upsert";
import UnreferencedFeedbackUpsert from "../reference/unreferenced-feedback-upsert";
import MetricScore from "./metric-score";

export default class MetricScoreUpsert {
    constructor(
        public score: number,
        public referenceAddressings: ReferenceAddressingUpsert[],
        public unreferencedFeedbacks: UnreferencedFeedbackUpsert[]
    ) {}

    public static ofMetricScore(metricScore: MetricScore): MetricScoreUpsert {
        return new MetricScoreUpsert(
            metricScore.score,
            ReferenceAddressingUpsert.ofReferenceAddressings(metricScore.referenceAddressings),
            UnreferencedFeedbackUpsert.ofUnreferencedFeedbacks(metricScore.unreferencedFeedbacks)
        )
    }

    public static zero(): MetricScoreUpsert {
        return new MetricScoreUpsert(
            0,
            [],
            []
        );
    }

    public static uncalculated(
        referenceAddressings: ReferenceAddressingUpsert[],
        unreferencedFeedbacks: UnreferencedFeedbackUpsert[]
    ): MetricScoreUpsert {
        return new MetricScoreUpsert(
            0,
            referenceAddressings,
            unreferencedFeedbacks
        );
    }

    public setScore(value: number): MetricScoreUpsert {
        this.score = value;
        return this;
    }
}