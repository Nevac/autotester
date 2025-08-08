import GeneratedFeedbackSemanticScore from "./generated-feedback-semantic-score";

interface IGeneratedFeedbackSemanticStatistic {
     sentence: string,
     scores: GeneratedFeedbackSemanticScore[]
}

export default class GeneratedFeedbackSemanticStatistic implements IGeneratedFeedbackSemanticStatistic {
    constructor(
        public readonly sentence: string,
        public readonly scores: GeneratedFeedbackSemanticScore[]
    ) {}
}