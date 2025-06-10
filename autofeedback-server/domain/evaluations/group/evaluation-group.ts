import {Document, model, Schema} from "mongoose";
import PromptGroup, {promptGroupSchema} from "../../prompts/prompt-group";
import Entity from "../../entities/entity";
import EntityUtil from "../../entities/entity";
import {Attempt, attemptSchema} from "../../attempts/attempt";
import {Llm} from "../../llms/llm";
import EvaluationState from "../evaluation-state";


export interface IEvaluationGroup {
    name: string,
    promptGroup: PromptGroup,
    attempts: Set<Attempt>,
    llms: Set<Llm>,
    state: EvaluationState
}

export class EvaluationGroup implements IEvaluationGroup, Entity {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly promptGroup: PromptGroup,
        public readonly attempts: Set<Attempt>,
        public readonly llms: Set<Llm>,
        public readonly state: EvaluationState,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {
    }

    public static ofDocument(evaluation: EvaluationGroupDocument) {
        const [createdAt, updatedAt] = EntityUtil.checkForProperties(evaluation);

        return new EvaluationGroup(
            EntityUtil.convertId(evaluation._id),
            evaluation.name,
            evaluation.promptGroup,
            evaluation.attempts,
            evaluation.llms,
            evaluation.state,
            createdAt,
            updatedAt
        )
    }
}

export const evaluationGroupSchema = new Schema<IEvaluationGroup>(
    {
        name: { type: String, required: true },
        promptGroup: { type: promptGroupSchema, required: true },
        attempts: [{ type: attemptSchema, required: true }],
        llms: [{ type: String, required: true}]
    },
    {
        timestamps: true
    }
);

export type EvaluationGroupDocument = Document<unknown, {}, IEvaluationGroup> & IEvaluationGroup & {};
    ;
export const EvaluationGroupModel = model<IEvaluationGroup>('EvaluationGroup', evaluationGroupSchema);