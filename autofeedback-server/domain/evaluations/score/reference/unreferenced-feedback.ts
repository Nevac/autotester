import {Schema} from "mongoose";
import ExpectedFeedbackSemanticStatistic from "../../statistic/expected-feedback-semantic-statistic";

interface IUnreferencedFeedback {
    generatedFeedbackIndex: number,
    generatedSentence: string,
    ignore: boolean,
}

export default class UnreferencedFeedback implements IUnreferencedFeedback {
    constructor(
        public readonly generatedFeedbackIndex: number,
        public readonly generatedSentence: string,
        public readonly ignore: boolean
    ) {}
}

export const unassignedFeedbackSchema = new Schema<IUnreferencedFeedback>(
    {
        generatedFeedbackIndex: { type: Number, required: true },
        generatedSentence: { type: String, required: true },
        ignore: { type: Boolean, required: true }
    },
    {
        _id: false,
        timestamps: false
    }
);