import GeneratedFeedbackSemanticScore, {
    GeneratedFeedbackSemanticScoreSchema
} from "./generated-feedback-semantic-score";
import {Schema} from "mongoose";
import FeedbackMetric from "../../attempts/expected-feedback/feedback-metric";

interface IGeneratedFeedbackSemanticStatistic {
    index: number,
    sentence: string,
    metric: FeedbackMetric,
    scores: GeneratedFeedbackSemanticScore[]
}

export default class GeneratedFeedbackSemanticStatistic implements IGeneratedFeedbackSemanticStatistic {
    constructor(
        public readonly index: number,
        public readonly sentence: string,
        public readonly metric: FeedbackMetric,
        public readonly scores: GeneratedFeedbackSemanticScore[]
    ) {}
}

export const generatedFeedbackSemanticStatisticSchema = new Schema<IGeneratedFeedbackSemanticStatistic>(
    {
        index: { type: Number, required: true },
        sentence: { type: String, required: true },
        metric: { type: String, required: true },
        scores: { type: [GeneratedFeedbackSemanticScoreSchema], required: true },
    },
    {
        _id: false,
        timestamps: false,
    }
);