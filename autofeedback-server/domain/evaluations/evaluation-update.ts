import PromptGroup from "../prompts/prompt-group";
import {Attempt} from "../attempts/attempt";
import {Llm} from "../llms/llm";
import EvaluationState from "./evaluation-state";
import {EvaluationScore} from "./evaluation-score";

export default class EvaluationUpdate {
    private _state: EvaluationState = EvaluationState.INITIATED;
    private _score: EvaluationScore = EvaluationScore.zero();

    constructor(
        public name: string,
        public attempt: Attempt,
        public promptGroup: PromptGroup,
        public llm: Llm,
    ) {}

    public state(value: EvaluationState): EvaluationUpdate {
        this._state = value;
        return this;
    }

    public score(value: EvaluationState): EvaluationUpdate {
        this._state = value;
        return this;
    }

    public getState(): EvaluationState {
        return this._state;
    }

    public getScore(): EvaluationScore {
        return this._score;
    }
}