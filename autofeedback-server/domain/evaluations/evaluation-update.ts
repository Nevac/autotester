import PromptGroup from "../prompts/prompt-group";
import {Attempt} from "../attempts/attempt";
import {Llm} from "../llms/llm";
import EvaluationState from "./evaluation-state";
import {EvaluationScore} from "./score/evaluation-score";
import Rag from "../rag/rag";
import EvaluationSemanticStatistic from "./statistic/evaluation-semantic-statistic";
import {Evaluation} from "./evaluation";
import RagDocument from "../rag/document/rag-document";

export default class EvaluationUpdate {
    public state: EvaluationState = EvaluationState.INITIATED;
    public score: EvaluationScore = EvaluationScore.zero();
    public semanticStatistic = EvaluationSemanticStatistic.empty();
    public generatedFeedback: string = "Not generated yet";
    public ragDocuments?: RagDocument[] = [];

    constructor(
        public name: string,
        public evaluationGroup: string,
        public attempt: Attempt,
        public promptGroup: PromptGroup,
        public llm: Llm,
        public rag?: Rag
    ) {}

    public static ofEvaluation(
        evaluation: Evaluation
    ): EvaluationUpdate {
        return new EvaluationUpdate(
            evaluation.name,
            evaluation.evaluationGroup,
            evaluation.attempt,
            evaluation.promptGroup,
            evaluation.llm,
            evaluation.rag
        )
            .setSemanticStatistic(evaluation.semanticStatistic)
            .setScore(evaluation.score)
            .setState(evaluation.state)
            .setGeneratedFeedback(evaluation.generatedFeedback)
            .setRagDocuments(evaluation.ragDocuments);
    }

    public setState(state: EvaluationState): EvaluationUpdate {
        this.state = state;
        return this;
    }

    public setScore(score: EvaluationScore): EvaluationUpdate {
        this.score = score;
        return this;
    }

    public setSemanticStatistic(statistic: EvaluationSemanticStatistic): EvaluationUpdate {
        this.semanticStatistic = statistic;
        return this;
    }

    public setGeneratedFeedback(generatedFeedback: string): EvaluationUpdate {
        this.generatedFeedback = generatedFeedback;
        return this;
    }

    public setRagDocuments(ragDocuments?: RagDocument[]): EvaluationUpdate {
        this.ragDocuments = ragDocuments;
        return this;
    }
}