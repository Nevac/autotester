import PromptGroup from "../../prompts/prompt-group";
import {Attempt} from "../../attempts/attempt";
import EvaluationGroupLlm from "./llm/evaluation-group-llm";
import EvaluationState from "../evaluation-state";
import Rag from "../../rag/rag";

export default class EvaluationGroupInsert {
    constructor(
        public readonly name: string,
        public readonly promptGroup: PromptGroup,
        public readonly attempts: Attempt[],
        public readonly llms: Map<string, EvaluationGroupLlm>,
        public readonly state: EvaluationState,
        public readonly rag?: Rag
    ) {}
}