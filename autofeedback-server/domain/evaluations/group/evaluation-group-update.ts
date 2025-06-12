import PromptGroup from "../../prompts/prompt-group";
import {Attempt} from "../../attempts/attempt";
import {Llm} from "../../llms/llm";
import EvaluationState from "../evaluation-state";
import {EvaluationScore} from "../evaluation-score";

export default class EvaluationGroupUpdate {
    public readonly score: EvaluationScore;

    constructor(
        public readonly name: string,
        public readonly promptGroup: PromptGroup,
        public readonly attempts: Attempt[],
        public readonly llms: Llm[],
        public readonly state: EvaluationState
    ) {
        this.score = EvaluationScore.zero();
    }
}