import FeedbackReference, {feedbackReferenceSchema} from "./feedback-reference";
import {Document, Schema} from "mongoose";

export interface IExpectedFeedback {
    correctness: FeedbackReference[],
    suggestion: FeedbackReference[],
    codeStyle: FeedbackReference[]
}

export default class ExpectedFeedback implements IExpectedFeedback {
    constructor(
        public readonly correctness: FeedbackReference[],
        public readonly suggestion: FeedbackReference[],
        public readonly codeStyle: FeedbackReference[]
    ) {}
}

export const expectedFeedbackSchema = new Schema<IExpectedFeedback>(
    {
        correctness: { type: [feedbackReferenceSchema], required: true },
        suggestion: { type: [feedbackReferenceSchema], required: true },
        codeStyle: { type: [feedbackReferenceSchema], required: true },
    }
);

export type ExpectedFeedbackDocument = Document<unknown, {}, IExpectedFeedback> & IExpectedFeedback & {};