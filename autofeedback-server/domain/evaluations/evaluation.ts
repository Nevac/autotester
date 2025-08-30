import {Document, model, Schema} from "mongoose";
import {Attempt, AttemptDocument, attemptSchema} from "../attempts/attempt";
import PromptGroup, {promptGroupSchema} from "../prompts/prompt-group";
import EntityUtil from "../entities/entity";
import Entity from "../entities/entity";
import EvaluationState from "./evaluation-state";
import {EvaluationScore, evaluationScoreSchema} from "./score/evaluation-score";
import {Llm} from "../llms/llm";
import Rag, {ragSchema} from "../rag/rag";
import EvaluationSemanticStatistic, {
    evaluationSemanticStatisticSchema
} from "./statistic/evaluation-semantic-statistic";
import EvaluationRagDocument, {ragDocumentSchema} from "./rag-document/evaluation-rag-document";
import Ast, {astSchema} from "../ast/ast";


export interface IEvaluation {
    name: string,
    evaluationGroup: string,
    attempt: Attempt,
    promptGroup: PromptGroup,
    llm: Llm,
    generatedFeedback: string,
    state: EvaluationState,
    score: EvaluationScore,
    semanticStatistic: EvaluationSemanticStatistic,
    ast: Ast,
    rag?: Rag,
    ragDocuments?: EvaluationRagDocument[]
}

export class Evaluation implements IEvaluation, Entity {
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
        public readonly ast: Ast,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly rag?: Rag,
        public readonly ragDocuments?: EvaluationRagDocument[]
    ) {}

    public static ofDocument(evaluation: EvaluationDocument) {
        const [createdAt, updatedAt] = EntityUtil.checkForProperties(evaluation);

        return new Evaluation(
            EntityUtil.convertId(evaluation._id),
            evaluation.name,
            evaluation.evaluationGroup,
            evaluation.attempt,
            evaluation.promptGroup,
            evaluation.llm,
            evaluation.generatedFeedback,
            evaluation.state,
            evaluation.score,
            evaluation.semanticStatistic,
            evaluation.ast,
            createdAt,
            updatedAt,
            evaluation.rag,
            evaluation.ragDocuments
        )
    }

    public static ofDocuments(evaluations: EvaluationDocument[]): Map<string, Evaluation> {
        return new Map(
            evaluations.map(evaluation => [
                EntityUtil.convertId(evaluation._id),
                Evaluation.ofDocument(evaluation)
            ]));
    }

    public static ofDocumentsToMap(attempts: EvaluationDocument[]): Map<string, Evaluation> {
        return new Map(
            attempts.map(attempt => [
                EntityUtil.convertId(attempt._id),
                Evaluation.ofDocument(attempt)
            ]));
    }
}

export const evaluationSchema = new Schema<IEvaluation>(
    {
        name: { type: String, required: true },
        evaluationGroup: { type: String, required: true },
        attempt: { type: attemptSchema, required: true },
        promptGroup: { type: promptGroupSchema, required: true },
        llm: { type: String, required: true },
        generatedFeedback: { type: String, required: true },
        state: { type: String, required: true },
        score: { type: evaluationScoreSchema, required: true },
        semanticStatistic: { type: evaluationSemanticStatisticSchema, required: true },
        ast: { type: astSchema, required: true },
        rag: { type: ragSchema, required: false },
        ragDocuments: { type: [ragDocumentSchema], required: false },
    },
    {
        timestamps: true,
    }
);

export type EvaluationDocument = Document<unknown, {}, IEvaluation> & IEvaluation & {};
export const EvaluationModel = model<IEvaluation>('Evaluation', evaluationSchema);