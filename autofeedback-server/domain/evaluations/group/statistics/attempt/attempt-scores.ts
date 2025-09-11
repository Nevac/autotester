import AttemptScoreEntry from "./attempt-score-entry";

export default class AttemptScores {
    public constructor(
        public readonly averageScores: AttemptScoreEntry[][]
    ) {}
}