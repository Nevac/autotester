import EvaluationState from "../../evaluation-state";
import EvaluationGroupLlmState from "./evaluation-group-llm-state";
import {Llm} from "../../../llms/llm";

interface IEvaluationGroupState {
    state: EvaluationState,
    llmStates: Map<Llm, EvaluationGroupLlmState>
}

export default class EvaluationGroupState implements IEvaluationGroupState {
    constructor(
        public readonly state: EvaluationState,
        public readonly llmStates: Map<Llm, EvaluationGroupLlmState>
    ) {}

    static fromJSON(json: any): EvaluationGroupState {
        const llmStates = new Map<Llm, EvaluationGroupLlmState>();

        for (const llmKey in json.llmStates) {
            const llmEnumValue = llmKey as Llm;
            const stateValue = EvaluationGroupLlmState.fromJSON(json.llmStates[llmKey]);
            llmStates.set(llmEnumValue, stateValue);
        }

        return new EvaluationGroupState(json.state, llmStates);
    }
}