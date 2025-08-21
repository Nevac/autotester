import Overgeneration from "./overgeneration";

export default class MetricOvergenerationScore {
    constructor(
        public readonly score: number,
        public readonly overgenerations: Overgeneration[]
    ) {}

    public static zero(): MetricOvergenerationScore {
        return new MetricOvergenerationScore(
            0,
            []
        );
    }
}