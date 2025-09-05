import EvaluationGroupStatKey from "./evaluation-group-stat-key";
import {Llm} from "../../../llms/llm";

export default class ScoreDeltaData {
    public constructor(
        public readonly llm: Llm,
        public readonly evaluationGroup: EvaluationGroupStatKey,
        public readonly delta: number
    ) {
    }
}