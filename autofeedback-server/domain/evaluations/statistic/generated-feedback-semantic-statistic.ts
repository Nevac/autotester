import GeneratedFeedbackSemanticScore, {
    GeneratedFeedbackSemanticScoreSchema
} from "./generated-feedback-semantic-score";
import {Schema} from "mongoose";
import {ExpectedFeedbackSemanticScoreSchema} from "./expected-feedback-semantic-score";

interface IGeneratedFeedbackSemanticStatistic {
     sentence: string,
     scores: GeneratedFeedbackSemanticScore[]
}

export default class GeneratedFeedbackSemanticStatistic implements IGeneratedFeedbackSemanticStatistic {
    constructor(
        public readonly sentence: string,
        public readonly scores: GeneratedFeedbackSemanticScore[]
    ) {}

    public static emptyScores(sentence: string) {
        return new GeneratedFeedbackSemanticStatistic(
            sentence,
            []
        );
    }
}

export const GeneratedFeedbackSemanticStatisticSchema = new Schema<IGeneratedFeedbackSemanticStatistic>(
    {
        sentence: { type: String, required: true },
        scores: { type: [GeneratedFeedbackSemanticScoreSchema], required: true },
    },
    {
        _id: false,
        timestamps: false,
    }
);