import {Schema} from "mongoose";
import ExpectedFeedbackSemanticStatistic from "../statistic/expected-feedback-semantic-statistic";

interface IMetricWrongHit {
    index: number,
    generatedSentence: string,
    ignore: boolean,
}

export default class MetricWrongHit implements IMetricWrongHit {
    constructor(
        public readonly index: number,
        public readonly generatedSentence: string,
        public readonly ignore: boolean
    ) {}
}

export const metricWrongHitSchema = new Schema<IMetricWrongHit>(
    {
        index: { type: Number, required: true },
        generatedSentence: { type: String, required: true },
        ignore: { type: Boolean, required: true }
    },
    {
        _id: false,
        timestamps: false
    }
);