import ExpectedFeedbackSemanticScore from "./expected-feedback-semantic-score";

export default class ExpectedFeedbackSemanticStatistic {
    constructor(
        public readonly id: string,
        public readonly sentence: string,
        public readonly scores: ExpectedFeedbackSemanticScore[]
    ) {}
}