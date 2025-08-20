import GeneratedFeedbackSemanticScore from "./generated-feedback-semantic-score";

export default class GeneratedFeedbackSemanticStatistic {
    constructor(
        public readonly index: number,
        public readonly sentence: string,
        public readonly scores: GeneratedFeedbackSemanticScore[]
    ) {}
}