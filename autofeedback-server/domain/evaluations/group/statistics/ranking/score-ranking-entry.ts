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
}