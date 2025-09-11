import ScoreRanking from "./score-ranking";
import ScoreRankingAverage from "./score-ranking-average";

export default class ScoreRankings {
    public constructor(
        public readonly rankingBase: ScoreRanking,
        public readonly rankingCompares: ScoreRanking[],
        public readonly rankingAverage: ScoreRankingAverage
    ) {}
}