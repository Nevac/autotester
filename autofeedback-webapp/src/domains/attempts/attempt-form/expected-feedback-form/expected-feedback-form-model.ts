import FeedbackReferenceFormModel from "../feedback-references-form/feedback-reference-form-model";

export default class ExpectedFeedbackFormModel {
    constructor(
        public correctness: FeedbackReferenceFormModel[],
        public suggestion: FeedbackReferenceFormModel[],
        public codeStyle: FeedbackReferenceFormModel[]
    ) {}

    public static create(): ExpectedFeedbackFormModel {
        return new ExpectedFeedbackFormModel(
            [],
            [],
            []
        )
    }
}