import {Llm} from "../../../llms/llm";
import {EvaluationScore, evaluationScoreSchema} from "../../score/evaluation-score";
import EvaluationState from "../../evaluation-state";
import {Schema} from "mongoose";

interface IEvaluationGroupLlm {
    llm: Llm,
    state: EvaluationState,
    score: EvaluationScore
}


export default class EvaluationGroupLlm implements  IEvaluationGroupLlm{
    constructor(
        public readonly llm: Llm,
        public readonly state: EvaluationState,
        public readonly score: EvaluationScore
    ) {
    }
}

export const evaluationGroupLlmSchema = new Schema<IEvaluationGroupLlm>(
    {
        llm: {type: String, required: true },
        state: { type: String, required: true },
        score: { type: evaluationScoreSchema, required: true },
    }
);