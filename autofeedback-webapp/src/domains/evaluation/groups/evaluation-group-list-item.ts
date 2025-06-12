import {EvaluationScore} from "../evaluation-score";
import EvaluationState from "../evaluation-state";

export default class EvaluationGroupListItem {

    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly state: EvaluationState,
        public readonly score: EvaluationScore,
        public readonly createdAt: Date
    ) {
    }
}