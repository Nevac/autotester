import {Schema} from "mongoose";
import GeneratedFeedbackSemanticStatistic, {
    generatedFeedbackSemanticStatisticSchema
} from "../statistic/generated-feedback-semantic-statistic";

interface IMetricOvergenerationScore {
    score: number,
    overgenerations: GeneratedFeedbackSemanticStatistic[]
}

export default class MetricOvergenerationScore implements IMetricOvergenerationScore{
    constructor(
        public readonly score: number,
        public readonly overgenerations: GeneratedFeedbackSemanticStatistic[]
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
        overgenerations: { type: [generatedFeedbackSemanticStatisticSchema], required: true }
    },
    {
        _id: false,
        timestamps: false
    }
);