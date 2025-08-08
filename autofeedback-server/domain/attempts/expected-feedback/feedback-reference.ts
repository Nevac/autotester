import {Document, Schema} from "mongoose";
import FeedbackMetric from "./feedback-metric";

interface IFeedbackReference {
    id: string,
    references: string[],
    metric: FeedbackMetric
}

export default class FeedbackReference implements IFeedbackReference {
    constructor(
        public readonly id: string,
        public readonly references: string[],
        public readonly metric : FeedbackMetric
    ) {}
}

export const feedbackReferenceSchema = new Schema<IFeedbackReference>(
    {
        id: { type: String, required: true },
        references: { type: [String], required: true },
        metric: {type: String, require: true }
    }
);

export type FeedbackReferenceDocument = Document<unknown, {}, IFeedbackReference> & IFeedbackReference & {};