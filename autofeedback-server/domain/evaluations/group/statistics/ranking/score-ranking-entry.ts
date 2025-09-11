import {Llm} from "../../../../llms/llm";
import {EvaluationGroupLlmScore} from "../../llm/evaluation-group-llm-score";
import EvaluationGroupLlm from "../../llm/evaluation-group-llm";

export default class ScoreRankingEntry {
    public constructor(
        public readonly llm: Llm,
        public readonly totalScore: number,
        public readonly correctness: number,
        public readonly suggestion: number,
        public readonly codeStyle: number,
        public readonly overgeneration: number
    ) {
    }

    public static ofEvaluationGroupScore(evaluationGroupLlm: EvaluationGroupLlm) {
        const score = evaluationGroupLlm.score;
        return new ScoreRankingEntry(
            evaluationGroupLlm.llm,
            score.total,
            score.correctness,
            score.suggestion,
            score.codeStyle,
            score.overgeneration
        )
    }

    public static zero(llm: Llm): ScoreRankingEntry {
        return new ScoreRankingEntry(
            llm,
            0,
            0,
            0,
            0,
            0
        );
    }

    public add(entry: ScoreRankingEntry): ScoreRankingEntry {
        return new ScoreRankingEntry(
            this.llm,
            this.totalScore + entry.totalScore,
            this.correctness + entry.correctness,
            this.suggestion + entry.suggestion,
            this.codeStyle + entry.codeStyle,
            this.overgeneration + entry.overgeneration
        );
    }

    public divide(divisor: number): ScoreRankingEntry {
        return new ScoreRankingEntry(
            this.llm,
            this.round(this.totalScore / divisor, 4),
            this.round(this.correctness / divisor, 4),
            this.round(this.suggestion / divisor, 4),
            this.round(this.codeStyle / divisor, 4),
            this.round(this.overgeneration / divisor, 4)
        );
    }

    private round(value: number, precision: number): number {
        return parseFloat(value.toPrecision(4));
    }
}