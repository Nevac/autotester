export class EvaluationGroupLlmScore {
    constructor(
        public readonly total: number,
        public readonly correctness: number,
        public readonly suggestion: number,
        public readonly codeStyle: number,
        public readonly overgeneration: number
    ) {}

    public static zero(): EvaluationGroupLlmScore {
        return new EvaluationGroupLlmScore(
            0,
            0,
            0,
            0,
            0
        );
    }
}