import ScoreRanking from "./score-ranking";

export default class ScoreRankings {
    public constructor(
        public readonly rankingBase: ScoreRanking,
        public readonly  rankingCompares: ScoreRanking[]
    ) {}
}