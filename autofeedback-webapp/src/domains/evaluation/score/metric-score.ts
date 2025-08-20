import MetricWrongHit from "./metric-wrong-hit";
import ReferenceAddressing from "./reference-addressing";

export default class MetricScore {
    constructor(
        public readonly score: number,
        public readonly referenceAddressings: ReferenceAddressing[],
        public readonly wrongHits: MetricWrongHit[]
    ) {}

    public static zero() {
        return new MetricScore(
            0,
            [],
            []
        );
    }
}