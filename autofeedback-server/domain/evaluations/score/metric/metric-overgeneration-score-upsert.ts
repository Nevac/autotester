import MetricOvergenerationScore from "./metric-overgeneration-score";
import OvergenerationUpsert from "./overgeneration-upsert";
import Overgeneration from "./overgeneration";
export default class MetricOvergenerationScoreUpsert {
    constructor(
        public score: number,
        public overgenerations: OvergenerationUpsert[]
    ) {}

    public static ofMetricOvergenerationScore(metricOvergenerationScore: MetricOvergenerationScore) {
        return new MetricOvergenerationScoreUpsert(
            metricOvergenerationScore.score,
            OvergenerationUpsert.ofOvergenerations(metricOvergenerationScore.overgenerations)
        );
    }

    public static zero(): MetricOvergenerationScoreUpsert {
        return new MetricOvergenerationScoreUpsert(
            0,
            []
        );
    }

    public static uncalculated(overgenerations: OvergenerationUpsert[]): MetricOvergenerationScoreUpsert {
        return new MetricOvergenerationScoreUpsert(
            0,
            overgenerations
        );
    }

    public setScore(value: number): MetricOvergenerationScoreUpsert {
        this.score = value;
        return this;
    }
}