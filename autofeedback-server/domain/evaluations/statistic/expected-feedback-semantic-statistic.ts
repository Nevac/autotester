import ExpectedFeedbackSemanticScore, {ExpectedFeedbackSemanticScoreSchema} from "./expected-feedback-semantic-score";
import {Schema} from "mongoose";
import FeedbackMetric from "../../attempts/expected-feedback/feedback-metric";

interface IExpectedFeedbackSemanticStatistic {
    id: string,
    metric: FeedbackMetric,
    sentence: string,
    scores: ExpectedFeedbackSemanticScore[]
}

export default class ExpectedFeedbackSemanticStatistic implements IExpectedFeedbackSemanticStatistic {
    constructor(
        public readonly id: string,
        public readonly metric: FeedbackMetric,
        public readonly sentence: string,
        public readonly scores: ExpectedFeedbackSemanticScore[]
    ) {}

    public static emptyScores(
        id: string,
        metric: FeedbackMetric,
        sentence: string
    ): ExpectedFeedbackSemanticStatistic {
        return new ExpectedFeedbackSemanticStatistic(
            id,
            metric,
            sentence,
            []
        );
    }
}

export const ExpectedFeedbackSemanticStatisticSchema = new Schema<IExpectedFeedbackSemanticStatistic>(
    {
        id: { type: String, required: true },
        metric: { type: String, required: true },
        sentence: { type: String, required: true },
        scores: { type: [ExpectedFeedbackSemanticScoreSchema], required: true },
    },
    {
        _id: false,
        timestamps: false,
    }
);