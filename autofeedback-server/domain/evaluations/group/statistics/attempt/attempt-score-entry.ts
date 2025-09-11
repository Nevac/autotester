import {Llm} from "../../../../llms/llm";
import {Evaluation} from "../../../evaluation";
import {Attempt} from "../../../../attempts/attempt";
import AttemptComplexity from "../../../../attempts/attempt-complexity";

export default class AttemptScoreEntry {
    public constructor(
        public readonly llm: Llm,
        public readonly attemptId: string,
        public readonly attemptName: string,
        public readonly complexity: AttemptComplexity,
        public readonly totalScore: number,
        public readonly correctness: number,
        public readonly suggestion: number,
        public readonly codeStyle: number,
        public readonly overgeneration: number
    ) {}

    public static zero(llm: Llm, attempt: Attempt): AttemptScoreEntry {
        return new AttemptScoreEntry(
            llm,
            attempt._id,
            attempt.name,
            attempt.complexity,
            0,
            0,
            0,
            0,
            0
        );
    }

    public add(evaluation: Evaluation): AttemptScoreEntry {
        const score = evaluation.score;
        return new AttemptScoreEntry(
            this.llm,
            this.attemptId,
            this.attemptName,
            this.complexity,
            this.totalScore + score.total,
            this.correctness + score.correctness.score,
            this.suggestion + score.suggestion.score,
            this.codeStyle + score.codeStyle.score,
            this.overgeneration + score.overgeneration.score
        )
    }

    public divide(divisor: number): AttemptScoreEntry {
        return new AttemptScoreEntry(
            this.llm,
            this.attemptId,
            this.attemptName,
            this.complexity,
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