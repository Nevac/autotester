import MetricBestHit, {metricBestHitSchema} from "./metric-best-hit";
import {Schema} from "mongoose";

interface IMetricScore {
    score: number,
    bestHits: MetricBestHit[]
}

export default class MetricScore implements IMetricScore {
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

export const metricScoreSchema = new Schema<IMetricScore>(
    {
        score: { type: Number, required: true },
        bestHits: { type: [metricBestHitSchema], required: true }
    },
    {
        _id: false,
        timestamps: false
    }
);