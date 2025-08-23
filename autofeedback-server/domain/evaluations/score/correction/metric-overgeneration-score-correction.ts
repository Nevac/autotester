import OvergenerationValidity from "../metric/overgeneration-validity";
import OvergenerationCorrection from "./overgeneration-correction";

export default class MetricOvergenerationScoreCorrection {
    constructor(
        public overgenerations: OvergenerationCorrection[]
    ) {}
}