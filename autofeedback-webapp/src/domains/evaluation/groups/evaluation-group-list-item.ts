import EvaluationState from "../evaluation-state";
import {Llm} from "../../llms/llm";

export default class EvaluationGroupListItem {

    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly state: EvaluationState,
        public readonly createdAt: Date,
        public readonly bestScore?: number,
        public readonly bestLlm?: Llm,
    ) {
    }
}