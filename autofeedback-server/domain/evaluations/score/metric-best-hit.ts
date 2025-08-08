import {Schema} from "mongoose";
import ExpectedFeedbackSemanticStatistic from "../statistic/expected-feedback-semantic-statistic";

interface IMetricBestHit {
    id: string,
    expectedSentence: string,
    generatedSentence: string,
    similarityScore: number
}

export default class MetricBestHit implements IMetricBestHit {
    constructor(
        public readonly id: string,
        public readonly expectedSentence: string,
        public readonly generatedSentence: string,
        public readonly similarityScore: number
    ) {}
}

export const metricBestHitSchema = new Schema<IMetricBestHit>(
    {
        id: { type: String, required: true },
        expectedSentence: { type: String, required: true },
        generatedSentence: { type: String, required: true },
        similarityScore: { type: Number, required: true },
    },
    {
        _id: false,
        timestamps: false
    }
);