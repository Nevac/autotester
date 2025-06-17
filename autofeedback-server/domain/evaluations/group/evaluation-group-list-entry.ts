import {EvaluationGroupDocument} from "./evaluation-group";
import EntityUtil from "../../entities/entity";
import EvaluationState from "../evaluation-state";
import {Llm} from "../../llms/llm";

export default class EvaluationGroupListEntry {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly state: EvaluationState,
        public readonly createdAt: Date,
        public readonly bestScore?: number,
        public readonly bestLlm?: Llm,
    ) {
    }

    public static ofDocument(evaluationGroup: EvaluationGroupDocument): EvaluationGroupListEntry {
        const [createdAt, _] = EntityUtil.checkForProperties(evaluationGroup);

        return new EvaluationGroupListEntry(
            EntityUtil.convertId(evaluationGroup._id),
            evaluationGroup.name,
            evaluationGroup.state,
            createdAt,
            evaluationGroup.bestScore,
            evaluationGroup.bestLlm,
        )
    }
}