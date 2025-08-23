import {Schema} from "mongoose";
import MetricScore, {metricScoreSchema} from "./metric/metric-score";
import MetricOvergenerationScore, {metricOvergenerationScoreSchema} from "./metric/metric-overgeneration-score";

export interface IEvaluationScore {
    total: number,
    correctness: MetricScore,
    suggestion: MetricScore,
    codeStyle: MetricScore,
    overgeneration: MetricOvergenerationScore
}

export class EvaluationScore implements IEvaluationScore {
    constructor(
        public readonly total: number,
        public readonly correctness: MetricScore,
        public readonly suggestion: MetricScore,
        public readonly codeStyle: MetricScore,
        public readonly overgeneration: MetricOvergenerationScore
    ) {}

    public static zero(): EvaluationScore {
        return new EvaluationScore(
            0,
            MetricScore.zero(),
            MetricScore.zero(),
            MetricScore.zero(),
            MetricOvergenerationScore.zero()
        );
    }
}

export const evaluationScoreSchema = new Schema<IEvaluationScore>(
    {
        total: { type: Number, required: true },
        correctness: { type: metricScoreSchema, required: true },
        suggestion: { type: metricScoreSchema, required: true },
        codeStyle: { type: metricScoreSchema, required: true },
        overgeneration: { type: metricOvergenerationScoreSchema, required: true }
    },
    {
        _id: false,
        timestamps: false
    }
);