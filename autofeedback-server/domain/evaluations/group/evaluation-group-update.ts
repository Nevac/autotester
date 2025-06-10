import PromptGroup from "../../prompts/prompt-group";
import {Attempt} from "../../attempts/attempt";
import {Llm} from "../../llms/llm";
import EvaluationState from "../evaluation-state";

export default class EvaluationGroupUpdate {
    constructor(
        public readonly name: string,
        public readonly promptGroup: PromptGroup,
        public readonly attempts: Map<string, Attempt>,
        public readonly llms: Set<Llm>,
        public readonly state: EvaluationState
    ) {
    }
}