import {Llm} from "../../../../llms/llm";
import EvaluationGroupStatKey from "./evaluation-group-stat-key";

export default class ScoreDeltaData {
    public constructor(
        public readonly llm: Llm,
        public readonly evaluationGroup: EvaluationGroupStatKey,
        public readonly delta: number
    ) {
    }
}