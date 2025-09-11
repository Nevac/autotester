import EvaluationGroupStatKey from "../evaluation-group-stat-key";
import ScoreRankingEntry from "./score-ranking-entry";
import {EvaluationGroup} from "../../evaluation-group";

export default class ScoreRankingAverage {
    public constructor(
        public readonly rankings: ScoreRankingEntry[]
    ) {}

}