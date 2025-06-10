import {EvaluationGroup, EvaluationGroupDocument} from "./evaluation-group";
import EntityUtil from "../../entities/entity";

export default class EvaluationGroupListEntry {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly createdAt: Date
    ) {
    }

    public static ofDocument(evaluationGroup: EvaluationGroupDocument): EvaluationGroupListEntry {
        const [createdAt, _] = EntityUtil.checkForProperties(evaluationGroup);

        return new EvaluationGroupListEntry(
            EntityUtil.convertId(evaluationGroup._id),
            evaluationGroup.name,
            createdAt
        )
    }
}