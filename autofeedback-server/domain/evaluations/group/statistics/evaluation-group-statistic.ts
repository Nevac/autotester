import ScoreDelta from "./score-delta";
import {Llm} from "../../../llms/llm";
import {EvaluationGroup} from "../evaluation-group";
import ScoreRankings from "./ranking/score-rankings";

export default class EvaluationGroupStatistic {
    public constructor(
        public readonly baseEvaluationGroup: EvaluationGroup | undefined,
        public readonly evaluationGroupsToCompare: EvaluationGroup[],
        public readonly llms: Llm[],
        public readonly nonCommonLlms: Llm[],
        public readonly scoreDelta: ScoreDelta,
        public readonly rankings: ScoreRankings
    ) {
    }
}