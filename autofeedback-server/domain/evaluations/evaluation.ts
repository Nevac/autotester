import {Document, model, Schema} from "mongoose";
import {Attempt, attemptSchema} from "../attempts/attempt";
import PromptGroup, {promptGroupSchema} from "../prompts/prompt-group";
import EntityUtil from "../entities/entity";
import Entity from "../entities/entity";
import EvaluationState from "./evaluation-state";
import {EvaluationScore, evaluationScoreSchema} from "./evaluation-score";
import {Llm} from "../llms/llm";
import Rag, {ragSchema} from "../rag/rag";


export interface IEvaluation {
    name: string,
    evaluationGroup: string,
    attempt: Attempt,
    promptGroup: PromptGroup,
    llm: Llm,
    state: EvaluationState,
    score: EvaluationScore,
    rag?: Rag
}

export class Evaluation implements IEvaluation, Entity {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly evaluationGroup: string,
        public readonly attempt: Attempt,
        public readonly promptGroup: PromptGroup,
        public readonly llm: Llm,
        public readonly state: EvaluationState,
        public readonly score: EvaluationScore,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly rag?: Rag,
    ) {
    }

    public static ofDocument(evaluation: EvaluationDocument) {
        const [createdAt, updatedAt] = EntityUtil.checkForProperties(evaluation);

        return new Evaluation(
            EntityUtil.convertId(evaluation._id),
            evaluation.name,
            evaluation.evaluationGroup,
            evaluation.attempt,
            evaluation.promptGroup,
            evaluation.llm,
            evaluation.state,
            evaluation.score,
            createdAt,
            updatedAt,
            evaluation.rag,
        )
    }

    public static ofDocuments(evaluations: EvaluationDocument[]): Map<string, Evaluation> {
        return new Map(
            evaluations.map(evaluation => [
                EntityUtil.convertId(evaluation._id),
                Evaluation.ofDocument(evaluation)
            ]));
    }
}

export const evaluationSchema = new Schema<IEvaluation>(
    {
        name: { type: String, required: true },
        evaluationGroup: { type: String, required: true },
        attempt: { type: attemptSchema, required: true },
        promptGroup: { type: promptGroupSchema, required: true },
        llm: { type: String, required: true },
        state: { type: String, required: true },
        score: { type: evaluationScoreSchema, required: true },
        rag: { type: ragSchema, required: false },
    },
    {
        timestamps: true
    }
);

export type EvaluationDocument = Document<unknown, {}, IEvaluation> & IEvaluation & {};
export const EvaluationModel = model<IEvaluation>('Evaluation', evaluationSchema);