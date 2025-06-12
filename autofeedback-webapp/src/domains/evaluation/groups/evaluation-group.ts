import PromptGroup from "../../prompts/groups/prompt-group";
import Exercise from "../../exercises/exercise";
import EvaluationState from "../evaluation-state";
import {Llm} from "../../llms/llm";
import Attempt from "../../attempts/attempt";

export class EvaluationGroup {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly promptGroup: PromptGroup,
        public readonly attempts: Set<Attempt>,
        public readonly llms: Set<Llm>,
        public readonly state: EvaluationState,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {}
}