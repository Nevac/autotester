import UnreferencedFeedback from "../reference/unreferenced-feedback";
import ReferenceAddressing from "../reference/reference-addressing";

export default class MetricScore {
    constructor(
        public readonly score: number,
        public readonly referenceAddressings: ReferenceAddressing[],
        public readonly unreferencedFeedbacks: UnreferencedFeedback[]
    ) {}

    public static zero() {
        return new MetricScore(
            0,
            [],
            []
        );
    }
}