import {Llm} from "../../../../../llms/llm";
import Attempt from "../../../../../attempts/attempt";
import {Evaluation} from "../../../../evaluation";
import AttemptComplexity from "../../../../../attempts/attempt-complexity";

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
}