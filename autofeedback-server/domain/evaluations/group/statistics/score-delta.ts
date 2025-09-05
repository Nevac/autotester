import EvaluationGroupStatKey from "./evaluation-group-stat-key";
import ScoreDeltaData from "./score-delta-data";
import {Llm} from "../../../llms/llm";

export default class ScoreDelta {
    public constructor(
        public readonly llms: Llm[],
        public readonly evaluationGroups: EvaluationGroupStatKey[],
        public readonly totalScore: ScoreDeltaData[],
        public readonly correctness: ScoreDeltaData[],
        public readonly suggestion: ScoreDeltaData[],
        public readonly codeStyle: ScoreDeltaData[],
        public readonly overgeneration: ScoreDeltaData[]
    ) {
    }
}