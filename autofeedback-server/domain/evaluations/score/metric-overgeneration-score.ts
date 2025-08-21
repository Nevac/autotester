import {Schema} from "mongoose";
import Overgeneration, {overgenerationSchema} from "./overgeneration";

interface IMetricOvergenerationScore {
    score: number,
    overgenerations: Overgeneration[]
}

export default class MetricOvergenerationScore implements IMetricOvergenerationScore{
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

export const metricOvergenerationScoreSchema = new Schema<IMetricOvergenerationScore>(
    {
        score: { type: Number, required: true },
        overgenerations: { type: [overgenerationSchema], required: true }
    },
    {
        _id: false,
        timestamps: false
    }
);