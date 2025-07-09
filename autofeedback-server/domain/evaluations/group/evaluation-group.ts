import {Document, model, Schema} from "mongoose";
import PromptGroup, {promptGroupSchema} from "../../prompts/prompt-group";
import Entity from "../../entities/entity";
import EntityUtil from "../../entities/entity";
import {Attempt, attemptSchema} from "../../attempts/attempt";
import {Llm} from "../../llms/llm";
import EvaluationGroupLlm, {evaluationGroupLlmSchema} from "./llm/evaluation-group-llm";
import EvaluationState from "../evaluation-state";
import Rag, {ragSchema} from "../../rag/rag";


export interface IEvaluationGroup {
    name: string,
    promptGroup: PromptGroup,
    attempts: Set<Attempt>,
    llms: Map<Llm, EvaluationGroupLlm>,
    state: EvaluationState,
    rag?: Rag,
    bestLlm?: Llm,
    bestScore?: number
}

export class EvaluationGroup implements IEvaluationGroup, Entity {


    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly promptGroup: PromptGroup,
        public readonly attempts: Set<Attempt>,
        public readonly llms: Map<Llm, EvaluationGroupLlm>,
        public readonly state: EvaluationState,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly rag?: Rag,
        public readonly bestLlm?: Llm,
        public readonly bestScore?: number
    ) {}

    public static ofDocument(evaluationGroup: EvaluationGroupDocument) {
        const [createdAt, updatedAt] = EntityUtil.checkForProperties(evaluationGroup);

        return new EvaluationGroup(
            EntityUtil.convertId(evaluationGroup._id),
            evaluationGroup.name,
            evaluationGroup.promptGroup,
            evaluationGroup.attempts,
            evaluationGroup.llms,
            evaluationGroup.state,
            createdAt,
            updatedAt,
            evaluationGroup.rag,
            evaluationGroup.bestLlm,
            evaluationGroup.bestScore
        )
    }
}

export const evaluationGroupSchema = new Schema<IEvaluationGroup>(
    {
        name: { type: String, required: true },
        promptGroup: { type: promptGroupSchema, required: true },
        attempts: [{ type: attemptSchema, required: true }],
        llms: { type: Map, of: evaluationGroupLlmSchema, required: true },
        state: { type: String, required: true },
        rag: { type: ragSchema, required: false },
        bestScore: { type: Number, required: false },
        bestLlm: { type: String, required: false }
    },
    {
        timestamps: true
    }
);

export type EvaluationGroupDocument = Document<unknown, {}, IEvaluationGroup> & IEvaluationGroup & {};
    ;
export const EvaluationGroupModel = model<IEvaluationGroup>('EvaluationGroup', evaluationGroupSchema);