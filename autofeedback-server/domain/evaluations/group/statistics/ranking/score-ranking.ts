import EvaluationGroupStatKey from "../evaluation-group-stat-key";
import ScoreRankingEntry from "./score-ranking-entry";
import {EvaluationGroup} from "../../evaluation-group";

export default class ScoreRanking {
    public constructor(
        public readonly evaluationGroup: EvaluationGroupStatKey,
        public readonly rankings: ScoreRankingEntry[]
    ) {}

    public static ofEvaluation(evaluationGroup: EvaluationGroup): ScoreRanking {
        return new ScoreRanking(
            new EvaluationGroupStatKey(
                evaluationGroup._id,
                evaluationGroup.name
            ),
            []
        )
    }
}