import {Schema} from "mongoose";

export interface IEvaluationGroupLlmScore {
    total: number,
    correctness: number,
    suggestion: number,
    codeStyle: number,
    overgeneration: number
}

export class EvaluationGroupLlmScore implements IEvaluationGroupLlmScore {
    constructor(
        public readonly total: number,
        public readonly correctness: number,
        public readonly suggestion: number,
        public readonly codeStyle: number,
        public readonly overgeneration: number
    ) {}

    public static zero(): EvaluationGroupLlmScore {
        return new EvaluationGroupLlmScore(
            0,
            0,
            0,
            0,
            0
        );
    }

    public add(
        total: number,
        correctness: number,
        suggestion: number,
        codeStyle: number,
        overgeneration: number
    ): EvaluationGroupLlmScore {
        return new EvaluationGroupLlmScore(
            this.total + total,
            this.correctness + correctness,
            this.suggestion + suggestion,
            this.codeStyle + codeStyle,
            this.overgeneration + overgeneration
        );
    }

    public toPrecision(precision: number): EvaluationGroupLlmScore {
        return new EvaluationGroupLlmScore(
            parseFloat(this.total.toPrecision(precision)),
            parseFloat(this.correctness.toPrecision(precision)),
            parseFloat(this.suggestion.toPrecision(precision)),
            parseFloat(this.codeStyle.toPrecision(precision)),
            parseFloat(this.overgeneration.toPrecision(precision)),
        )
    }
}

export const evaluationGroupLlmScoreSchema = new Schema<IEvaluationGroupLlmScore>(
    {
        total: { type: Number, required: true },
        correctness: { type: Number, required: true },
        suggestion: { type: Number, required: true },
        codeStyle: { type: Number, required: true },
        overgeneration: { type: Number, required: true }
    },
    {
        _id: false,
        timestamps: false
    }
);