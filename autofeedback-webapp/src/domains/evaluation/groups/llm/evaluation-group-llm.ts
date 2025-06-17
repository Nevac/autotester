import {Llm} from "../../../llms/llm";
import {EvaluationScore} from "../../evaluation-score";
import EvaluationState from "../../evaluation-state";

export default class EvaluationGroupLlm {
    constructor(
        public readonly llm: Llm,
        public readonly state: EvaluationState,
        public readonly score: EvaluationScore
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
