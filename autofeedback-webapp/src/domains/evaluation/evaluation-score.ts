export class EvaluationScore {
    constructor(
        public readonly totalScore: number
    ) {
    }

    public static zero(): EvaluationScore {
        return new EvaluationScore(0);
    }
}