import {Schema} from "mongoose";

interface IExpectedFeedbackSemanticScore {
    sentence: string,
    score: number
}

export default class ExpectedFeedbackSemanticScore implements IExpectedFeedbackSemanticScore {
    constructor(
        public readonly sentence: string,
        public readonly score: number
    ) {}
}

export const ExpectedFeedbackSemanticScoreSchema = new Schema<IExpectedFeedbackSemanticScore>(
    {
        sentence: { type: String, required: true },
        score: { type: Number, required: true },
    },
    {
        _id: false,
        timestamps: false,
    }
);