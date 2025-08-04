import {Document, Schema} from "mongoose";

interface IFeedbackReference {
    id: string,
    references: string[]
}

export default class FeedbackReference implements IFeedbackReference {
    constructor(
        public readonly id: string,
        public readonly references: string[]
    ) {}
}

export const feedbackReferenceSchema = new Schema<IFeedbackReference>(
    {
        id: { type: String, required: true },
        references: { type: [String], required: true },
    }
);

export type FeedbackReferenceDocument = Document<unknown, {}, IFeedbackReference> & IFeedbackReference & {};