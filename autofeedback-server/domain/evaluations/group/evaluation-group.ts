import {Document, model, Schema} from "mongoose";
import PromptGroup, {promptGroupSchema} from "../../prompts/prompt-group";
import Entity from "../../entities/entity";
import EntityUtil from "../../entities/entity";
import {Attempt, attemptSchema} from "../../attempts/attempt";
import {Llm} from "../../llms/llm";
import EvaluationState from "../evaluation-state";
import {EvaluationScore, evaluationScoreSchema} from "../evaluation-score";


export interface IEvaluationGroup {
    name: string,
    promptGroup: PromptGroup,
    attempts: Set<Attempt>,
    llms: Set<Llm>,
    state: EvaluationState,
    score: EvaluationScore
}

export class EvaluationGroup implements IEvaluationGroup, Entity {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly promptGroup: PromptGroup,
        public readonly attempts: Set<Attempt>,
        public readonly llms: Set<Llm>,
        public readonly state: EvaluationState,
        public readonly score: EvaluationScore,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {
    }

    public static ofDocument(evaluationGroup: EvaluationGroupDocument) {
        const [createdAt, updatedAt] = EntityUtil.checkForProperties(evaluationGroup);

        return new EvaluationGroup(
            EntityUtil.convertId(evaluationGroup._id),
            evaluationGroup.name,
            evaluationGroup.promptGroup,
            evaluationGroup.attempts,
            evaluationGroup.llms,
            evaluationGroup.state,
            evaluationGroup.score,
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
        llms: [{ type: String, required: true}],
        score: { type: evaluationScoreSchema, required: true }
    },
    {
        timestamps: true
    }
);

export type EvaluationGroupDocument = Document<unknown, {}, IEvaluationGroup> & IEvaluationGroup & {};
    ;
export const EvaluationGroupModel = model<IEvaluationGroup>('EvaluationGroup', evaluationGroupSchema);