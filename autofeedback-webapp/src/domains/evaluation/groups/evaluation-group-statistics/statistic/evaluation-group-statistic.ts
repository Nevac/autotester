import {EvaluationGroup} from "../../evaluation-group";
import ScoreDelta from "./score-delta";
import {Llm} from "../../../../llms/llm";

export default class EvaluationGroupStatistic {
    public constructor(
        public readonly baseEvaluationGroup: EvaluationGroup | undefined,
        public readonly evaluationGroupsToCompare: EvaluationGroup[],
        public readonly llms: Llm[],
        public readonly nonCommonLlms: Llm[],
        public readonly scoreDelta: ScoreDelta | undefined
    ) {
    }
}