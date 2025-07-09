import PromptGroup from "../../prompts/groups/prompt-group";
import Exercise from "../../exercises/exercise";
import EvaluationState from "../evaluation-state";
import {Llm} from "../../llms/llm";
import Attempt from "../../attempts/attempt";
import EvaluationGroupState from "./state/evaluation-group-state";
import EvaluationGroupLlmState from "./state/evaluation-group-llm-state";
import EvaluationGroupLlm from "./llm/evaluation-group-llm";
import Rag from "../../rag/groups/rag";

export class EvaluationGroup {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly promptGroup: PromptGroup,
        public readonly attempts: Set<Attempt>,
        public readonly llms: Map<Llm, EvaluationGroupLlm>,
        public readonly state: EvaluationState,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly rag?: Rag,
        public readonly bestLlm?: Llm,
        public readonly bestScore?: number
    ) {}

    static fromJSON(json: any): EvaluationGroup {
        const llms = new Map<Llm, EvaluationGroupLlm>();
        for (const llmKey in json.llms) {
            const llmEnumValue = llmKey as Llm;
            const stateValue = EvaluationGroupLlm.fromJSON(json.llms[llmKey]);
            llms.set(llmEnumValue, stateValue);
        }

        return new EvaluationGroup(
            json._id,
            json.name,
            json.promptGroup,
            json.attempts,
            llms,
            json.state,
            new Date(json.createdAt),
            new Date(json.updatedAt),
            json.rag,
            json.bestLlm,
            json.bestScore
        );
    }

}