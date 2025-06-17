import {Llm} from "../../../llms/llm";
import EvaluationState from "../../evaluation-state";

export interface IEvaluationGroupLlmState {
    llm: Llm,
    state: EvaluationState
}

export default class EvaluationGroupLlmState implements IEvaluationGroupLlmState {
    constructor(
        public readonly llm: Llm,
        public readonly state: EvaluationState
    ) {}

    static fromJSON(json: any): EvaluationGroupLlmState {
        return new EvaluationGroupLlmState(json.llm, json.state);
    }
}