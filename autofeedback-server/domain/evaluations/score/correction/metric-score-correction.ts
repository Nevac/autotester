import ReferencedCorrection from "./referenced-correction";
import UnreferencedCorrection from "./unreferenced-correction";

export default class MetricScoreCorrection {
    constructor(
        public referenced: ReferencedCorrection[],
        public unreferenced: UnreferencedCorrection[]
    ) {}
}