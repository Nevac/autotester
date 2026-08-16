import EvaluationRepository from "./evaluation-repository";
import EvaluationListEntry from "./evaluation-list-entry";
import {Evaluation} from "./evaluation";
import EvaluationUpdate from "./evaluation-update";
import {EvaluationGroup} from "./group/evaluation-group";
import {Llm} from "../llms/llm";
import {ClientRequest} from "../llms/llm-client";
import LlmService from "../llms/llm-service";
import TextEmbedding3LargeClient from "../rag/embedding/text-embedding3-large.client";
import PineconeClient from "../rag/client/pinecone-client";
import RagQueryBuilder from "../rag/rag-query-builder";
import SemanticEvaluatorClient from "../semantic-evaluators/semantic-evaluator-client";
import ModernBertClient from "../semantic-evaluators/modern-bert-client";
import EvaluationState from "./evaluation-state";
import ScoreCalculator from "./score/calculation/score-calculator";
import {logger} from "../../logger";
import Ast from "../ast/ast";
import RagClientResponse from "../rag/client/rag-response";
import {EvaluationScoreCorrection} from "./score/correction/evaluation-score-correction";
import ScoreCorrector from "./score/correction/score-corrector";
import ConfusionDto from "./score/confusion/confusion-dto";
import ExportDocumentContentGenerator from "../export/document-attempts-content-generator";
import ExportDocumentGenerator from "../export/document-generator";
import DocumentEvaluationsContentGenerator from "../export/document-evaluations-content-generator";
import RagDocumentRepository from "../rag/document/rag-document-repository";
import EvaluationRagDocument from "./rag-document/evaluation-rag-document";
import ExpectedFeedback from "../attempts/expected-feedback/expected-feedback";
import EvaluationSemanticStatistic from "./statistic/evaluation-semantic-statistic";

export default class EvaluationService {

    private readonly evaluationRepository: EvaluationRepository;
    private readonly ragDocRepository: RagDocumentRepository;
    private readonly llmService: LlmService;
    private readonly semanticEvaluatorClient: SemanticEvaluatorClient;

    constructor() {
        this.evaluationRepository = new EvaluationRepository();
        this.ragDocRepository = new RagDocumentRepository();
        this.llmService = new LlmService();
        this.semanticEvaluatorClient = new ModernBertClient();
    }

    public async evaluate(evaluation: Evaluation): Promise<Evaluation> {
        await this.update(
            evaluation._id,
            EvaluationUpdate.ofEvaluation(evaluation)
                .setState(EvaluationState.RUNNING)
        );

        try {
            logger.debug(`Start Evaluation [${evaluation.llm}][${evaluation._id}]`)
            const client = this.llmService.resolveLlmService(evaluation.llm);

            const documents = await this.loadRagDocuments(evaluation);
            const ast = evaluation.ast;

            const response = await client.create(
                ClientRequest.ofEvaluation(
                    evaluation,
                    documents
                )
            );

            const llmFeedback = response.messages[0];
            evaluation = await this.update(
                evaluation._id,
                EvaluationUpdate.ofEvaluation(evaluation)
                    .setGeneratedFeedback(llmFeedback)
                    .setRagDocuments(documents)
                    .setAst(ast)
            );

            const evaluationStatistic = await this.generateSemanticStatistics(
                llmFeedback,
                evaluation.attempt.expectedFeedback
            )

            const evaluationScore = ScoreCalculator.calculateFromStatistic(
                evaluation.attempt.expectedFeedback,
                evaluationStatistic
            );

            const evaluationUpdate = EvaluationUpdate.ofEvaluation(evaluation)
                .setSemanticStatistic(evaluationStatistic)
                .setState(EvaluationState.DONE)
                .setScore(evaluationScore);

            logger.info(`Evaluation DONE [${evaluation.llm}][${evaluation._id}]`)
            return await this.update(evaluation._id, evaluationUpdate);

        } catch (e) {
            console.error(`Evaluation FAILED [${evaluation.llm}][${evaluation._id}]`, e);
            const evaluationUpdate = EvaluationUpdate.ofEvaluation(evaluation)
                .setState(EvaluationState.FAILURE);

            return await this.update(evaluation._id, evaluationUpdate);
        }

    }

    private async generateSemanticStatistics(
        llmFeedback: string,
        expectedFeedback: ExpectedFeedback
    ): Promise<EvaluationSemanticStatistic> {
        const evaluationStatistic = await this.semanticEvaluatorClient.evaluate(
            llmFeedback,
            expectedFeedback
        ).catch(err => {
            console.log(err);
            undefined
        });

        if (!evaluationStatistic) {
            throw new Error();
        }

        return evaluationStatistic
    }

    public async calculateScoresFromStatistic(evaluations: Map<string, Evaluation>): Promise<Map<string, Evaluation>> {
        const updates = new Map(
            Array.from(evaluations.entries()).map(([id, evaluation]) => {
                const evaluationScore = ScoreCalculator.calculateFromStatistic(
                    evaluation.attempt.expectedFeedback,
                    evaluation.semanticStatistic
                )

                const update = EvaluationUpdate.ofEvaluation(evaluation)
                    .setScore(evaluationScore);

                return [id, update];
            }));

        return await this.evaluationRepository.updateAll(updates);
    }

    public async generateAllSemanticStatistics(evaluations: Map<string, Evaluation>): Promise<Map<string, Evaluation>> {
        const entries: [string, EvaluationUpdate][] = []
        let count = 0;

        for(let [id, evaluation] of evaluations.entries()) {
            count++;
            console.log(`Generated ${count}/${evaluations.size} statistics`)
            const semanticStatistic = await this.generateSemanticStatistics(
                evaluation.generatedFeedback,
                evaluation.attempt.expectedFeedback
            );

            const evaluationScore =
                ScoreCalculator.calculateFromStatistic(
                    evaluation.attempt.expectedFeedback,
                    semanticStatistic
                );

            const update = EvaluationUpdate.ofEvaluation(evaluation)
                .setSemanticStatistic(semanticStatistic)
                .setScore(evaluationScore);

            entries.push([id, update]);
        }

        const updates = new Map<string, EvaluationUpdate>(entries);

        return this.evaluationRepository.updateAll(updates);
    }


    public async correctScore(id: string, correction: EvaluationScoreCorrection): Promise<Evaluation> {
        const evaluationUpdate = EvaluationUpdate.ofEvaluation(
            await this.evaluationRepository.getById(id)
        );

        const score = ScoreCorrector.correct(
            evaluationUpdate.score,
            correction
        );

        evaluationUpdate.setScore(
            ScoreCalculator.calculate(
                score.correctness,
                score.suggestion,
                score.codeStyle,
                score.overgeneration
            )
        );

        return await this.evaluationRepository.update(id, evaluationUpdate);
    }

    public async confusion(id: string, confusion: ConfusionDto): Promise<Evaluation> {
        return await this.evaluationRepository.setConfusionById(id, confusion.confusion);
    }

    public async getAll(): Promise<Evaluation[]> {
        return await this.evaluationRepository.getAll();
    }

    public async getAllListEntries(evaluationGroupId: string, llm: Llm): Promise<EvaluationListEntry[]> {
        return await this.evaluationRepository.getAllListEntries(evaluationGroupId, llm);
    }

    public async getById(id: string): Promise<Evaluation> {
        return await this.evaluationRepository.getById(id);
    }

    public async getByGroupId(groupId: string): Promise<Map<string, Evaluation>> {
        return await this.evaluationRepository.getByGroupId(groupId);
    }

    public async getByGroupIds(groupIds: string[]): Promise<Map<string, Evaluation>> {
        return await this.evaluationRepository.getByGroupIds(groupIds);
    }

    public async getAllNotDoneByGroupId(groupId: string): Promise<Map<string, Evaluation>> {
        return await this.evaluationRepository.getAllNotDoneByGroupId(groupId);
    }

    public async create(evaluationUpdate: EvaluationUpdate): Promise<Evaluation> {
        return await this.evaluationRepository.create(evaluationUpdate);
    }

    public async createByGroup(evaluationGroup: EvaluationGroup): Promise<Map<string, Evaluation>> {
        const evaluations = [];
        for (const llm of evaluationGroup.llms) {
            for (const attempt of evaluationGroup.attempts.values()) {
                evaluations.push(
                    new EvaluationUpdate(
                        llm[0] + "-" + attempt.name,
                        evaluationGroup._id,
                        attempt,
                        evaluationGroup.promptGroup,
                        llm[0],
                        Ast.empty(evaluationGroup.astEnabled),
                        evaluationGroup.rag,
                        evaluationGroup.ragStatic
                    )
                )
            }
        }
        return await this.evaluationRepository.createAll(
            evaluations
        );
    }

    public async update(id: string, update: EvaluationUpdate): Promise<Evaluation> {
        return await this.evaluationRepository.update(id, update);
    }

    public async delete(id: string): Promise<boolean> {
        return await this.evaluationRepository.delete(id);
    }

    public async deleteByGroup(evaluationGroupId: string): Promise<boolean> {
        return await this.evaluationRepository.deleteAllByGroup(evaluationGroupId);
    }

    private async loadRagDocuments(evaluation: Evaluation): Promise<EvaluationRagDocument[]> {
        let ragClientResponse: RagClientResponse = RagClientResponse.empty(evaluation.ast);
        if (evaluation.rag) {
            const ragClient = new PineconeClient(
                new TextEmbedding3LargeClient(),
                evaluation.rag.apiId
            );
            ragClientResponse = await ragClient.retrieve(
                RagQueryBuilder.ofEvaluation(evaluation),
                evaluation.ast.enabled
            );
        }

        let exerciseDocuments: EvaluationRagDocument[] = [];
        let attemptDocuments: EvaluationRagDocument[] = [];

        if (evaluation.ragStatic) {
            const ragStatic = evaluation.ragStatic;
            const attemptId = evaluation.attempt._id.toString();
            const exerciseId = evaluation.attempt.exercise._id.toString();

            if (ragStatic.exerciseRagDocuments.has(exerciseId)) {
                const ragDocuments = await this.ragDocRepository.getByIds(
                    ragStatic.exerciseRagDocuments.get(exerciseId)!!
                )
                exerciseDocuments = EvaluationRagDocument.ofRagDocs(Array.from(ragDocuments.values()));
            }

            if (ragStatic.attemptRagDocuments.has(attemptId)) {
                const ragDocuments = await this.ragDocRepository.getByIds(
                    ragStatic.attemptRagDocuments.get(exerciseId)!!
                )
                attemptDocuments = EvaluationRagDocument.ofRagDocs(Array.from(ragDocuments.values()));
            }
        }

        return Array.prototype.concat(ragClientResponse.documents, exerciseDocuments, attemptDocuments);
    }
}