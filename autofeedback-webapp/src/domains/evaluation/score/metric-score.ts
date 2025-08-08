import MetricBestHit from "./metric-best-hit";

export default class MetricScore {
    constructor(
        public readonly score: number,
        public readonly bestHits: MetricBestHit[]
    ) {}

    public static zero() {
        return new MetricScore(
            0,
            []
        );
    }
}