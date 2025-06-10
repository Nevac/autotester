import {Schema} from "mongoose";

export interface IEvaluationScore {
    totalScore: number
}

export class EvaluationScore implements IEvaluationScore {
    constructor(
        public readonly totalScore: number
    ) {}

    public static zero(): EvaluationScore {
        return new EvaluationScore(0);
    }
}

export const evaluationScoreSchema = new Schema<IEvaluationScore>(
    {
        totalScore: { type: Number, required: true },
    },
    {
        timestamps: true
    }
);