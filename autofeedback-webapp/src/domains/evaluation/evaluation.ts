import PromptGroup from "../prompts/groups/prompt-group";
import {Llm} from "../llms/llm";
import Attempt from "../attempts/attempt";
import EvaluationState from "./evaluation-state";
import Rag from "../rag/groups/rag";
import EvaluationSemanticStatistic from "./statistic/evaluation-semantic-statistic";
import EvaluationScore from "./score/evaluation-score";
import RagDocument from "../rag/document/rag-document";

export class Evaluation {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly evaluationGroup: string,
        public readonly attempt: Attempt,
        public readonly promptGroup: PromptGroup,
        public readonly llm: Llm,
        public readonly generatedFeedback: string,
        public readonly state: EvaluationState,
        public readonly score: EvaluationScore,
        public readonly semanticStatistic: EvaluationSemanticStatistic,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly rag?: Rag,
        public readonly ragDocuments?: RagDocument[]
) {}
}