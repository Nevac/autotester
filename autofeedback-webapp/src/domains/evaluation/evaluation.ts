import Exercise from "../exercises/exercise";
import PromptGroup from "../prompts/groups/prompt-group";
import {Llm} from "../llms/llm";
import Attempt from "../attempts/attempt";
import EvaluationState from "./evaluation-state";
import {EvaluationScore} from "./evaluation-score";

export class Evaluation {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly attempt: Attempt,
        public readonly promptGroup: PromptGroup,
        public readonly llm: Llm,
        public readonly state: EvaluationState,
        public readonly score: EvaluationScore,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {}
}