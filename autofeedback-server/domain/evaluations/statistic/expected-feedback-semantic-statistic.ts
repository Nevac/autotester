import ExpectedFeedbackSemanticScore, {ExpectedFeedbackSemanticScoreSchema} from "./expected-feedback-semantic-score";
import {Schema} from "mongoose";

interface IExpectedFeedbackSemanticStatistic {
    id: string,
    sentence: string,
    scores: ExpectedFeedbackSemanticScore[]
}

export default class ExpectedFeedbackSemanticStatistic implements IExpectedFeedbackSemanticStatistic {
    constructor(
        public readonly id: string,
        public readonly sentence: string,
        public readonly scores: ExpectedFeedbackSemanticScore[]
    ) {}
}

export const ExpectedFeedbackSemanticStatisticSchema = new Schema<IExpectedFeedbackSemanticStatistic>(
    {
        id: { type: String, required: true },
        sentence: { type: String, required: true },
        scores: { type: [ExpectedFeedbackSemanticScoreSchema], required: true },
    },
    {
        _id: false,
        timestamps: true,
    }
);