import GeneratedFeedbackSemanticStatistic, {
    generatedFeedbackSemanticStatisticSchema
} from "./generated-feedback-semantic-statistic";
import {Schema} from "mongoose";
import ExpectedFeedbackSemanticStatistic, {
    ExpectedFeedbackSemanticStatisticSchema
} from "./expected-feedback-semantic-statistic";

export interface IEvaluationSemanticStatistic {
    expectedFeedback: ExpectedFeedbackSemanticStatistic[],
    generatedFeedback: GeneratedFeedbackSemanticStatistic[],
}

export default class EvaluationSemanticStatistic implements IEvaluationSemanticStatistic {
    constructor(
        public readonly expectedFeedback: ExpectedFeedbackSemanticStatistic[],
        public readonly generatedFeedback: GeneratedFeedbackSemanticStatistic[]
    ) {}

    public static empty(): EvaluationSemanticStatistic {
        return new EvaluationSemanticStatistic (
            [],
            []
        );
    }
}

export const EvaluationSemanticStatisticSchema = new Schema<IEvaluationSemanticStatistic>(
    {
        expectedFeedback: { type: [ExpectedFeedbackSemanticStatisticSchema], required: true },
        generatedFeedback: { type: [generatedFeedbackSemanticStatisticSchema], required: true },
    },
    {
        _id: false,
        timestamps: false,
    }
);