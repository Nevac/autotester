import {EvaluationDocument} from "./evaluation";
import EntityUtil from "../entities/entity";
import EvaluationState from "./evaluation-state";

export default class EvaluationListEntry {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly state: EvaluationState,
        public readonly score: number,
        public readonly createdAt: Date
    ) {
    }

    public static ofDocument(evaluation: EvaluationDocument): EvaluationListEntry {
        const [createdAt, _] = EntityUtil.checkForProperties(evaluation);

        return new EvaluationListEntry(
            EntityUtil.convertId(evaluation._id),
            evaluation.name,
            evaluation.state,
            evaluation.score.total,
            createdAt
        )
    }
}