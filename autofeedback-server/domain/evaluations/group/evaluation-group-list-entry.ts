import {EvaluationGroup, EvaluationGroupDocument} from "./evaluation-group";
import EntityUtil from "../../entities/entity";
import EvaluationState from "../evaluation-state";
import {EvaluationScore} from "../evaluation-score";

export default class EvaluationGroupListEntry {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly state: EvaluationState,
        public readonly score: EvaluationScore,
        public readonly createdAt: Date
    ) {
    }

    public static ofDocument(evaluationGroup: EvaluationGroupDocument): EvaluationGroupListEntry {
        const [createdAt, _] = EntityUtil.checkForProperties(evaluationGroup);

        return new EvaluationGroupListEntry(
            EntityUtil.convertId(evaluationGroup._id),
            evaluationGroup.name,
            evaluationGroup.state,
            evaluationGroup.score,
            createdAt
        )
    }
}