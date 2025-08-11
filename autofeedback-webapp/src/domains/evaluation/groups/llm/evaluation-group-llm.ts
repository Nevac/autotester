import {Llm} from "../../../llms/llm";
import EvaluationState from "../../evaluation-state";
import EvaluationScore from "../../score/evaluation-score";
import {EvaluationGroupLlmScore} from "./evaluation-group-llm-score";

export default class EvaluationGroupLlm {
    constructor(
        public readonly llm: Llm,
        public readonly state: EvaluationState,
        public readonly score: EvaluationGroupLlmScore
    ) {
    }

    static fromJSON(json: any): EvaluationGroupLlm {
        return new EvaluationGroupLlm(
            json.llm,
            json.state,
            json.score
        );
    }
}
