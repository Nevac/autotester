import {Schema} from "mongoose";

interface IGeneratedFeedbackSemanticScore {
    id: string,
    sentence: string,
    score: number
}

export default class GeneratedFeedbackSemanticScore implements IGeneratedFeedbackSemanticScore{
    constructor(
        public readonly id: string,
        public readonly sentence: string,
        public readonly score: number
    ) {}
}

export const GeneratedFeedbackSemanticScoreSchema = new Schema<IGeneratedFeedbackSemanticScore>(
    {
        id: { type: String, required: true },
        sentence: { type: String, required: true },
        score: { type: Number, required: true },
    },
    {
        _id: false,
        timestamps: false,
    }
);