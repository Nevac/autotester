import FeedbackReference from "./feedback-reference";

export default class ExpectedFeedback {
    constructor(
        public readonly correctness: FeedbackReference[],
        public readonly suggestion: FeedbackReference[],
        public readonly codeStyle: FeedbackReference[]
    ) {}

    public static create(): ExpectedFeedback {
        return new ExpectedFeedback(
            [],
            [],
            []
        )
    }
}