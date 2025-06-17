import PromptGroup from "../prompts/prompt-group";
import {Attempt} from "../attempts/attempt";
import {Llm} from "../llms/llm";
import EvaluationState from "./evaluation-state";
import {EvaluationScore} from "./evaluation-score";

export default class EvaluationUpdate {
    public state: EvaluationState = EvaluationState.INITIATED;
    public score: EvaluationScore = EvaluationScore.zero();

    constructor(
        public name: string,
        public evaluationGroup: string,
        public attempt: Attempt,
        public promptGroup: PromptGroup,
        public llm: Llm
    ) {}
}